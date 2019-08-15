import { TestBed, async, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { DashboardModule } from '@piros/dashboard';
import { SocketService } from './services/socket.service';
import { ApiService } from './services/api.service';
import { of } from 'rxjs';
import { AuthService } from './modules/auth/services/auth.service';
import { MainRendererService } from './services/render/main-renderer.service';

describe('AppComponent', () => {

  let apiServiceSpy: jasmine.SpyObj<ApiService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let rendererServiceSpy: jasmine.SpyObj<MainRendererService>;

  beforeEach(async(() => {

    apiServiceSpy = jasmine.createSpyObj('ApiService', ['getReady']);
    rendererServiceSpy = jasmine.createSpyObj('MainRendererService', ['init', 'setViewport']);

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
        { provide: MainRendererService, useValue: rendererServiceSpy }
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
    const app = <AppComponent>fixture.debugElement.componentInstance;
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      
      expect(rendererServiceSpy.init).toHaveBeenCalled();
      expect(rendererServiceSpy.setViewport).toHaveBeenCalled();

    });
  }));

});
