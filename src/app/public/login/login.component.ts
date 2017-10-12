import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { MyService } from '../../my-service.service';
import { Login } from './login.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    providers: [Login, MyService]

})
export class LoginComponent implements OnInit {

    userForm: any;
    loginForm: any;
    errorMessage: any;
    constructor(private formBuilder: FormBuilder, private _loginService: Login, private router: Router) {
        this.userForm = this.formBuilder.group({
            'password': ['', Validators.required],
            'email': ['', [Validators.required, MyService.emailValidator]],
            // 'profile': ['', [Validators.required, Validators.minLength(10)]]   
        });
    }

    saveUser() {
        if (this.userForm.valid) {
            this._loginService.auth(this.userForm._value).subscribe(
                response => {
                    this.router.navigate(['/dashboard']);
                    localStorage.setItem('token', response.data.token);
                    console.log(response);
                },
                err => {
                    console.log(JSON.parse(err._body).message);
                    this.errorMessage = JSON.parse(err._body).message;
                    this.router.navigate(['/login']);
                },
            );
        }
    }

    keywords() {
        this._loginService.keywords().subscribe(
            response => {
                // localStorage.setItem('token', response.data.token);
                console.log(response);
            },
            err => {
                console.log(JSON.parse(err._body));
            },
        );
    }

    ngOnInit() {
        this._loginService.keywords().subscribe(
            response => {
                // localStorage.setItem('token', response.data.token);
                console.log(response);
            },
            err => {
                console.log(JSON.parse(err._body));
            },
        )
    }

}
