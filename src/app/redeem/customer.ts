/* Defines the product entity */
export class Customer {

    cm_cust_id: number ;
    cm_mobile_no: number;
    cm_Name: string;
    cm_alt_mobile: number;
    cm_email: string;
    cm_address_1: string;
    cm_address_2: string;
    cm_town: string;
    cm_pincode: number;
    cm_city: string;
    cm_state: string;
    cm_profile_photo:  string;
    poyalty_card ;

   merchant_poyalty: MerchantPoyalty;

}


export class MerchantPoyalty {

    mp_id: number;
    mp_cust_id:number;
    mp_merchant_id:number ;
    mp_card_id:number ;
    mp_poyals_accrued :number;
    mp_poyals_redeemed:number ;
    mp_poyals_balance :number ;
    mp_poyals_expired:number ;
    mp_record_status:string ; 



}

