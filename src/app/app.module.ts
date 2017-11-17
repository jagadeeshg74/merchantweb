import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { LOCALE_ID } from '@angular/core';

  import { ChartsModule } from 'ng2-charts/ng2-charts';

// import { ChartModule } from 'angular2-highcharts';
import { AppComponent } from './app.component';

import { AppRoutingModule } from './app.routing';

import { DashboardComponent } from './dashboard/dashboard.component';
import { PoyChartComponent } from './report/poy-chart.component';
import { PoyReportComponent } from './report/poy-report.component';
import { RedeemComponent } from './redeem/redeem.component';
import { SettingsComponent } from './settings/settings.component';
import { ErrorComponent } from './error/error.component';

import { UserService } from './admin/adminShared/user.service';
import { FirebaseUserService } from './admin/adminShared/firebaseuser.service';
import { AuthenticationService } from './admin/adminShared/authentication.service';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { NavbarComponent } from './navbar/navbar.component';
import { CustomerService } from './redeem/customer.service';
import { ReportDataService } from './report/ReportDataService';

// import { HomeModule } from './home/home.module';
// import { AdminModule } from './admin/admin.module';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    RedeemComponent,
    SettingsComponent,
    ErrorComponent,
    HomeComponent,
    NavbarComponent,
    PoyChartComponent,
    PoyReportComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpModule,
   // ChartModule.forRoot(require('highcharts')),
   ChartsModule
  ],
  providers: [  CustomerService, AuthenticationService ,ReportDataService ,
     LoginComponent ],
  bootstrap: [AppComponent]
})
export class AppModule { }
