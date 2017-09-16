import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AuthenticationService } from './auth.service';
import 'rxjs/add/operator/map';
import { MaterialStore, DBConStrng } from '../Models/index';

@Injectable()
export class MatStoreService {

  constructor(private http: Http, private auth: AuthenticationService) { }

  url = DBConStrng + 'matstore/';
  headers = new Headers({ 'Authorization': 'Bearer ' + this.auth.token });
  options = new RequestOptions({ headers: this.headers });

  getStoreBalance() {
    return this.http.get(this.url, this.options).map(res => res.json());
  }


}
