import { Component, OnInit, Renderer2 ,Injectable} from '@angular/core';
import { Http, Headers, Response, RequestOptions, URLSearchParams } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/throttleTime';
import 'rxjs/add/observable/fromEvent';

import { ValidationService } from './../../validationService.service';
import { environment } from './../../../environments/environment';
import { CollectionsService } from './collections.service';
import { SecureService } from './../secure.service';


@Component({
    selector: 'app-collections',
    templateUrl: './collections.component.html',
    styleUrls: ['./collections.component.scss'],
    providers: [CollectionsService, SecureService]
})
export class CollectionsComponent implements OnInit {

    collections: any[];
    collection: any[];
    currentModal: any;
    collectionForm: any;
    apiUrl: string = environment.apiUrl;
    modalMode: string = "Add";
    errorMessage: string;
    updateId: String;
    storeResult: any;
    selectedStore: any = [];
    storeResultDropdown: any = false;
    catalogeResult: any;
    selectedCataloge: any = [];
    catalogeResultDropdown: any = false;
    offerResult: any;
    selectedOffer: any = [];
    offerResultDropdown: any = false;
    cityResult: any;
    selectedCity: any = [];
    cityResultDropdown: any = false;


    constructor(private _collectionsService: CollectionsService, private _secureService: SecureService, private formBuilder: FormBuilder, private renderer: Renderer2,private http: Http) {
        this.collectionForm = this.formBuilder.group({
            'collectionName': ['', [Validators.required, , Validators.minLength(2)]],
            'collectionType': [, [Validators.required, ValidationService.imageValidator]],
            'collectionPicture': ['', [Validators.required, ValidationService.imageValidator]],
            'storeId': [[]],
            'searchStore': [''],
            'catalogId': [[]],
            'searchCataloge': [''],
            'offerId': [[]],
            'searchOffer': [''],
            'cityName': [[]],
            'cityId': [[]],
            'searchCity': [''],
            'storeType': [, [Validators.required, ValidationService.imageValidator]],
            'buisnessOffline': [],
            'buisnessOnline': []
        });
    }
    basicAuthorizationHeader(headers: Headers) {
        headers.append('Authorization', 'maximumvsminimumsecurity');
    }
    onFileChange($event,imageId) {
        this._secureService.changePreview($event,imageId);
        let fileName = $event.target.getAttribute("fileName");
        this.collectionForm.controls[fileName].setValue($event.target.files[0]);
    }
    update(index, modal) {
        this.updateId = this.collections[index]._id;
        this.currentModal = "collectionModal";
        this.renderer.addClass(document.body, 'modal-active');
        this.modalMode = "Update";
        this._collectionsService.getSingleCollection(this.updateId).subscribe(
            response => {
                if( response.data.buisnessOnline ){
                    this.collectionForm.controls.storeType.setValue('buisnessOnline');
                }else if( response.data.buisnessOffline ){
                    this.collectionForm.controls.storeType.setValue('buisnessOffline');
                }
                this.selectedCity = [];
                for ( let i=0; i< response.data.cityName.length; i++){
                    this.selectedCity.push({cityName:response.data.cityName[i]});
                }
                this.selectedStore = [];
                for ( let i=0; i< response.data.storesInfo.length; i++){
                    this.selectedStore.push({storeName:response.data.storesInfo[i].storeName});
                }
                this.collectionForm.patchValue(response.data);
            },
            err => {
            },
        )
        
    }

    add(modal) {
        this.currentModal = "collectionModal";
        this.renderer.addClass(document.body, 'modal-active');
        this.modalMode = "Add";
    }

