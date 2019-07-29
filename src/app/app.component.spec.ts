import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { DashboardModule } from '@binarysearch/dashboard';
import { SocketService } from './services/socket.service';

describe('AppComponent', () => {

  let socketServiceSpy: jasmine.SpyObj<SocketService>;

  beforeEach(async(() => {

    socketServiceSpy = jasmine.createSpyObj('SocketService', ['getMessages']);

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        DashboardModule
      ],
      declarations: [
        AppComponent
      ],
      providers: [
        { provide: SocketService, useValue: socketServiceSpy }
      ]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });
});
