import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vsign-main',
  templateUrl: './vsign-main.component.html',
  styleUrls: ['./vsign-main.component.scss']
})
export class VsignMainComponent implements OnInit {

  flag: boolean = false;
  flagsign: boolean = false;
  flagdoc: boolean = false;
  title = 'vsigned';
  constructor(private router: Router) { }
  // tslint:disable-next-line:use-lifecycle-interface
  ngOnInit(): void {
    this.flag = true;
  }
  dashboard(): void {
    this.router.navigate(['dashboard']);
    this.flag = true;
    this.flagsign = false;
    this.flagdoc = false;
  }
  document(): void {
    this.router.navigate(['document']);
    this.flagdoc = true;
    this.flag = false;
    this.flagsign = false;
  }
  signing(): void {
    this.router.navigate(['signing']);
    this.flagsign = true;
    this.flag = false;
    this.flagdoc = false;

  }
}
