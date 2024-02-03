import { ChangeDetectionStrategy, Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
    selectAppTheme,
    selectNavButtons,
    selectRestoreProgress, selectRestoreState,
    selectVisibleProgress,
} from '../../../store/selectors/settings.selectors';
import {
    toggleNavigationButtonAction, toggleRestoreProgressAction, toggleRestoreStateAction,
    toggleThemeAction,
    toggleVisibleProgressAction,
} from '../../../store/actions/settings.actions';
import { TranslateModule } from '@ngx-translate/core';
import { AsyncPipe } from '@angular/common';
import { IonMenu, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonToggle } from '@ionic/angular/standalone';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        IonMenu,
        IonHeader,
        IonToolbar,
        IonTitle,
        IonContent,
        IonList,
        IonItem,
        IonLabel,
        IonToggle,
        AsyncPipe,
        TranslateModule,
    ],
})
export class MenuComponent {
    public navButtonState: Observable<boolean> = this.store.pipe(select(selectNavButtons));
    public darkMode: Observable<boolean> = this.store.pipe(select(selectAppTheme));
    public visibleProgress: Observable<boolean> = this.store.pipe(select(selectVisibleProgress));
    public restoreProgress: Observable<boolean> = this.store.pipe(select(selectRestoreProgress));
    public restoreState: Observable<boolean> = this.store.pipe(select(selectRestoreState));

    constructor(private store: Store) {
    }

    public changeNavigationButtonState(checked: boolean): void {
        this.store.dispatch(toggleNavigationButtonAction({ navButton: checked }));
    }

    public toggleTheme(checked: boolean): void {
        this.store.dispatch(toggleThemeAction({ darkTheme: checked }));
    }

    public toggleVisibleProgress(checked: boolean): void {
        this.store.dispatch(toggleVisibleProgressAction({ visibleProgress: checked }));
    }

    public toggleRestoreProgress(checked: boolean): void {
        this.store.dispatch(toggleRestoreProgressAction({ restoreProgress: checked }));
    }

    public toggleRestoreState(checked: boolean): void {
        this.store.dispatch(toggleRestoreStateAction({ restoreState: checked }));
    }
}
