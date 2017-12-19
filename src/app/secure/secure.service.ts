import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { environment } from './../../environments/environment';
import { Http, Headers, Response } from '@angular/http';

@Injectable()
export class SecureService {
    
    createAuthorizationHeader(headers: Headers) {
        headers.append('Authorization', 'JWT ' + localStorage.getItem('token'));
    }

    basicAuthorizationHeader(headers: Headers) {
        headers.append('Authorization', 'maximumvsminimumsecurity');
    }
    
    constructor(private http: Http) { }

    changePreview($event,imageId) {
        const preview = <HTMLImageElement>document.getElementById(imageId);
        const reader = new FileReader();
        
        reader.onloadend = function () {
            preview.src = reader.result;
        }
        if ($event.target.files[0]) {
            reader.readAsDataURL($event.target.files[0]);
        } else {
            preview.src = "";
        }
    }
    getAll(control) {
        let headers = new Headers();
        if (control == 'stores' || control == 'staticPages/' || control == 'users/admin/adminKey'){
            this.createAuthorizationHeader(headers);
            return this.http.get(environment.apiUrl + control, { headers: headers }).map((res: Response) => res.json())    
        }
        else{
            this.basicAuthorizationHeader(headers);
            return this.http.get(environment.apiUrl + control, { headers: headers }).map((res: Response) => res.json())    
        }
    }
    add(control, data) {
        console.log('here start adding from secure service');
        if(control == 'collections' || control == 'categories' ){
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
            console.log('here returns data');
            return this.http.post(environment.apiUrl + control, formData, { headers: headers }).map((res: Response) => res.json())
        }else{
            let headers = new Headers();
            this.createAuthorizationHeader(headers);
            return this.http.post(environment.apiUrl + control, data, { headers: headers }).map((res: Response) => res.json())
        }
        
    }
}
