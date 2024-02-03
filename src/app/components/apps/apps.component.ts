import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-apps',
  templateUrl: './apps.component.html',
  styleUrls: ['./apps.component.scss'],
})
export class AppsComponent {

  constructor(private translateService: TranslateService) {}

  public isRussianLanguage() : boolean {
    return this.translateService.currentLang === 'ru';
  }
}
