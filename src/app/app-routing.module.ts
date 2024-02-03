import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { FutureHandlerComponent } from './components/future-handler/future-handler.component';

const routes: Routes = [
  { path: '', redirectTo: 'react', pathMatch: 'full' },
  { path: 'react', loadChildren: () => import('./modules/react.module').then(m => m.ReactModule) },
  { path: 'languages', loadChildren: () => import('./modules/languages-menu.module').then(m => m.LanguagesMenuModule) },
  { path: 'apps', loadChildren: () => import('./modules/apps.module').then(m => m.AppsModule) },
  {
    path: 'search',
    loadChildren: () => import('./modules/search.module').then((m) => m.SearchModule),
    pathMatch: 'full',
  },
  { path: 'error', component: FutureHandlerComponent, pathMatch: 'full' },
  { path: '**', redirectTo: 'error', pathMatch: 'full' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
