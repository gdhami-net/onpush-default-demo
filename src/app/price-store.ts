import { Injectable, signal } from '@angular/core';

/**
 * Two copies of the same number. `last` is a plain field, so nothing in the
 * reactive graph is told when it changes; `lastSignal` is the same value in a
 * signal, which does tell the graph.
 *
 * A component written before the Angular 22 upgrade usually reads the plain
 * one, because under the old default strategy that was enough.
 */
@Injectable({ providedIn: 'root' })
export class PriceStore {
  last = 100;

  readonly lastSignal = signal(100);

  /** What a timer callback, a WebSocket message or an HTTP response does. */
  push(next: number): void {
    this.last = next;
  }

  pushSignal(next: number): void {
    this.lastSignal.set(next);
  }
}
