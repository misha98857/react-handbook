import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class ReactService {

  constructor(
    private translate: TranslateService,
    private alertController: AlertController,
  ) {
  }

  public async presentAlertPurchaseDelay(): Promise<void> {
    const alert = await this.alertController.create({
      header: this.translate.instant('alert-purchase-header') as string,
      message: this.translate.instant('alert-purchase-message') as string,
      buttons: [
        {
          text: this.translate.instant('ok') as string,
          role: null,
        },
      ],
    });
    await alert.present();
  }

  public async presentErrorDownloadAlert(): Promise<void> {
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
