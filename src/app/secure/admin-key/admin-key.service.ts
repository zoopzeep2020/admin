import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions, URLSearchParams } from '@angular/http';
import { Output, EventEmitter } from '@angular/core';
import 'rxjs/add/operator/map';
import * as globals from './../../globals';

@Injectable()
export class AdminKeyService {

    createAuthorizationHeader(headers: Headers) {
        headers.append('Authorization', 'JWT ' + localStorage.getItem('token'));
    }

    constructor(private http: Http) { }

    getAll() {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        return this.http.get(globals.apiUrl + 'users/admin/adminKey', { headers: headers }).map((res: Response) => res.json())
    }

}
