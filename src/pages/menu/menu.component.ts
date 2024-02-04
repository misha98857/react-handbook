import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { AsyncPipe } from '@angular/common';
import {
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonMenu,
  IonTitle,
  IonToggle,
  IonToolbar,
} from '@ionic/angular/standalone';
import {
  selectAppTheme,
  selectNavButtons,
  selectRestoreProgress,
  selectRestoreState,
  selectShowProgress,
} from '../../store/selectors/settings.selectors';
import {
  toggleNavigationButtonAction,
  toggleRestoreProgressAction,
  toggleRestoreStateAction,
  toggleShowProgressAction,
  toggleThemeAction,
} from '../../store/actions/settings.actions';

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
  navButtonState: Observable<boolean> = this.store.select(selectNavButtons);
  darkMode: Observable<boolean> = this.store.select(selectAppTheme);
  showProgress: Observable<boolean> = this.store.select(selectShowProgress);
  restoreProgress: Observable<boolean> = this.store.select(selectRestoreProgress);
  restoreState: Observable<boolean> = this.store.select(selectRestoreState);

  constructor(private store: Store) {}

  changeNavigationButtonState(checked: boolean): void {
    // TODO: should use method from service in features
    this.store.dispatch(toggleNavigationButtonAction({ navButton: checked }));
  }

  toggleTheme(checked: boolean): void {
    this.store.dispatch(toggleThemeAction({ darkTheme: checked }));
  }

  toggleShowProgress(checked: boolean): void {
    this.store.dispatch(toggleShowProgressAction({ showProgress: checked }));
  }

  toggleRestoreProgress(checked: boolean): void {
    this.store.dispatch(toggleRestoreProgressAction({ restoreProgress: checked }));
  }

  toggleRestoreState(checked: boolean): void {
    this.store.dispatch(toggleRestoreStateAction({ restoreState: checked }));
  }
}
