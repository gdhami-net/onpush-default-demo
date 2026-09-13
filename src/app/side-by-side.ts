import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { EagerParent } from './eager-parent';
import { GeneratedParent } from './generated-parent';
import { PriceStore } from './price-store';

/**
 * The same three Eager children mounted twice: once under a parent that kept the
 * old strategy, once under a parent generated after the upgrade. Both branches
 * read the same store, so any difference on screen is change detection and
 * nothing else.
 *
 * The root itself is Eager, which is what an upgraded `App` component looks like
 * after the v22 migration has run over it.
 */
@Component({
  selector: 'side-by-side',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [EagerParent, GeneratedParent],
  template: `
    <section>
      <h2>Eager parent</h2>
      <eager-parent [label]="eagerLabel()" />
    </section>

    <section>
      <h2>OnPush parent</h2>
      <generated-parent [label]="onPushLabel()" />
    </section>

    <footer>
      <button type="button" data-testid="root-push" (click)="store.push(store.last + 1)">
        push a new price
      </button>
      <button type="button" data-testid="root-push-signal" (click)="store.pushSignal(store.lastSignal() + 1)">
        push a new signal price
      </button>
      <button type="button" data-testid="root-relabel" (click)="onPushLabel.set('relabelled ' + store.last)">
        change the OnPush parent's input
      </button>
    </footer>
  `,
})
export class SideBySide {
  readonly store = inject(PriceStore);
  readonly eagerLabel = signal('before the upgrade');
  readonly onPushLabel = signal('generated after the upgrade');
}
