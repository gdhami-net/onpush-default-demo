import { Component } from '@angular/core';
import { describe, expect, it } from 'vitest';

@Component({
  selector: 'top-level-host',
  template: `<span>top level</span>`,
})
class TopLevelHost {}

describe('hosts', () => {
  @Component({
    selector: 'nested-host',
    template: `<span>nested</span>`,
  })
  class NestedHost {}

  it('exists', () => {
    expect(TopLevelHost).toBeTruthy();
    expect(NestedHost).toBeTruthy();
  });
});