    addOREditCollection() {
        if (this.collectionForm.valid) {
            if (this.modalMode === "Update") {
                this._collectionsService.update(this.updateId, this.collectionForm._value).subscribe(
                    response => {
                        this.get();
                        this.currentModal = null;
                        this.storeResultDropdown = false;
                        this.renderer.removeClass(document.body, 'modal-active');
                        this.resetFrom();
                    },
                    err => {
                        this.errorMessage = JSON.parse(err._body).message;
                    },
                );
            } else {
                this._secureService.add('collections' , this.collectionForm._value).subscribe(
                    response => {
                        this.get();
                        this.currentModal = null;
                        this.storeResultDropdown = false;
                        this.renderer.removeClass(document.body, 'modal-active');
                        this.resetFrom();
                    },
                    err => {
                        this.errorMessage = JSON.parse(err._body).message;
                    },
                );
            }
        } else {
            ValidationService.validateAllFormFields(this.collectionForm);
        }
    }
    delete(index) {
        this._collectionsService.delete(this.collections[index]._id).subscribe(
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
        this.storeResultDropdown = false;
        this.renderer.removeClass(document.body, 'modal-active');
        this.resetFrom();
    }

    resetFrom() {
        this.collectionForm.reset();
        this.collectionForm.controls.cityName.setValue([]);
        this.collectionForm.controls.cityId.setValue([]);
        this.collectionForm.controls.storeId.setValue([]);
        this.collectionForm.controls.offerId.setValue([]);
        this.selectedCity = [];
        this.selectedOffer = [];
        this.selectedStore = [];
        this.selectedCataloge = [];
    }

    get() {
        this._secureService.getAll('collections').subscribe(
            response => {
                this.collections = response['data'];
            },
            err => {
            },
        )
        
    }

    storeTypeChaned(storeType) {
        if (storeType === 'buisnessOffline') {
            this.collectionForm.controls.buisnessOffline.setValue(true);
            this.collectionForm.controls.buisnessOnline.setValue(false);
        } else if (storeType === 'buisnessOnline') {
            this.collectionForm.controls.buisnessOnline.setValue(true);
            this.collectionForm.controls.buisnessOffline.setValue(false);
        }
    }

    // store auto select start
    searchStore(search, buisnessOnline, buisnessOffline, cityName) {
        if (search != null && buisnessOffline != null && buisnessOffline != null && cityName != null) {
            this._collectionsService.getStore(search, buisnessOnline, buisnessOffline, cityName[0]).subscribe(
                response => {
                    this.storeResult = response['data'];
                    if (this.storeResult.length == 0) {
                        this.storeResult[0] = {
                            storeName: "No store found"
                        };
                        this.storeResultDropdown = true;
                    } else {
                        this.storeResult = this.removeSelectedResult(this.storeResult, this.selectedStore, 'storeName');
                        this.storeResultDropdown = true;
                    }
                },
                err => {
                },
            )
        }
    }

    storeSelect(index) {
        if (this.storeResult[index].storeName != "No store found") {
            this.collectionForm.controls.storeId.value.push(this.storeResult[index]._id);
            this.selectedStore.push(this.storeResult[index]);
            this.storeResultDropdown = false;
        }

    }

    removeStore(index) {
        this.collectionForm.controls.storeId.value.splice(index, 1);
        this.selectedStore.splice(index, 1);
    }
    // store auto select end

    // cataloge auto select start
    searchCataloge(search, buisnessOnline, buisnessOffline, cityName) {
        if (search != null && buisnessOffline != null && buisnessOffline != null && cityName != null) {
            this._collectionsService.getCataloge(search, buisnessOnline, buisnessOffline, cityName[0]).subscribe(
                response => {
                    this.catalogeResult = response['data'];
                    if (this.catalogeResult.length == 0) {
                        this.catalogeResult[0] = {
                            catalogeName: "No cataloge found"
                        };
                        this.catalogeResultDropdown = true;
                    } else {
                        this.catalogeResultDropdown = true;
                    }
                },
                err => {
                },
            )
        }
    }

    catalogeSelect(index) {
        if (this.catalogeResult[index].catalogeName != "No cataloge found") {
            this.collectionForm.controls.catalogId.value.push(this.catalogeResult[index]._id);
            this.selectedCataloge.push(this.catalogeResult[index]);
            this.catalogeResultDropdown = false;
        }

    }

    removeCataloge(index) {
        this.collectionForm.controls.catalogId.value.splice(index, 1);
        this.selectedCataloge.splice(index, 1);
    }
    // cataloge auto select end

    //offer auto select start
    searchOffer(search, buisnessOnline, buisnessOffline, cityName) {
        if (search != "" && buisnessOffline != null && buisnessOffline != null && cityName != null) {
            this._collectionsService.getOffer(search, buisnessOnline, buisnessOffline, cityName).subscribe(
                response => {
                    this.offerResult = response['data'];
                    if (this.offerResult.length == 0) {
                        this.offerResult[0] = {
                            offerName: "No offer found"
                        };
                        this.offerResultDropdown = true;
                    } else {
                        this.offerResult = this.removeSelectedResult(this.offerResult, this.selectedOffer, 'offerName');
                        this.offerResultDropdown = true;
                    }
                },
                err => {
                },
            )
        }else{
            this.offerResultDropdown=false;
        }
    }

    offerSelect(index) {
        if (this.offerResult[index].offerName != "No offer found") {
            this.collectionForm.controls.offerId.value.push(this.offerResult[index]._id);
            this.selectedOffer.push(this.offerResult[index]);
            this.offerResultDropdown = false;
        }

    }

    removeOffer(index) {
        this.collectionForm.controls.offerId.value.splice(index, 1);
        this.selectedOffer.splice(index, 1);
    }
    // offer auto select end

    //city auto select start
    searchCity(search) {
        if (search != "") {
            this._collectionsService.getCity(search).subscribe(
                response => {
                    this.cityResult = response['data'];
                    
                    if (this.cityResult.length == 0) {
                        this.cityResult[0] = {
                            cityName: "No city found"
                        };
                        this.cityResultDropdown = true;
                    } else {
                        this.cityResult = this.removeSelectedResult(this.cityResult, this.selectedCity, 'cityName');
                        this.cityResultDropdown = true;
                    }
                },
                err => {
                },
            )
        }else{
            this.cityResultDropdown=false;
        }
    }

    removeSelectedResult(result, selectedResult, parameterName){
        for (let i = 0; i < selectedResult.length; i++){
            for(let j = 0 ; j < result.length; j++){
                if(result[j][parameterName] == selectedResult[i][parameterName]){
                    result.splice(j, 1);
                }
            }
        }
        return result;
    }

    citySelect(index) {
        if (this.cityResult[index].cityName != "No city found") {
            this.collectionForm.controls.cityName.value.push(this.cityResult[index].cityName);
            this.collectionForm.controls.cityId.value.push(this.cityResult[index]._id);
            this.selectedCity.push(this.cityResult[index]);
            this.cityResultDropdown = false;
        }

    }

    removeCity(index) {
        this.collectionForm.controls.cityId.value.splice(index, 1);
        this.collectionForm.controls.cityName.value.splice(index, 1);
        this.selectedCity.splice(index, 1);
    }
    // city auto select end

    ngOnInit() {
        document.getElementsByTagName('body')[0].addEventListener('click', ()=>{
            this.catalogeResultDropdown = false;
            this.cityResultDropdown = false;
            this.storeResultDropdown = false;
            this.offerResultDropdown = false;
        })
        this.get();
        this.collectionForm.controls.storeType.valueChanges.debounceTime(100).subscribe(newValue => this.storeTypeChaned(newValue));
        this.collectionForm.controls.searchStore.valueChanges.debounceTime(1000).subscribe(newValue => this.searchStore(newValue, this.collectionForm.controls.buisnessOnline.value, this.collectionForm.controls.buisnessOffline.value, this.collectionForm.controls.cityName.value));
        this.collectionForm.controls.searchCataloge.valueChanges.debounceTime(1000).subscribe(newValue => this.searchCataloge(newValue, this.collectionForm.controls.buisnessOnline.value, this.collectionForm.controls.buisnessOffline.value, this.collectionForm.controls.cityName.value));
        this.collectionForm.controls.searchOffer.valueChanges.debounceTime(1000).subscribe(newValue => this.searchOffer(newValue, this.collectionForm.controls.buisnessOnline.value, this.collectionForm.controls.buisnessOffline.value, this.collectionForm.controls.cityName.value));
        this.collectionForm.controls.searchCity.valueChanges.debounceTime(1000).subscribe(newValue => this.searchCity(newValue));
    }
}
