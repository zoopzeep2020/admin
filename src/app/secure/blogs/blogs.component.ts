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
        }

    }



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
        this._secureService.getAll('blogs/withoutlogin').subscribe(
            response => {
                this.blogs = response['data'];
                console.log(this.blogs);
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
        console.log(event);
        this.blogForm.controls['descriptionHtml'].setValue(event.html);
        // this.txtArea.value = event.html;
    }

    changeTextarea(event) {
        this.blogForm.controls['description'].setValue(this.blogForm.controls['descriptionHtml'].value);

        console.log(this.blogForm.controls['descriptionHtml'].value)
    }

    textarea() {
        this.txtArea = document.createElement('textarea');
        this.txtArea.style.cssText = "width: 100%;margin: 0px;background: rgb(29, 29, 29);box-sizing: border-box;color: rgb(204, 204, 204);font-size: 15px;outline: none;padding: 20px;line-height: 24px;font-family: Consolas, Menlo, Monaco, &quot;Courier New&quot;, monospace;position: absolute;top: 0;bottom: 0;border: none;display:none;"

        var myEditor = document.querySelector('.quill-editor')
        var htmlEditor = document.querySelector('.quill-editor')

        console.log(myEditor, htmlEditor);
        htmlEditor.appendChild(this.txtArea)
        // = this.editorHtml;
        console.log(this.txtArea);
        // quill.on('text-change', (delta, oldDelta, source) => {
        //     var html = myEditor.children[0].innerHTML
        //     txtArea.value = html
        // })

        var customButton = document.querySelector('.ql-showHtml');
        console.log(customButton);
        customButton.addEventListener('click', () => {
            this.editorHtml = !this.editorHtml;
            console.log(this.editorHtml);
            // console.log(this.txtArea);
            // console.log(this.txtArea.value);
            // if (this.txtArea.style.display === '') {
            //     var html = this.txtArea.value;
            //     console.log(this.txtArea.value);
            //     setTimeout(() => {
            //         // this.blogForm.controls['description'].setValue(html);
            //     });
            // }
            // setTimeout(() => {
            //     this.txtArea.style.display = this.txtArea.style.display === 'none' ? '' : 'none'
            // }, 1000);
        });

        this.txtArea.addEventListener('change', (e) => {
            console.log(e.target.value)
        });
    }

    ngOnInit() {
        this.get();
    }


}
