import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-attachmentview',
  templateUrl: './attachmentview.component.html',
  styleUrls: ['./attachmentview.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class AttachmentviewComponent implements OnInit {
  public AttachmentData: any;
  constructor(
    public matDialogRef: MatDialogRef<AttachmentviewComponent>,
    @Inject(MAT_DIALOG_DATA) public attachmentDetails: any,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    const fileURL = URL.createObjectURL(this.attachmentDetails.blob);
    this.AttachmentData = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
  }

  CloseClicked(): void {
    this.matDialogRef.close(null);
  }
  

}
