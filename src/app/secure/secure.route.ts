import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CategoriesComponent } from './categories/categories.component';

export const SECURE_ROUTES: Routes = [
    {       
        path: 'dashboard', 
        component: DashboardComponent
    },
    {       
        path: 'categories', 
        component: CategoriesComponent
    },
    
];

