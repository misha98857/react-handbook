import { booleanAttribute, Component, DestroyRef, inject, numberAttribute, OnInit } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { IonApp, IonContent, IonRouterOutlet, Platform } from '@ionic/angular/standalone';
import { Store } from '@ngrx/store';
import { combineLatest, forkJoin, from, Observable, of, switchMap, tap } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { Device } from '@capacitor/device';
import { initApplicationDataAction } from '../../store/actions/settings.actions';
import { loadArticlesAction } from '../../store/actions/articles.actions';
import { loadProgressStateAction } from '../../store/actions/progress.actions';
import { openWithProgressAction } from '../../store/actions/navigation.actions';
import { loadLatestPageAction, saveLatestPageAction } from '../../store/actions/history.actions';
import { selectRouterState } from '../../store/selectors/articles.selectors';
import { initialSettingsState } from '../../store/state/settings.state';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { selectAppTheme } from '../../store/selectors/settings.selectors';
import { AsyncPipe } from '@angular/common';
import { MenuComponent } from '../menu/menu.component';
import { allowedLanguages, langMap } from '../../shared/translate/const/const';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonApp, IonContent, IonRouterOutlet, AsyncPipe, MenuComponent],
})
export class AppComponent implements OnInit {
  darkMode: Observable<boolean> = this.store.select(selectAppTheme);

  destroyRef = inject(DestroyRef);

  constructor(
    private platform: Platform,
    private store: Store,
    private translate: TranslateService,
  ) {}

  ngOnInit(): void {
    this.initializeApp();
  }

  initializeApp(): void {
    from(this.platform.ready())
      .pipe(
        switchMap(() => this.initApplicationData()),
        tap(() => {
          this.initRouterWatcher();
          this.darkThemeHandler();
        }),
        switchMap(() => PushNotifications.register()),
      )
      .subscribe();
  }

  private getLanguage(language: string | null): Observable<string> {
    if (language) {
      return of(language);
    }

    let deviceLanguage$ = from(Device.getLanguageCode());

    return deviceLanguage$.pipe(
      map(({ value: deviceLanguage }) => {
        if (!allowedLanguages.includes(deviceLanguage)) {
          return deviceLanguage === 'ru-RU' || deviceLanguage === 'ru' ? 'ru' : 'en';
        }

        if (Object.keys(langMap).includes(deviceLanguage)) {
          deviceLanguage = langMap[deviceLanguage];
        }

        return deviceLanguage;
      }),
    );
  }

  private darkThemeHandler() {
    this.darkMode.subscribe(darkMode => {
      void StatusBar.setStyle({ style: darkMode ? Style.Dark : Style.Light });
      void StatusBar.setBackgroundColor({ color: darkMode ? '#000000' : '#ffffff' });
    });
  }

  private initApplicationData() {
    const settings$ = this.initSettings();
    const language$ = settings$.pipe(switchMap(settings => this.getLanguage(settings['language'])));

    return combineLatest([
      settings$,
      language$,
      Preferences.get({ key: 'progress' }),
      Preferences.get({ key: 'latestPage' }),
    ]).pipe(
      switchMap(([settings, language, { value: progress }, { value: latestPage }]) => {
        console.log(settings, language, progress, latestPage);
        this.store.dispatch(initApplicationDataAction({ settings: { ...settings, language } }));
        this.store.dispatch(loadArticlesAction());
        this.store.dispatch(loadProgressStateAction({ progressState: JSON.parse(progress) as Record<string, number> }));
        this.restoreLatestPage(settings['restoreState'], latestPage);
        return SplashScreen.hide();
      }),
    );
  }

  private initRouterWatcher() {
    this.store
      .select(selectRouterState)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(routerState => {
        this.store.dispatch(saveLatestPageAction({ url: routerState.url }));
      });
  }

  private initSettings() {
    const settingsKeys = Object.keys(initialSettingsState);

    return forkJoin(settingsKeys.map(setting => Preferences.get({ key: setting }))).pipe(
      map(values => {
        return settingsKeys.reduce((acc, setting, index) => {
          const settingValue = values[index].value;
          return {
            ...acc,
            [setting]: settingValue ? this.coerceSettingsProperty(setting, settingValue) : acc[setting],
          };
        }, initialSettingsState);
      }),
    );
  }

  private restoreLatestPage(restoreState: boolean, latestPage: string) {
    if (restoreState && latestPage) {
      this.store.dispatch(openWithProgressAction());
      this.store.dispatch(loadLatestPageAction({ url: latestPage.replace(/"/g, '') }));
      return;
    }

    if (location.pathname !== '/react') {
      location.assign('/react');
    }
  }

  private coerceSettingsProperty(settingKey: string, value: string) {
    if (typeof initialSettingsState[settingKey] === 'boolean') {
      return booleanAttribute(value);
    }

    if (typeof initialSettingsState[settingKey] === 'number') {
      return numberAttribute(value, 1);
    }

    return value;
  }
}
