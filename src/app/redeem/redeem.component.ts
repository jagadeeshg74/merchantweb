import { Component, OnInit, OnChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Customer, MerchantPoyalty } from './customer';
import { CustomerService } from './customer.service';


@Component({
  selector: 'app-redeem',
  templateUrl: './redeem.component.html',
  styleUrls: ['./redeem.component.css']
})
export class RedeemComponent implements OnInit, OnChanges {
  customer: Customer;
  mobile_no: string;
  errorMessage: string;
  custMessage:string;
  redeemMessage :String ;
  bill_amount = 0;
  redeem_amount = 0;
  final_amount = 0;
  accrued_poyals = 0;
  bill_no;
  // startdate
  billDate: any;
  authUser;
  newobj;
  // merchant_poyaltyfiltered: MerchantPoyalty[] |undefined;
  // available_poyals = 5000 ;


  constructor(private _customerService: CustomerService) {
    // this.bill_date = new Date('YYYY/mm/dd');
    this.billDate = new Date(Date.now());
    console.log(' this.billDate' +  this.billDate);
  }

  ngOnInit() {
    this.authUser = JSON.parse(localStorage.getItem('currentUser'));
  }


  ngOnInit2() {
  //  this.merchant_poyaltyfiltered = this.customer.merchant_poyalty.filter(
    //  merchant_poyalty => merchant_poyalty.mp_merchant_id === this.authUser.ur_merchant_id);
  }
  ngOnChanges(change) {

    console.log('It works!');
    this.final_amount = this.bill_amount - this.redeem_amount;
  }

  getCustomerByMobile() {
    console.log('mobile no ' + this.mobile_no);

   

    this._customerService.getCustomerByMobile(this.mobile_no , this.authUser.ur_merchant_id).subscribe(
      customer => {

        this.customer = customer;
        this.customer.merchant_poyalty = customer.merchant_poyalty;
        this.customer.poyalty_card =customer.poyalty_card;
        console.log('merchant poyalty' + this.customer.merchant_poyalty );
        console.log(JSON.stringify(this.customer) === JSON.stringify({}));


        if (JSON.stringify(this.customer) === JSON.stringify({})) {

          console.log('Customer not found ' + this.mobile_no);
         // alert('Customer not found ');
          this.customer = null;
         // this.custMessage = 'Customer not found for mobile no: ' + this.mobile_no;
          this.custMessage = 'Your customer ' +this.mobile_no+ 
            ' is not enrolled with poyalty program. pl. ask to download poyalty app and start getting the benefits';
        } else {

        console.log('after subscription getCustomerByMobile ' + this.customer);

        this.custMessage = null;

        }
      },
      error => this.errorMessage = <any>error
    );
    console.log('customer ' + this.customer);
    console.log('errorMessage ' + this.errorMessage);

  }

  calcFinalAmt() {
    this.final_amount = (this.bill_amount - this.redeem_amount) > 0 ? this.bill_amount - this.redeem_amount : 0;
    return this.final_amount;

  }

  calcAccruedPoyals() {


    this.accrued_poyals = Math.floor(this.final_amount / 20);
    this.accrued_poyals = this.accrued_poyals >= 0 ? this.accrued_poyals : 0;
    return this.accrued_poyals;

  }

  reset() {

    console.log("reset is called");
    this.redeem_amount = 0;
    this.bill_amount = 0;
    this.billDate = new Date(Date.now());
    this.bill_no = '';
    this.final_amount = 0;
    this.redeemMessage = null;
    this.errorMessage = null ;
  }


  redeem() {

        console.log(" in redeem " + this.bill_amount + '---' + this.redeem_amount+'......' +this.bill_no);
    
        this.validateRedeemForm();
    
     
        // debugger;  
    
        console.log('date ' + this.bill_date);
    
          this._customerService.redeemCustomer(this.bill_amount,
          this.redeem_amount,
          this.customer.cm_cust_id,
          this.authUser.ur_merchant_id,
          this.bill_no,
          this.bill_date)
          .subscribe(
          (data: any) => {

            if (data.success) {

            this.customer.poyalty_card = data.poyalty_card;
            this.customer.merchant_poyalty = data.merchant_poyalty ;
           // alert(' Sucessfully submitted redeem for this customer');

            console.log('after subscription poyalty_card ' + this.customer.poyalty_card);
            console.log('after subscription merchant_poyalty' + this.customer.merchant_poyalty);
            console.log('after subscription data' + JSON.stringify(data));
            console.log('after subscription customer ' + JSON.stringify(this.customer));
            this.redeemMessage =  'Sucessfully submitted redeem for this customer!';


          } else {
             // alert(data.msg + ' Unable to process redeem. Please contact Administrator !');
             // this.redeemMessage = data.msg + ' Unable to process redeem. Please contact Administrator !';
             this.errorMessage = data.msg ;
            }

          },
          error => {
          this.errorMessage = <any>error;
           // alert(this.errorMessage + ' Unable to process redeem. Please contact Administrator !');
            this.redeemMessage = this.errorMessage + ' Unable to process redeem. Please contact Administrator !';

          }
          );

        // console.log('customer phew phew' + JSON.stringify(this.customer));
        console.log('errorMessage ' + this.errorMessage);
    
        this.reset();
    
      }
    

  validateRedeemForm() {

  }

  isValidRedeem = function () {

    return Math.abs(this.redeem_amount) > Math.abs(this.bill_amount);


  };

  checkRedeem = function () {

    // redeem_amount > customer.poyalty_card.cp_poyals_accrued
    // this.redeem_amount =0;
      if ((this.customer !== undefined ) && (this.customer.merchant_poyalty !== undefined)) {

        console.log('in check redeem' + this.redeem_amount + '---' + this.customer.merchant_poyalty.mp_poyals_balance);
        return Math.abs(this.redeem_amount) > Math.abs(this.customer.merchant_poyalty.mp_poyals_balance);
      } else {
          return  Math.abs(this.redeem_amount) > 0 ;
      }

   };

  set bill_date(e) {
    e = e.split('-');
    let d = new Date(Date.UTC(e[0], e[1] - 1, e[2]));
    this.billDate.setFullYear(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
  }

  get bill_date() {
    return this.billDate.toISOString().substring(0, 10);
  }

}
