import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';

export const PUBLIC_ROUTES: Routes = [
    {  
        path : 'login', component: LoginComponent 
    }
];

