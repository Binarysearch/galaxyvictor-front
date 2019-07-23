import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Validators, FormBuilder, FormControl } from '@angular/forms';
import { TranslateService } from '../../../../services/translate.service';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm = this.fb.group({
    email: ['admin@galaxyvictor.com', [Validators.email, Validators.required]],
    password: ['12345', Validators.required]
  });

  @ViewChild('password',{static:false}) passwordInput: ElementRef;

  errorMessage: string;

  constructor(public loginService: LoginService, public ts: TranslateService, private fb: FormBuilder) { }

  ngOnInit() {

  }

  login() {
    this.loginService.login(this.loginForm.value.email, this.loginForm.value.password).subscribe(null, error => {
      if (error.status === 401) {
        this.errorMessage = this.ts.strings.invalidLoginCredentials;
        this.loginForm.patchValue({password: ''});

        this.passwordInput.nativeElement.focus();
      }
    });
  }

  get email () {
    return this.loginForm.controls.email as FormControl;
  }

  get password (): FormControl {
    return this.loginForm.controls.password as FormControl;
  }
}
