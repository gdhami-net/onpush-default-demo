# migration-fixture

These three files are the *pre-migration* shapes used to record what Angular's
v22 `change-detection-eager` migration writes. They are outside `src/`, so
`tsconfig.app.json` (`include: ["src/**/*.ts"]`) never compiles them and they have
no effect on `npm run build` or `npm run check`.

`expected.diff` is the real output captured on Angular 22.1.6.

## Reproducing it

Do this in a throwaway copy of a v22 project, not in a checkout you care about —
the migration edits files in place.

```bash
cp migration-fixture/price-ticker.ts migration-fixture/price-panel.ts src/app/
cp migration-fixture/host.spec.ts src/app/
git add -A && git commit -m "before"
npx ng update @angular/core --migrate-only --name=change-detection-eager
git diff
```

Two things to notice, both recorded in `expected.diff`:

1. `price-ticker.ts` had no `changeDetection` key and gets
   `ChangeDetectionStrategy.Eager` added, with the import appended to the end of
   the existing `@angular/core` import list. `price-panel.ts` named
   `ChangeDetectionStrategy.Default` and has it rewritten to `Eager`.
2. `host.spec.ts` never appears in the output (the run reports "Migration
   completed (4 files modified)" for the app files) because the only tsconfig the migration is pointed at in a
   CLI-generated v22 project is `tsconfig.app.json`, which excludes `*.spec.ts`.
   Add `"tsConfig": "tsconfig.spec.json"` to the `test` target in `angular.json`
   and run it again: the top-level `TopLevelHost` gets the annotation, and
   `NestedHost` — declared inside the `describe` callback — still does not,
   because the migration only walks classes at the top level of a file.

The migration source is readable at
`node_modules/@angular/core/schematics/bundles/change-detection-eager.cjs`;
`ts.forEachChild(sf, ...)` plus the `ts.isClassDeclaration` guard is the
top-level-only walk, and the two `toInsert` strings are what gets written.
