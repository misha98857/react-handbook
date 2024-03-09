import {
  Component,
  DestroyRef,
  effect,
  EnvironmentInjector,
  inject,
  OnInit,
  runInInjectionContext,
} from '@angular/core';
import { IonApp, IonContent, IonRouterOutlet, Platform } from '@ionic/angular/standalone';
import { Store } from '@ngrx/store';
import { forkJoin, from, Observable, of, switchMap, tap } from 'rxjs';
import { PushNotifications } from '@capacitor/push-notifications';
import { Device } from '@capacitor/device';
import { openWithProgressAction } from '../../store/actions/navigation.actions';
import { loadLatestPageAction, saveLatestPageAction } from '../../store/actions/history.actions';
import { selectRouterState } from '../../store/selectors/router-state.selectors';
import { StatusBar, Style } from '@capacitor/status-bar';
import { AsyncPipe } from '@angular/common';
import { MenuComponent } from '../menu/menu.component';
import { allowedLanguages, langMap } from '../../shared/translate/const/const';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { SettingsService } from '../../features/services/settings.service';
import { Preferences } from '@capacitor/preferences';
import { SplashScreen } from '@capacitor/splash-screen';
import { SettingsState, SettingsStore } from '../../store/signal-store/settings.store';
import { ArticlesService } from '../../features/services/articles.service';
import { ReadProgressStore } from '../../store/signal-store/read-progress.store';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonApp, IonContent, IonRouterOutlet, AsyncPipe, MenuComponent],
})
export class AppComponent implements OnInit {
  readonly settingsStore = inject(SettingsStore);
  readonly readProgressStore = inject(ReadProgressStore);

  destroyRef = inject(DestroyRef);

  private environmentInjector = inject(EnvironmentInjector);

  constructor(
    private platform: Platform,
    private store: Store,
    private settingsService: SettingsService,
    private articlesService: ArticlesService,
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
    runInInjectionContext(this.environmentInjector, () => {
      effect(() => {
        void StatusBar.setStyle({ style: this.settingsStore.darkTheme() ? Style.Dark : Style.Light });
        void StatusBar.setBackgroundColor({ color: this.settingsStore.darkTheme() ? '#000000' : '#ffffff' });
      });
    });
  }

  private initApplicationData(settings: SettingsState) {
    const language$ = this.getLanguage(settings['language']);

    return forkJoin([language$, Preferences.get({ key: 'progress' }), Preferences.get({ key: 'latestPage' })]).pipe(
      switchMap(([language, progress, latestPage]) => {
        this.settingsStore.updateSettings({ language });
        this.articlesService.loadArticlesFile();
        this.readProgressStore.updateReadProgress(JSON.parse(progress.value) as Record<string, number>);
        this.restoreLatestPage(!!settings['restoreState'], latestPage.value);
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
