import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, ValidatorFn } from '@angular/forms';
import { RegisterService } from '../../services/register.service';
import { TranslateService } from 'src/app/services/translate.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm = this.fb.group({
    email: ['', [Validators.email, Validators.required]],
    password: ['', [Validators.minLength(5), Validators.required]],
    repeatPassword: ['']
  }, {validator: this.checkEqualPassword } );

  constructor(private router: Router ,private registerService: RegisterService, public ts: TranslateService, private fb: FormBuilder) { }

  ngOnInit() {
  }

  get email () {
    return this.registerForm.controls.email as FormControl;
  }

  get password (): FormControl {
    return this.registerForm.controls.password as FormControl;
  }

  get repeatPassword (): FormControl { 
    return this.registerForm.controls.repeatPassword as FormControl;
  }

  register() {
    const email = this.registerForm.value.email;
    const password = this.registerForm.value.password;
    this.registerService.register(email, password).subscribe(() => {
      this.router.navigateByUrl('/');
    });
  }

  public checkEqualPassword(fg: FormGroup) {
    const p1 = fg.value.password;
    const p2 = fg.value.repeatPassword;

    if (p1 !== p2) {
      return { notEquals: true };
    }
    return null;
  }

}
