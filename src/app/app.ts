import { ChangeDetectionStrategy, Component, OnDestroy, inject } from '@angular/core';
import { PriceStore } from './price-store';
import { SideBySide } from './side-by-side';

/**
 * The root of the page. A timer pushes a new price every second, into the plain
 * field only — the thing a WebSocket handler or an interval poller does in an
 * app that predates signals.
 */
@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [SideBySide],
  template: `
    <h1>A price ticking once a second, rendered twice</h1>
    <p>
      Both columns are the same Eager child reading the same plain field. The
      only difference is the change detection strategy of the component above it.
    </p>
    <side-by-side />
  `,
})
export class App implements OnDestroy {
  private readonly store = inject(PriceStore);

  private readonly timer = setInterval(() => this.store.push(this.store.last + 1), 1000);

  ngOnDestroy(): void {
    clearInterval(this.timer);
  }
}
