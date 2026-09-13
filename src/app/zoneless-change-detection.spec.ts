import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { PriceStore } from './price-store';
import { SideBySide } from './side-by-side';

/**
 * Case 5 — the same scenarios with no zone.js at all, which is what a project
 * created on v21 or v22 gets by default. The point of this file is to keep the
 * post honest: zoneless skips the plain-field update for its own reason, and
 * that reason is not the parent's strategy.
 */
let fixture: ComponentFixture<SideBySide>;
let store: PriceStore;

function shown(testid: string): string[] {
  const root = fixture.nativeElement as HTMLElement;
  return Array.from(root.querySelectorAll(`[data-testid="${testid}"]`)).map((node) =>
    node.textContent!.trim(),
  );
}

beforeEach(async () => {
  // No providers: zoneless is the default change detection in v22's TestBed,
  // the same as in a project the v22 CLI generates.
  fixture = TestBed.createComponent(SideBySide);
  store = TestBed.inject(PriceStore);
  fixture.autoDetectChanges();
  await fixture.whenStable();
});

describe('zoneless change detection', () => {
  it('renders the same number under both parents to start with', () => {
    expect(shown('eager-price')).toEqual(['100', '100']);
  });

  it('case 5 — a plain field change schedules nothing, so neither branch moves', async () => {
    store.push(500);
    await fixture.whenStable();

    expect(store.last).toBe(500);
    // Including the branch under the Eager parent. There is no pass to skip.
    expect(shown('eager-price')).toEqual(['100', '100']);
  });

  it('case 5 — a signal change schedules a pass and reaches both branches', async () => {
    store.pushSignal(600);
    await fixture.whenStable();

    expect(shown('eager-signal-price')).toEqual(['600', '600']);
  });

  it('case 5 — a DOM event schedules a pass, and the Eager children then read the plain field', async () => {
    const root = fixture.nativeElement as HTMLElement;
    root.querySelector<HTMLButtonElement>('[data-testid="root-push"]')!.click();
    await fixture.whenStable();

    expect(store.last).toBe(101);
    // The click marked the root, so the Eager branch is checked and the OnPush
    // branch is not — the same split as under zone.js, for the same reason.
    expect(shown('eager-price')).toEqual(['101', '100']);
  });
});
