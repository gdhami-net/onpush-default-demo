import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PriceStore } from './price-store';

/** Same reading of the same plain field, plus a DOM event of its own. */
@Component({
  selector: 'eager-price-button',
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <span data-testid="eager-price-button">{{ store.last }}</span>
    <button type="button" data-testid="bump" (click)="bump()">bump</button>
  `,
})
export class EagerPriceButton {
  readonly store = inject(PriceStore);

  bump(): void {
    this.store.push(this.store.last + 1);
  }
}
