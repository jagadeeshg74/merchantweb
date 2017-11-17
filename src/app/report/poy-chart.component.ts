import { Component , OnInit } from '@angular/core';
import * as Chart from 'chart.js';
/*
`
    chart {
      display: block;
    }
  `
*/

import { ReportDataService } from './ReportDataService';
@Component({
  selector: 'app-poy-chart',
  styleUrls: ['./poy-chart.component.css'],
// template: `<chart [options]="options"></chart>`
  templateUrl: './poy-chart.component.html',
})

export class PoyChartComponent implements OnInit {
 // Pie
 public pieChartLabels: string[] = ['Accrued', 'Redeemed'];
 public pieChartData = {};


public lineChartData ={};

public  pieChart ;
public lineChart ;

 public pieChartType: string = 'pie';

 // Setup the chart
 public chartData: Array<any> = [];
 public chartLabels: Array<any> = [];
 errorMessage;

 public user;

 constructor(private _chartdataService: ReportDataService) {
  this.options = {};
}
options: Object;

ngOnInit() {

  this.user = JSON.parse(localStorage.getItem('currentUser'));

   var canvas = <HTMLCanvasElement> document.getElementById("pieChart");
   var pie_ctx: CanvasRenderingContext2D = canvas.getContext("2d");

   var line_canvas = <HTMLCanvasElement> document.getElementById("lineChart");
   var line_ctx: CanvasRenderingContext2D = line_canvas.getContext("2d");



 this._chartdataService.getMerchantCashpoints(this.user.ur_merchant_id)
.subscribe(
  (data: any ) => {
    console.log(data);

   if (data.success) {
           console.log('in populateChartData');
         //  this.pieChartData.data.datasets[0].data =  [ data.cashpoints[2].accrued    ,  data.cashpoints[2].redeemed  ];
         this.pieChartData = { type: 'pie',
         data: {
             datasets: [{
                 label: 'Colors',
                 data: [ data.cashpoints[2].accrued    ,  data.cashpoints[2].redeemed  ],
                 backgroundColor: [ "#99ff33" , "#c45850"]
                 //#3cba9f -green colour   , another green #73D53E
             }],
             labels: ['accrued' , 'redeemed']
         },
         options: {
             responsive: true,
             title:{
                 display: true,
                 text: data.cashpoints[2].month +" Cashpoints"
             }
         }
       } ;
       this.lineChartData ={ type: 'line',
       data: {
         labels: [data.cashpoints[0].month, data.cashpoints[1].month, data.cashpoints[2].month],
         datasets: [{
          borderColor: "#99ff33",
          pointBorderColor: "#99ff33",
          pointBackgroundColor: "#99ff33",
          pointHoverBackgroundColor: "#99ff33",
          pointHoverBorderColor: "#99ff33",
          pointBorderWidth: 10,
          pointHoverRadius: 10,
          pointHoverBorderWidth: 1,
          pointRadius: 3,
          fill: false,
          borderWidth: 4,
          // fillColor: "#99ff33",
           //#73D53E
          // strokeColor: "#99ff33)",
          // pointColor: "#99ff33",
           label: 'Accrued',
          // fill: false,
           data: [ data.cashpoints[0].accrued , data.cashpoints[1].accrued , data.cashpoints[2].accrued],
           // backgroundColor: '#99ff33'
         }, {
          borderColor: "#c45850",
          pointBorderColor: "#c45850",
          pointBackgroundColor: "#c45850",
          pointHoverBackgroundColor: "#c45850",
          pointHoverBorderColor: "#c45850",
          pointBorderWidth: 10,
          pointHoverRadius: 10,
          pointHoverBorderWidth: 1,
          pointRadius: 3,
          fill: false,
          borderWidth: 4,
          // fillColor: "#c45850",
           //strokeColor: "#c45850",
           //pointColor: "#c45850",
           label: 'Redeemed',
          // fill: false,
           data: [data.cashpoints[0].redeemed , data.cashpoints[1].redeemed, data.cashpoints[2].redeemed ],
          // backgroundColor: '#c45850'
           /// safron rgba(255,153,0,0.6)
         }]
       },
       options: {
         pointDotRadius: 10,
         bezierCurve: false,
         scaleShowVerticalLines: false,
         scaleGridLineColor: "black",
         elements: {
             line: {
                 tension: 0, // disables bezier curves
             }
         }
     }
     };
    
            //     console.log('this.lineChartData' + JSON.stringify(this.lineChartData) );
                 console.log('this.pieChartData' + JSON.stringify(this.pieChartData));
                 this.pieChart  = new Chart(pie_ctx , this.pieChartData );
                 this.lineChart = new Chart(line_ctx , this.lineChartData );

         }else {
              // alert(data.msg + ' Unable to process redeem. Please contact Administrator !');
             }
           },
           error => {
              this.errorMessage = <any>error;
             alert(this.errorMessage + ' Unable to get chart data. Please contact Administrator !');
           }
           );




  console.log('init called');
 // document.getElementById("legendDiv").innerHTML = <string> myChart.generateLegend();

 const populateChartData = () => {
  this.chartData[0] = {
     data: this._chartdataService.getMerchantCashpoints(this.user.ur_merchant_id)
     .subscribe(
       (data: any ) => {
         console.log(data);
         /*
         data =  {"success":true,
         "cashpoints": [
                        { "month":"JANUARY", "accrued":"295","redeemed":"100"},
                        { "month":"FEBRUARY", "accrued":"395","redeemed":"150"},
                        { "month":"MARCH", "accrued":"495","redeemed":"200"}
             ]
             };

             Merchant Cashpoints : {"success":true,
             "cashpoints":[
                      {"month":"August","accrued":"1000","redeemed":"0"},
                      {"month":"September","accrued":"1000","redeemed":"0"},
                      {"month":"October","accrued":"4000","redeemed":"0"}]}
             */

        if (data.success) {
                console.log('in populateChartData');
              //  this.pieChartData.data.datasets[0].data =  [ data.cashpoints[2].accrued    ,  data.cashpoints[2].redeemed  ];

              this.pieChartData = { type: 'pie',
              data: {
                  datasets: [{
                      label: 'Colors',
                      data: [ data.cashpoints[2].accrued    ,  data.cashpoints[2].redeemed  ],
                      backgroundColor: [ "#3cba9f" , "#c45850"]
                  }],
                  labels: ['accrued' , 'redeemed']
              },
              options: {
                  responsive: true,
                  title:{
                      display: true,
                      text: "Cashpoints"
                  }
              }
            } ;

                 // console.log('this.lineChartData' + JSON.stringify(this.lineChartData) );
                      console.log('this.pieChartData' + JSON.stringify(this.pieChartData));
                      var pieChart = new Chart(pie_ctx , this.pieChartData );
                     // pieChart.render();

              }else {
                   // alert(data.msg + ' Unable to process redeem. Please contact Administrator !');
                  }
                },
                error => {
                   this.errorMessage = <any>error;
                  alert(this.errorMessage + ' Unable to get chart data. Please contact Administrator !');
                }
                ),

};
 };


}

 // events
 public chartClicked(e:any):void {
   console.log(e);
 }

 public chartHovered(e:any):void {
   console.log(e);
  }

}