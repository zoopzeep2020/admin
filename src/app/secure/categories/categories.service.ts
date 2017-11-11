import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions, URLSearchParams } from '@angular/http';
import { Output, EventEmitter } from '@angular/core';
import 'rxjs/add/operator/map';
import * as globals from './../../globals';

@Injectable()
export class CategoriesService {

    createAuthorizationHeader(headers: Headers) {
        headers.append('Authorization', 'JWT ' + localStorage.getItem('token'));
    }

    basicAuthorizationHeader(headers: Headers) {
        headers.append('Authorization', 'maximumvsminimumsecurity');
    }

    constructor(private http: Http) { }

    getAll() {
        let headers = new Headers();
        this.basicAuthorizationHeader(headers);
        return this.http.get(globals.apiUrl + 'categories', { headers: headers }).map((res: Response) => res.json())
    }

    add(data) {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        const formData = new FormData();
        for (var prop in data) {
            formData.append(prop, data[prop]);
        }
        console.log(formData);
        return this.http.post(globals.apiUrl + 'categories', formData, { headers: headers }).map((res: Response) => res.json())
    }

    update(id, data) {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        const formData = new FormData();
        for (var prop in data) {
            formData.append(prop, data[prop]);
        }
        console.log(formData);
        return this.http.put(globals.apiUrl + 'categories/' + id, formData, { headers: headers }).map((res: Response) => res.json())
    }

    delete(id) {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        return this.http.delete(globals.apiUrl + 'categories/' + id, { headers: headers }).map((res: Response) => res.json())
    }
}
