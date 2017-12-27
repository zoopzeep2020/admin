import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { ValidationService } from './../../validationService.service';
import { Login } from './login.service';
import { environment } from './../../../environments/environment';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    providers: [Login]

})
export class LoginComponent implements OnInit {

    loginForm: any;
    signupForm: any;
    errorMessage: any;
    loginFormActive: any;
    formName : string = '' ;
    
    constructor(private formBuilder: FormBuilder, private _loginService: Login, private router: Router) {

        this.loginForm = this.formBuilder.group({
            'password': ['', Validators.required],
            'email': ['', [Validators.required, ValidationService.emailValidator]],
        });

        console.log(this.loginForm);

        this.signupForm = this.formBuilder.group({
            'password': ['', [Validators.required]],
            'email': ['', [Validators.required, ValidationService.emailValidator]],
            'adminKey': ['', [Validators.required]],
        });
    }

    login() {
        if (this.loginForm.dirty && this.loginForm.valid) {
            this._loginService.auth(this.loginForm._value).subscribe(
                response => {
                    if (response.data.isAdmin == true) {
                        this.router.navigate(['/dashboard']);
                            localStorage.setItem('token', response.data.token);
                            localStorage.setItem('userId', response.data._id);
                            localStorage.setItem('userName', response.data.name);
                            localStorage.setItem('userEmail', response.data.email);
                            localStorage.setItem('userPhone', response.data.phone);
                            if(response.data.isAdmin){
                                localStorage.setItem('userType', 'Admin');
                            }else if(response.data.isUser){
                                localStorage.setItem('userType', 'User');
                            }else if(response.data.isStore){
                                localStorage.setItem('userType', 'Store');
                            }
                        console.log(response);
                    } else {
                        this.errorMessage = "You are not admin.";
                    }
                },
                err => {
                    this.router.navigate(['/login']);
                    console.log(JSON.parse(err._body).message);
                    this.errorMessage = JSON.parse(err._body).message;
                },
            );
        }
    }

    signup() {
        if (this.signupForm.dirty && this.signupForm.valid) {
            this._loginService.signup(this.signupForm._value).subscribe(
                response => {
                    this.router.navigate(['/dashboard']);
                    localStorage.setItem('token', response.data.token);
                    console.log(response);
                },
                err => {
                    console.log(JSON.parse(err._body).message);
                    this.errorMessage = JSON.parse(err._body).message;
                },
            );
        }
    }

    changeForm() {
        this.loginFormActive = !this.loginFormActive;
        if(this.loginFormActive){
            this.formName ="Sign-in";
        } else if (!this.loginFormActive) {
            this.formName ="Sign-Up";
        }
    }
    
    ngOnInit() {
        this.formName ="Sign-in";
        this.loginFormActive = true;
    }

}
