import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-card',
    templateUrl: './language-card.component.html',
    styleUrls: ['./language-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LanguageCardComponent {
    @Input() message: string;
    @Input() imagePath: string;
    @Input() disabled: boolean;
    @Input() language: string;
    @Input() selected: boolean;
    @Output() changeLanguage: EventEmitter<string> = new EventEmitter<string>();

    public setLanguage() {
        this.changeLanguage.emit(this.language);
    }
}
