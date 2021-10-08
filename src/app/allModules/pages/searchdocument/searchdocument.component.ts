import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatPaginator, MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatSort, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { HistorypopupComponent } from 'app/historypopup/historypopup/historypopup.component';
import { TagDetails } from 'app/models/Dashboard';

import { AuthenticationDetails } from 'app/models/master';
import { ActionLog } from 'app/models/OrderFulFilment';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { SnackBarStatus } from 'app/notifications/snackbar-status-enum';
import { AuthService } from 'app/services/auth.service';
import { Observable, forkJoin } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { runInThisContext } from 'vm';
import { DocReturnData } from '../digital-signing/Model/returnfile.model';
import { DashboardService1 } from '../document-center/dashboard1.service';
import { DocHeaderDetail } from '../document-center/models/DashboardTable.model';
import { efficiencyChart } from '../document-center/models/efficiencyChart.model';
import { processChart } from '../document-center/models/processChart.model';
import { emailsender } from '../document-center/models/RemainderEmail.model';
import { sendRemainder } from '../document-center/models/SendRemainder.model';

export interface PeriodicElement {
  title: string;
  author: string;
  date: string;
  fulfilment: string;
  signed: string;
  completed: string;
  action: string;
}
export class history{
  keyword:string;
  searchedin:string;
  datetime:any;
}
@Component({
  selector: 'app-searchdocument',
  templateUrl: './searchdocument.component.html',
  styleUrls: ['./searchdocument.component.scss']
})
export class SearchdocumentComponent implements OnInit {
  snackbar: NotificationSnackBarComponent;
  public now: Date = new Date();
  latesttime:any;
  newPlaceHolder: string = "Select the dropdown";
  menushow: boolean = true;
  datasummary:boolean=false;
  formdata: FormData;
  viewClient: string = "";
  viewCompany: string = "";
  viewDocId: string = "";
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  InitiatedRecords: DocHeaderDetail[] = [];
  NxtSignRecords: DocHeaderDetail[] = [];
  SignedRecords: DocHeaderDetail[] = [];
  _localvariable: TagDetails;
  // data1: CloudData[]=[];
  AllRecords = [];
  entryindex:any;
  firstentry:any;
  lastentry:any;
  filterarr = [];
  titlearr = [];
  authorarr = [];
  searchhistoryarr: any = [];
  ActionLog: any;
  data_arr = [];
  Create: any;
  DocList = [];
  displayname: string = "";
  titleactive: boolean = false;
  authoractive: boolean = false;
  curruser: AuthenticationDetails;
  links = ['All', 'Create', 'Released', 'In Signing', 'Completed'];
  activeLink = this.links[0];
  efficiencyChartData: efficiencyChart;
  effi_percentage: number;
  processChartData: processChart = new processChart();
  signing_process: number;
  Signing_process: number;
  hidespin: boolean;
  hidespin1:boolean;
  resultarray=[];
  latest_date = [];
  latest_date1 = [];
  latest_date2 = [];
  latest_date3 = [];
  datesFormGroup: FormGroup;
  filteredOption: Observable<string[]> | undefined;

  employeesDataSource: MatTableDataSource<any>;
  employeesDisplayColumns: string[] = ['title', 'author', 'date', 'fulfilment', 'signed', 'completeby', 'action'];
  length: number=0;
  selecteddocId: any;

  //employeesDataSource: MatTableDataSource<any>;
  //employeesDisplayColumns: string[] = ['title', 'author', 'date', 'fulfilment', 'signed', 'completeby', 'action'];
  constructor(private service: DashboardService1, private _snackBar: MatSnackBar, 
    private router: Router, private fb: FormBuilder,   public dialog: MatDialog,
    public datepipe: DatePipe, private _authservice: AuthService) {
    this.curruser = JSON.parse(localStorage.getItem("authorizationData"));
    this.displayname = this.curruser.DisplayName;
  }

