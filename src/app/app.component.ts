import { OnInit, Component } from '@angular/core';
import { ExchangeService } from './service/exchange.service';
import {
  first,
  filter,
  distinctUntilChanged,
  debounceTime,
} from 'rxjs/operators';
import { ExchangeType } from './model/exchange-type';
import { ListColumn } from './model/list-column';
import { AuthenticationService } from './service/authentication.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Exchange } from './model/exchange';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'money-exchange-web';
  changeMoneyForm!: FormGroup;
  columns: ListColumn[] = [
    {
      name: 'Moneda Origen°',
      property: 'monedaOrigen',
    },
    {
      name: 'Moneda Destino',
      property: 'monedaDestino',
    },
    {
      name: 'Tipo Cambio',
      property: 'tipoCambio',
    },
  ] as ListColumn[];
  rows: ExchangeType[] = [];
  exchangeSelected?: ExchangeType;

  constructor(private formBuilder: FormBuilder,
    private exchangeService: ExchangeService,
    private authenticationService: AuthenticationService) {
  }

  ngOnInit(): void {
    this.changeMoneyForm = this.formBuilder.group(
      {
        exchangeType: [null, Validators.required],
      },
    );

    this.getExchangeTypes();
  }

  getExchangeTypes() {
    this.exchangeService
      .getExchangeTypes()
      .pipe(first())
      .subscribe((response) => {
        if (response !== null) {
          if (response.isSuccess) {
            if (!response.isWarning) {
              if(response.data) {
                this.rows = response.data;
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

  select(row: ExchangeType) {
    this.exchangeSelected = row;
  }

  authenticate(){
    this.authenticationService
      .generateJwt()
      .pipe(first())
      .subscribe((response) => {
        if (response !== null) {
          if (response.isSuccess) {
            if (!response.isWarning) {
              if(response.data) {
                localStorage.setItem('token', response.data);
                alert('Se realiza la authenticacion correctamente');
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

  desAuthenticate() {
    localStorage.removeItem('token');
    alert('Se limpiaron las credenciales');
  }

  onSubmit() {
    if (this.changeMoneyForm.invalid) {
      return;
    }

    const exchange: Exchange = new Exchange();
    exchange.monedaOrigen = this.exchangeSelected?.monedaOrigen;
    exchange.monedaDestino = this.exchangeSelected?.monedaDestino;
    exchange.tipoCambio = +this.changeMoneyForm.controls.exchangeType.value;

    this.exchangeService
      .changeMoneyExchangeType(exchange)
      .pipe(first())
      .subscribe((response) => {
        if (response !== null) {
          if (response.isSuccess) {
            if (!response.isWarning) {
              this.getExchangeTypes();
              alert('Se actualiza correctamente la información del tipo de cambio');
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

  }
}
