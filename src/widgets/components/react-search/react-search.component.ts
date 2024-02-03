import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Articles } from '../../../entities/articles/article';
import { select, Store } from '@ngrx/store';
import { selectSearchedReactArticles } from '../../../store/selectors/react.selectors';
import { selectProgressState } from '../../../store/selectors/progress.selectors';
import { selectVisibleProgress } from '../../../store/selectors/settings.selectors';
import { ReactService } from '../../../features/services/react.service';
import { searchReactArticlesAction } from '../../../store/actions/react.actions';
import { openWithSearchAction } from '../../../store/actions/navigation.actions';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { NgFor, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault, AsyncPipe } from '@angular/common';
import { IonHeader, IonToolbar, IonButtons, IonBackButton, IonMenuButton, IonSearchbar, IonContent, IonAccordionGroup, IonAccordion, IonItem, IonLabel, IonList, IonBadge } from '@ionic/angular/standalone';

@Component({
    selector: 'app-react-search',
    templateUrl: './react-search.component.html',
    styleUrls: ['./react-search.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        IonHeader,
        IonToolbar,
        IonButtons,
        IonBackButton,
        IonMenuButton,
        IonSearchbar,
        IonContent,
        IonAccordionGroup,
        NgFor,
        IonAccordion,
        IonItem,
        IonLabel,
        IonList,
        RouterLink,
        NgIf,
        NgSwitch,
        NgSwitchCase,
        IonBadge,
        NgSwitchDefault,
        AsyncPipe,
        TranslateModule,
    ],
})
export class ReactSearchComponent {
    public articles$: Observable<Array<Articles>> = this.store.pipe(select(selectSearchedReactArticles));
    public openStatus: Map<string, boolean> = new Map<string, boolean>();
    public progress: Observable<Record<string, number>> = this.store.pipe(select(selectProgressState));
    public visibleProgress: Observable<boolean> = this.store.pipe(select(selectVisibleProgress));

    constructor(private store: Store) {
    }

    public searchText(e: { detail: { value: string } }): void {
        const {
            detail: { value },
        } = e;
        this.store.dispatch(searchReactArticlesAction({ text: value }));
    }

    public ionViewDidEnter(): void {
        const searchedElements = document.getElementsByTagName('ion-searchbar');
        if (searchedElements) {
            const { value } = document.getElementsByTagName('ion-searchbar')[0];
            this.store.dispatch(searchReactArticlesAction({ text: value }));
        }
    }

    public openArticleWithSearch(): void {
        this.store.dispatch(openWithSearchAction());
    }
}
