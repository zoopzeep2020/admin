import { Component, OnInit } from '@angular/core';
import { SecureService } from './../../secure.service';

import { environment } from './../../../../environments/environment';

@Component({
  selector: 'app-left-side-bar',
  templateUrl: './left-side-bar.component.html',
  styleUrls: ['./left-side-bar.component.scss'],
  providers: [ SecureService ]
})
export class LeftSideBarComponent implements OnInit {

  constructor() { }
  
  user = environment.userName;  
  type = environment.userType;
  
  ngOnInit() {
  }

}
