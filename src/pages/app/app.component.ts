import { Component, effect, EnvironmentInjector, inject, OnInit, runInInjectionContext } from '@angular/core';
import { IonApp, IonContent, IonRouterOutlet, Platform } from '@ionic/angular/standalone';
import { from } from 'rxjs';
import { PushNotifications } from '@capacitor/push-notifications';
import { StatusBar, Style } from '@capacitor/status-bar';
import { AsyncPipe, Location } from '@angular/common';
import { MenuComponent } from '../menu/menu.component';
import { SplashScreen } from '@capacitor/splash-screen';
import { SettingsStore } from '../../store/settings.store';
import { HistoryStore } from '../../store/history.store';
import { ArticlesService } from '../../features/services/articles.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { NavigationStore } from '../../store/navigation.store';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonApp, IonContent, IonRouterOutlet, AsyncPipe, MenuComponent],
})
export class AppComponent implements OnInit {
  readonly settingsStore = inject(SettingsStore);
  readonly navigationStore = inject(NavigationStore);
  readonly historyStore = inject(HistoryStore);
  private readonly environmentInjector = inject(EnvironmentInjector);

  constructor(
    private platform: Platform,
    private location: Location,
    private articlesService: ArticlesService,
    private translate: TranslateService,
    private router: Router,
  ) {
    effect(
      () => {
        const language = this.settingsStore.language();
        if (language) {
          this.setLanguage(language);
          this.restoreAppState();
        }
      },
      { allowSignalWrites: true },
    );
  }

  ngOnInit(): void {
    this.initializeApp();
  }

  initializeApp(): void {
    from(this.platform.ready()).subscribe(() => {
      this.initUrlChangeWatcher();
      this.darkThemeChangeEffect();
      void PushNotifications.register();
      void SplashScreen.hide();
    });
  }

  private darkThemeChangeEffect() {
    runInInjectionContext(this.environmentInjector, () => {
      effect(() => {
        void StatusBar.setStyle({ style: this.settingsStore.darkTheme() ? Style.Dark : Style.Light });
        void StatusBar.setBackgroundColor({ color: this.settingsStore.darkTheme() ? '#000000' : '#ffffff' });
      });
    });
  }

  private initUrlChangeWatcher() {
    this.location.onUrlChange((url: string) => {
      this.historyStore.updateLatestPage(url);
    });
  }

  private setLanguage(language: string): void {
    this.articlesService.loadArticlesFile(language);
    this.translate.use(language);
  }

  private restoreAppState(): void {
    const latestPage = this.historyStore.latestPage();
    const shouldRestoreAppState = this.settingsStore.restoreAppState();
    const appStateAlreadyRestored = this.historyStore.appStateRestored();

    if (appStateAlreadyRestored || !shouldRestoreAppState || !latestPage) {
      return;
    }

    this.historyStore.updateAppStateRestored(true);
    this.navigationStore.updateNavigationState({ isProgress: true });
    void this.router.navigateByUrl(latestPage.replace(/"/g, ''));
  }
}
