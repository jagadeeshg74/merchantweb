import { Component, OnInit, OnChanges } from '@angular/core';

import jsPDF from 'jspdf';

import { ReportDataService } from '../report/ReportDataService';

var jsPDF = require('jspdf');
require('jspdf-autotable');

@Component({
    selector: 'app-poy-report',
    styles: [],
    templateUrl: './poy-report.component.html'
})


export class PoyReportComponent implements OnInit, OnChanges {

    public user;
    reportDate: any;
    reportMonth: any;
    newDate : any;
    public dailycashpoints = [];
    public monthlycashpoints = [];
    errorMessage;
    reportMessage : string;

    constructor(private _reportdataService: ReportDataService) {

        this.reportDate = new Date();
        this.reportMonth = new Date();

    }
    ngOnChanges(change) {

        console.log('It works!');

    }


    ngOnInit() {
        this.user = JSON.parse(localStorage.getItem('currentUser'));

        this._reportdataService.getMerchantCashpoints(this.user.ur_merchant_id)

            .subscribe(
            (data: any) => {
                console.log(data);


                if (data.success) {
                    console.log('in Populate Report Data');

                    this.dailycashpoints = data.cashpoints_daily;
                    this.monthlycashpoints = data.cashpoints_monthly;

                    console.log('Daily : ' + this.dailycashpoints);
                    console.log('Monthly : ' + this.monthlycashpoints);

                } else {
                    // alert(data.msg + ' Unable to process redeem. Please contact Administrator !');
                }
            },
            error => {
                this.errorMessage = <any>error;
              //  alert(this.errorMessage + ' Unable to get chart data. Please contact Administrator !');
                this.reportMessage = this.errorMessage + ' Unable to get chart data. Please contact Administrator !';
            }
            );

        console.log('init called');
    }


    parseReportMonth(dateString: string): Date {

        console.log(dateString);

        var dd  = parseInt(dateString.slice(0, 2));
        var mon = parseInt(dateString.slice(2, 4));
        var year = parseInt(dateString.slice(4, 8));

        if (dateString) {
            // let d = new Date(Date.UTC(e[0], e[1] - 1, e[2]));
            let d = new Date(Date.UTC(year, mon - 1, 1));
            this.reportMonth.setFullYear(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
            console.log(this.reportMonth);
        } else {
            return null;
        }
    }


    set report_date(e) {
        e = e.split('-');
        console.log('date :' + e[0] + '---' + e[1] + '---' + e[2])
        let d = new Date(Date.UTC(e[0], e[1] - 1, e[2]));
        this.reportDate.setFullYear(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
    }

    get report_date() {
        return this.reportDate.toISOString().substring(0, 10);
    }

    get report_month() {
        return this.reportMonth.toISOString().substring(0, 10);
    }


    public reportDownload(report_type) {

        console.log(JSON.stringify(this.reportMonth));
        console.log(JSON.stringify(report_type));
       

        if (report_type === 'monthly') {

            console.log(JSON.stringify(this.report_month));
            this.newDate = this.report_month;
            // console.log(JSON.stringify(this.report_month));
            //   this.report_date = new Date( this.report_month.toISOString().substring(0, 10));

        } else {

            this.newDate = this.report_date;
        }

        console.log('Report Date' + JSON.stringify(this.report_date) + '----' + this.report_month + '----' + report_type);
        this._reportdataService.getReportData(this.user.ur_merchant_id,
            report_type,
            this.newDate)
            .subscribe(
            (data: any) => {

                console.log(JSON.stringify(data));

                if (data.success) {
                    switch (report_type) {
                        case 'daily': {
                            console.log('Daily Report');
                            this.dailycashpoints = data.cashpoints_daily;
                            this.generateReport(report_type, this.dailycashpoints);

                            break;
                        }

                        case 'monthly': {
                            console.log('monthly Report');
                            this.monthlycashpoints = data.cashpoints_monthly;
                            this.generateReport(report_type, this.monthlycashpoints);
                            break;
                        }

                        default: {
                            console.log("Invalid report choice");
                            break;
                        }
                    }


                  //  console.log('after subscription report data' + JSON.stringify(data));

                } else {
                  //  alert(data.msg + ' Unable to process redeem. Please contact Administrator !');
                    this.reportMessage =  'Sucessfully retrieved '+ report_type +' report .'
                    
                }

            },
            error => {
                this.errorMessage = <any>error +  + ' Unable to process redeem. Please contact Administrator !';
              //  alert(this.errorMessage);
            }
            );


    }
    public generateReport(report_type, report_data) {

        var record;

        console.log('we are here');
        var doc = new jsPDF('landscape', 'pt');
        var col = ['S.No', 'Date', 'Trans id', 'Customer Mobile', 'Name', 'Bill Number', 'Bill Amount',
            'Paid Amount', 'Type A/R', 'Accrued', 'Redeemed'];
        var rows = [];

        var accrued =0 ;
        var redeemed =0 ;


        console.log('report_data length ' + report_data.length);
        if (report_data.length < 1) {

           // doc.text(20, 20, 'There are no records found for ' + report_type + ' transactions .');
         //  alert ('There are no records found for ' + report_type + ' transactions .');
           this.reportMessage =' There are no records found for ' + report_type + ' transactions .';

        }
        else {

            for (var i = 0; i < report_data.length; i++) {

                var recData = report_data[i];
                var record: any = [i + 1, recData['Date'], recData['TransId'],
                recData['Name'], recData['CustomerMobile'],
                recData['BillNumber'], recData['BillAmount'], recData['FinalAmount'],
                recData['TypeAR'], recData['accrued'], recData['redeemed']];
                accrued +=  parseFloat(recData['accrued']);
                redeemed += parseFloat(recData['redeemed']);

                rows.push(record);
            }

            var totalRecord: any = [ , , , , , ,,,'Total :',accrued ,redeemed ];

            rows.push(totalRecord);

            doc.autoTable(col, rows, {

                margin: { top: 40 },
                addPageContent: function (data) {
                    doc.text(' Cashpoints ' + report_type + ' Reporting  ', 40, 30);
                }
            });

                 // Save the PDF
        doc.save(report_type + '_Cashpoints.pdf');
       // alert(' Sucessfully retrieved '+ report_type +' report .');
       this.reportMessage =  'Sucessfully retrieved '+ report_type +' report .'


        }


    }











}



