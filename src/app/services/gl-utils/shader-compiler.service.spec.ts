import { TestBed } from '@angular/core/testing';

import { ShaderCompilerService } from './shader-compiler.service';

describe('ShaderCompilerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ShaderCompilerService = TestBed.get(ShaderCompilerService);
    expect(service).toBeTruthy();
  });
});
