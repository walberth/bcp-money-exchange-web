import { Component, OnInit } from "@angular/core";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";

@Component({
  selector: 'app-change-money',
  templateUrl: './change-money.component.html',
  styleUrls: ['./change-money.component.css']
})
export class ChangeMoneyComponent implements OnInit {
  changeMoneyForm!: FormGroup;
  submitted = false;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.changeMoneyForm = this.formBuilder.group(
      {
        monedaOrigen: [null, Validators.required],
        monedaDestino: [null, Validators.required],
        monto: [null, Validators.required],
        montoObtenido: null,
      },
    );
  }
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.changeMoneyForm.invalid) {
      return;
    }

    // display form values on success
    alert(
      "SUCCESS!! :-)\n\n" + JSON.stringify(this.changeMoneyForm.controls.value, null, 4)
    );
  }

  onReset() {
    debugger;
    this.submitted = false;
    this.changeMoneyForm.reset();
  }
}
