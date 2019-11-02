import { TestBed, async, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { DashboardModule } from '@piros/dashboard';
import { of } from 'rxjs';
import { GalaxyMapService } from './services/galaxy-map.service';
import { ApiService } from '@piros/api';

describe('AppComponent', () => {

  let apiServiceSpy: jasmine.SpyObj<ApiService>;
  let galaxyMapSpy: jasmine.SpyObj<GalaxyMapService>;

  beforeEach(async(() => {

    apiServiceSpy = jasmine.createSpyObj('ApiService', ['isReady']);
    galaxyMapSpy = jasmine.createSpyObj('GalaxyMapService', [
      'setCanvas',
      'onMouseWheel',
      'onMouseClick',
      'onMouseDown',
      'onMouseUp',
      'onResize',
      'onMouseMove'
    ]);

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        DashboardModule
      ],
      declarations: [
        AppComponent
      ],
      providers: [
        { provide: ApiService, useValue: apiServiceSpy },
        { provide: GalaxyMapService, useValue: galaxyMapSpy }
      ]
    }).compileComponents();

    apiServiceSpy.isReady.and.returnValue(of(true));

    
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  
  it('should prepare renderer on ngAfterViewInit', fakeAsync(() => {
    const fixture = TestBed.createComponent(AppComponent);

    fixture.detectChanges();
    fixture.whenStable().then(() => {
      
      expect(galaxyMapSpy.setCanvas).toHaveBeenCalled();

    });
  }));

});
