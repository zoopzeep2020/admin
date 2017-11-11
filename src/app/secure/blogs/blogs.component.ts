import { Component, OnInit, Renderer2 } from '@angular/core';
import { Http, Headers, Response, RequestOptions, URLSearchParams } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { ValidationService } from './../../validationService.service';
import * as globals from './../../globals';
import { BlogsService } from './blogs.service';


@Component({
    selector: 'app-blogs',
    templateUrl: './blogs.component.html',
    styleUrls: ['./blogs.component.scss'],
    providers: [BlogsService]
})
export class BlogsComponent implements OnInit {

    blogs: any[];
    blog: any[];
    currentModal: any;
    blogForm: any;
    apiUrl: string = globals.apiUrl;
    modalMode: string = "Add";
    errorMessage: string;
    updateId: String;

    constructor(private _blogsService: BlogsService, private formBuilder: FormBuilder, private renderer: Renderer2) {
        this.blogForm = this.formBuilder.group({
            'title': ['', [Validators.required, , Validators.minLength(2)]],
            'blogPicture': ['', [Validators.required, ValidationService.imageValidator]],
            'authorName': ['', [Validators.required, , Validators.minLength(2)]],
            'authorImage': ['', [Validators.required, ValidationService.imageValidator]],
            'description': ['', [Validators.required, Validators.minLength(500)]],
        });
    }

    onFileChange($event) {
        let fileName = $event.target.getAttribute("fileName");
        this.blogForm.controls[fileName].setValue($event.target.files[0]);
    }

    update(index, modal) {
        this.blogForm.patchValue(this.blogs[index]);
        this.updateId = this.blogs[index]._id;
        this.currentModal = "blogModal";
        this.renderer.addClass(document.body, 'modal-active');
        this.modalMode = "Update";
    }

    add(modal) {
        this.currentModal = "blogModal";
        this.modalMode = "Add";
        this.renderer.addClass(document.body, 'modal-active');
    }

    addOREditBlog() {
        console.log(this.blogForm._value);
        if (this.blogForm.dirty && this.blogForm.valid) {
            if (this.modalMode === "Update") {
                this._blogsService.update(this.updateId, this.blogForm._value).subscribe(
                    response => {
                        this.get();
                        this.currentModal = null;
                        this.renderer.removeClass(document.body, 'modal-active');
                        this.blogForm.reset();
                    },
                    err => {
                        this.errorMessage = JSON.parse(err._body).message;
                    },
                );
            } else {
                this._blogsService.add(this.blogForm._value).subscribe(
                    response => {
                        this.get();
                        this.currentModal = null;
                        this.renderer.removeClass(document.body, 'modal-active');
                        this.blogForm.reset();
                    },
                    err => {
                        this.errorMessage = JSON.parse(err._body).message;
                    },
                );
            }
        } else {
            console.log(this.blogForm);
            ValidationService.validateAllFormFields(this.blogForm);
        }
    }

    delete(index) {
        this._blogsService.delete(this.blogs[index]._id).subscribe(
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
        this.blogForm.reset();
        this.renderer.removeClass(document.body, 'modal-active');
    }

    get() {
        this._blogsService.getAll().subscribe(
            response => {
                this.blogs = response['data'];
                console.log(this.blogs);
            },
            err => {
            },
        )
    }

    ngOnInit() {
        this.get();
    }
}
