import {Injectable} from '@angular/core';
import {Http, Response, RequestOptions, URLSearchParams} from '@angular/http';
import {Output, EventEmitter} from '@angular/core';
import 'rxjs/add/operator/map';

@Injectable()
export class MyService {
  apiArr: string[];
  users: any = [];
  data = {};                            
  // constructor(private http: HttpClient) { 
  // }
  constructor(private http: Http) {}
  
  getApp(): string {
    return 'Hey ! This is from service!';
  }
  getArray(){
    this.users = [
      { name: 'Jilles', age: 21 },
      { name: 'Todd', age: 24 },
      { name: 'Lisa', age: 18 }
    ];
    return this.users;
  }
  getDataFromApi(id, data) {
    return this.http.get('https://www.reddit.com/r/westworld/.json')
        .map((res: Response) => res.json());
  }
  // getDataFromApi(){
  //   this.http.get('https://www.reddit.com/r/westworld/.json').subscribe(data => {
  //     // Read the result field from the JSON response.
  //     this.apiArr = data['data']['children'];
  //     console.log(this.apiArr);
  //   });
  //   return this.apiArr;
  // }

  static emailValidator(control) {
    // RFC 2822 compliant regex
    if (control.value.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)) {
        return null;
    } else {
        return { 'invalidEmailAddress': true };
    }
  }
  static getValidatorErrorMessage(validatorName: string, validatorValue?: any) {
    let config = {
        'required': 'Required',
        'invalidCreditCard': 'Is invalid credit card number',
        'invalidEmailAddress': 'Invalid email address',
        'invalidPassword': 'Invalid password. Password must be at least 6 characters long, and contain a number.',
        'minlength': `Minimum length ${validatorValue.requiredLength}`
    };

    return config[validatorName];
  }
}
