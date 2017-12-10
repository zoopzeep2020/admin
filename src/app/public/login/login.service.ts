import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions, URLSearchParams } from '@angular/http';
import { Output, EventEmitter } from '@angular/core';
import 'rxjs/add/operator/map';
import { environment } from './../../../environments/environment';
// import * as globals from './../../globals';

@Injectable()
export class Login {

  constructor(private http: Http) { }

  auth(data) {
    return this.http.post(environment.apiUrl + 'auth', data).map((res: Response) => res.json())
  }

  signup(data) {
    return this.http.post(environment.apiUrl + 'users/admin', data).map((res: Response) => res.json())
  }

}
