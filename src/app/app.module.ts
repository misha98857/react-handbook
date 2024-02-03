import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy, RouterModule } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@awesome-cordova-plugins/splash-screen/ngx';
import { StatusBar } from '@awesome-cordova-plugins/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ReactModule } from './modules/react.module';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { appReducers } from './store/reducers/app.reduces';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { FutureHandlerModule } from './modules/future-handler.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ReactService } from './services/react.service';
import { AppMenuModule } from './modules/app-menu.module';
import { EffectsModule } from '@ngrx/effects';
import { AppEffects } from './store/effects/app.effects';
import { SettingsEffects } from './store/effects/settings.effects';
import { ProgressEffects } from './store/effects/progress.effects';
import { HistoryEffects } from './store/effects/history.effects';
import { LanguagesMenuModule } from './modules/languages-menu.module';
import { LanguageService } from './services/language.service';

export const createTranslateLoader = (http: HttpClient): TranslateHttpLoader =>
  new TranslateHttpLoader(http, './assets/locale/', '.json');

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    ReactModule,
    FutureHandlerModule,
    HttpClientModule,
    AppMenuModule,
    RouterModule,
    LanguagesMenuModule,
    StoreModule.forRoot(appReducers),
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
    StoreRouterConnectingModule.forRoot(),
    EffectsModule.forRoot([AppEffects, SettingsEffects, ProgressEffects, HistoryEffects]),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
  ],
  providers: [
    StatusBar,
    SplashScreen,
    ReactService,
    LanguageService,
    {
      provide: RouteReuseStrategy,
      useClass: IonicRouteStrategy,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
