import { Injectable } from '@angular/core';
import {CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot} from '@angular/router';

@Injectable()
export class AuthGuardForLoggedIn implements CanActivate {
  constructor( private router: Router ) {}
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if(localStorage.getItem('token')){
            console.log('this is true');
            this.router.navigate(['/dashboard']);
            return false;
        }else{
            console.log('this is false');
            return true;
        }
    }
}