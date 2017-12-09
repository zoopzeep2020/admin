import { Component, OnInit, Renderer2 } from '@angular/core';
import { Http, Headers, Response, RequestOptions, URLSearchParams } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { ValidationService } from './../../validationService.service';
import * as globals from './../../globals';
import { storesService } from './stores.service';


@Component({
  selector: 'app-stores',
  templateUrl: './stores.component.html',
  styleUrls: ['./stores.component.scss'],
  providers: [storesService]
})
export class StoresComponent implements OnInit {

  stores: any[];
  currentModal: string;
  storeForm: any;
  apiUrl: string = globals.apiUrl;
  modalMode: string = "Add";
  errorMessage: string;
  updateId: String;

  constructor(private _storesService: storesService, private formBuilder: FormBuilder, private renderer: Renderer2) {
    this.storeForm = this.formBuilder.group({

    });
  }

  update(index, modal) {
    this.storeForm.patchValue(this.stores[index]);
    this.updateId = this.stores[index]._id;
    this.currentModal = "storeModal";
    this.renderer.addClass(document.body, 'modal-active');
    this.modalMode = "Update";
  }


  changeStatus(index) {
    this.storeForm.patchValue(this.stores[index]);
    var data = {};

    data['isActive'] = !this.stores[index].isActive;


    this._storesService.update(this.stores[index]._id, data).subscribe(
      response => {
        this.get();
        this.currentModal = null;
        this.renderer.removeClass(document.body, 'modal-active');
        this.storeForm.reset();
      },
      err => {
        this.errorMessage = JSON.parse(err._body).message;
      },
    );
  }

  add(modal) {
    this.currentModal = "storeModal";
    this.renderer.addClass(document.body, 'modal-active');
    this.modalMode = "Add";
  }

  addOREditStore() {
    console.log(this.storeForm);
    if (this.storeForm.valid) {
      this.storeForm.controls.location.setValue([this.storeForm.controls.latitude.value, this.storeForm.controls.longitude.value]);
      console.log(this.storeForm);
      if (this.modalMode === "Update") {
        this._storesService.update(this.updateId, this.storeForm._value).subscribe(
          response => {
            this.get();
            this.currentModal = null;
            this.renderer.removeClass(document.body, 'modal-active');
            this.storeForm.reset();
          },
          err => {
            this.errorMessage = JSON.parse(err._body).message;
          },
        );
      } else {
        console.log(this.storeForm);
        this._storesService.add(this.storeForm._value).subscribe(
          response => {
            this.get();
            this.currentModal = null;
            this.renderer.removeClass(document.body, 'modal-active');
            this.storeForm.reset();
          },
          err => {
            this.errorMessage = JSON.parse(err._body).message;
          },
        );
      }
    } else {
      ValidationService.validateAllFormFields(this.storeForm);
    }
  }

  delete(index) {
    this._storesService.delete(this.stores[index]._id).subscribe(
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
    this.storeForm.reset();
  }

  get() {
    this._storesService.getAll().subscribe(
      response => {
        this.stores = response['data'];
        console.log(this.stores);
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
