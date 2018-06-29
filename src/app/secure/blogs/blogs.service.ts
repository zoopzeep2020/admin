import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions, URLSearchParams } from '@angular/http';
import { Output, EventEmitter } from '@angular/core';
import 'rxjs/add/operator/map';
import { environment } from './../../../environments/environment';

@Injectable()
export class BlogsService {

    createAuthorizationHeader(headers: Headers) {
        headers.append('Authorization', 'JWT ' + localStorage.getItem('token'));
    }

    basicAuthorizationHeader(headers: Headers) {
        headers.append('Authorization', 'maximumvsminimumsecurity');
    }

    constructor(private http: Http) { }

    // getAll() {
    //     let headers = new Headers();
    //     this.basicAuthorizationHeader(headers);
    //     return this.http.get(environment.apiUrl + 'blogs/withoutlogin', { headers: headers }).map((res: Response) => res.json())
    // }

    // add(data) {
    //     let headers = new Headers();
    //     this.createAuthorizationHeader(headers);
    //     const formData = new FormData();
    //     for (var prop in data) {
    //         formData.append(prop, data[prop]);
    //     }
    //     console.log(formData);
    //     return this.http.post(environment.apiUrl + 'blogs', formData, { headers: headers }).map((res: Response) => res.json())
    // }

    getSingle(id) {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        return this.http.get(environment.apiUrl + 'blogs/' + id, { headers: headers }).map((res: Response) => res.json())
    }



    update(id, data) {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        const formData = new FormData();
        for (var prop in data) {
            formData.append(prop, data[prop]);
        }
        console.log(formData);
        return this.http.put(environment.apiUrl + 'blogs/' + id, formData, { headers: headers }).map((res: Response) => res.json())
    }

    delete(id) {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        return this.http.delete(environment.apiUrl + 'blogs/' + id, { headers: headers }).map((res: Response) => res.json())
    }

    imageUpload(data) {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        const formData = new FormData();
        for (var prop in data) {
            if (Array.isArray(data[prop])) {
                data[prop].forEach(val => {
                    formData.append(`${prop}[]`, val);
                });
            } else {
                formData.append(prop, data[prop]);
            }
        }
        return this.http.post(environment.apiUrl + 'imageupload/', formData, { headers: headers }).map((res: Response) => res.json())
    }
}
