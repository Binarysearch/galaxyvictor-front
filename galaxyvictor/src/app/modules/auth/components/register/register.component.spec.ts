import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';

import { RegisterComponent } from './register.component';
import { TranslateService } from 'src/app/services/translate.service';
import { ReactiveFormsModule } from '@angular/forms';
import { RegisterService } from '../../services/register.service';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let registerServiceSpy: jasmine.SpyObj<RegisterService>;

  beforeEach(async(() => {

    registerServiceSpy = jasmine.createSpyObj('RegisterService', ['register']);

    TestBed.configureTestingModule({
      declarations: [ RegisterComponent ],
      imports: [
        ReactiveFormsModule
      ],
      providers: [
        TranslateService,
        { provide: RegisterService, useValue: registerServiceSpy }
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

      registerServiceSpy.register.and.returnValue(of({ id: '', email: ''}));

      fixture.componentInstance.register();

      expect(registerServiceSpy.register).toHaveBeenCalledWith('someEmail', 'somePassword');

    });
  }));


});
