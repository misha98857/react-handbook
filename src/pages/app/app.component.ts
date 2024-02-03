import { Component, OnDestroy, OnInit } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { IonicRouteStrategy, Platform } from '@ionic/angular/standalone';
import { select, Store, StoreModule } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { Device } from '@capacitor/device';
import { increaseOpenCountAction, initApplicationDataAction } from '../../store/actions/settings.actions';
import { loadReactArticlesAction } from '../../store/actions/react.actions';
import { loadProgressStateAction } from '../../store/actions/progress.actions';
import { openWithProgressAction } from '../../store/actions/navigation.actions';
import { loadLatestPageAction, saveLatestPageAction } from '../../store/actions/history.actions';
import { selectRouterState } from '../../store/selectors/react.selectors';
import { ISettingsState } from '../../store/state/settings.state';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { selectAppTheme } from '../../store/selectors/settings.selectors';
import { BrowserModule } from '@angular/platform-browser';
import { ReactModule } from '../react.module';
import { FutureHandlerModule } from '../future-handler.module';
import { AppMenuModule } from '../app-menu.module';
import { RouteReuseStrategy, RouterModule } from '@angular/router';
import { LanguagesMenuModule } from '../languages-menu.module';
import { ReactService } from '../../features/services/react.service';
import { LanguageService } from '../../features/services/language.service';
import { IonApp, IonContent, IonRouterOutlet } from '@ionic/angular/standalone';
import { AsyncPipe } from '@angular/common';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [
    IonApp,
    IonContent,
    IonRouterOutlet,
    AppMenuModule,
    AsyncPipe,
  ],
  providers: [
    ReactService,
    LanguageService,
    {
      provide: RouteReuseStrategy,
      useClass: IonicRouteStrategy,
    },
  ],
})
export class AppComponent implements OnInit, OnDestroy {
  public darkMode: Observable<boolean> = this.store.pipe(select(selectAppTheme));

  private routerWatcher: Subscription;

  constructor(
    private platform: Platform,
    private store: Store,
    private translate: TranslateService,
  ) {
  }

  public ngOnInit(): void {
    void this.initializeApp();
  }

  public ngOnDestroy(): void {
    this.routerWatcher.unsubscribe();
  }

  public async initializeApp(): Promise<void> {
    await this.platform.ready();
    await this.initApplicationData().then(() => {
      this.initRouterWatcher();
      this.darkThemeHandler();
      void PushNotifications.register();
    });
  }

  private async initLanguage(language: string | null): Promise<string> {
    const allowedLanguages = ['ru', 'en', 'az', 'es', 'fr', 'hu', 'it', 'ja', 'ko', 'mn', 'pt', 'tr', 'uk', 'zh'];
    const langMap: Record<string, string> = { pt: 'pt-br', zh: 'zh-hans' };

    if (language === null) {
      let deviceLang: string = (await Device.getLanguageCode()).value;

      if (!allowedLanguages.includes(deviceLang)) {
        return deviceLang === 'ru-RU' || deviceLang === 'ru' ? 'ru' : 'en';
      } else {
        if (Object.keys(langMap).includes(deviceLang)) {
          deviceLang = langMap[deviceLang];
        }
        return deviceLang;
      }
    } else {
      return language;
    }
  }

  private darkThemeHandler() {
    this.darkMode.subscribe(darkMode => {
      if (darkMode) {
        void StatusBar.setStyle({ style: Style.Dark });
        void StatusBar.setBackgroundColor({ color: '#000000' });
      } else {
        void StatusBar.setStyle({ style: Style.Light });
        void StatusBar.setBackgroundColor({ color: '#ffffff' });
      }
    });
  }

  private async initApplicationData() {
    const { value: darkTheme } = await Preferences.get({ key: 'darkTheme' });
    let { value: language } = await Preferences.get({ key: 'language' });
    language = await this.initLanguage(language);
    const { value: navButton } = await Preferences.get({ key: 'navButton' });
    const { value: openCount } = await Preferences.get({ key: 'openCount' });
    const { value: fontSize } = await Preferences.get({ key: 'fontSize' });
    const { value: isRated } = await Preferences.get({ key: 'isRated' });
    const { value: progress } = await Preferences.get({ key: 'progress' });
    const { value: visibleProgress } = await Preferences.get({ key: 'visibleProgress' });
    const { value: restoreProgress } = await Preferences.get({ key: 'restoreProgress' });
    const { value: restoreState } = await Preferences.get({ key: 'restoreState' });
    const { value: latestPage } = await Preferences.get({ key: 'latestPage' });

    const settings: ISettingsState = {
      fontSize: parseFloat(fontSize ?? '1.0'),
      darkTheme: (darkTheme ?? 'false') === 'true',
      language,
      isRated: (isRated ?? 'false') === 'true',
      openCount: parseInt(openCount ?? '0', 10),
      navButton: (navButton ?? 'true') === 'true',
      visibleProgress: (visibleProgress ?? 'true') === 'true',
      restoreProgress: (restoreProgress ?? 'true') === 'true',
      restoreState: (restoreState ?? 'true') === 'true',
    };
    this.translate.use(language);
    this.store.dispatch(initApplicationDataAction({ settings }));
    this.store.dispatch(loadReactArticlesAction());
    this.store.dispatch(loadProgressStateAction({ progressState: JSON.parse(progress) as Record<string, number> }));
    this.store.dispatch(
      increaseOpenCountAction({
        openCount: parseInt(openCount ?? '0', 10) + 1,
        language,
      }),
    );
    if (restoreState === 'true') {
      this.store.dispatch(openWithProgressAction());
      this.store.dispatch(loadLatestPageAction({ url: latestPage.replace(/"/g, '') }));
    } else {
      if (location.pathname !== '/react') {
        location.assign('/react');
      }
    }
    await SplashScreen.hide();
  }

  private initRouterWatcher() {
    this.routerWatcher = this.store.pipe(select(selectRouterState)).subscribe((routerState) => {
      let url = routerState.url;
      if (routerState.root.fragment) {
        url = url.replace(`#${routerState.root.fragment}`, '');
      }
      this.store.dispatch(saveLatestPageAction({ url }));
    });
  }
}
