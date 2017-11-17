import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RedeemComponent } from './redeem/redeem.component';
import { SettingsComponent } from './settings/settings.component';
import { ErrorComponent } from './error/error.component';
import {HomeComponent } from './home/home.component';
import { AuthenticationService } from './admin/adminShared/authentication.service';

@NgModule({

imports: [

    RouterModule.forRoot([
        { path: 'login', component: LoginComponent },
        { path: '',  component : HomeComponent ,
          canActivate: [ AuthenticationService ],
         children: [
            {
            path: 'redeem',
            component: RedeemComponent
            },
            {
                path: 'dashboard',
                component: DashboardComponent
                },

        {
            path: '',
           component: RedeemComponent
            },
         {
            path: '**',
           component: ErrorComponent
            },

        ]		},
        { path : '**', component : ErrorComponent },
        { path: 'redeem', component: RedeemComponent  }
    ])
    ],
    exports :  [
        RouterModule
    ]

    })

    export class AppRoutingModule { }

