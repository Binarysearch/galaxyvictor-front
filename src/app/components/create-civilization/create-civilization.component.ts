import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Validators, FormBuilder, FormControl } from '@angular/forms';
import { TranslateService } from '../../services/translate.service';
import { Router } from '@angular/router';
import { ApiService } from '@piros/api';

@Component({
  selector: 'create-civilization',
  templateUrl: './create-civilization.component.html',
  styleUrls: ['./create-civilization.component.css']
})
export class CreateCivilizationComponent implements OnInit {

  form = this.fb.group({
    name: ['', Validators.required]
  });

  errorMessage: string;

  constructor(public api: ApiService, public ts: TranslateService, private fb: FormBuilder) { }

  ngOnInit() {

  }

  create() {
    
  }

  get name (): FormControl {
    return this.form.controls.name as FormControl;
  }

  nameError(): boolean  {
    return this.form.controls.name.errors.required;
  }
}
