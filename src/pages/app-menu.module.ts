import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { MenuComponent } from '../widgets/components/app-menu/menu.component';

@NgModule({
  declarations: [MenuComponent],
  imports: [CommonModule, IonicModule, TranslateModule, RouterModule],
  exports: [MenuComponent],
})
export class AppMenuModule {
}
