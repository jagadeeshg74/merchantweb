import { Component } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';


import { FormsModule } from '@angular/forms';


// import {UserService} from '../admin/adminShared/user.service';
import { AuthenticationService } from '../admin/adminShared/authentication.service';


@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {

  userLoggedIn = false;
  loggedInUserId: number;
  user: any;
  errorMessage: string;
  infoMessage: string;
  errors: any;
  email:string;
  useremailid: string;
  password: string;
  data;
  authUser: any;

  constructor(private authSVC: AuthenticationService, private router: Router) {

  }

  resetPassword() {

    this.infoMessage = null;
    this.errorMessage = null;
    this.authSVC.resetPassword(this.useremailid)
      .subscribe(
      (data: any) => {
        console.log('login compo data :' + data);

        if (data.success) {
          // alert(' Sucessful login for customer');

          this.data = data;
          console.log('data' + JSON.stringify(this.data));
          console.log(this.data.success);
          console.log('data success' + this.data.success);
          this.infoMessage = data.msg;

        } else {
          // alert(data.msg + ' Unable to process redeem. Please contact Administrator !');s
          this.errorMessage = data.msg;
          // alert(this.errorMessage + ' Unable to login. Please contact Administrator !');
          //  this.errors = data.msg;

        }

      },
      error => {
        this.errorMessage = ' Could not reset password . Please contact Poyalty Administrator ! \n\n  ' + <any>error;
        //  alert(this.errorMessage + ' Unable to login. Please contact Administrator !');
      }
      );

  }

  login() {
    this.infoMessage = null;
    this.authSVC.login(this.email, this.password)
      .subscribe(
      (data: any) => {
        console.log('login compo data :' + data);

        if (data.success) {
          // alert(' Sucessful login for customer');
          this.user = data.user;
          localStorage.setItem('currentUser', JSON.stringify(this.user));
          console.log('after subscription data' + JSON.stringify(data));
          console.log('after subscription User ' + JSON.stringify(this.user));
          this.data = data;
          console.log('data' + JSON.stringify(this.data));
          console.log(this.data.success);
          this.userLoggedIn = this.data.success;
          console.log('this.userLoggedIn   : ' + this.userLoggedIn);
          this.authUser = this.data.user;
          this.loggedInUserId = this.authUser.ur_merchant_id;
          console.log(this.data.user);
          console.log(this.authUser);
          // localStorage.setItem('currentUser', JSON.stringify(this.authUser));
          // this.verifyUser();
          console.log('data success' + this.data.success);
          console.log('this.userLoggedIn   : ' + this.userLoggedIn);

        } else {
          // alert(data.msg + ' Unable to process redeem. Please contact Administrator !');s
          this.errorMessage = ' Unable to verify user . ' + data.msg;
          // alert(this.errorMessage + ' Unable to login. Please contact Administrator !');
          //  this.errors = data.msg;

        }

      },
      error => {
        this.errorMessage = ' Unable to verify user . Please contact Poyalty Administrator ! \n\n  ' + <any>error;
        //  alert(this.errorMessage + ' Unable to login. Please contact Administrator !');
      }
      );


  }

  signup() {
    this.router.navigate(['/admin/signup']);
  }

  cancel() {
    this.router.navigate(['']);
  }

  forgetpassword() {
    this.infoMessage = ' Your Password will be emailed to you .Please check your email. ';

  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

    let url: string = state.url;
    console.log('canActivate' + this.userLoggedIn);
    return this.verifyLogin(url);
  }

  verifyLogin(url: string): boolean {

    console.log('verifyLogin userLoggedIn :' + this.userLoggedIn)
    if (this.userLoggedIn) {

      console.log('userLoggedIn ' + this.userLoggedIn);
      return true;
    }

    this.router.navigate(['/login']);
    return false;
  }

  verifyUser() {

    this.authUser = localStorage.getItem('currentUser');
    if (this.authUser) {
      // alert(`Welcome ${this.authUser.email}`);
      // this.loggedInUserId = this.authUser.ur_merchant_id;
      // this.userLoggedIn = true;
      console.log('am here verifyUser' + this.loggedInUserId + '-----' + this.authUser);
      this.router.navigate(['dashboard']);
    } else {

    }
  }

}
