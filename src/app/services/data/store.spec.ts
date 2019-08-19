import { TestBed } from '@angular/core/testing';

import { Store } from './store';

describe('Store', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const store: Store = TestBed.get(Store);
    expect(store).toBeTruthy();
  });
});
