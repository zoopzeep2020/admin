import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions, URLSearchParams } from '@angular/http';
import { Output, EventEmitter } from '@angular/core';
import 'rxjs/add/operator/map';
import * as globals from './../../globals';

@Injectable()
export class citiesService {

    createAuthorizationHeader(headers: Headers) {
        headers.append('Authorization', 'JWT ' + localStorage.getItem('token'));
    }

    basicAuthorizationHeader(headers: Headers) {
        headers.append('Authorization', 'maximumvsminimumsecurity');
    }

    constructor(private http: Http) { }

    getAll() {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        return this.http.get(globals.apiUrl + 'cities', { headers: headers }).map((res: Response) => res.json())
    }

    add(data) {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        return this.http.post(globals.apiUrl + 'cities', data, { headers: headers }).map((res: Response) => res.json())
    }

    update(id, data) {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        return this.http.put(globals.apiUrl + 'cities/' + id, data, { headers: headers }).map((res: Response) => res.json())
    }

    delete(id) {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        return this.http.delete(globals.apiUrl + 'cities/' + id, { headers: headers }).map((res: Response) => res.json())
    }
}
