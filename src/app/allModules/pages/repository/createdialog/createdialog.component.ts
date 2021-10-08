import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { DocTag } from '../../new-doucument/models/Tag.model';
import { TagService } from '../service/tag.service';

@Component({
  selector: 'app-createdialog',
  templateUrl: './createdialog.component.html',
  styleUrls: ['./createdialog.component.scss']
})
export class CreatedialogComponent implements OnInit {
  InputMain:any;
  dtag:any=[];
  dtag1:any=[];
  myControl = new FormControl();
  filteredOptions: Observable<any[]>;
  constructor( public dialogRef: MatDialogRef<CreatedialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,private _tagservice:TagService) { }

  ngOnInit(): void {
    this._tagservice.getTags().subscribe((g: DocTag) => {
      console.log(g[0].docId);
      this.dtag.push(g);
      for(let i=0;i<this.dtag[0].length;i++)
      {
        this.dtag1.push(this.dtag[0][i].tagName);
      }
      
      console.log(this.dtag1)
    })
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.dtag1.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }
  Create():void{
    this.dialogRef.close(this.InputMain);
  }
}