  ngOnInit(): void {
    this.resultarray.length=0;
    this.datesFormGroup = this.fb.group({
      lists: [''],
    });
    this.filteredOption = this.datesFormGroup.get('lists').valueChanges.pipe(
      startWith(''),
      map(value => this._filtera(value))
    );
    var timecalc=localStorage.getItem("latesttime");
    console.log(timecalc);
    if(timecalc==null){
      console.log("nothing");
      this.latesttime="No latest entry"
    }
    else{
      const min=+timecalc.slice(-2);
      const hr=+timecalc.slice(0,2);
      const totmin=(hr*60)+min;
      console.log(totmin);
      
      console.log(this.now);
      setInterval(() => {
        this.now = new Date();
      }, 1);
      var timeonly=this.datepipe.transform(this.now,"HH.mm");
      console.log(timeonly);
      const hr1=+timeonly.slice(0,2);
      const min1=+timeonly.slice(-2);  
      const totmin2=(hr1*60)+min1;
      console.log(totmin2);
  
      const minsub=totmin2-totmin;
      if(minsub>=60){
     //   this.latesttime
     const hrconvert=minsub/60;
     const decihrconvert=hrconvert.toFixed(1);
     this.latesttime=decihrconvert+" "+"hrs ago";
      }
      else{
        this.latesttime=minsub+" "+"mins ago";
      }
    }

         
    





    this.hidespin = true;
    this.links = ['All', 'Create', 'Released', 'In Signing', 'Completed'];
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
     
      console.log(this.AllRecords);

      const len = this.AllRecords.length;
      this.entryindex=this.AllRecords.length;
      this.firstentry= this.datepipe.transform(this.AllRecords[0].createdOn, 'MMMM d, y');
      this.lastentry= this.datepipe.transform(this.AllRecords[this.entryindex-1].createdOn, 'MMMM d, y');

      console.log(this.entryindex, this.firstentry, this.lastentry);
      
      for (let h = 0; h < len; h++) {
        this.titlearr.push(this.AllRecords[h].title);
      }
      console.log(this.titlearr);

      for (let h = 0; h < len; h++) {
        this.authorarr.push(this.AllRecords[h].author);
      }
      console.log(this.authorarr);

    });


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
  ActiveLink(link: any) {
    if (link === 'Released') {
      this.employeesDataSource = new MatTableDataSource(this.DocList.filter(x => { return x.fulfilment == "Released" }))
    }
    if (link === 'In Signing') {
      this.employeesDataSource = new MatTableDataSource(this.DocList.filter(x => { return x.fulfilment == "In Signing" }))
    }
    if (link === 'Completed') {
      this.employeesDataSource = new MatTableDataSource(this.DocList.filter(x => { return x.fulfilment == "Completed" }))
    }
    if (link === 'All') {
      this.employeesDataSource = new MatTableDataSource(this.DocList.filter(x => { return x.fulfilment == "Released" || x.fulfilment == "Draft" || x.fulfilment == "In Signing" || x.fulfilment == "Completed" }))
    }
    if (link === 'Create') {
      this.employeesDataSource = new MatTableDataSource(this.DocList.filter(x => { return x.fulfilment == "Draft" }))
    }
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


  addbutton() {
    this.CreateActionLogvalues("Creation");
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
  // sendRemainder(docId) {
  //   this.formdata = new FormData;
  //   this.service.sendRemainder(docId).subscribe((x) => {
  //     console.log(x);
  //     let obj1: sendRemainder = x;
  //     if (obj1.Type = "nxtsign") {
  //       console.log(x);
  //       var client = obj1.client;
  //       this.service.returnRemainder(client).subscribe((y: any) => {
  //         console.log(y);
  //         let obj2: emailsender = y;
  //         var userid = obj2.Username;
  //         var email = obj2.Email;

  //         // this.formdata = new FormData();
  //         this.formdata.append("DocID", userid);
  //         this.formdata.append("senderEmail", email);
  //         this.service.sendEmail(this.formdata).subscribe((z: any) => {
  //           console.log("formdata", z);
  //           this.snackbar.openSnackBar("Remainder sent successfully", SnackBarStatus.success, 2000);
  //         })
  //       })
  //     }



  //   })

  // }

  private _filtera(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.filterarr.filter((Tid: string) => Tid.toLowerCase().includes(filterValue));
  }
  title() {
    this.filterarr = this.titlearr;
    this.menushow = false;
    this.newPlaceHolder = "Enter Title";
    this.titleactive = true;
  }
  author() {
    this.filterarr = this.authorarr;
    this.menushow = false;
    this.newPlaceHolder = "Enter Author";
    this.authoractive = true;
  }
  search() {
    this.resultarray.length=0;
    if(this.datesFormGroup.get('lists').value == ""){
      this.menushow = true;
      this.newPlaceHolder = "Select the dropdown";
      this.authoractive = false;
      this.titleactive = false;
      this.datasummary=false;
      
    }

else{
  this.searchhistoryarr.length=0;
  const len = this.AllRecords.length;
  console.log(this.datesFormGroup.get('lists').value);
  var searchval = this.datesFormGroup.get('lists').value;

  if (this.titleactive) {
  const model = new history();
  model.keyword=this.datesFormGroup.get('lists').value;
  model.searchedin="title";
  model.datetime=this.now;
  this.searchhistoryarr.push(model);
  var existingEntries = JSON.parse(localStorage.getItem("historyarr"));
    if(existingEntries==null){
      console.log("no local storage");
    localStorage.setItem("historyarr", JSON.stringify(this.searchhistoryarr));
    }
    else{
    localStorage.setItem("historyarrayupdate", JSON.stringify(this.searchhistoryarr));
    existingEntries.push(...this.searchhistoryarr);
    localStorage.setItem("historyarr", JSON.stringify(existingEntries));
    }

    for (let l = 0; l < len; l++) {
      if (this.AllRecords[l].title == searchval) {
        this.resultarray.push(this.AllRecords[l]);
      }
    }
    this.length=this.resultarray.length;
    this.employeesDataSource = new MatTableDataSource(this.resultarray);
    console.log(this.resultarray);
  }

  else{
    const model = new history();
    model.keyword=this.datesFormGroup.get('lists').value;
    model.searchedin="author";
    model.datetime=this.now;
    this.searchhistoryarr.push(model);
    console.log(this.searchhistoryarr);
    var existingEntries = JSON.parse(localStorage.getItem("historyarr"));
    if(existingEntries==null){
      console.log("no local storage");
    localStorage.setItem("historyarr", JSON.stringify(this.searchhistoryarr));
    }
    else{
    localStorage.setItem("historyarrayupdate", JSON.stringify(this.searchhistoryarr));
    existingEntries.push(...this.searchhistoryarr);
    localStorage.setItem("historyarr", JSON.stringify(existingEntries));
    }
  

    for (let l = 0; l < len; l++) {
      if (this.AllRecords[l].author == searchval) {
        this.resultarray.push(this.AllRecords[l]);
      }

    }
    console.log(this.resultarray.length);
    this.length=this.resultarray.length;
    this.employeesDataSource = new MatTableDataSource(this.resultarray);
    console.log(this.resultarray.length);
    
  }
this.datasummary=true;
}
  }
opensearchhistory(){
  const dialogRef = this.dialog.open(HistorypopupComponent,{disableClose:true});
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
    if (!obj1.Type) {
      console.log(x);
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
              },
              (err)=>{
                this._snackBar.open('Due date Expiry', '', {
                  duration: 2000,
                  horizontalPosition: this.horizontalPosition,
                  verticalPosition: this.verticalPosition,
                  panelClass: 'i' === 'i' ? 'danger' : 'info'
                });
              })
            })
          })
        })
      })
    }



  })

}
onSelect(selectedItem: DocHeaderDetail) {
  this.hidespin1 = true;
  console.log("Selected item Id: ", typeof selectedItem.docId); // You get the Id of the selected item here
  // let params = new HttpParams();
  // params = params.append("DocId", selectedItem.docId)

  // this.employeesDataSource = new MatTableDataSource(data);
  // this.snackbar.openSnackBar("Deleted successfully", SnackBarStatus.success, 2000);
  this.service.DeleteData(selectedItem.docId).subscribe(
    (data: any[]) => {
      console.log(data);
      const index: number = this.resultarray.indexOf(selectedItem);
      if (index > -1) {
        this.resultarray.splice(index, 1);
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
      // if (selectedItem.fulfilment == "Completed") {
      //   this.signcompletelength1 = this.signcompletelength1 - 1;
      // }
      // if (selectedItem.fulfilment == "In Signing") {
      //   this.signcompletelength3 = this.signcompletelength3 - 1;
      // }
      this.employeesDataSource = new MatTableDataSource(this.resultarray);
      this.hidespin1 = false;
      // this.snackbar.openSnackBar("Deleted successfully", SnackBarStatus.success, 2000);
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
