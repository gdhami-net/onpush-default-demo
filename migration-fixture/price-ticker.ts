import { Component, inject } from '@angular/core';
import { PriceStore } from './price-store';

@Component({
  selector: 'price-ticker',
  template: `<span>{{ store.last }}</span>`,
})
export class PriceTicker {
  readonly store = inject(PriceStore);
}
