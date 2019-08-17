import { TestBed, async, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { DashboardModule } from '@piros/dashboard';
import { SocketService } from './services/socket.service';
import { ApiService } from './services/api.service';
import { of } from 'rxjs';
import { AuthService } from './modules/auth/services/auth.service';
import { GalaxyMapService } from './services/galaxy-map.service';

describe('AppComponent', () => {

  let apiServiceSpy: jasmine.SpyObj<ApiService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let galaxyMapSpy: jasmine.SpyObj<GalaxyMapService>;

  beforeEach(async(() => {

    apiServiceSpy = jasmine.createSpyObj('ApiService', ['getReady']);
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
        { provide: AuthService, useValue: authServiceSpy },
        { provide: GalaxyMapService, useValue: galaxyMapSpy }
      ]
    }).compileComponents();

    apiServiceSpy.getReady.and.returnValue(of(true));

    
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
