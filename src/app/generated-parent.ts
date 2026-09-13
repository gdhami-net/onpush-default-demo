import { Component, input } from '@angular/core';
import { EagerPrice } from './eager-price';
import { EagerPriceButton } from './eager-price-button';
import { EagerSignalPrice } from './eager-signal-price';

/**
 * A component with no `changeDetection` key, which is what the v22 generator
 * writes and what the v22 default therefore decides. `strategy-defaults.spec.ts`
 * asserts that its compiled definition comes out OnPush.
 */
@Component({
  selector: 'generated-parent',
  imports: [EagerPrice, EagerPriceButton, EagerSignalPrice],
  template: `
    <h3 data-testid="generated-label">{{ label() }}</h3>
    <eager-price />
    <eager-price-button />
    <eager-signal-price />
  `,
})
export class GeneratedParent {
  readonly label = input('');
}
