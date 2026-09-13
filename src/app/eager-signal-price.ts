import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PriceStore } from './price-store';

/** Same strategy, same store, but the template reads the signal copy. */
@Component({
  selector: 'eager-signal-price',
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `<span data-testid="eager-signal-price">{{ store.lastSignal() }}</span>`,
})
export class EagerSignalPrice {
  readonly store = inject(PriceStore);
}
