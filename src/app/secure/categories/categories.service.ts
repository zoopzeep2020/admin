import {Injectable} from '@angular/core';
import {Http,Headers, Response, RequestOptions, URLSearchParams} from '@angular/http';
import {Output, EventEmitter} from '@angular/core';
import 'rxjs/add/operator/map';

@Injectable()
export class CategoriesService {
    
    
    results: string[];
    data = {};       
    
    createAuthorizationHeader(headers: Headers) {
        headers.append('Authorization', 'JWT ' + localStorage.getItem('token'));
    }

    constructor(private http: Http) {}

    get() {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        return this.http.get('http://webrexstudio.com:3001/categories', { headers: headers } ).map((res: Response) => res.json())
      }

    // constructor(private http: Http) { 
    //     this.http.get( 'http://webrexstudio.com:3001/v1/categories/').subscribe(data => {
    //       // Read the result field from the JSON response.
    //       this.results = data['data']['children'];
    //       console.log(this.results);
    //     });
    //   }

}
