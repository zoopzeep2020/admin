import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';

export const SECURE_ROUTES: Routes = [
    {       
        path: 'dashboard', 
        component: DashboardComponent
    },
    
];

