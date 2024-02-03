import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Store} from "@ngrx/store";
import {AlertController, LoadingController} from "@ionic/angular";
import {TranslateService} from "@ngx-translate/core";
import {rateAppAction} from "../store/actions/settings.actions";

@Injectable({
    providedIn: "root"
})
export class ReactService {
    public navButtonState: boolean;
    public articlesOpenCount = 0;

    constructor(
        private http: HttpClient,
        private store: Store,
        private loadingController: LoadingController,
        private translate: TranslateService,
        private alertController: AlertController,
    ) {
    }

    public async presentAlert(): Promise<void> {
        const alert = await this.alertController.create({
            header: this.translate.instant("alert-header") as string,
            message: this.translate.instant("alert-message") as string,
            buttons: [
                {
                    text: this.translate.instant("cancel") as string,
                    role: "cancel"
                },
                {
                    text: this.translate.instant("rate") as string,
                    handler: () => {
                        this.store.dispatch(rateAppAction());
                        window.open("https://play.google.com/store/apps/details?id=dev.misha98857.react_article", "_system", "location=yes");
                    },
                    role: null
                }
            ]
        });
        await alert.present();
    }

    public async presentAlertPurchaseDelay(): Promise<void> {
        const alert = await this.alertController.create({
            header: this.translate.instant("alert-purchase-header") as string,
            message: this.translate.instant("alert-purchase-message") as string,
            buttons: [
                {
                    text: this.translate.instant("ok") as string,
                    role: null
                }
            ]
        });
        await alert.present();
    }

    public async presentErrorDownloadAlert(): Promise<void> {
        const alert = await this.alertController.create({
            header: this.translate.instant("download-localization-error") as string,
            message: this.translate.instant("download-localization-error-message") as string,
            buttons: [
                {
                    text: this.translate.instant("ok") as string
                }
            ]
        });
        await alert.present();
    }
}
