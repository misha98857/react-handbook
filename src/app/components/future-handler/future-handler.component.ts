import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-future-handler',
  templateUrl: './future-handler.component.html',
  styleUrls: ['./future-handler.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FutureHandlerComponent {}
