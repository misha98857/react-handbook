import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { IonApp, IonContent, IonRouterOutlet, Platform } from '@ionic/angular/standalone';
import { Store } from '@ngrx/store';
import { forkJoin, from, Observable, of, switchMap, tap } from 'rxjs';
import { PushNotifications } from '@capacitor/push-notifications';
import { Device } from '@capacitor/device';
import { openWithProgressAction } from '../../store/actions/navigation.actions';
import { loadLatestPageAction, saveLatestPageAction } from '../../store/actions/history.actions';
import { selectRouterState } from '../../store/selectors/router-state.selectors';
import { StatusBar, Style } from '@capacitor/status-bar';
import { selectAppTheme } from '../../store/selectors/settings.selectors';
import { AsyncPipe } from '@angular/common';
import { MenuComponent } from '../menu/menu.component';
import { allowedLanguages, langMap } from '../../shared/translate/const/const';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { SettingsService } from '../../features/services/settings.service';
import { SettingsState } from '../../store/state/settings.state';
import { changeAppLanguageAction, initApplicationDataAction } from '../../store/actions/settings.actions';
import { loadProgressStateAction } from '../../store/actions/progress.actions';
import { Preferences } from '@capacitor/preferences';
import { SplashScreen } from '@capacitor/splash-screen';

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
    private settingsService: SettingsService,
  ) {}

  ngOnInit(): void {
    this.initializeApp();
  }

  initializeApp(): void {
    from(this.platform.ready())
      .pipe(
        switchMap(() => this.settingsService.initSettings$()),
        switchMap(settings => this.initApplicationData(settings)),
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

    const deviceLanguage$ = from(Device.getLanguageCode());

    return deviceLanguage$.pipe(
      map(({ value: deviceLanguage }) => {
        if (!allowedLanguages.includes(deviceLanguage)) {
          return 'en';
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

  private initApplicationData(settings: SettingsState) {
    const language$ = this.getLanguage(settings['language']);

    return forkJoin([language$, Preferences.get({ key: 'progress' }), Preferences.get({ key: 'latestPage' })]).pipe(
      switchMap(([language, progress, latestPage]) => {
        this.store.dispatch(initApplicationDataAction({ settings: { ...settings, language } }));
        this.store.dispatch(changeAppLanguageAction({ language }));
        this.store.dispatch(
          loadProgressStateAction({ progressState: JSON.parse(progress.value) as Record<string, number> }),
        );
        this.restoreLatestPage(settings['restoreState'], latestPage.value);
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
}
