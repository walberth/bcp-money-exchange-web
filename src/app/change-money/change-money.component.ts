import { Component, Input, OnInit } from "@angular/core";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { ExchangeType } from "../model/exchange-type";
import { ExchangeService } from "../service/exchange.service";
import { first } from 'rxjs/operators';
import { Exchange } from "../model/exchange";

@Component({
  selector: 'app-change-money',
  templateUrl: './change-money.component.html',
  styleUrls: ['./change-money.component.css']
})
export class ChangeMoneyComponent implements OnInit {
  changeMoneyForm!: FormGroup;
  submitted = false;

  @Input()
  exchangeSelected?: ExchangeType;

  constructor(private formBuilder: FormBuilder,
    private exchangeService: ExchangeService) { }

  ngOnInit(): void {
    this.changeMoneyForm = this.formBuilder.group(
      {
        monto: [null, Validators.required],
        montoObtenido: null,
      },
    );
  }

  onSubmit() {
    this.submitted = true;

    if (this.changeMoneyForm.invalid) {
      return;
    }

    const receiveExchange: Exchange = new Exchange();
    receiveExchange.monedaOrigen = this.exchangeSelected?.monedaOrigen;
    receiveExchange.monedaDestino = this.exchangeSelected?.monedaDestino;
    receiveExchange.monto = +this.changeMoneyForm.controls.monto.value;

    this.exchangeService
      .performMoneyExchange(receiveExchange)
      .pipe(first())
      .subscribe((response) => {
        if (response !== null) {
          if (response.isSuccess) {
            if (!response.isWarning) {
              if(response.data) {
                const exchange = response.data as Exchange;
                this.changeMoneyForm.controls.montoObtenido.setValue(exchange.montoCambiado)
              }
            } else {
              alert(response.message);
            }
          } else {
            alert(response.message);
          }
        }
      });
  }

  onReset() {
    this.submitted = false;
    this.exchangeSelected = undefined;
    this.changeMoneyForm.reset();
  }
}
