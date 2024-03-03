import { enableProdMode, importProvidersFrom } from '@angular/core';
import { environment } from './environments/environment';
import '@capacitor/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideStore } from '@ngrx/store';
import { appReducers } from '../store/reducers/app.reduces';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { provideEffects } from '@ngrx/effects';
import { SettingsEffects } from '../store/effects/settings.effects';
import { ProgressEffects } from '../store/effects/progress.effects';
import { HistoryEffects } from '../store/effects/history.effects';
import { AppComponent } from '../pages/app/app.component';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideRouterStore } from '@ngrx/router-store';
import { HttpClient, provideHttpClient, withFetch } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { createTranslateLoader } from '../shared/translate/utils/create-translate-loader';
import {
  PreloadAllModules,
  provideRouter,
  RouteReuseStrategy,
  withInMemoryScrolling,
  withPreloading,
} from '@angular/router';
import { routes } from './routes/routes';

if (environment.production) {
  enableProdMode();
}
bootstrapApplication(AppComponent, {
  providers: [
    provideIonicAngular(),
    provideStore(appReducers),
    provideEffects([SettingsEffects, ProgressEffects, HistoryEffects]),
    provideRouterStore(),
    importProvidersFrom(
      TranslateModule.forRoot({
        defaultLanguage: 'en',
        loader: {
          provide: TranslateLoader,
          useFactory: createTranslateLoader,
          deps: [HttpClient],
        },
      }),
    ),
    provideHttpClient(withFetch()),
    provideRouter(
      routes,
      withPreloading(PreloadAllModules),
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled',
      }),
    ),
    {
      provide: RouteReuseStrategy,
      useClass: IonicRouteStrategy,
    },
    !environment.production ? provideStoreDevtools() : [],
  ],
}).catch(err => console.log(err));
