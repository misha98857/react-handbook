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

@Component({
    selector: 'app-react-search',
    templateUrl: './react-search.component.html',
    styleUrls: ['./react-search.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
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
