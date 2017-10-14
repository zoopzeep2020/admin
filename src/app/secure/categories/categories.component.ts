import { Component, OnInit } from '@angular/core';
import { Http, Headers, Response, RequestOptions, URLSearchParams } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import * as myGlobals from './../../globals';
import { CategoriesService } from './categories.service';

@Component({
    selector: 'app-categories',
    templateUrl: './categories.component.html',
    styleUrls: ['./categories.component.scss'],
    providers: [CategoriesService]
})
export class CategoriesComponent implements OnInit {

    constructor(private _categoriesService: CategoriesService) { }
    Imagepath =  "http://webrexstudio.com:3001/";
    categories : any[];
    data:any[];
    category: any[];
    currentModal: string;   

    update(index, modal){
        this.category = this.categories[index];

        console.log(modal);
//        this.currentModal = modal;
        this.currentModal = "categoryModal";
        console.log(this.currentModal);
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
