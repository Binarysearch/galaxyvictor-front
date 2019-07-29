import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DevelopIndexComponent } from './develop-index.component';
import { EndPointService, AppInfo } from '../../../../services/end-point.service';
import { of } from 'rxjs';

describe('DevelopIndexComponent', () => {
  let component: DevelopIndexComponent;
  let fixture: ComponentFixture<DevelopIndexComponent>;

  const FAKE_APP_INFO: AppInfo = {
    apiHost: 'some_host',
    appVersion: '1.0.0'
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DevelopIndexComponent ],
      providers: [
        { provide: EndPointService, useValue: { getAppInfo(){ return of(FAKE_APP_INFO) } } }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DevelopIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
