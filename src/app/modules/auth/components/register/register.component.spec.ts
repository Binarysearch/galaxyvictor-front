import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';

import { RegisterComponent } from './register.component';
import { TranslateService } from 'src/app/services/translate.service';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '@piros/api';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let registerServiceSpy: jasmine.SpyObj<ApiService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async(() => {

    registerServiceSpy = jasmine.createSpyObj('ApiService', ['register']);
    routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

    TestBed.configureTestingModule({
      declarations: [ RegisterComponent ],
      imports: [
        ReactiveFormsModule,
        RouterModule
      ],
      providers: [
        TranslateService,
        { provide: ApiService, useValue: registerServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should register with form values', fakeAsync(() => {
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

      let repeatPasswordInput = fixture.debugElement.query(By.css('input[formControlName="repeatPassword"]'));
      let elementRepeatPassword = repeatPasswordInput.nativeElement;

      elementRepeatPassword.value = 'someOtherPassword';
      elementRepeatPassword.dispatchEvent(new Event('input'));

      expect(fixture.componentInstance.email.value).toBe('someEmail');
      expect(fixture.componentInstance.password.value).toBe('somePassword');
      expect(fixture.componentInstance.repeatPassword.value).toBe('someOtherPassword');

      registerServiceSpy.register.and.returnValue(of({
        user: { id: '', username: '', password: ''},
        token: 'some_token',
        state: null
      }));

      fixture.componentInstance.register();

      expect(registerServiceSpy.register).toHaveBeenCalledWith('someEmail', 'somePassword');
      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/');

    });
  }));


});
