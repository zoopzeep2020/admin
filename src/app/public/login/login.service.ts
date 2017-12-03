import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions, URLSearchParams } from '@angular/http';
import { Output, EventEmitter } from '@angular/core';
import 'rxjs/add/operator/map';
import * as globals from './../../globals';

@Injectable()
export class Login {

  constructor(private http: Http) { }

  auth(data) {
    return this.http.post(globals.apiUrl + 'auth', data).map((res: Response) => res.json())
  }

  signup(data) {
    return this.http.post(globals.apiUrl + 'users/admin', data).map((res: Response) => res.json())
  }

}
