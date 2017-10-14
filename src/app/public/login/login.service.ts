import {Injectable} from '@angular/core';
import {Http,Headers, Response, RequestOptions, URLSearchParams} from '@angular/http';
import {Output, EventEmitter} from '@angular/core';
import 'rxjs/add/operator/map';

@Injectable()
export class Login {
  apiArr: string[];
  users: any = [];
  data = {};    
  public result : String;

  constructor(private http: Http) {}

  createAuthorizationHeader(headers: Headers) {
    headers.append('Authorization', 'JWT ' + localStorage.getItem('token'));
  }
  
  auth(data) {
    return this.http.post('http://webrexstudio.com:3001/auth', data).map((res: Response) => res.json())
  }

  // keywords() {
  //   let headers = new Headers();
  //   this.createAuthorizationHeader(headers);
  //   return this.http.get('http://webrexstudio.com:3001/v1/categories', {headers: headers} ).map((res: Response) => res.json())
  // }

  // auth() {
  //   return this.http.get('http://webrexstudio.com:3001/v1/catalogs')
  //       .map((res: Response) => res.json());
  // }   
}
