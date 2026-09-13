import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PriceTicker } from './price-ticker';

@Component({
  selector: 'price-panel',
  changeDetection: ChangeDetectionStrategy.Default,
  imports: [PriceTicker],
  template: `<price-ticker />`,
})
export class PricePanel {}
