import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TagDetails } from 'app/models/Dashboard';
import { AuthenticationDetails } from 'app/models/master';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { SnackBarStatus } from 'app/notifications/notification-snack-bar/notification-snackbar-status-enum';
import { DatePipe } from '@angular/common'
import {SelectionModel} from '@angular/cdk/collections';
import * as FileSaver from 'file-saver';

// import {
//   ApexNonAxisChartSeries,
//   ApexResponsive,
//   ApexChart,
//   ApexPlotOptions,
//   ApexDataLabels,
// } from "ng-apexcharts";
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTooltip,
  ApexStroke,
  ApexResponsive,
  ApexLegend
} from "ng-apexcharts";
import { forkJoin, Observable } from 'rxjs';
// import { DashboardService1 } from './dashboard1.service';
// import { DocHeaderDetail } from './models/DashboardTable.model';
// import { efficiencyChart } from './models/efficiencyChart.model';
// import { processChart } from './models/processChart.model';
// import { emailsender } from './models/RemainderEmail.model';
// import { sendRemainder } from './models/SendRemainder.model';
import { ActionLog } from 'app/models/OrderFulFilment';
import { AuthService } from 'app/services/auth.service';
import { HttpParams } from '@angular/common/http';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material';
import { DocReturnData } from '../new-doucument/models/returndataPostgres.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DocHeaderDetail } from '../document-center/models/DashboardTable.model';
import { efficiencyChart } from '../document-center/models/efficiencyChart.model';
import { processChart } from '../document-center/models/processChart.model';
import { DashboardService1 } from '../document-center/dashboard1.service';
import { sendRemainder } from '../document-center/models/SendRemainder.model';
import { emailsender } from '../document-center/models/RemainderEmail.model';
import { GetattachmentdetailsService1 } from '../digital-signing/getattachmentdetails.service1';
import { FilenameAndDocIDs } from '../new-doucument/models/FilenamesandAttIDs.model';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
// import { TestComponent } from '../test/test.component';

// export interface ChartOptions {
//   series: ApexNonAxisChartSeries;
//   chart: ApexChart;
//   responsive: ApexResponsive[];
//   labels: any;
//   colors: string[];
//   plotOptions: ApexPlotOptions;
// };
export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  responsive: ApexResponsive[];
  dataLabels: ApexDataLabels;
  legend: ApexLegend;
};
export interface PeriodicElement {
  title: string;
  author: string;
  date: string;
  fulfilment: string;
  signed: string;
  completed: string;
  action: string;
}



@Component({
  selector: 'app-output',
  templateUrl: './output.component.html',
  styleUrls: ['./output.component.scss']
})
export class OutputComponent implements OnInit {
  selection = new SelectionModel(true, []);
  snackbar: NotificationSnackBarComponent;
  formdata: FormData;
  hidespin1:boolean;
  InitiatedRecords: DocHeaderDetail[] = [];
  NxtSignRecords: DocHeaderDetail[] = [];
  SignedRecords: DocHeaderDetail[] = [];
  _localvariable: TagDetails;
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  // data1: CloudData[]=[];
  FileNames: FilenameAndDocIDs[] = []
  AllRecords = [];
  signlength = [];
  completedby: any = [];
  signlength1: any = 0;
  viewClient: string = "";
  viewCompany: string = "";
  viewDocId: string = "";
  signcompletelength = [];
  signcompletelength1: any = 0;
  signcompletelength2 = [];
  signcompletelength3: any = 0;
  selectedvalue:any=0;
  ActionLog: any;
  data_arr = [];
  Create: any;
  DocList = [];
  displayname: string = "";
  curruser: AuthenticationDetails;
  links = ['Completed'];
  activeLink = this.links[0];
  efficiencyChartData: efficiencyChart;
  effi_percentage: number;
  processChartData: processChart = new processChart();
  signing_process: number;
  Signing_process: number;
  hidespin: boolean;
  color = 'primary';
  modespin = 'indeterminate';
  latest_date = [];
  latest_date1 = [];
  latest_date2 = [];
  latest_date3 = [];
  count_jan = 0;
  count_feb = 0;
  count_mar = 0;
  count_apr = 0;
  count_may = 0;
  count_jun = 0;
  count_jul = 0;
  count_jan1 = 0;
  count_feb1 = 0;
  count_mar1 = 0;
  count_apr1 = 0;
  count_may1 = 0;
  count_jun1 = 0;
  count_jul1 = 0;
  count_jan2 = 0;
  count_feb2 = 0;
  count_mar2 = 0;
  count_apr2 = 0;
  count_may2 = 0;
  count_jun2 = 0;
  count_jul2 = 0;
  count_jan3 = 0;
  count_feb3 = 0;
  count_mar3 = 0;
  count_apr3 = 0;
  count_may3 = 0;
  count_jun3 = 0;
  count_jul3 = 0;
  countdelay = 0;
  form: FormGroup;
  public a=[];

