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

  public ngOnInit(): void {
    void this.initializeApp();
  }

  public async initializeApp(): Promise<void> {
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
      StatusBar.setStyle({ style: darkMode ? Style.Dark : Style.Light });
      StatusBar.setBackgroundColor({ color: darkMode ? '#000000' : '#ffffff' });
    });
  }

  private async initApplicationData() {
    const settings = await this.initSettings();
    const { value: progress } = await Preferences.get({ key: 'progress' });

    let language = settings['language'];
    language = await this.initLanguage(language);

    this.translate.use(language);
    this.store.dispatch(initApplicationDataAction({ settings }));
    this.store.dispatch(loadArticlesAction());
    this.store.dispatch(loadProgressStateAction({ progressState: JSON.parse(progress) as Record<string, number> }));

    this.restoreLatestPage(settings['restoreState'], settings['latestPage']);
    await SplashScreen.hide();
  }

  private initRouterWatcher() {
    this.store.select(selectRouterState).pipe(takeUntilDestroyed()).subscribe((routerState) => {
      let url = routerState.url;
      this.store.dispatch(saveLatestPageAction({ url }));
    });
  }

  private async initSettings() {
    let settings: SettingsState = initialSettingsState;

    for (const setting of Object.keys(initialSettingsState)) {
      const { value } = await Preferences.get({ key: setting });
      settings = { ...settings, [setting]: value ? this.coerceSettingsProperty(setting, value) : settings[setting] };
    }

    return settings;
  }

  private restoreLatestPage(restoreState: boolean, latestPage: string) {
    if (restoreState) {
      this.store.dispatch(openWithProgressAction());
      this.store.dispatch(loadLatestPageAction({ url: latestPage.replace(/"/g, '') }));
      return;
    }

    if (location.pathname !== '/react') {
      location.assign('/react');
    }
  }

  private coerceSettingsProperty(settingKey: string, value: string) {
    console.log(settingKey, value);
    if (['showProgress', 'restoreProgress', 'restoreState', 'navButton', 'darkTheme', 'isRated'].includes(settingKey)) {
      return booleanAttribute(value);
    }

    if (['fontSize', 'openCount'].includes(settingKey)) {
      return numberAttribute(value, 1);
    }

    return value;
  }
}
