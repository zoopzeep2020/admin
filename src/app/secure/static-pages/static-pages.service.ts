import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions, URLSearchParams } from '@angular/http';
import { Output, EventEmitter } from '@angular/core';
import 'rxjs/add/operator/map';
import { environment } from './../../../environments/environment';

@Injectable()
export class StaticPagesService {

    createAuthorizationHeader(headers: Headers) {
        headers.append('Authorization', 'JWT ' + localStorage.getItem('token'));
    }

    basicAuthorizationHeader(headers: Headers) {
        headers.append('Authorization', 'maximumvsminimumsecurity');
    }

    constructor(private http: Http) { }

    // getAll() {
    //     let headers = new Headers();
    //     this.createAuthorizationHeader(headers);
    //     return this.http.get(environment.apiUrl + 'staticPages/', { headers: headers }).map((res: Response) => res.json())
    // }

    // add(data) {
    //     let headers = new Headers();
    //     this.createAuthorizationHeader(headers);
    //     return this.http.post(environment.apiUrl + 'staticPages', data, { headers: headers }).map((res: Response) => res.json())
    // }

    update(id, data) {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        return this.http.put(environment.apiUrl + 'staticPages/' + id, data, { headers: headers }).map((res: Response) => res.json())
    }

    delete(id) {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        return this.http.delete(environment.apiUrl + 'staticPages/' + id, { headers: headers }).map((res: Response) => res.json())
    }
}