  employeesDataSource: MatTableDataSource<any>;
  employeesDisplayColumns: string[] = ['select','title', 'author', 'date', 'fulfilment', 'signed', 'completeby', 'action'];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  //  @ViewChild(MatPaginator) paginator: MatPaginator;

  // ngAfterViewInit() {
  //   this.dataSource.paginator = this.paginator;
  // }

  public chartOptions: ChartOptions;
  date: Date;
  selecteddocId: any;
  isDateError: boolean;
  DocList1=[];
  filterdata: any[];

  constructor(private service: DashboardService1, private _snackBar: MatSnackBar, private attachmentdetails: GetattachmentdetailsService1, private router: Router, private fb: FormBuilder, public datepipe: DatePipe, private _authservice: AuthService) {
    this.curruser = JSON.parse(localStorage.getItem("authorizationData"));
    localStorage.setItem("displayName",this.curruser.DisplayName);
    console.log('newnamecursor',localStorage.getItem("displayName") );
    this.displayname = this.curruser.DisplayName;
    // this.displayname = localStorage.getItem("displayName");
    console.log('newname', this.displayname);
    this.form = this.fb.group({
      fromdate: [''],
      todate: ['']
    });


  }

  ngOnInit(): void {

    //alert("date : "+ dateParts[0]+ dateParts[1] + " Year : " + dateParts[2]);
    this.hidespin = true;
    this.links = [ 'Completed'];
    // this.displayname = this.curruser.DisplayName;
    // console.log('newname',this.displayname);
    this.getAllDashBoardData().subscribe((x: any) => {
      this.efficiencyChartData = x[3];
      console.log(x[1]);
      this.effi_percentage = ((parseInt(this.efficiencyChartData.signedDocs) / (parseInt(this.efficiencyChartData.totalDocs)))) * 100;
      console.log(this.effi_percentage);
      this.effi_percentage = Math.round(this.effi_percentage);
      this.processChartData = x[4];
      console.log(x[2]);
      console.log(this.count_jan, "final value")
      this.data_arr.push(parseInt(this.processChartData.draft))
      this.data_arr.push(parseInt(this.processChartData.released))
      this.data_arr.push(parseInt(this.processChartData.signing))
      this.data_arr.push(parseInt(this.processChartData.completed));



      this.signing_process = (parseInt(this.processChartData.signing) / (parseInt(this.processChartData.completed))) * 100;
      this.Signing_process = Math.round(this.signing_process);
      console.log(this.Signing_process);

      this.InitiatedRecords = x[0];
      this.NxtSignRecords = x[1];
      this.SignedRecords = x[2];
      const tableRecords = [];
      var tagdata = {
        text: "",
        weight: 0
      }

      // for(var i=0;i< this.SignedRecords.length;i++){
      //   this.data1.push( {text:this.SignedRecords[i].title,
      //  weight:parseInt(this.SignedRecords[i].scount)})
      // }
      // console.log(this.data1);
      this.NxtSignRecords.forEach(g => {
        if (this.InitiatedRecords.indexOf(this.InitiatedRecords.find(k => k.docId == g.docId)) < 0) {
          tableRecords.push(g)
        }
      })

      this.SignedRecords.forEach(g => {
        if (this.InitiatedRecords.indexOf(this.InitiatedRecords.find(k => k.docId == g.docId)) < 0) {
          tableRecords.push(g)
        }
      })
      this.InitiatedRecords.forEach(g => {
        if (tableRecords.indexOf(g) < 0) {
          tableRecords.push(g);
        }
      })
      console.log(tableRecords);


      this.AllRecords = tableRecords.reverse();
      this.hidespin = false;
      this.filterdata=this.AllRecords;
      this.employeesDataSource = new MatTableDataSource(this.AllRecords);
      this.DocList = tableRecords;
      console.log(this.AllRecords);
      // localStorage.setItem("Tablevalue",JSON. stringify(this.DocList));

      //  this.count_jan =0 ;2021-07-30T10:32:34.35
      console.log(this.datepipe.transform('2021-07-30T10:32:34.35', 'MMM dd yyyy'), "july month");
    
      for (let i = 0; i < this.DocList.length; i++) {
        // console.log(this.DocList[i].fulfilment);

        if (this.DocList[i].fulfilment == "Draft") {
          this.latest_date.push(this.datepipe.transform(this.DocList[i].createdOn, 'MMM'));

        }
        else if (this.DocList[i].fulfilment == "Released") {
          this.latest_date1.push(this.datepipe.transform(this.DocList[i].createdOn, 'MMM'));

        }
        else if (this.DocList[i].fulfilment == "In Signing") {
          this.latest_date2.push(this.datepipe.transform(this.DocList[i].createdOn, 'MMM'));
        }
        else if (this.DocList[i].fulfilment == "Completed") {
          this.latest_date3.push(this.datepipe.transform(this.DocList[i].createdOn, 'MMM'));
        }

      }
      //Draft
      for (let k = 0; k < this.latest_date.length; k++) {
        if (this.latest_date[k] === "Jan") {
          this.count_jan = this.count_jan + 1;
          // console.log(this.count_jan, "jan month count");
        }
        else if (this.latest_date[k] === "Feb") {
          this.count_feb = this.count_feb + 1;
          // console.log(this.count_jan, "feb month count");
        }
        else if (this.latest_date[k] === "Mar") {
          this.count_mar = this.count_mar + 1;
          // console.log(this.count_jan, "mar month count");
        }
        else if (this.latest_date[k] === "Apr") {
          this.count_apr = this.count_apr + 1;
          // console.log(this.count_jan, "april month count");
        }
        else if (this.latest_date[k] === "May") {
          this.count_may = this.count_may + 1;
          // console.log(this.count_jan, "may month count");
        }
        else if (this.latest_date[k] === "Jun") {
          this.count_jun = this.count_jun + 1;
          // console.log(this.count_jan, "jun month count");
        }
        else if (this.latest_date[k] === "Jul") {
          this.count_jul = this.count_jul + 1;
          // console.log(this.count_jan, "jul month count");
        }
      }
      //Released
      for (let k = 0; k < this.latest_date1.length; k++) {
        if (this.latest_date1[k] === "Jan") {
          this.count_jan1 = this.count_jan1 + 1;
          // console.log(this.count_jan, "jan month count");
        }
        else if (this.latest_date1[k] === "Feb") {
          this.count_feb1 = this.count_feb1 + 1;
          // console.log(this.count_jan, "feb month count");
        }
        else if (this.latest_date1[k] === "Mar") {
          this.count_mar1 = this.count_mar1 + 1;
          // console.log(this.count_jan, "mar month count");
        }
        else if (this.latest_date1[k] === "Apr") {
          this.count_apr1 = this.count_apr1 + 1;
          // console.log(this.count_jan, "april month count");
        }
        else if (this.latest_date1[k] === "May") {
          this.count_may1 = this.count_may1 + 1;
          // console.log(this.count_jan, "may month count");
        }
        else if (this.latest_date1[k] === "Jun") {
          this.count_jun1 = this.count_jun1 + 1;
          // console.log(this.count_jan, "jun month count");
        }
        else if (this.latest_date1[k] === "Jul") {
          this.count_jul1 = this.count_jul1 + 1;
          // console.log(this.count_jan, "jul month count");
        }
      }
      //In Signing
      for (let k = 0; k < this.latest_date2.length; k++) {
        if (this.latest_date2[k] === "Jan") {
          this.count_jan1 = this.count_jan2 + 1;
          // console.log(this.count_jan, "jan month count");
        }
        else if (this.latest_date2[k] === "Feb") {
          this.count_feb1 = this.count_feb2 + 1;
          // console.log(this.count_jan, "feb month count");
        }
        else if (this.latest_date2[k] === "Mar") {
          this.count_mar2 = this.count_mar2 + 1;
          // console.log(this.count_jan, "mar month count");
        }
        else if (this.latest_date2[k] === "Apr") {
          this.count_apr2 = this.count_apr2 + 1;
          // console.log(this.count_jan, "april month count");
        }
        else if (this.latest_date2[k] === "May") {
          this.count_may2 = this.count_may2 + 1;
          // console.log(this.count_jan, "may month count");
        }
        else if (this.latest_date2[k] === "Jun") {
          this.count_jun2 = this.count_jun2 + 1;
          // console.log(this.count_jan, "jun month count");
        }
        else if (this.latest_date2[k] === "Jul") {
          this.count_jul2 = this.count_jul2 + 1;
          // console.log(this.count_jan, "jul month count");
        }
      }
      //Completed
      for (let k = 0; k < this.latest_date3.length; k++) {
        if (this.latest_date3[k] === "Jan") {
          this.count_jan3 = this.count_jan3 + 1;
          // console.log(this.count_jan, "jan month count");
        }
        else if (this.latest_date3[k] === "Feb") {
          this.count_feb3 = this.count_feb3 + 1;
          // console.log(this.count_jan, "feb month count");
        }
        else if (this.latest_date3[k] === "Mar") {
          this.count_mar3 = this.count_mar3 + 1;
          // console.log(this.count_jan, "mar month count");
        }
        else if (this.latest_date3[k] === "Apr") {
          this.count_apr3 = this.count_apr3 + 1;
          // console.log(this.count_jan, "april month count");
        }
        else if (this.latest_date3[k] === "May") {
          this.count_may3 = this.count_may3 + 1;
          // console.log(this.count_jan, "may month count");
        }
        else if (this.latest_date3[k] === "Jun") {
          this.count_jun3 = this.count_jun3 + 1;
          // console.log(this.count_jan, "jun month count");
        }
        else if (this.latest_date3[k] === "Jul") {
          this.count_jul3 = this.count_jul3 + 1;
          // console.log(this.count_jan, "jul month count");
        }
      }
      this.signlength = this.DocList.filter(x => { return x.fulfilment == "Released" });
      this.signlength1 = this.signlength.length;
      this.signcompletelength = this.DocList.filter(x => { return x.fulfilment == "Completed" });
      this.signcompletelength1 = this.signcompletelength.length;
      this.signcompletelength2 = this.DocList.filter(x => { return x.fulfilment == "In Signing" });
      this.signcompletelength3 = this.signcompletelength2.length;
      this.date = new Date();
      let latest_date = this.datepipe.transform(this.date, 'MMM dd,yyy');
      // console.log(latest_date);

      for (let ik = 0; ik < this.DocList.length; ik++) {
        console.log(this.DocList[ik].completeby);
        this.completedby.push(this.datepipe.transform(this.DocList[ik].completeby, 'MMM dd,yyy'));
        // console.log(this.completedby);
      }

      //         if(this.DocList[ik].completeby>=latest_date){
      // console.log(new Date('MMM dd yyyy'));
      //         }
      for (let ij = 0; ij < this.completedby.length; ij++) {
        if (latest_date >= this.completedby[ij]) {
          this.countdelay = this.countdelay + 1;
        }
      }
      // console.log(this.countdelay);


      // if(this.DocList.)
      this.chartOptions1();


      this.employeesDataSource.sort = this.sort
      this.employeesDataSource.paginator = this.paginator;
    })
    // var regex =/\s|,/g;
    // let fullDate = "Dec 1,2016";
    // // let datePrt = [""];
    // console.log('ads@sfs',this.DocList);

    // let Date = "Apr 30,2021";
    // var dateParts =fullDate.split(/[\s|,]/g);
    // var datePrt = Date.split(/[\s|,]/g);



    // if(this.DocList[0].createdon   == "Apr")
    // {
    // alert("April month")
    // }

  }
  chartOptions1() {
    this.chartOptions = {
      series: [
        {
          name: "Created",
          data: [this.count_jan, this.count_feb, this.count_mar, this.count_apr, this.count_may, this.count_jun, this.count_jul]
        },
        {
          name: "Released",
          data: [this.count_jan1, this.count_feb1, this.count_mar1, this.count_apr1, this.count_may1, this.count_jun1, this.count_jul1]
        },
        {
          name: "In Signing",
          data: [this.count_jan2, this.count_feb2, this.count_mar2, this.count_apr2, this.count_may2, this.count_jun2, this.count_jul2]
        },
        {
          name: "Completed",
          data: [this.count_jan3, this.count_feb3, this.count_mar3, this.count_apr3, this.count_may3, this.count_jun3, this.count_jul3]
        }
      ],
      chart: {
        height: 150,
        type: "area",
        zoom: {
          enabled: false,
        },
        toolbar: {
          show: false,
        },

      },

      dataLabels: {
        enabled: false
      },
      legend: {
        show: false
      },
      stroke: {
        curve: "smooth"
      },
      xaxis: {
        // type: "datetime",
        categories: [
          // "",
          "jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "July"
        ]
      },
      tooltip: {
        // x: {
        //   format: "dd/MM/yy HH:mm"
        // }
      }, responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
              redrawOnWindowResize: true
            },

            legend: {
              show: false,
              position: "left",

            }
          }
        },
        {
          breakpoint: 769,
          options: {
            chart: {
              width: 135,
              redrawOnWindowResize: true,
              offsetX: -5
            },

            legend: {
              show: false

            }
          }
        },
        {
          breakpoint: 1025,
          options: {
            chart: {
              width: 140,
              height: 130,
              redrawOnWindowResize: true
            },

            legend: {
              show: false

            }
          }
        }
      ]
    };
  }
  boolNxtsign(g: any) {
    // var a=this.NxtSignRecords;
    // console.log(a);
    if (g.client == this.curruser.ClientID) {
      if (this.NxtSignRecords.indexOf(this.NxtSignRecords.find(k => k.docId == g.docId)) >= 0) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }

  }
  getAllDashBoardData(): Observable<any> {
    return forkJoin([this.service.getInitiatedTableContents(this.curruser.ClientID, this.curruser.Company), this.service.getNxtSignedTableContents(this.curruser.ClientID, this.curruser.Company), this.service.getSignedTableContents(this.curruser.ClientID, this.curruser.Company), this.service.getKPI(this.curruser.ClientID, this.curruser.Company), this.service.getProgress(this.curruser.ClientID, this.curruser.Company)]);
  }
  DateSelected(): void {
    this.selection.selected[0].length;
  }
  SearchClicked(): void {
    if (this.form.valid) {
      if (!this.isDateError) {
        // this.IsProgressBarVisibile = true;
        // const UserName = this.form.get('UserName').value;
        const FrDate = this.form.get('fromdate').value;
        let FromDate = '';
        if (FrDate) {
          FromDate = this.datepipe.transform(FrDate, 'yyyy-MM-dd');
        }
        const TDate = this.form.get('todate').value;
        let ToDate = '';
        if (TDate) {
          ToDate = this.datepipe.transform(TDate, 'yyyy-MM-dd');
        }
        if (this.curruser.UserRole === 'User' || this.curruser.UserRole === 'TempUser') {
          this.service.FilterTableData(this.curruser.UserName,FromDate, ToDate,this.curruser.ClientID, this.curruser.Company,this.filterdata)
            .subscribe((data:any[]) => {
              console.log(data);
              this.DocList=data;
              console.log(this.DocList)
              this.employeesDataSource = new MatTableDataSource(this.DocList);
              // this.AllUserLoginHistories = data as UserLoginHistory[];
              // this.tableDataSource = new MatTableDataSource(this.AllUserLoginHistories);
              // this.tableDataSource.paginator = this.LoginHistoryPaginator;
              // this.tableDataSource.sort = this.LoginHistorySort;
              // this.IsProgressBarVisibile = false;
            }, (error) => {
              console.error(error);
              // this.IsProgressBarVisibile = false;
            }
            );
        } else {
          // this.service.FilterLoginHistoryByUser( FromDate, ToDate)
          //   .subscribe((data) => {
          //     console.log(data);
          //     // this.AllUserLoginHistories = data as UserLoginHistory[];
          //     // this.tableDataSource = new MatTableDataSource(this.AllUserLoginHistories);
          //     // this.tableDataSource.paginator = this.LoginHistoryPaginator;
          //     // this.tableDataSource.sort = this.LoginHistorySort;
          //     // this.IsProgressBarVisibile = false;
          //   }, (error) => {
          //     console.error(error);
          //     // this.IsProgressBarVisibile = false;
          //   }
          //   );
        }

      }
    } else {
      Object.keys(this.form.controls).forEach(key => {
        this.form.get(key).markAsTouched();
        this.form.get(key).markAsDirty();
      });
    }
  }
  ActiveLink(link: any) {
    // if (link === 'Released') {
    //   this.activeLink = link;
    //   this.employeesDataSource = new MatTableDataSource(this.DocList.filter(x => { return x.fulfilment == "Released" }));

    // }
    // if (link === 'In Signing') {
    //   this.activeLink = link;
    //   this.employeesDataSource = new MatTableDataSource(this.DocList.filter(x => { return x.fulfilment == "In Signing" }))
    // }
    if (link === 'Completed') {
      this.activeLink = link;
      this.employeesDataSource = new MatTableDataSource(this.DocList.filter(x => { return x.fulfilment == "Completed" }))
    }
    // if (link === 'All') {
    //   this.activeLink = link;
    //   this.employeesDataSource = new MatTableDataSource(this.DocList.filter(x => { return x.fulfilment == "Released" || x.fulfilment == "Draft" || x.fulfilment == "In Signing" || x.fulfilment == "Completed" }))
    // }
    // if (link === 'Create') {
    //   this.activeLink = link;
    //   this.employeesDataSource = new MatTableDataSource(this.DocList.filter(x => { return x.fulfilment == "Draft" }))
    // }
  }
  sign(client, company, docId, fulfilment, author, createdon, completeby) {
    this.CreateActionLogvalues("Signing DocumentCenter Attachment");
    // client = x[0][0].client;
    // company = x[0][0].company;
    // docId = x[0][0].docId;
    console.log(client);
    localStorage.setItem("displayName", this.curruser.DisplayName);
    this.DocList.forEach(element => {
      if (element.docId === docId) {
        localStorage.setItem("DueDate", element.date);
      }
    })
    if (this.NxtSignRecords.find(f => f.docId == docId) != null) {
      localStorage.setItem("hideSign", "No")
    }

    localStorage.setItem("Author", author)
    localStorage.setItem("fulfilment", fulfilment);
    localStorage.setItem("CreatedOn", createdon);
    localStorage.removeItem('completeclient');
    localStorage.removeItem('completecompany');
    localStorage.removeItem('completedocId');
    localStorage.setItem("completedby", completeby)
    localStorage.setItem("Selectedclient", client);
    localStorage.setItem("Selectedcompany", company);
    localStorage.setItem("SelecteddocId", docId);
    this.router.navigate(['/pages/sign']);
  }

  view(client, company, docId, fulfilment) {
    this.CreateActionLogvalues("View DocumentCenter Attachment");

    // client = x[0][0].client;
    // company = x[0][0].company;
    // docId = x[0][0].docId;
    console.log(client);
    localStorage.removeItem("Selectedclient");
    localStorage.removeItem("Selectedcompany");
    localStorage.removeItem("SelecteddocId");
    localStorage.removeItem("completeclient");
    localStorage.removeItem("completecompany");
    localStorage.removeItem("completedocId");
    // this.router.navigate(['signDoc']);

    localStorage.setItem("viewClient", client);
    localStorage.setItem("fulfilmentSave", fulfilment)
    localStorage.setItem("viewCompany", company);
    localStorage.setItem("viewDocId", docId);
    localStorage.setItem("forUpdating", "Yes")
    this.router.navigate(['/pages/create']);

  }

  applyfilter(filterValue: string): void {
    this.employeesDataSource.filter = filterValue.trim().toLowerCase();
  }
  ondate() {
    if(this.form.get("fromdate").value!=null || this.form.get("fromdate").value!=""){
      this.employeesDataSource = new MatTableDataSource(this.DocList.filter(x=>{

       
      console.log(true);
      console.log( new Date(x.date) <= new Date((this.datepipe.transform(this.form.get("fromdate").value,"yyyy-MM-dd"))));
        return new Date(x.date) >= new Date((this.datepipe.transform(this.form.get("fromdate").value,"yyyy-MM-dd")))}))
    }
    if(this.form.get("todate").value!=null || this.form.get("todate").value!=""){
      this.employeesDataSource = new MatTableDataSource(this.DocList.filter(x=>{

       console.log( new Date(x.date) <= new Date((this.datepipe.transform(this.form.get("todate").value,"yyyy-MM-dd"))));
       
        return new Date(x.date) <= new Date((this.datepipe.transform(this.form.get("todate").value,"yyyy-MM-dd")))}))
    }

    if((this.form.get("todate").value!=null || this.form.get("todate").value!="") &&(this.form.get("fromdate").value!=null || this.form.get("fromdate").value!="")){
      this.employeesDataSource = new MatTableDataSource(this.DocList.filter(x=>{

        
        console.log( new Date(x.date) <= new Date((this.datepipe.transform(this.form.get("todate").value,"yyyy-MM-dd"))) && new Date(x.date) >= new Date((this.datepipe.transform(this.form.get("fromdate").value,"yyyy-MM-dd"))));
        return (new Date(x.date) <= new Date((this.datepipe.transform(this.form.get("todate").value,"yyyy-MM-dd"))) && new Date(x.date) >= new Date((this.datepipe.transform(this.form.get("fromdate").value,"yyyy-MM-dd"))) )}))
    }
  }
  // tslint:disable-next-line:typedef
  addbutton() {
    this.CreateActionLogvalues("Creation");
    localStorage.removeItem("Selectedclient");
    localStorage.removeItem("Selectedcompany");
    localStorage.removeItem("SelecteddocId");
    localStorage.removeItem("completeclient");
    localStorage.removeItem("completecompany");
    localStorage.removeItem("completedocId");
    localStorage.removeItem("viewClient");
    localStorage.removeItem("fulfilmentSave")
    localStorage.removeItem("viewCompany");
    localStorage.removeItem("viewDocId");
    if(this.selection.selected){
    this.sendRemainder   ;
    }
    else{
      console.log("wrong")
    }
    this.router.navigate(['/pages/create']);
  }
  CreateActionLogvalues(text): void {
    this.ActionLog = new ActionLog();
    this.ActionLog.UserID = this.curruser.UserID;
    this.ActionLog.AppName = "Dashboard";
    this.ActionLog.ActionText = text + " is Clicked";
    this.ActionLog.Action = text;
    this.ActionLog.CreatedBy = this.curruser.UserName;
    this._authservice.CreateActionLog(this.ActionLog).subscribe(
      (data) => {
        console.log(data);
      },
      (err) => {
        console.log(err);
      }
    );
  }
  onClickDownload(i: number) {
    this.selection.selected[0]=i;
    if(this.selection.selected[0]){
    this.attachmentdetails.getAttachmentPosgresql(this.FileNames[i].docID).subscribe((x: DocReturnData) => {
      const dblob = this.dataURItoBlob(x.files);
      const dfile = new File([dblob], x.fileName, { type: x.fileType });
      FileSaver.saveAs(dfile);
      this.a.push(FileSaver)
    
    })}
    else{
      console.log("wrong")
    }
  }
  viewDoc(client, company, docId, fulfilment, author, createdon, completeby) {
    this.CreateActionLogvalues("View DocumentCenter Attachment");
    localStorage.setItem("displayName", this.curruser.DisplayName);
    console.log(fulfilment);
    localStorage.removeItem("Selectedclient");
    localStorage.removeItem("Selectedcompany");
    localStorage.removeItem("SelecteddocId");
    localStorage.removeItem("completeclient");
    localStorage.removeItem("completecompany");
    localStorage.removeItem("completedocId");
    let hideSignbutton = "";
    if (this.SignedRecords.find(f => f.docId == docId) != null) {
      localStorage.setItem("hideSign", "Yes")
    }
    if (this.InitiatedRecords.find(f => f.docId == docId) != null) {
      console.log("hidesss");

      localStorage.setItem("hideSign", "Yes")
    }
    this.DocList.forEach(element => {
      if (element.docId === docId) {
        localStorage.setItem("DueDate", element.date);
      }
    });
    localStorage.setItem("fulfilment", fulfilment);
    localStorage.setItem("Author", author)
    localStorage.setItem("CreatedOn", createdon)
    if (fulfilment !== "Completed") {
      console.log("here");


      localStorage.setItem("Selectedclient", client);
      localStorage.setItem("Selectedcompany", company);
      localStorage.setItem("SelecteddocId", docId);
    } else {

      localStorage.setItem("completedby", completeby)
      localStorage.setItem("completeclient", client);
      localStorage.setItem("completecompany", company);
      localStorage.setItem("completedocId", docId);
    }

    this.router.navigate(['/pages/sign']);
  }
  dataURItoBlob(dataURI) {
    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array]);
    return blob;
  }
  sendRemainder(client, company, docId, fulfilment, author, createdon, completeby) {
    this.hidespin1 = true;
    this.selecteddocId=docId;
    localStorage.removeItem("Selectedclient");
    localStorage.removeItem("Selectedcompany");
    localStorage.removeItem("SelecteddocId");
    localStorage.removeItem("completeclient");
    localStorage.removeItem("completecompany");
    localStorage.removeItem("completedocId");
    localStorage.setItem("viewClient", client);
    // localStorage.setItem("fulfilmentSave", fulfilment)
    localStorage.setItem("viewCompany", company);
    localStorage.setItem("viewDocId", docId);
    this.viewClient = localStorage.getItem("viewClient");
    this.viewCompany = localStorage.getItem("viewCompany");
    this.viewDocId = localStorage.getItem("viewDocId");
    this.formdata = new FormData;
    this.service.sendRemainder(docId).subscribe((x) => {
      console.log(x);
      let obj1: sendRemainder = x;
      // = "nxtsign"
      // if (!obj1.Type) {
      //   console.log(x);
        this.service.getDocAtts(this.viewDocId, this.viewClient, this.viewCompany).subscribe((x: string[]) => {
          let Atts = x;
          this.service.getfilefromPostGres(x).subscribe((y: DocReturnData[]) => {
            y.forEach(q => {
              const blob = this.dataURItoBlob(q.files)
              const file = new File([blob], q.fileName, { 'type': q.fileType })
              console.log(file);


              var client = obj1.client;
              this.service.returnRemainder(client).subscribe((y: any) => {
                console.log(y);
                let obj2: emailsender = y;
                var userid = obj2.Username;
                var email = obj2.Email;

                this.formdata = new FormData();
                this.formdata.append("DocID", userid);
                this.formdata.append("senderEmail", email);
                this.formdata.append("File",file);
                // this.formdata.append("Files",)
                console.log(this.formdata.get("DocID"))
                this.service.sendEmail(this.formdata).subscribe((z: any) => {
                  console.log("formdata", z);
                  this.hidespin1 = false;
                  this._snackBar.open('Remainder sent successfully', '', {
                    duration: 2000,
                    horizontalPosition: this.horizontalPosition,
                    verticalPosition: this.verticalPosition,
                    panelClass: 'i' === 'i' ? 'success' : 'info'
                  });
                  // this.snackbar.openSnackBar("Remainder sent successfully", SnackBarStatus.success, 2000);
                })
              })
            })
          })
        })
      // }



    })

  }
  isAllSelected() {
  //  console.log(this.selection);
    const numSelected = this.selection.selected.length;
    this.selectedvalue=this.selection.selected.length;
    this.selectedvalue.clear();
    console.log("hi",this.selectedvalue);
    const numRows = this.employeesDataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
   //  console.log(this.selection);
    this.isAllSelected() ?
        this.selection.clear() :
        this.employeesDataSource.data.forEach(row => this.selection.select(row));
  }
  selectRow(row) {
   // this.selection.toggle(row);
    this.selectedvalue=this.selection.selected[0];
   
  }

  logSelection() {
    this.selection.selected.forEach(s => console.log(s.name));
  }
  onSelect(selectedItem: DocHeaderDetail) {
    this.hidespin1 = true;
    console.log("Selected item Id: ", typeof selectedItem.docId); // You get the Id of the selected item here
    let params = new HttpParams();
    params = params.append("DocId", selectedItem.docId)

    // this.employeesDataSource = new MatTableDataSource(data);
    // this.snackbar.openSnackBar("Deleted successfully", SnackBarStatus.success, 2000);
    this.service.DeleteData(selectedItem.docId).subscribe(
      (data: any[]) => {
        console.log(data);
        const index: number = this.AllRecords.indexOf(selectedItem);
        if (index > -1) {
          this.AllRecords.splice(index, 1);
        }
        // this.signlength=data.filter(x => { return x.fulfilment == "Released" });
        // this.signlength1=this.signlength.length;
        // this.signcompletelength=data.filter(x => { return x.fulfilment == "Completed" });
        // this.signcompletelength1=this.signcompletelength.length;
        // this.signcompletelength2=data.filter(x => { return x.fulfilment == "In Signing" });
        // this.signcompletelength3=this.signcompletelength2.length;
        // if (selectedItem.fulfilment == "Released") {
        //   this.signlength1 = this.signlength1 - 1;
        // }
        if (selectedItem.fulfilment == "Completed") {
          this.signcompletelength1 = this.signcompletelength1 - 1;
        }
        // if (selectedItem.fulfilment == "In Signing") {
        //   this.signcompletelength3 = this.signcompletelength3 - 1;
        // }
        //this.activeLink = "all";
        this.employeesDataSource = new MatTableDataSource(this.AllRecords);
        // this.snackbar.openSnackBar("Deleted successfully", SnackBarStatus.success, 2000);
        this.hidespin1 = false;
        this._snackBar.open('Deleted successfully', '', {
          duration: 2000,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
          panelClass: 'i' === 'i' ? 'success' : 'info'
        });
      },
      (err) => {
        console.error(err);
      }
    )

  }

}


