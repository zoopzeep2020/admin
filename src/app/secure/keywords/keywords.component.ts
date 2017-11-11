import { Component, OnInit, Renderer2 } from '@angular/core';
import { Http, Headers, Response, RequestOptions, URLSearchParams } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { ValidationService } from './../../validationService.service';
import * as globals from './../../globals';
import { keywordsService } from './keywords.service';


@Component({
    selector: 'app-keywords',
    templateUrl: './keywords.component.html',
    styleUrls: ['./keywords.component.scss'],
    providers: [keywordsService]
})
export class KeywordsComponent implements OnInit {

    keywords: any[];
    currentModal: string;
    keywordForm: any;
    apiUrl: string = globals.apiUrl;
    modalMode: string = "Add";
    errorMessage: string;
    updateId: String;

    constructor(private _keywordsService: keywordsService, private formBuilder: FormBuilder, private renderer: Renderer2) {
        this.keywordForm = this.formBuilder.group({
            'title': ['', [Validators.required, , Validators.minLength(2)]],
        });
    }

    onFileChange($event) {
        let fileName = $event.target.getAttribute("fileName");
        this.keywordForm.controls[fileName].setValue($event.target.files[0]);
    }

    update(index, modal) {
        this.keywordForm.patchValue(this.keywords[index]);
        this.updateId = this.keywords[index]._id;
        this.currentModal = "keywordModal";
        this.renderer.addClass(document.body, 'modal-active');
        this.modalMode = "Update";
    }

    add(modal) {
        this.currentModal = "keywordModal";
        this.renderer.addClass(document.body, 'modal-active');
        this.modalMode = "Add";
    }

    addOREditKeyword() {
        if (this.keywordForm.valid) {
            if (this.modalMode === "Update") {
                this._keywordsService.update(this.updateId, this.keywordForm._value).subscribe(
                    response => {
                        this.get();
                        this.currentModal = null;
                        this.renderer.removeClass(document.body, 'modal-active');
                        this.keywordForm.reset();
                    },
                    err => {
                        this.errorMessage = JSON.parse(err._body).message;
                    },
                );
            } else {
                console.log(this.keywordForm);
                this._keywordsService.add(this.keywordForm._value).subscribe(
                    response => {
                        this.get();
                        this.currentModal = null;
                        this.renderer.removeClass(document.body, 'modal-active');
                        this.keywordForm.reset();
                    },
                    err => {
                        this.errorMessage = JSON.parse(err._body).message;
                    },
                );
            }
        } else {
            ValidationService.validateAllFormFields(this.keywordForm);
        }
    }

    delete(index) {
        this._keywordsService.delete(this.keywords[index]._id).subscribe(
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
        this.keywordForm.reset();
    }

    get() {
        this._keywordsService.getAll().subscribe(
            response => {
                this.keywords = response['data'];
                console.log(this.keywords);
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
