import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PriceStore } from './price-store';

/**
 * The shape the v22 `change-detection-eager` migration leaves behind: a
 * component that had no `changeDetection` key before the upgrade and carries an
 * explicit `Eager` afterwards. It reads a plain field, so the only thing that
 * can put a new number on screen is a change-detection pass that reaches it.
 */
@Component({
  selector: 'eager-price',
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `<span data-testid="eager-price">{{ store.last }}</span>`,
})
export class EagerPrice {
  readonly store = inject(PriceStore);
}
