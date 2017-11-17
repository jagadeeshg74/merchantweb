import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule,  Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { HomeComponent } from './home.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { LoginComponent } from '../login/login.component';
import { RedeemComponent } from '../redeem/redeem.component';

import { UserService } from '../admin/adminShared/user.service';


const HomeRoutes: Routes = [
    {      path: 'home',
        component: HomeComponent,
        children: [
            { path: 'settings', component: LoginComponent, canActivate: [UserService] },
            { path: 'redeem', component: RedeemComponent, canActivate: [UserService] },
            { path: 'login', component: LoginComponent },
            { path: '', component: HomeComponent, canActivate: [UserService] }
        ]
    },
];
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild(HomeRoutes)
    ],
    exports: [
        RouterModule
    ],
    declarations: [
        HomeComponent,
        NavbarComponent,
        LoginComponent
    ],
    providers: [
        UserService
    ]
})
export class HomeModule {}

