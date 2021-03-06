import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Response } from '../model/response';
import { ExchangeType } from '../model/exchange-type';
import { Constant } from '../helper/constant';
import { Exchange } from '../model/exchange';

@Injectable({
  providedIn: 'root',
})
export class ExchangeService {
  constructor(protected httpClient: HttpClient) {
  }

  getExchangeTypes(): Observable<Response<ExchangeType[]>> {
    return this.httpClient.get<Response<ExchangeType[]>>(
      `${environment.backend}/${Constant.ExchangeApi}`
    );
  }

  performMoneyExchange(exchange: Exchange): Observable<Response<any>> {
    return this.httpClient.post<Response<any>>(
      `${environment.backend}/${Constant.ExchangeApi}/perform`,
      JSON.stringify(exchange)
    );
  }

  changeMoneyExchangeType(exchange: Exchange): Observable<Response<any>> {
    return this.httpClient.put<Response<any>>(
      `${environment.backend}/${Constant.ExchangeApi}`,
      JSON.stringify(exchange)
    );
  }
}
