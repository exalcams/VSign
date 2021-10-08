import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatTableDataSource, throwMatDialogContentAlreadyAttachedError } from '@angular/material';
export interface PeriodicElement {
  keyword:string;
  searchedin:string;
  datetime:string;
}


@Component({
  selector: 'app-historypopup',
  templateUrl: './historypopup.component.html',
  styleUrls: ['./historypopup.component.scss']
})
export class HistorypopupComponent implements OnInit {
  searchhistoryarr: any = [];
  employeesDataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['keyword', 'searchedin', 'datetime'];
  constructor(private dialogRef: MatDialogRef<HistorypopupComponent>) { }

  ngOnInit() {
    this.searchhistoryarr=JSON.parse(localStorage.getItem("historyarr"));
    console.log(this.searchhistoryarr);
    this.employeesDataSource = new MatTableDataSource(this.searchhistoryarr);
    console.log(this.employeesDataSource);
    
  }
  close() {
    this.dialogRef.close();
  }
}
