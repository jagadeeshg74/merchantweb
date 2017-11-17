import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

import { Customer } from './customer';

@Injectable()
export class CustomerService {
    private _customerUrl = '';
    customers: Customer[];
    data ;
    errorMessage;

    constructor(private _http: Http) { }

    getCustomers(): Observable<Customer[]> {

        return this._http.get(this._customerUrl)
            .map((response: Response) => <Customer[]>response.json())
            .do(data => console.log('All: ' + JSON.stringify(data)))
            .catch(this.handleError);
    }

    getCustomerByMobile(mobile: string , merchant_id :string): Observable<any> {



        this._customerUrl = '../merchant_laravel/api/v1/customer/' + mobile + '/merchant/'+ merchant_id ;
        return this._http.get(this._customerUrl)
            .map((response: Response) => <Customer>response.json())
            .do(data => console.log('All: ' + JSON.stringify(data)))
            .catch(this.handleError);


    }


     redeemCustomer(bill_amount: number, redeem_amount: number, cust_id: number, merchant_id: number ,
                        bill_no : string ,bill_date :Date): Observable<any> {

        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

       return  this._http.post('../merchant_laravel/api/v1/redeem', 
       {  'bill_amount': bill_amount, 'redeem_amount': redeem_amount ,
        'cust_id': cust_id , 'merchant_id': merchant_id, 'bill_no': bill_no , 'bill_date' : bill_date }, options)
          .map((res: Response) =><any> res.json())
          .do(
          (data:any) => {
            this.data = data;
            console.log('data' + JSON.stringify(this.data));
          },
          error => {
            this.errorMessage = <any>error;
            console.log('error' + this.errorMessage);
          },
          () => console.log('redeem complete'))
          .catch(this.handleError);


    }

    getCustomerByMobileold(mobile: number): Observable<Customer> {

        return this.getCustomers()
            .map((customers: Customer[]) => customers.find(c => c.cm_mobile_no === mobile));

    }

    private handleError(error: Response) {
        // in a real world app, we may send the server to some remote logging infrastructure
        // instead of just logging it to the console
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }



    private extractData(res: Response) {
        let body = res.json();
        return body.data || {};
    }
    private handleErrorObservable(error: Response | any) {
        console.error(error.message || error);
        return Observable.throw(error.message || error);
    }


 


}
