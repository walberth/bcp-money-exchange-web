import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Response } from '../model/response';
import { Constant } from '../helper/constant';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(protected httpClient: HttpClient) {
  }

  generateJwt(): Observable<Response<any>> {
    return this.httpClient.get<Response<any>>(`${environment.backend}/${Constant.AuthenticationApi}`);
  }
}
