import { Component, OnInit, Renderer2 } from '@angular/core';
import { Http, Headers, Response, RequestOptions, URLSearchParams } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { ValidationService } from './../../validationService.service';
import * as globals from './../../globals';
import { CategoriesService } from './categories.service';


@Component({
    selector: 'app-categories',
    templateUrl: './categories.component.html',
    styleUrls: ['./categories.component.scss'],
    providers: [CategoriesService]
})
export class CategoriesComponent implements OnInit {

    categories: any[];
    category: any[];
    currentModal: any;
    categoryForm: any;
    apiUrl: string = globals.apiUrl;
    modalMode: string = "Add";
    errorMessage: string;
    updateId: String;

    constructor(private _categoriesService: CategoriesService, private formBuilder: FormBuilder, private renderer: Renderer2) {
        this.categoryForm = this.formBuilder.group({
            'category': ['', [Validators.required, , Validators.minLength(2)]],
            'categoryImage': ['', [Validators.required, ValidationService.imageValidator]],
            'categoryActiveImage': ['', [Validators.required, ValidationService.imageValidator]],
        });
    }

    onFileChange($event) {
        let fileName = $event.target.getAttribute("fileName");
        this.categoryForm.controls[fileName].setValue($event.target.files[0]);
    }

    update(index, modal) {
        this.categoryForm.patchValue(this.categories[index]);
        this.updateId = this.categories[index]._id;
        this.currentModal = "categoryModal";
        this.renderer.addClass(document.body, 'modal-active');
        this.modalMode = "Update";
    }

    add(modal) {
        this.currentModal = "categoryModal";
        this.renderer.addClass(document.body, 'modal-active');
        this.modalMode = "Add";
    }

    addOREditCategory() {
        if (this.categoryForm.valid) {
            if (this.modalMode === "Update") {
                this._categoriesService.update(this.updateId, this.categoryForm._value).subscribe(
                    response => {
                        this.get();
                        this.currentModal = null;
                        this.renderer.removeClass(document.body, 'modal-active');
                        this.categoryForm.reset();
                    },
                    err => {
                        this.errorMessage = JSON.parse(err._body).message;
                    },
                );
            } else {
                this._categoriesService.add(this.categoryForm._value).subscribe(
                    response => {
                        this.get();
                        this.currentModal = null;
                        this.renderer.removeClass(document.body, 'modal-active');
                        this.categoryForm.reset();
                    },
                    err => {
                        this.errorMessage = JSON.parse(err._body).message;
                    },
                );
            }
        } else {
            console.log(this.categoryForm);
            ValidationService.validateAllFormFields(this.categoryForm);
        }
    }

    delete(index) {
        this._categoriesService.delete(this.categories[index]._id).subscribe(
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
        this.categoryForm.reset();
    }

    get() {
        this._categoriesService.getAll().subscribe(
            response => {
                this.categories = response['data'];
            },
            err => {
            },
        )
    }

    ngOnInit() {
        this.get();
    }



}
