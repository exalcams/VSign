import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import {
    MatIconRegistry,
    MatSnackBar,
    MatTableDataSource,
    MatPaginator,
    MatSort,
    MatTabChangeEvent
} from '@angular/material';
import { Router } from '@angular/router';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { SnackBarStatus } from 'app/notifications/notification-snack-bar/notification-snackbar-status-enum';
import { AuthenticationDetails } from 'app/models/master';
import { fuseAnimations } from '@fuse/animations';
import { DashboardService } from 'app/services/dashboard.service';
import { ShareParameterService } from 'app/services/share-parameters.service';
import { SelectionModel } from '@angular/cdk/collections';
import { Guid } from 'guid-typescript';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class DashboardComponent implements OnInit {
    authenticationDetails: AuthenticationDetails;
    currentUserID: Guid;
    currentUserRole: string;
    MenuItems: string[];
    isProgressBarVisibile: boolean;
    notificationSnackBarComponent: NotificationSnackBarComponent;
    displayedColumns: string[] = [
        'INV_NO',
        'INV_DATE',
        'INV_TYPE',
        'PLANT',
        'VEHICLE_NO',
        'VEHICLE_CAPACITY',
        'FWD_AGENT',
        'CARRIER',
        'EWAYBILL_NO',
        'EWAYBILL_DATE',
        'PROPOSED_DELIVERY_DATE',
        'ACTUAL_DELIVERY_DATE'
    ];
    dataSource = new MatTableDataSource<any>();
    selection = new SelectionModel<any>(true, []);
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(
        private _router: Router,
        private _dashboardService: DashboardService,
        private _shareParameterService: ShareParameterService,
        public snackBar: MatSnackBar
    ) {
        this.isProgressBarVisibile = false;
        this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
    }

    ngOnInit(): void {
        // Retrive authorizationData
        const retrievedObject = localStorage.getItem('authorizationData');
        if (retrievedObject) {
            this.authenticationDetails = JSON.parse(retrievedObject) as AuthenticationDetails;
            this.currentUserID = this.authenticationDetails.UserID;
            this.currentUserRole = this.authenticationDetails.UserRole;
            this.MenuItems = this.authenticationDetails.MenuItemNames.split(',');
            if (this.MenuItems.indexOf('Dashboard') < 0) {
                this.notificationSnackBarComponent.openSnackBar('SuccessFully Logged In', SnackBarStatus.success
                );
                // this._router.navigate(['/auth/login']);
            }
        } else {
            this.notificationSnackBarComponent.openSnackBar('You Dont have the access', SnackBarStatus.danger);
        }
    }

    applyFilter(filterValue: string): void {
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }



}
