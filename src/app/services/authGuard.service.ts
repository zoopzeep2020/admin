import { Injectable } from '@angular/core';
import { CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { tokenNotExpired, JwtHelper } from 'angular2-jwt';

@Injectable()
export class AuthGuardService implements CanActivate {
    constructor(private router: Router) { }

    jwtHelper: JwtHelper = new JwtHelper();

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        var token = localStorage.getItem('token');
        // console.log(
        //     this.jwtHelper.decodeToken(token),
        //     this.jwtHelper.getTokenExpirationDate(token),
        //     this.jwtHelper.isTokenExpired(token)
        // );

        if (localStorage.getItem('token') && !this.jwtHelper.isTokenExpired(token)) {
            return true;
        } else {
            localStorage.removeItem('token');
            this.router.navigate(['/login']);
            return false;
        }
    }
}