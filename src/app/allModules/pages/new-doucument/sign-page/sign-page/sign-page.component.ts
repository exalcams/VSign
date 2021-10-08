import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { runInThisContext } from 'vm';
import { PopUpReturnData } from './PopUpReturnData.model';
//import { SignaturePadorImgComponent } from '../signature-pador-img/signature-pador-img.component';
import {ThemePalette} from '@angular/material/core';
import { SignProcessOutput } from '../SignProcessOutput.model'


@Component({
  selector: 'app-sign-page',
  templateUrl: './sign-page.component.html',
  styleUrls: ['./sign-page.component.scss']
})
export class SignPageComponent implements OnInit {

  selected1 = 'option2';
  selectedoption: string;
  returndata: string;
  inputfromcustom: string;
   signpopform:FormGroup
  form: FormGroup;
  sgnImg:string;
  sgnSelf:string;
  hideTagField = false;
  sgnAadhar:string;
  sgnToken:string;
  sgnCert:string;
  nofselected:string;
  pageSelection = true;
  multiemail = new FormControl('');
  returnInfo:PopUpReturnData = new PopUpReturnData();
  selfImgData:string;
  selectedUsersForEmail:any[]
  router: any;
 User1=false;
 USer2=false;
 User3=false;
 signpopreturndata:SignProcessOutput = new SignProcessOutput()
 levelusers:any;
// checkForm=new FormGroup({
//   custom: new FormArray([
//     new FormControl('',Validators.required),

//   ])
// });

  constructor(private fb: FormBuilder,private Dialog: MatDialog ,private dialogRef: MatDialogRef<SignPageComponent>, @Inject(MAT_DIALOG_DATA) data) {
  this.levelusers = data.levelusers;
    //  this.sgnAadhar = data.sgnAadhar;
  //  this.sgnCert = data.sgnCert;
  //  this.sgnImg = data.sgnImg;
  //  this.sgnSelf = data.sgnSelf;
  //  this.sgnToken = data.sgnToken;
  //  this.nofselected = data.nofselected
   this.signpopform = this.fb.group({
    position: ['Page'],
    selectedoption:['first'],
    inputfromcustom:[''],
    optedEmailType:['init'],
   
   })
   this.signpopform.get("inputfromcustom").disable();
  }

  ngOnInit() {
    this.signpopform.get("selectedoption").valueChanges.subscribe(x=>{
      if(x==="custom"){
        this.signpopform.get("inputfromcustom").enable();
      }
      else{
        this.signpopform.get("inputfromcustom").disable();
      }
      
    })
    
    
        this.signpopform.get("position").valueChanges.subscribe(x=>{
      if(x==="Page"){
        this.pageSelection = true;
        this.hideTagField = false;
      }
      else if(x==="Tag"){
        this.pageSelection = false;
        this.hideTagField = true;
      }
    })
    // this.form = this.fb.group({
    //   firstpage: [''],
    //   lastpage: [''],
    //   allpages: [''],
    //   custom: ['']

    // });
  }
  userChange(){
    this.selectedUsersForEmail = this.multiemail.value
    console.log(this.selectedUsersForEmail)
    
  }
  signdocument() {
    // this.dialogRef.close();
    console.log(this.selectedoption);
    if(this.signpopform.get("selectedoption").value === "first"){
      this.returndata = "1_";
    }
    else if(this.signpopform.get("selectedoption").value === "last"){
      this.returndata = "last";
    }
    else if(this.signpopform.get("selectedoption").value === "all"){
      this.returndata = "all";
    }
    else{
      this.returndata = this.signpopform.get("inputfromcustom").value+"_";
    }
   
    this.signpopreturndata.sgnPages = this.returndata;
    
  //  this.signpopreturndata.sgnTagName = this.signpopform.get("Tagname").value;
    this.signpopreturndata.sgnLocation = this.signpopform.get("position").value;
    this.signpopreturndata.RecieveEmailConfig = this.signpopform.get("optedEmailType").value
    this.signpopreturndata.RecieveEmailDef = this.selectedUsersForEmail;
    this.dialogRef.close(this.signpopreturndata);
    
   // this.router.navigate(["signing"])
    
  }


  // OpenSignaturePad(){
  //   const dialogconfig = new MatDialogConfig();
  //   dialogconfig.disableClose = false;
  //   dialogconfig.autoFocus = true;
    

  //   const data = this.Dialog.open(SignaturePadorImgComponent, dialogconfig);
  //    data.afterClosed().subscribe(x=>{
  //      this.selfImgData = x;
  //    })
  // }

  dialogRefclose(){
    this.dialogRef.close();
  }
}
