import { Component, OnInit, Renderer2 } from '@angular/core';
import { Http, Headers, Response, RequestOptions, URLSearchParams } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { ValidationService } from './../../validationService.service';
import { environment } from './../../../environments/environment';
import { StaticPagesService } from './static-pages.service';
import { SecureService } from './../secure.service';


@Component({
  selector: 'app-staticPages',
  templateUrl: './static-pages.component.html',
  styleUrls: ['./static-pages.component.scss'],
  providers: [StaticPagesService, SecureService]
})
export class StaticPagesComponent implements OnInit {

  staticPages: any[];
  staticPage: any[];
  currentModal: any;
  staticPageForm: any;
  apiUrl: string = environment.apiUrl;
  modalMode: string = "Add";
  errorMessage: string;
  updateId: String;

  constructor(private _staticPagesService: StaticPagesService, private _secureService: SecureService, private formBuilder: FormBuilder, private renderer: Renderer2) {
    this.staticPageForm = this.formBuilder.group({
      'title': ['', [Validators.required, , Validators.minLength(2)]],
      'content': ['', [Validators.required, ValidationService.imageValidator]],
      'type': ['', [Validators.required, , Validators.minLength(2)]],
    });
  }

  update(index, modal) {
    this.staticPageForm.patchValue(this.staticPages[index]);
    this.updateId = this.staticPages[index]._id;
    this.currentModal = "staticPageModal";
    this.renderer.addClass(document.body, 'modal-active');
    this.modalMode = "Update";
  }

  add(modal) {
    this.currentModal = "staticPageModal";
    this.modalMode = "Add";
    this.renderer.addClass(document.body, 'modal-active');
  }

  addOREditStaticPage() {
    console.log(this.staticPageForm._value);
    if (this.staticPageForm.dirty && this.staticPageForm.valid) {
      if (this.modalMode === "Update") {
        this._staticPagesService.update(this.updateId, this.staticPageForm._value).subscribe(
          response => {
            this.get();
            this.currentModal = null;
            this.renderer.removeClass(document.body, 'modal-active');
            this.staticPageForm.reset();
          },
          err => {
            this.errorMessage = JSON.parse(err._body).message;
          },
        );
      } else {
        this._staticPagesService.add(this.staticPageForm._value).subscribe(
          response => {
            this.get();
            this.currentModal = null;
            this.renderer.removeClass(document.body, 'modal-active');
            this.staticPageForm.reset();
          },
          err => {
            this.errorMessage = JSON.parse(err._body).message;
          },
        );
      }
    } else {
      console.log(this.staticPageForm);
      ValidationService.validateAllFormFields(this.staticPageForm);
    }
  }

  delete(index) {
    this._staticPagesService.delete(this.staticPages[index]._id).subscribe(
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
    this.staticPageForm.reset();
    this.renderer.removeClass(document.body, 'modal-active');
  }

  get() {
    this._secureService.getAll('staticPages/').subscribe(
      response => {
        this.staticPages = response['data'];
        console.log(this.staticPages);
      },
      err => {
      },
    )
  }

  ngOnInit() {
    this.get();
  }
}
