import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormControl } from '@angular/forms';
import { TranslateService } from '../../services/translate.service';
import { GvApiService } from '../../services/gv-api.service';
import { CivilizationsService } from '../../services/data/civilizations.service';

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

  constructor(
    public api: GvApiService,
    public civilizationsService: CivilizationsService,
    public ts: TranslateService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {

  }

  create() {
    this.civilizationsService.createCivilization(this.form.value.name).subscribe();
  }

  get name (): FormControl {
    return this.form.controls.name as FormControl;
  }

  nameError(): boolean  {
    return this.form.controls.name.errors.required;
  }
}
