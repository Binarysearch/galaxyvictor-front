import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { TranslateService } from 'src/app/services/translate.service';
import { LoginService } from '../../services/login.service';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let loginServiceSpy: jasmine.SpyObj<LoginService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async(() => {

    loginServiceSpy = jasmine.createSpyObj('LoginService', ['login']);
    routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

    TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      imports: [
        ReactiveFormsModule,
        RouterModule
      ],
      providers: [
        TranslateService,
        { provide: LoginService, useValue: loginServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should login with form values', fakeAsync(() => {
    expect(component).toBeTruthy();
    fixture.whenStable().then(() => {
      let emailInput = fixture.debugElement.query(By.css('input[formControlName="email"]'));
      let elementEmail = emailInput.nativeElement;

      elementEmail.value = 'someEmail';
      elementEmail.dispatchEvent(new Event('input'));

      let passwordInput = fixture.debugElement.query(By.css('input[formControlName="password"]'));
      let elementPassword = passwordInput.nativeElement;

      elementPassword.value = 'somePassword';
      elementPassword.dispatchEvent(new Event('input'));
      

      expect(fixture.componentInstance.email.value).toBe('someEmail');
      expect(fixture.componentInstance.password.value).toBe('somePassword');

      loginServiceSpy.login.and.returnValue(of({
        user: { id: '', email: ''},
        token: 'some_token'
      }));

      fixture.componentInstance.login();

      expect(loginServiceSpy.login).toHaveBeenCalledWith('someEmail', 'somePassword');
      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/');

    });
  }));
});
