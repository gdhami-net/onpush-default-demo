import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { EagerPrice } from './eager-price';
import { EagerPriceButton } from './eager-price-button';
import { EagerSignalPrice } from './eager-signal-price';

/** The same parent as it stood before the upgrade: checked on every pass. */
@Component({
  selector: 'eager-parent',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [EagerPrice, EagerPriceButton, EagerSignalPrice],
  template: `
    <h3 data-testid="eager-label">{{ label() }}</h3>
    <eager-price />
    <eager-price-button />
    <eager-signal-price />
  `,
})
export class EagerParent {
  readonly label = input('');
}
