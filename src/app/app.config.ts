import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';

/**
 * `provideZoneChangeDetection()` is what the v21 migration writes into an
 * upgraded app, because from v21 Angular stopped installing the zone.js
 * scheduler by default. This demo keeps it so the page behaves like an app that
 * came up through the versions rather than one generated yesterday.
 */
export const appConfig: ApplicationConfig = {
  providers: [provideBrowserGlobalErrorListeners(), provideZoneChangeDetection()],
};
