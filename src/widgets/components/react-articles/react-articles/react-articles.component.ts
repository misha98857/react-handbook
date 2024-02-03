import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Articles } from '../../../../entities/articles/article';
import { Platform, ToastController, IonHeader, IonToolbar, IonButtons, IonBackButton, IonButton, IonIcon, IonMenuButton, IonTitle, IonContent, IonAccordionGroup, IonAccordion, IonItem, IonLabel, IonList, IonBadge } from '@ionic/angular/standalone';
import { Observable, Subscription } from 'rxjs';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { App } from '@capacitor/app';
import { selectReactArticles } from '../../../../store/selectors/react.selectors';
import { selectProgressState } from '../../../../store/selectors/progress.selectors';
import { selectLanguage, selectVisibleProgress } from '../../../../store/selectors/settings.selectors';
import { ReactService } from '../../../../features/services/react.service';
import { openWithProgressAction } from '../../../../store/actions/navigation.actions';
import { addIcons } from "ionicons";
import { search, languageOutline } from "ionicons/icons";
import { IonRouterLink } from "@ionic/angular/standalone";
import { NgFor, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault, AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-react-articles',
    templateUrl: './react-articles.component.html',
    styleUrls: ['./react-articles.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        IonHeader,
        IonToolbar,
        IonButtons,
        IonBackButton,
        IonButton,
        RouterLink,
        IonIcon,
        IonMenuButton,
        IonTitle,
        IonContent,
        IonAccordionGroup,
        NgFor,
        IonAccordion,
        IonItem,
        IonLabel,
        IonList,
        NgIf,
        NgSwitch,
        NgSwitchCase,
        IonBadge,
        NgSwitchDefault,
        AsyncPipe,
        TranslateModule,
    ],
})
export class ReactArticlesComponent implements OnDestroy {
    public articles: Observable<Articles[]> = this.store.pipe(select(selectReactArticles));
    public progress: Observable<Record<string, number>> = this.store.pipe(select(selectProgressState));
    public visibleProgress: Observable<boolean> = this.store.pipe(select(selectVisibleProgress));
    public language: Observable<string> = this.store.pipe(select(selectLanguage));

    private backButtonSubscribe: Subscription;
    private backCounter = 0;
    private changeLanguageSubscription: Subscription;

    constructor(
        private store: Store,
        private reactService: ReactService,
        private toastController: ToastController,
        private platform: Platform,
        private translate: TranslateService,
    ) {
        addIcons({ search, languageOutline });
    }

    public ionViewWillEnter(): void {
        this.backButtonSubscribe = this.platform.backButton.subscribe(() => {
            this.backCounter += 1;
            if (this.backCounter === 1) {
                void this.onBackButtonPress();
                setTimeout(() => (this.backCounter = 0), 2000);
            }
            if (this.backCounter === 2) {
                // eslint-disable-next-line @typescript-eslint/dot-notation
                App.exitApp();
            }
        });
    }

    public ionViewDidLeave(): void {
        this.backButtonSubscribe.unsubscribe();
    }

    public ngOnDestroy(): void {
        this.changeLanguageSubscription.unsubscribe();
    }

    public openArticle(): void {
        this.store.dispatch(openWithProgressAction());
    }

    private async onBackButtonPress(): Promise<void> {
        const toast = await this.toastController.create({
            message: this.translate.instant('exit') as string,
            duration: 2000,
        });
        await toast.present();
    }
}
