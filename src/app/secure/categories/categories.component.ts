import { Component, OnInit, Renderer2 } from '@angular/core';
import { Http, Headers, Response, RequestOptions, URLSearchParams } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { ValidationService } from './../../validationService.service';
import { environment } from './../../../environments/environment';
import { CategoriesService } from './categories.service';
import { SecureService } from './../secure.service';


@Component({
    selector: 'app-categories',
    templateUrl: './categories.component.html',
    styleUrls: ['./categories.component.scss'],
    providers: [CategoriesService, SecureService]
})
export class CategoriesComponent implements OnInit {

    categories: any[];
    category: any[];
    currentModal: any;
    categoryForm: any;
    apiUrl: string = environment.apiUrl;
    modalMode: string = "Add";
    errorMessage: string;
    updateId: String;

    constructor(private _categoriesService: CategoriesService, private _secureService : SecureService, private formBuilder: FormBuilder, private renderer: Renderer2) {
        this.categoryForm = this.formBuilder.group({
            'category': ['', [Validators.required, , Validators.minLength(2)]],
            'categoryImage': ['', [Validators.required, ValidationService.imageValidator]],
            'categoryActiveImage': ['', [Validators.required, ValidationService.imageValidator]],
        });
    }

    onFileChange($event,imageName) {
        let fileName = $event.target.getAttribute("fileName");
        this.categoryForm.controls[fileName].setValue($event.target.files[0]);
        
        
        const preview = <HTMLImageElement>document.getElementById(imageName);
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
                this._secureService.add('categories', this.categoryForm._value).subscribe(
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
        this._secureService.getAll('categories').subscribe(
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
