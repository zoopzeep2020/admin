import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CategoriesComponent } from './categories/categories.component';
import { KeywordsComponent } from './keywords/keywords.component';
import { BlogsComponent } from './blogs/blogs.component';
import { ReportReviewsComponent } from './report-reviews/report-reviews.component';
import { AdminKeyComponent } from './admin-key/admin-key.component';
import { CollectionsComponent } from './collections/collections.component';

export const SECURE_ROUTES: Routes = [
    {
        path: 'dashboard',
        component: DashboardComponent
    },
    {
        path: 'collections',
        component: CollectionsComponent
    },
    {
        path: 'categories',
        component: CategoriesComponent
    },
    {
        path: 'keywords',
        component: KeywordsComponent
    },
    {
        path: 'blogs',
        component: BlogsComponent
    },
    {
        path: 'report-reviews',
        component: ReportReviewsComponent
    },
    {
        path: 'adminKey',
        component: AdminKeyComponent
    },

];

