import { NgModule, Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

// We need to import the ReactiveFormsModule and HttpModule--for--form 
import { HttpModule } from '@angular/http';
import { ReactiveFormsModule } from '@angular/forms';

//routes
import { PUBLIC_ROUTES } from './public/public.route';
import { SECURE_ROUTES } from './secure/secure.route';

//app-services
import { MyService } from './my-service.service';                   
import { AuthGuardService } from './services/authGuard.service';
import { AuthGuardForLoggedIn } from './services/authGuardForLoggedIn.service';



//app-components
import { AppComponent } from './app.component';   

//public-components
import { PublicComponent } from './public/public.component';
import { LoginComponent } from './public/login/login.component';

//public-services


//secure-components
import { SecureComponent } from './secure/secure.component';
import { DashboardComponent } from './secure/dashboard/dashboard.component';

// import { LoginComponent } from './login/login.component';
import { ControlMessagesComponent } from './control-messages.component';
import { HeaderComponent } from './secure/common/header/header.component';
import { LeftSideBarComponent } from './secure/common/left-side-bar/left-side-bar.component';
import { CategoriesComponent } from './secure/categories/categories.component';

const APP_ROUTES: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full', },
    { path: '', component: PublicComponent, canActivate: [AuthGuardForLoggedIn], data: { title: 'Public Views' }, children: PUBLIC_ROUTES },
    { path: '', component: SecureComponent, canActivate: [AuthGuardService], data: { title: 'Secure Views' }, children: SECURE_ROUTES }
];

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        ControlMessagesComponent,
        PublicComponent,
        SecureComponent,
        DashboardComponent,
        HeaderComponent,
        LeftSideBarComponent,
        CategoriesComponent
    ],
    imports: [
        BrowserModule, 
        HttpClientModule,
        RouterModule.forRoot(APP_ROUTES),
        ReactiveFormsModule,
        HttpModule
    ],
    providers: [MyService, AuthGuardService, AuthGuardForLoggedIn],
    bootstrap: [AppComponent]
})

@Component ({  
    providers : [ ] 
})
export class AppModule { 
    
}