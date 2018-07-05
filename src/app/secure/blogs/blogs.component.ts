import { Component, OnInit, Renderer2, ViewEncapsulation } from '@angular/core';
import { Http, Headers, Response, RequestOptions, URLSearchParams } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ValidationService } from './../../validationService.service';
import { environment } from './../../../environments/environment';
import { BlogsService } from './blogs.service';
import { SecureService } from './../secure.service';
import { Statement } from '@angular/compiler/src/output/output_ast';



@Component({
    selector: 'app-blogs',
    templateUrl: './blogs.component.html',
    styleUrls: ['./blogs.component.scss'],
    providers: [BlogsService, SecureService],
    encapsulation: ViewEncapsulation.None
})
export class BlogsComponent implements OnInit {

    blogs: any[];
    blog: any;
    currentModal: any;
    blogForm: any;
    apiUrl: string = environment.apiUrl;
    modalMode: string = "Add";
    errorMessage: string;
    updateId: String;
    editorHtml: boolean = false;
    txtArea: any;
    editorConfig: any = {
        modules: {
            toolbar: [
                ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
                ['blockquote', 'code-block'],

                [{ 'header': 1 }, { 'header': 2 }],               // custom button values
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
                [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
                [{ 'direction': 'rtl' }],                         // text direction

                [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

                [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
                [{ 'font': [] }],
                [{ 'align': [] }],

                ['clean'],

                ['link', 'image', 'video'],
                ['showHtml']                                        // remove formatting button

                // link and image, video
            ]
        },
    }
    quill: any;


    constructor(private _blogsService: BlogsService, private _secureService: SecureService, private formBuilder: FormBuilder, private renderer: Renderer2) {
        this.blogForm = this.formBuilder.group({
            'title': ['', [Validators.required, , Validators.minLength(2)]],
            'blogPicture': ['', [Validators.required, ValidationService.imageValidator]],
            'authorName': ['', [Validators.required, , Validators.minLength(2)]],
            'authorImage': ['', [Validators.required, ValidationService.imageValidator]],
            'description': ['', [Validators.required, Validators.minLength(500)]],
            'metaDescription': ['', [Validators.required, Validators.minLength(100)]],
            'metaKeyword': ['', [Validators.required]],
            'descriptionHtml': ['', [Validators.required]],
            'autherInfo': ['', [Validators.required]],
            'category': ['', [Validators.required]],
        });
    }

    onFileChange($event, imageId) {

        this._secureService.changePreview($event, imageId);

        let fileName = $event.target.getAttribute("fileName");
        this.blogForm.controls[fileName].setValue($event.target.files[0]);
    }

    update(index, modal) {
        this.getSingle(this.blogs[index]._id)
        this.textarea();

    }


    add(modal) {
        this.currentModal = "blogModal";
        this.modalMode = "Add";
        this.renderer.addClass(document.body, 'modal-active');
        this.textarea();

    }

    addOREditBlog() {
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
                this._secureService.add('blogs', this.blogForm._value).subscribe(
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
        this._secureService.getAll('blogs/withoutlogin').subscribe(
            response => {
                this.blogs = response['data'];
            },
            err => {
            },
        )
    }

    getSingle(id) {
        this._blogsService.getSingle(id).subscribe(
            response => {
                this.blog = response['data'];
                this.blogForm.patchValue(this.blog);
                this.updateId = this.blog._id;
                this.currentModal = "blogModal";
                this.renderer.addClass(document.body, 'modal-active');
                this.modalMode = "Update";
            },
            err => {
            },
        )
    }

    onContentChanged(event) {
        this.blogForm.controls['descriptionHtml'].setValue(event.html);
        // this.txtArea.value = event.html;
    }

    onEditorCreated(event) {
        var toolbar = event.getModule('toolbar');
        toolbar.addHandler('image', this.imageHandler);
        this.blogForm.controls['descriptionHtml'].setValue(event.html);
        this.quill = event;
    }

    uploadFile(event) {
        const file = event.target.files[0];
        let data = {
            image: file
        }
        this._blogsService.imageUpload(data).subscribe(response => {
            const range = this.quill.getSelection(true);
            const index = range.index + range.length;
            this.quill.insertEmbed(range.index, 'image', environment.apiUrl + response.data.image);
        },
            err => {
            },
        );
    }

    imageHandler(value) {
        document.getElementById('fileSelectBox').click();
        // const Imageinput = document.createElement('input');
        // Imageinput.setAttribute('type', 'file');
        // Imageinput.setAttribute('accept', 'image/png, image/gif, image/jpeg, image/bmp, image/x-icon');
        // Imageinput.classList.add('ql-image');
        // Imageinput.addEventListener('change', () => {
        //     const file = Imageinput.files[0];
        //     let data = {
        //         image: file
        //     }
        //     console.log(file);
        //     this.uploadFile(data);
        //     const range = this.quill.getSelection(true);
        //     const index = range.index + range.length;

        //     this.quill.insertEmbed(range.index, 'image', "http://www.zeepzoop.com/images/logo.png");
        //     // if (Imageinput.files != null && Imageinput.files[0] != null) {
        //     //     this._service.sendFileToServer(file).subscribe(res => {
        //     //         this._returnedURL = res;
        //     //         this.pushImageToEditor();
        //     //     });
        //     // }
        // });

        // Imageinput.click();
    }

    pushImageToEditor() {
        const range = this.quill.getSelection(true);
        const index = range.index + range.length;
        this.quill.insertEmbed(range.index, 'image', "http://www.zeepzoop.com/images/logo.png");
    }

    changeTextarea(event) {
        this.blogForm.controls['description'].setValue(this.blogForm.controls['descriptionHtml'].value);
    }

    textarea() {
        var customButton = document.querySelector('.ql-showHtml');
        customButton.addEventListener('click', () => {
            this.editorHtml = !this.editorHtml;
        });
    }

    ngOnInit() {
        this.get();
    }


}
