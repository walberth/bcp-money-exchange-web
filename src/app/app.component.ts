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

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'money-exchange-web';
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

  constructor(private exchangeService: ExchangeService,
    private authenticationService: AuthenticationService) {
  }

  ngOnInit(): void {
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
    console.log(row);
    this.exchangeSelected = row;
  }

  holi(){
    console.log('hola papa');
    this.authenticationService
      .generateJwt()
      .pipe(first())
      .subscribe((response) => {
        if (response !== null) {
          if (response.isSuccess) {
            if (!response.isWarning) {
              if(response.data) {
                localStorage.setItem('token', response.data);
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
}
