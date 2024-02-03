import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactSearchComponent } from '../components/react-search/react-search.component';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [ReactSearchComponent],
  imports: [
    CommonModule,
    IonicModule,
    TranslateModule,
    RouterModule.forChild([
      {
        path: '',
        component: ReactSearchComponent,
      },
    ]),
  ],
})
export class SearchModule {}
