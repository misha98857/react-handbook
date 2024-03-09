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
import { from, Observable, of, switchMap, tap } from 'rxjs';
import { PushNotifications } from '@capacitor/push-notifications';
import { Device } from '@capacitor/device';
import { StatusBar, Style } from '@capacitor/status-bar';
import { AsyncPipe, Location } from '@angular/common';
import { MenuComponent } from '../menu/menu.component';
import { allowedLanguages, langMap } from '../../shared/translate/const/const';
import { map } from 'rxjs/operators';
import { SplashScreen } from '@capacitor/splash-screen';
import { SettingsStore } from '../../store/settings.store';
import { ReadProgressStore } from '../../store/read-progress.store';
import { NavigationStore } from '../../store/navigation.store';
import { HistoryStore } from '../../store/history.store';
import { getState } from '@ngrx/signals';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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

  private readonly destroyRef = inject(DestroyRef);
  private readonly environmentInjector = inject(EnvironmentInjector);

  constructor(
    private platform: Platform,
    private location: Location,
  ) {}

  ngOnInit(): void {
    this.initializeApp();
  }

  initializeApp(): void {
    from(this.platform.ready())
      .pipe(
        tap(() => {
          this.initUrlChangeWatcher();
          this.darkThemeHandler();
        }),
        switchMap(() => PushNotifications.register()),
      )
      .subscribe(() => {
        this.initApplicationData();
      });
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

  private initApplicationData() {
    const settings = getState(this.settingsStore);
    const language$ = this.getLanguage(settings['language']);

    language$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(language => {
      const latestPage = this.historyStore.latestPage();
      this.settingsStore.updateSettings({ language });
      this.restoreLatestPage(!!settings['restoreState'], latestPage);
      SplashScreen.hide();
    });
  }

  private initUrlChangeWatcher() {
    this.location.onUrlChange((url: string) => {
      this.historyStore.updateLatestPage(url);
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
