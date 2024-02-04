import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular/standalone';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class ArticlesService {
  constructor(
    private translate: TranslateService,
    private alertController: AlertController,
  ) {}

  async presentErrorDownloadAlert(): Promise<void> {
    const alert = await this.alertController.create({
      header: this.translate.instant('download-localization-error') as string,
      message: this.translate.instant('download-localization-error-message') as string,
      buttons: [
        {
          text: this.translate.instant('ok') as string,
        },
      ],
    });
    await alert.present();
  }
}
