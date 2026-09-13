import { ChangeDetectionStrategy, Component } from '@angular/core';
import { describe, expect, it } from 'vitest';
import migrations from '../../node_modules/@angular/core/schematics/migrations.json';
import corePackage from '../../node_modules/@angular/core/package.json';
import { EagerParent } from './eager-parent';
import { EagerPrice } from './eager-price';
import { GeneratedParent } from './generated-parent';

/** A component written exactly the way `ng generate component` writes one in v22. */
@Component({
  selector: 'as-generated',
  template: `<p>as generated</p>`,
})
class AsGenerated {}

/** The deprecated alias, to check it still resolves to the same strategy. */
@Component({
  selector: 'legacy-default',
  changeDetection: ChangeDetectionStrategy.Default,
  template: `<p>legacy default</p>`,
})
class LegacyDefault {}

/** The compiled component definition. `onPush` is the flag the runtime reads. */
function def(type: unknown): { onPush: boolean } {
  return (type as { ɵcmp: { onPush: boolean } }).ɵcmp;
}

describe('case 1 — the enum and the default, as shipped', () => {
  it('is measured against @angular/core 22.1.6', () => {
    expect(corePackage.version).toBe('22.1.6');
  });

  it('names the always-check strategy Eager and keeps Default as a deprecated alias', () => {
    expect(ChangeDetectionStrategy.OnPush).toBe(0);
    expect(ChangeDetectionStrategy.Eager).toBe(1);
    expect(ChangeDetectionStrategy.Default).toBe(1);
    expect(ChangeDetectionStrategy.Default).toBe(ChangeDetectionStrategy.Eager);
  });

  it('compiles a component with no changeDetection key to OnPush', () => {
    expect(def(AsGenerated).onPush).toBe(true);
    expect(def(GeneratedParent).onPush).toBe(true);
  });

  it('compiles an explicit Eager, and the deprecated Default, to the always-check strategy', () => {
    expect(def(EagerParent).onPush).toBe(false);
    expect(def(EagerPrice).onPush).toBe(false);
    expect(def(LegacyDefault).onPush).toBe(false);
  });

  it('ships the migration that writes Eager into components that had no strategy', () => {
    const migration = migrations.schematics['change-detection-eager'];
    expect(migration.version).toBe('22.0.0');
    expect(migration.description).toBe('Adds `ChangeDetectionStrategy.Eager` to all components.');
  });
});
