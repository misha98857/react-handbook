import {ChangeDetectionStrategy, Component} from "@angular/core";
import {ReactService} from "../../services/react.service";
import {select, Store} from "@ngrx/store";
import {Observable} from "rxjs";
import {
    selectAppTheme,
    selectNavButtons,
    selectRestoreProgress,
    selectRestoreState,
    selectVisibleProgress
} from "../../store/selectors/settings.selectors";
import {
    rateAppAction,
    toggleNavigationButtonAction,
    toggleRestoreProgressAction,
    toggleRestoreStateAction,
    toggleThemeAction,
    toggleVisibleProgressAction
} from "../../store/actions/settings.actions";
import {Router} from "@angular/router";
import {MenuController} from "@ionic/angular";
import {TranslateService} from "@ngx-translate/core";

@Component({
    selector: "app-menu",
    templateUrl: "./menu.component.html",
    styleUrls: ["./menu.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuComponent {
    public navButtonState: Observable<boolean> = this.store.pipe(select(selectNavButtons));
    public darkMode: Observable<boolean> = this.store.pipe(select(selectAppTheme));
    public visibleProgress: Observable<boolean> = this.store.pipe(select(selectVisibleProgress));
    public restoreProgress: Observable<boolean> = this.store.pipe(select(selectRestoreProgress));
    public restoreState: Observable<boolean> = this.store.pipe(select(selectRestoreState));

    constructor(private reactService: ReactService,
                private store: Store,
                private router: Router,
                private menu: MenuController,
                private translateService: TranslateService) {
    }


    public changeNavigationButtonState(checked: boolean): void {
        this.store.dispatch(toggleNavigationButtonAction({navButton: checked}));
    }

    public toggleTheme(checked: boolean): void {
        this.store.dispatch(toggleThemeAction({darkTheme: checked}));
    }

    public disableRating(): void {
        this.store.dispatch(rateAppAction());
    }

    public openMyApps(): void {
        void this.router.navigate(["apps"]);
        void this.menu.close();
    }

    public toggleVisibleProgress(checked: boolean): void {
        this.store.dispatch(toggleVisibleProgressAction({visibleProgress: checked}));
    }

    public toggleRestoreProgress(checked: boolean): void {
        this.store.dispatch(toggleRestoreProgressAction({restoreProgress: checked}));
    }

    public toggleRestoreState(checked: boolean): void {
        this.store.dispatch(toggleRestoreStateAction({restoreState: checked}));
    }

    public isRussianLanguage(): boolean {
        return this.translateService.currentLang === 'ru';
    }
}
