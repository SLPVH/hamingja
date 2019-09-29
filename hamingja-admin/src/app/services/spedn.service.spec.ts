import { TestBed } from '@angular/core/testing';

import { SpednService } from './spedn.service';

describe('SpednService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SpednService = TestBed.get(SpednService);
    expect(service).toBeTruthy();
  });
});
