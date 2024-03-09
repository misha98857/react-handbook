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
import { forkJoin, from, Observable, of, switchMap, tap } from 'rxjs';
import { PushNotifications } from '@capacitor/push-notifications';
import { Device } from '@capacitor/device';
import { StatusBar, Style } from '@capacitor/status-bar';
import { AsyncPipe } from '@angular/common';
import { MenuComponent } from '../menu/menu.component';
import { allowedLanguages, langMap } from '../../shared/translate/const/const';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { SettingsService } from '../../features/services/settings.service';
import { Preferences } from '@capacitor/preferences';
import { SplashScreen } from '@capacitor/splash-screen';
import { SettingsState, SettingsStore } from '../../store/settings.store';
import { ArticlesService } from '../../features/services/articles.service';
import { ReadProgressStore } from '../../store/read-progress.store';
import { NavigationStore } from '../../store/navigation.store';
import { HistoryStore } from '../../store/history.store';
import { ActivatedRoute, Router } from '@angular/router';

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
  readonly navigationStore = inject(NavigationStore);
  readonly historyStore = inject(HistoryStore);

  destroyRef = inject(DestroyRef);

  private environmentInjector = inject(EnvironmentInjector);

  constructor(
    private platform: Platform,
    private settingsService: SettingsService,
    private articlesService: ArticlesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
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
    this.activatedRoute.url.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.historyStore.updateLatestPage(this.router.url);
    });
  }

  private restoreLatestPage(restoreState: boolean, latestPage: string) {
    if (restoreState && latestPage) {
      this.navigationStore.updateNavigationState({ isProgress: true });
      return;
    }

    if (location.pathname !== '/react') {
      location.assign('/react');
    }
  }
}
