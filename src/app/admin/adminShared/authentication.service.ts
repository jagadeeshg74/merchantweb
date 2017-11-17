import { Injectable } from '@angular/core';
import {
    CanActivate,
    Router,
    ActivatedRouteSnapshot,
    RouterStateSnapshot
} from '@angular/router';



import { Customer } from '../../redeem/customer';

import { Http, Headers, Response, RequestOptions } from '@angular/http';
// import { Observable } from 'rxjs/Observable';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

@Injectable()
export class AuthenticationService implements CanActivate {

    userLoggedIn: boolean = false;
    loggedInUserId: number;
    authUser: any;
    merchant ;

    data :any;
    errorMessage;

    constructor(private router: Router, private _http: Http) { }


    resetPassword(emailid: string): Observable<any> {

        console.log('Email:' + emailid );

        let header = new Headers();
        header.append('Content-type', 'application/json');

      // let headers = new Headers({ 'Content-Type': 'application/json' });
      // let options = new RequestOptions({ headers: headers });

       return this._http.post('../merchant_laravel/api/v1/users/password/reset',
         { 'email' : emailid },
        {
          headers: header
        })
          .map((res: Response) => res.json())
          .do(
          data => {
            if (data.success) {
            this.data = data;
            console.log('password reset ');
            console.log('data' + JSON.stringify(this.data));
            console.log(this.data.success);
            console.log('returning data');
            return data ;
            } else {
                this.errorMessage =  data.msg;
                // alert(this.errorMessage + ' Unable to login. Please contact Administrator !');
                // this.errors = data.msg;
                return {success : 'false', msg : this.errorMessage };

            }

          },
          error => {
            this.errorMessage = <any>error;
            console.log('error' + this.errorMessage);
         //   alert(this.errorMessage + ' Unable to login. Please contact Administrator !');
            return {success : 'false', msg : this.errorMessage };
          },
          () => {console.log('Login complete');
                    } );



   /*  return this.http.post('/users/authenticate', { username: username, password: password })
            .map((response: Response) => {
                // login successful if there's a jwt token in the response
                let user = response.json();
                alert(user);
                console.log(user);
                if (user && user.token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(user));
                }

                return user;
            });   */
    }
    
    login(username: string, password: string) : Observable<any> {
        console.log(username + '----' + password);

        let header = new Headers();
        header.append('Content-type', 'application/json');

      // let headers = new Headers({ 'Content-Type': 'application/json' });
      // let options = new RequestOptions({ headers: headers });

       return this._http.post('../merchant_laravel/api/v1/users/authenticate',
         { 'username' : username, 'password': password },
        {
          headers: header
        })
          .map((res: Response) => res.json())
          .do(
          data => {
            if (data.success) {
            this.data = data;
            console.log('am here Auth Service');
            console.log('data' + JSON.stringify(this.data));
            console.log(this.data.success);
            this.userLoggedIn = this.data.success;
            this.authUser =     this.data.user;
            this.loggedInUserId = this.authUser.ur_merchant_id;
            console.log(this.data.user);
            console.log(this.authUser);
            localStorage.setItem('currentUser', JSON.stringify(this.authUser));
             this.verifyUser();
            console.log('returning data');
            return data ;
            } else {
                this.errorMessage = ' Unable to verify user . ' + data.msg;
                // alert(this.errorMessage + ' Unable to login. Please contact Administrator !');
                // this.errors = data.msg;
                return {success : 'false', msg : this.errorMessage };

            }

          },
          error => {
            this.errorMessage = <any>error;
            console.log('error' + this.errorMessage);
         //   alert(this.errorMessage + ' Unable to login. Please contact Administrator !');
            return {success : 'false', msg : this.errorMessage };
          },
          () => {console.log('Login complete');
                    } );



   /*  return this.http.post('/users/authenticate', { username: username, password: password })
            .map((response: Response) => {
                // login successful if there's a jwt token in the response
                let user = response.json();
                alert(user);
                console.log(user);
                if (user && user.token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(user));
                }

                return user;
            });   */
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        let url: string = state.url;
        return this.verifyLogin(url);
    }

    verifyLogin(url: string): boolean {
        if (this.userLoggedIn) { return true; }

        this.router.navigate(['/login']);
        return false;
    }
    verifyUser() {
        this.authUser =  localStorage.getItem('currentUser');
        if (this.authUser) {

           // alert(`Welcome ${this.authUser.email}`);
           // this.loggedInUserId = this.authUser.ur_merchant_id;
           // this.userLoggedIn = true;
            console.log('am here verifyUser'+ this.loggedInUserId +'-----'+this.authUser);
            this.router.navigate(['']);
        }else
        {


        };
    }
    private extractData(res: Response) {
        console.log(res.json());
        let body = res.json();
        console.log (body.data );
        return body.data || {};
    }

    private handleErrorObservable(error: Response | any) {
        console.log(error.message || error);
        return Observable.throw(error.message || error);
    }

    private handleError(error: Response) {
        // in a real world app, we may send the server to some remote logging infrastructure
        // instead of just logging it to the console
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }

    private handleError1(error: any) {
        // In a real world app, we might use a remote logging infrastructure
        // We'd also dig deeper into the error to get a better message
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.log(errMsg); // log to console instead
        return Observable.throw(errMsg);
    }

    loginBUF(username: string, password: string) : Observable<any> {
        console.log(username + password);

        let header = new Headers();
        header.append('Content-type', 'application/json');

      //  let headers = new Headers({ 'Content-Type': 'application/json' });
      // let options = new RequestOptions({ headers: headers });

        this._http.post('../merchant_laravel/api/v1/users/authenticate',
         { 'username' : username, 'password': password },
        {
          headers: header
        })
          .map((res: Response) => res.json())
          .subscribe(
          data => {
            this.data = data;
            console.log('data' + JSON.stringify(this.data));
            console.log(this.data.success);
            this.userLoggedIn = this.data.success;
            this.authUser =     this.data.user;

            this.loggedInUserId = this.authUser.ur_merchant_id;
            console.log(this.data.user);
           // console.log(this.authUser);
            localStorage.setItem('currentUser', JSON.stringify(this.authUser));
            this.verifyUser();
          },
          error => {
            this.errorMessage = <any>error;
            console.log('error' + this.errorMessage);
           // alert(this.errorMessage + ' Unable to login. Please contact Administrator !');
          },
          () => console.log('Login complete'));

        return null;


      /*  return this.http.post('/users/authenticate', { username: username, password: password })
            .map((response: Response) => {
                // login successful if there's a jwt token in the response
                let user = response.json();
                alert(user);
                console.log(user);
                if (user && user.token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(user));
                }

                return user;
            });   */
    }
}