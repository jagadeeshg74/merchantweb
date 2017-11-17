import { Component } from '@angular/core';
import {AuthenticationService} from '../adminShared/authentication.service';
import { Router } from '@angular/router';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
 })
 
export class LoginComponent { 
  email: string;
  password1: string;

  constructor(private authSVC: AuthenticationService, private router: Router){}

  login(){
    this.authSVC.login(this.email, this.password1);
    // this.authSVC.verifyUser();
  }

  signup(){
    this.router.navigate(['/admin/signup']);
  }

  cancel(){
    this.router.navigate(['']);
  }


}