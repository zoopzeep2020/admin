import { Component, OnInit, Renderer2 } from '@angular/core';
import { Http, Headers, Response, RequestOptions, URLSearchParams } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { ValidationService } from './../../validationService.service';
import { environment } from './../../../environments/environment';
import { AdminKeyService } from './admin-key.service';
import { SecureService } from './../secure.service';


@Component({
    selector: 'app-adminKey',
    templateUrl: './admin-key.component.html',
    styleUrls: ['./admin-key.component.scss'],
    providers: [AdminKeyService, SecureService]
})
export class AdminKeyComponent implements OnInit {

    adminKey: {};
    currentModal: any;
    adminKeyForm: any;
    apiUrl: string = environment.apiUrl;
    modalMode: string = "Add";
    errorMessage: string;
    updateId: String;

    constructor(private _adminKeyService: AdminKeyService,  private _secureService : SecureService, private formBuilder: FormBuilder, private renderer: Renderer2) {

    }

    get() {
        this._secureService.getAll('users/admin/adminKey').subscribe(
            response => {
                this.adminKey = response['data'];
                console.log(this.adminKey);
            },
            err => {
            },
        )
    }

    ngOnInit() {
        this.get();
    }



}
