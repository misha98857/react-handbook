import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppsComponent } from '../components/apps/apps.component';
import { IonicModule } from '@ionic/angular';
import { CardComponent } from '../components/apps/card/card.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [AppsComponent, CardComponent],
  imports: [
    CommonModule,
    IonicModule,
    TranslateModule,
    RouterModule.forChild([
      {
        path: '',
        component: AppsComponent,
      },
    ]),
  ],
  exports: [AppsComponent]
})
export class AppsModule {}
