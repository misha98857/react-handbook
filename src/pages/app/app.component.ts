import { booleanAttribute, Component, numberAttribute, OnInit } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { Platform } from '@ionic/angular/standalone';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { Device } from '@capacitor/device';
import { initApplicationDataAction } from '../../store/actions/settings.actions';
import { loadArticlesAction } from '../../store/actions/articles.actions';
import { loadProgressStateAction } from '../../store/actions/progress.actions';
import { openWithProgressAction } from '../../store/actions/navigation.actions';
import { loadLatestPageAction, saveLatestPageAction } from '../../store/actions/history.actions';
import { selectRouterState } from '../../store/selectors/articles.selectors';
import { initialSettingsState, SettingsState } from '../../store/state/settings.state';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { selectAppTheme } from '../../store/selectors/settings.selectors';
import { IonApp, IonContent, IonRouterOutlet } from '@ionic/angular/standalone';
import { AsyncPipe } from '@angular/common';
import { MenuComponent } from '../app-menu/menu.component';
import { allowedLanguages, langMap } from '../../shared/translate/const/const';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [
    IonApp,
    IonContent,
    IonRouterOutlet,
    AsyncPipe,
    MenuComponent,
  ],
})
export class AppComponent implements OnInit {
  darkMode: Observable<boolean> = this.store.select(selectAppTheme);

  constructor(
    private platform: Platform,
    private store: Store,
    private translate: TranslateService,
  ) {
  }

  ngOnInit(): void {
    void this.initializeApp();
  }

  async initializeApp(): Promise<void> {
    await this.platform.ready();
    this.initApplicationData().then(async () => {
      this.initRouterWatcher();
      this.darkThemeHandler();
      await PushNotifications.register();
    });
  }

  private async initLanguage(language: string | null): Promise<string> {
    if (language) {
      return language;
    }

    let { value: deviceLang } = await Device.getLanguageCode();

    if (!allowedLanguages.includes(deviceLang)) {
      return deviceLang === 'ru-RU' || deviceLang === 'ru' ? 'ru' : 'en';
    }

    if (Object.keys(langMap).includes(deviceLang)) {
      deviceLang = langMap[deviceLang];
    }

    return deviceLang;
  }

  private darkThemeHandler() {
    this.darkMode.subscribe(darkMode => {
      void StatusBar.setStyle({ style: darkMode ? Style.Dark : Style.Light });
      void StatusBar.setBackgroundColor({ color: darkMode ? '#000000' : '#ffffff' });
    });
  }

  private async initApplicationData() {
    const settings = await this.initSettings();
    const { value: progress } = await Preferences.get({ key: 'progress' });
    const { value: latestPage } = await Preferences.get({ key: 'latestPage' });

    let language = settings['language'];
    language = await this.initLanguage(language);
    this.translate.use(language);

    this.store.dispatch(initApplicationDataAction({ settings: { ...settings, language } }));
    this.store.dispatch(loadArticlesAction());
    this.store.dispatch(loadProgressStateAction({ progressState: JSON.parse(progress) as Record<string, number> }));

    this.restoreLatestPage(settings['restoreState'], latestPage);
    await SplashScreen.hide();
  }

  private initRouterWatcher() {
    this.store.select(selectRouterState).pipe(takeUntilDestroyed()).subscribe((routerState) => {
      this.store.dispatch(saveLatestPageAction({ url: routerState.url }));
    });
  }

  private async initSettings() {
    let settings: SettingsState = initialSettingsState;

    for (const setting of Object.keys(initialSettingsState)) {
      const { value } = await Preferences.get({ key: setting });
      settings = value ? { ...settings, [setting]: this.coerceSettingsProperty(setting, value) } : { ...settings };
    }

    return settings;
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
