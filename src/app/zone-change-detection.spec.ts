import 'zone.js';
import { ChangeDetectorRef, NgZone, provideZoneChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { beforeEach, describe, expect, it } from 'vitest';
import { EagerPrice } from './eager-price';
import { PriceStore } from './price-store';
import { SideBySide } from './side-by-side';

/**
 * Cases 2, 3, 4 and 6, with zone.js change detection — the setup an app that has
 * just been upgraded from v21 still has, because `provideZoneChangeDetection()`
 * is what its `app.config.ts` says.
 *
 * Nothing here sleeps. `zone.run()` makes zone.js schedule the tick, and
 * `fixture.whenStable()` waits for that scheduled tick rather than for a clock.
 */
let fixture: ComponentFixture<SideBySide>;
let zone: NgZone;
let store: PriceStore;

/** Both copies of the same reading: [under the Eager parent, under the OnPush parent]. */
function shown(testid: string): string[] {
  const root = fixture.nativeElement as HTMLElement;
  return Array.from(root.querySelectorAll(`[data-testid="${testid}"]`)).map((node) =>
    node.textContent!.trim(),
  );
}

function buttons(testid: string): HTMLButtonElement[] {
  const root = fixture.nativeElement as HTMLElement;
  return Array.from(root.querySelectorAll(`[data-testid="${testid}"]`));
}

beforeEach(async () => {
  TestBed.configureTestingModule({ providers: [provideZoneChangeDetection()] });
  fixture = TestBed.createComponent(SideBySide);
  zone = TestBed.inject(NgZone);
  store = TestBed.inject(PriceStore);
  // Attaches the fixture to ApplicationRef, so zone.js drives the ticks the way
  // it does in a running app instead of the test calling detectChanges by hand.
  fixture.autoDetectChanges();
  await fixture.whenStable();
});

describe('zone.js change detection', () => {
  it('renders the same number under both parents to start with', () => {
    expect(shown('eager-price')).toEqual(['100', '100']);
  });

  it('case 2 — a plain field changed by something outside the tree only reaches the Eager branch', async () => {
    zone.run(() => store.push(101));
    await fixture.whenStable();

    expect(shown('eager-price')).toEqual(['101', '100']);
  });

  it('case 2 — a real timer callback inside the zone behaves the same way', async () => {
    await new Promise<void>((resolve) =>
      zone.run(() =>
        setTimeout(() => {
          store.push(102);
          resolve();
        }, 0),
      ),
    );
    await fixture.whenStable();

    expect(shown('eager-price')).toEqual(['102', '100']);
  });

  it('case 2 — an event elsewhere in the app does not rescue the skipped branch', async () => {
    buttons('root-push')[0]!.click();
    await fixture.whenStable();

    expect(store.last).toBe(101);
    expect(shown('eager-price')).toEqual(['101', '100']);
  });

  it('case 3 — a DOM event handled inside the Eager child refreshes it, and its siblings', async () => {
    zone.run(() => store.push(200));
    await fixture.whenStable();
    expect(shown('eager-price-button')).toEqual(['200', '100']);

    // The button inside the child that sits under the OnPush parent.
    buttons('bump')[1]!.click();
    await fixture.whenStable();

    expect(store.last).toBe(201);
    expect(shown('eager-price-button')).toEqual(['201', '201']);
    // The sibling that has no event of its own is refreshed too, because the
    // pass had to walk through the OnPush parent to reach the clicked view.
    expect(shown('eager-price')).toEqual(['201', '201']);
  });

  it('case 4 — a signal read in the Eager child template updates under either parent', async () => {
    zone.run(() => store.pushSignal(900));
    await fixture.whenStable();

    expect(shown('eager-signal-price')).toEqual(['900', '900']);
    // The plain field is untouched by this, in both branches.
    expect(shown('eager-price')).toEqual(['100', '100']);
  });

  it('case 4 — a signal changed with no zone involved still reaches both branches', async () => {
    store.pushSignal(901);
    await fixture.whenStable();

    expect(shown('eager-signal-price')).toEqual(['901', '901']);
  });

  it('case 6 — an input change on the OnPush parent brings the Eager child below it up to date', async () => {
    zone.run(() => store.push(300));
    await fixture.whenStable();
    expect(shown('eager-price')).toEqual(['300', '100']);

    fixture.componentInstance.onPushLabel.set('new label');
    await fixture.whenStable();

    expect(shown('generated-label')).toEqual(['new label']);
    expect(shown('eager-price')).toEqual(['300', '300']);
  });

  it('markForCheck on the child itself also gets the branch checked', async () => {
    zone.run(() => store.push(400));
    await fixture.whenStable();
    expect(shown('eager-price')).toEqual(['400', '100']);

    // The second EagerPrice on the page is the one under the OnPush parent.
    const cdr = fixture.debugElement
      .queryAll(By.directive(EagerPrice))
      .map((node) => node.injector.get(ChangeDetectorRef))[1]!;
    zone.run(() => cdr.markForCheck());
    await fixture.whenStable();

    expect(shown('eager-price')).toEqual(['400', '400']);
  });
});
