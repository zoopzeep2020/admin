import { Component, OnInit } from '@angular/core';
import { Http, Headers, Response, RequestOptions, URLSearchParams } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';

import * as myGlobals from './../../globals';
import { CategoriesService } from './categories.service';


@Component({
    selector: 'app-categories',
    templateUrl: './categories.component.html',
    styleUrls: ['./categories.component.scss'],
    providers: [CategoriesService]
})
export class CategoriesComponent implements OnInit {

    Imagepath =  "http://webrexstudio.com:3001/";
    categories : any[];
    data:any[];
    category: any[];
    currentModal: string;   
    categoryForm: any;

    constructor(private _categoriesService: CategoriesService,private formBuilder: FormBuilder) { 
        this.categoryForm = this.formBuilder.group({
            'category': ['', Validators.required],
            'categoryImage': ['', Validators.required],
            'categoryActiveImage': ['', Validators.required],
        });
    }

    update(index, modal){
        this.categoryForm.patchValue(this.categories[index]);
        console.log(this.categoryForm);
        console.log(modal);
        this.currentModal = "categoryModal";
        console.log(this.currentModal);
    }

    addCategory(){
        if (this.categoryForm.valid) {
            console.log('done');
        }else{
            console.log('err');
        }
    }

    delete(index){
        console.log(index);
    }

    closeModal(){
        this.currentModal = null;
    }
   

    ngOnInit() {
        this._categoriesService.get().subscribe(
            response => {
                // localStorage.setItem('token', response.data.token);
                console.log(response);
                this.categories = response['data'];
                console.log(this.categories);
            },
            err => {
                console.log(JSON.parse(err._body));
            },
        )
        console.log(this.currentModal);
    }

}
