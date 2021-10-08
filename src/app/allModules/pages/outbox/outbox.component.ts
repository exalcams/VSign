import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { AuthenticationDetails } from 'app/models/master';
import { ActionLog } from 'app/models/OrderFulFilment';
import { AuthService } from 'app/services/auth.service';
import { forkJoin, Observable } from 'rxjs';
import { DashboardService1 } from '../document-center/dashboard1.service';
import { DocHeaderDetail } from '../document-center/models/DashboardTable.model';
import { efficiencyChart } from '../document-center/models/efficiencyChart.model';
import { processChart } from '../document-center/models/processChart.model';
import { emailsender } from '../document-center/models/RemainderEmail.model';
import { sendRemainder } from '../document-center/models/SendRemainder.model';
import { DocReturnData } from '../new-doucument/models/returndataPostgres.model';
import * as FileSaver from 'file-saver';
export interface PeriodicElement {
  // select:any;
  title: string;
  author: string;
  date: string;
  fulfilment: string;
  signed: string;
  completed: string;
  action: string;
}
@Component({
  selector: 'app-outbox',
  templateUrl: './outbox.component.html',
  styleUrls: ['./outbox.component.scss']
})
export class OutboxComponent implements OnInit {
  InitiatedRecords: DocHeaderDetail[] = [];
  NxtSignRecords: DocHeaderDetail[] = [];
  SignedRecords: DocHeaderDetail[] = [];
  efficiencyChartData: efficiencyChart;
  employeesDataSource: MatTableDataSource<any>;
  selection = new SelectionModel<PeriodicElement>(true, []);
  employeesDisplayColumns: string[] = ['select','title', 'author', 'date', 'fulfilment', 'signed', 'completeby', 'action'];
  AllRecords: any[];
  hidespin: boolean;
  filterdata: any[];
  effi_percentage: number;
  processChartData: processChart = new processChart();
  signing_process: number;
  Signing_process: number;
  data_arr = [];
  public a:any;
  curruser: AuthenticationDetails;
  // selection: any;
  DocList = [];
  selectedvalue: any;
  ActionLog: ActionLog;
  hidespin1: boolean;
  signcompletelength =[];
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  signcompletelength1: number;
  selectedarray=[];
  a1: any;
  a2: any;
  formdata: FormData;
  viewClient: string;
  viewCompany: string;
  viewDocId: string;
  constructor(private service: DashboardService1,private router: Router,private _snackBar: MatSnackBar,private _authservice: AuthService) { 
    this.curruser = JSON.parse(localStorage.getItem("authorizationData"));
    localStorage.setItem("displayName",this.curruser.DisplayName);
    console.log('newnamecursor',localStorage.getItem("displayName") )
  }

  ngOnInit() {
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
      
      this.DocList = tableRecords;
       this.signcompletelength=this.AllRecords.filter(x => { return x.fulfilment == "Completed" });
       this.employeesDataSource = new MatTableDataSource(this.signcompletelength);
          this.signcompletelength1=this.signcompletelength.length;
      // console.log(this.AllRecords);
      // localStorage.setItem("Tablevalue",JSON. stringify(this.DocList));

      
      


      // this.employeesDataSource.sort = this.sort
      // this.employeesDataSource.paginator = this.paginator;
    })
  }
  getAllDashBoardData(): Observable<any> {
    return forkJoin([this.service.getInitiatedTableContents(this.curruser.ClientID, this.curruser.Company), this.service.getNxtSignedTableContents(this.curruser.ClientID, this.curruser.Company), this.service.getSignedTableContents(this.curruser.ClientID, this.curruser.Company), this.service.getKPI(this.curruser.ClientID, this.curruser.Company), this.service.getProgress(this.curruser.ClientID, this.curruser.Company)]);
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
  SentMail(){
   for(var i=0;i<this.selectedarray.length;i++)
   {
     this.a=this.selectedarray[i].client;
     this.a1=this.selectedarray[i].company;
    this.a2= this.selectedarray[i].docId;
    this.sendRemainder(this.a,this.a1,this.a2);
   }
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
  sendRemainder(client, company, docId) {
    this.hidespin1 = true;
    // this.selecteddocId=docId;
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
    this.service.sendRemainder2(docId).subscribe((x) => {
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
                this.service.sendEmail1(this.formdata).subscribe((z: any) => {
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
      }
    })
    }
    print(){
      for(var i=0;i<this.selectedarray.length;i++)
      {
        this.a=this.selectedarray[i].client;
        this.a1=this.selectedarray[i].company;
       this.a2= this.selectedarray[i].docId;
       this.onprint(this.a,this.a1,this.a2);
      }
     }
  onprint(client, company, docId){
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
    this.service.getDocAtts(this.viewDocId, this.viewClient, this.viewCompany).subscribe((x: string[]) => {
      let Atts = x;
      this.service.getfilefromPostGres(x).subscribe((y: DocReturnData[]) => {
        y.forEach(q => {
          const blob = this.dataURItoBlob(q.files)
           const file=( new File([blob], q.fileName, { 'type': q.fileType }));
          console.log(file);
          FileSaver.saveAs(file);
        })
      })
 
    })
  }
      
  isAllSelected() {
    //  console.log(this.selection);
      const numSelected = this.selection.selected.length;
      this.selectedarray=this.selection.selected;
      console.log(this.selectedarray);
      
      this.selectedvalue=this.selection.selected.length;
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
    //  this.selection.toggle(row);
      this.selectedvalue=this.selection.selected[0];
     
    }
    checkboxLabel(row?: PeriodicElement): string {
      if (!row) {
        return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
      }
      return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.title + 1}`;
    }
   
    // logSelection() {
    //   this.selection.selected.forEach(s => console.log(s.name));
    // }
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
    onSelect(selectedItem: DocHeaderDetail) {
      this.hidespin1 = true;
      console.log("Selected item Id: ", typeof selectedItem.docId); // You get the Id of the selected item here
    
  
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
  
  
  

}
