import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions, URLSearchParams } from '@angular/http';
import { Output, EventEmitter } from '@angular/core';
import 'rxjs/add/operator/map';
import * as globals from './../../globals';

@Injectable()
export class CollectionsService {

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
        return this.http.get(globals.apiUrl + 'collections', { headers: headers }).map((res: Response) => res.json())
    }

    getStore(search, buisnessOnline, buisnessOffline, cityName) {
        let querystring = '';
        if (cityName != null) {
            //  querystring += '&location=' + cityName;
        }
        if (buisnessOnline == true) {
            querystring += '&buisnessOnline=' + buisnessOnline;
        }
        if (buisnessOffline == true) {
            querystring += '&buisnessOffline=' + buisnessOffline;
        }

        console.log(querystring);

        let headers = new Headers();
        this.basicAuthorizationHeader(headers);
        return this.http.get(globals.apiUrl + 'stores/search?search=' + search + querystring, { headers: headers }).map((res: Response) => res.json())
    }

    getCataloge(search, buisnessOnline, buisnessOffline, cityName) {
        let querystring = '';
        if (cityName != null) {
            //  querystring += '&location=' + cityName;
        }
        if (buisnessOnline == true) {
            querystring += '&buisnessOnline=' + buisnessOnline;
        }
        if (buisnessOffline == true) {
            querystring += '&buisnessOffline=' + buisnessOffline;
        }

        let headers = new Headers();
        this.basicAuthorizationHeader(headers);
        return this.http.get(globals.apiUrl + 'catalogs/search?search=' + search + querystring, { headers: headers }).map((res: Response) => res.json())
    }

    getOffer(search, buisnessOnline, buisnessOffline, cityName) {
        let querystring = '';
        if (cityName != null) {
            //  querystring += '&location=' + cityName;
        }
        if (buisnessOnline == true) {
            querystring += '&buisnessOnline=' + buisnessOnline;
        }
        if (buisnessOffline == true) {
            querystring += '&buisnessOffline=' + buisnessOffline;
        }

        let headers = new Headers();
        this.basicAuthorizationHeader(headers);
        return this.http.get(globals.apiUrl + 'offers/search?search=' + search + querystring, { headers: headers }).map((res: Response) => res.json())
    }

    getCity(search) {
        let headers = new Headers();
        this.basicAuthorizationHeader(headers);
        return this.http.get(globals.apiUrl + 'cities/searchByWord?search=' + search, { headers: headers }).map((res: Response) => res.json())
    }


    add(data) {
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
        console.log(formData);
        return this.http.post(globals.apiUrl + 'collections', formData, { headers: headers }).map((res: Response) => res.json())
    }

    update(id, data) {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        const formData = new FormData();
        for (var prop in data) {
            formData.append(prop, data[prop]);
        }
        console.log(formData);
        return this.http.put(globals.apiUrl + 'collections/' + id, formData, { headers: headers }).map((res: Response) => res.json())
    }

    delete(id) {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        return this.http.delete(globals.apiUrl + 'collections/' + id, { headers: headers }).map((res: Response) => res.json())
    }
}
