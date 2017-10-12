import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MyService } from './my-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],			
  providers:[MyService]
})

export class AppComponent implements OnInit {
	
    title = 'Angular 2 REST Website';
    
    links = {
      // MyComponent: ['/my-component'],
      // SecontComponentComponent: ['/secont-component'],
      // UseServiceComponent: ['/use-service']         
    };
    result = [];
    apiarr: any = [];
    value: string = ""; 
    constructor(private _appService: MyService) { }  
 
    auth(event) {
      console.log(event);

      // this._appService.getDataFromApi('d','ravi').subscribe(response => {
      //   this.apiarr = response.data.children;
      // });
    }
	
    ngOnInit(): void { 
       this.value = this._appService.getApp();
       this.result = this._appService.getArray();
     //  this.apiarr = this._appService.getDataFromApi();
        console.log(this.result);
        console.log(this.apiarr);
      
      this._appService.getDataFromApi('sanjaya','ravi').subscribe(response => {
        this.apiarr = response.data.children;
      });

    } 
  }