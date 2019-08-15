import { TestBed, async } from '@angular/core/testing';
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
});
