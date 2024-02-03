import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MenuComponent} from '../components/app-menu/menu.component';
import {TranslateModule} from '@ngx-translate/core';
import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';

@NgModule({
    declarations: [MenuComponent],
    imports: [CommonModule, IonicModule, TranslateModule, RouterModule],
    exports: [MenuComponent],
})
export class AppMenuModule {
}
