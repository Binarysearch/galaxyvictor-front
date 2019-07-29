import { TestBed } from '@angular/core/testing';

import { WebSocketBuilderService } from './web-socket-builder.service';

describe('WebSocketBuilderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WebSocketBuilderService = TestBed.get(WebSocketBuilderService);
    expect(service).toBeTruthy();
  });
});
