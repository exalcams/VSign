import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-geardialog',
  templateUrl: './geardialog.component.html',
  styleUrls: ['./geardialog.component.scss']
})
export class GeardialogComponent implements OnInit {
  tagusers:any=[] ;
  constructor(public dialogRef: MatDialogRef<GeardialogComponent>,@Inject(MAT_DIALOG_DATA) data) {
    this.tagusers=data.dialogdata.data;
    console.log(data);
    
   }

  ngOnInit() {
    console.log(this.tagusers);
    
  }
  dialogRefclose(){
    this.dialogRef.close();
  }

}
