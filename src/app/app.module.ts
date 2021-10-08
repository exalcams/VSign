import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import {
    MatButtonModule, MatIconModule, MatSnackBar,MatAutocomplete, MatSnackBarModule, MatDialogModule, MatToolbarModule,
    MAT_DATE_LOCALE, MatProgressSpinnerModule, MatProgressBarModule, MatExpansionModule, MatTableModule, MatFormFieldModule, MatAutocompleteModule, MatBadgeModule, MatBottomSheetModule, MatButtonToggleModule, MatCardModule, MatCheckboxModule, MatChipsModule, MatStepperModule, MatDividerModule, MatGridListModule, MatInputModule, MatListModule, MatMenuModule, MatPaginatorModule, MatRadioModule, MatRippleModule, MatSelectModule, MatSidenavModule, MatSliderModule, MatSlideToggleModule, MatSortModule, MatTabsModule, MatTooltipModule
} from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';
import 'hammerjs';
import { VsignMainComponent } from './vsign-main/vsign-main.component';
// import { PdfViewerModule } from '';

import { FuseModule } from '@fuse/fuse.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseProgressBarModule, FuseSidebarModule, FuseThemeOptionsModule } from '@fuse/components';

import { fuseConfig } from 'app/fuse-config';

import { AppComponent } from 'app/app.component';
import { LayoutModule } from 'app/layout/layout.module';
import { NotificationSnackBarComponent } from './notifications/notification-snack-bar/notification-snack-bar.component';
import { DatePipe } from '@angular/common';
import { NotificationDialogComponent } from './notifications/notification-dialog/notification-dialog.component';
import { WINDOW_PROVIDERS } from './window.providers';
import {FlexLayoutModule, BREAKPOINT} from '@angular/flex-layout';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { HistorypopupComponent } from './historypopup/historypopup/historypopup.component';
import { EmailComponent } from './email/email.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
// import { SigndocumentComponent } from './allModules/pages/digital-signing/signdocument/signdocument.component';
// import { OwnerRemarksComponent } from './allModules/pages/digital-signing/owner-remarks/owner-remarks.component';
// import { SignaturePadorImgComponent } from './allModules/pages/digital-signing/signature-pador-img/signature-pador-img.component';
// import {​​​​​​​​ SignaturePadModule }​​​​​​​​ from'angular2-signaturepad';
const appRoutes: Routes = [
    {
        path: 'auth',
        loadChildren: './allModules/authentication/authentication.module#AuthenticationModule'
    },
    {
        path: 'pages',
        loadChildren: './allModules/pages/pages.module#PagesModule'
    },
    {
        path: 'master',
        loadChildren: './allModules/master/master.module#MasterModule'
    },
    {
        path: 'reports',
        loadChildren: './allModules/reports/reports.module#ReportsModule'
    },
    {
        path: 'audit',
        loadChildren: './allModules/audit/audit.module#AuditModule'
    },
    {
        path: '**',
        redirectTo: 'auth/login'
    },
];

@NgModule({
    declarations: [
        AppComponent,
        NotificationSnackBarComponent,
        NotificationDialogComponent,
        VsignMainComponent,
        HistorypopupComponent,
        EmailComponent
        // SigndocumentComponent,
        // OwnerRemarksComponent,
        // SignaturePadorImgComponent
    ],
    imports: [
        FlexLayoutModule,
        // SignaturePadModule,
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        RouterModule.forRoot(appRoutes, { preloadingStrategy: PreloadAllModules, useHash: true }),

        TranslateModule.forRoot(),

        // PdfViewerModule,
        // Material moment date module
        MatMomentDateModule,
        MatButtonModule,
        MatIconModule,
        MatSnackBarModule,
        MatDialogModule,
        MatToolbarModule,
        MatExpansionModule,
        MatAutocompleteModule,
    
        MatFormFieldModule,
        MatAutocompleteModule,
        
        MatBadgeModule,
        MatBottomSheetModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatCardModule,
        MatCheckboxModule,
        MatChipsModule,
        MatStepperModule,
        MatDatepickerModule,
        MatDialogModule,
        MatDividerModule,
        MatExpansionModule,
        MatGridListModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatMenuModule,
        MatNativeDateModule,
        MatPaginatorModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        MatRadioModule,
        MatRippleModule,
        MatSelectModule,
        MatSidenavModule,
        MatSliderModule,
        MatSlideToggleModule,
        MatSnackBarModule,
        MatSortModule,
        MatTableModule,
        MatTabsModule,
        MatToolbarModule,
        MatTooltipModule,
        

        // Fuse modules
        FuseModule.forRoot(fuseConfig),
        FuseProgressBarModule,
        FuseSharedModule,
        FuseSidebarModule,
        FuseThemeOptionsModule,

        // App modules
        LayoutModule,
    ],
    providers: [
        DatePipe,
        WINDOW_PROVIDERS,
        {provide: MAT_DATE_LOCALE, useValue: 'en-IN'}
    ],
    bootstrap: [
        AppComponent
    ],
    entryComponents: [
        NotificationDialogComponent,
        HistorypopupComponent
        // SigndocumentComponent,
        // OwnerRemarksComponent,
        // SignaturePadorImgComponent
    ],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule {
}