// this.chartOptions = {
      //   series: this.data_arr,
      //   chart: {
      //     type: "donut",
      //     width: 250,
      //     height: 180,
      //     offsetY: -10,
      //     offsetX: -10
      //   },

      //     labels: ["Created", "Released", "Signing", "Completed"],
      //     colors: ['#1764e8', '#74a2f1', '#c3d8fd', '#61fd9f'],
      //     plotOptions: {
      //       pie: {
      //         donut: {
      //           size: '10%',

      //         }
      //       }
      //     },

      //     responsive: [
      //       {
      //         breakpoint: 480,
      //         options: {
      //           chart: {
      //             width: 200,
      //             redrawOnWindowResize: true
      //           },

      //           legend: {
      //             show: false,
      //             position: "left",

      //           }
      //         }
      //       },
      //       {
      //         breakpoint: 769,
      //         options: {
      //           chart: {
      //             width: 135,
      //             redrawOnWindowResize: true,
      //             offsetX:-5
      //           },

      //           legend: {
      //             show: false

      //           }
      //         }
      //       },
      //       {
      //         breakpoint: 1025,
      //         options: {
      //           chart: {
      //             width: 140,
      //             height: 130,
      //             redrawOnWindowResize: true
      //           },

      //           legend: {
      //             show: false

      //           }
      //         }
      //       },
      //       {
      //         breakpoint: 2000,
      //         options: {
      //           chart: {
      //             width: 250,
      //             offsetY: -20,
      //             redrawOnWindowResize: true
      //           },

      //           legend: {
      //             show: true,
      //             position: "left",
      //             offsetY: -6,
      //             offsetX:10,
      //             markers:{
      //               width:8,
      //               height:8,
      //               // offsetX:15,
      //             }

      //           }
      //         }
      //       }
      //     ]
      //   };
