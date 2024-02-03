import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { LanguageCardComponent } from '../widgets/components/languages-menu/language-card/language-card.component';
import { LanguagesMenuComponent } from '../widgets/components/languages-menu/languages-menu.component';


@NgModule({
  declarations: [LanguagesMenuComponent, LanguageCardComponent],
  imports: [
    CommonModule,
    IonicModule,
    TranslateModule,
    RouterModule.forChild([
      {
        path: '',
        component: LanguagesMenuComponent,
      }]),
  ],
  exports: [LanguagesMenuComponent],
})
export class LanguagesMenuModule {
}
