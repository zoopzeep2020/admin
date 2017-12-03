import { Component, OnInit, Renderer2 } from '@angular/core';
import { Http, Headers, Response, RequestOptions, URLSearchParams } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { ValidationService } from './../../validationService.service';
import * as globals from './../../globals';
import { citiesService } from './cities.service';


@Component({
    selector: 'app-cities',
    templateUrl: './cities.component.html',
    styleUrls: ['./cities.component.scss'],
    providers: [citiesService]
})
export class CitiesComponent implements OnInit {

    cities: any[];
    currentModal: string;
    cityForm: any;
    apiUrl: string = globals.apiUrl;
    modalMode: string = "Add";
    errorMessage: string;
    updateId: String;

    constructor(private _citiesService: citiesService, private formBuilder: FormBuilder, private renderer: Renderer2) {
        this.cityForm = this.formBuilder.group({
            'cityName': ['', [Validators.required, , Validators.minLength(2)]],
            'cityState': ['', [Validators.required, , Validators.minLength(2)]],
            'latitude': ['', [Validators.required, , Validators.minLength(2)]],
            'longitude': ['', [Validators.required, , Validators.minLength(2)]],
            'location': [],
        });
    }

    update(index, modal) {
        this.cityForm.patchValue(this.cities[index]);
        this.cityForm.controls.latitude.patchValue(this.cities[index].location[0]);
        this.cityForm.controls.longitude.patchValue(this.cities[index].location[1]);
        this.updateId = this.cities[index]._id;
        this.currentModal = "cityModal";
        this.renderer.addClass(document.body, 'modal-active');
        this.modalMode = "Update";
    }

    add(modal) {
        this.currentModal = "cityModal";
        this.renderer.addClass(document.body, 'modal-active');
        this.modalMode = "Add";
    }

    addOREditCity() {
        console.log(this.cityForm);
        if (this.cityForm.valid) {
            this.cityForm.controls.location.setValue([this.cityForm.controls.latitude.value, this.cityForm.controls.longitude.value]);
            console.log(this.cityForm);
            if (this.modalMode === "Update") {
                this._citiesService.update(this.updateId, this.cityForm._value).subscribe(
                    response => {
                        this.get();
                        this.currentModal = null;
                        this.renderer.removeClass(document.body, 'modal-active');
                        this.cityForm.reset();
                    },
                    err => {
                        this.errorMessage = JSON.parse(err._body).message;
                    },
                );
            } else {
                console.log(this.cityForm);
                this._citiesService.add(this.cityForm._value).subscribe(
                    response => {
                        this.get();
                        this.currentModal = null;
                        this.renderer.removeClass(document.body, 'modal-active');
                        this.cityForm.reset();
                    },
                    err => {
                        this.errorMessage = JSON.parse(err._body).message;
                    },
                );
            }
        } else {
            ValidationService.validateAllFormFields(this.cityForm);
        }
    }

    delete(index) {
        this._citiesService.delete(this.cities[index]._id).subscribe(
            response => {
                this.get();
            },
            err => {
                this.errorMessage = JSON.parse(err._body).message;
            },
        );
    }

    closeModal() {
        this.currentModal = null;
        this.renderer.removeClass(document.body, 'modal-active');
        this.cityForm.reset();
    }

    get() {
        this._citiesService.getAll().subscribe(
            response => {
                this.cities = response['data'];
                console.log(this.cities);
            },
            err => {
                console.log(JSON.parse(err._body));
            },
        )
    }

    ngOnInit() {
        this.get();
    }
}
