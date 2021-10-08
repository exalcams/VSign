import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FuseSidebarModule } from '@fuse/components';
import { FuseSearchBarModule, FuseShortcutsModule } from '@fuse/components';
// import { NewDoucumentComponent } from './new-doucument/new-doucument.component';
// import { FuseSharedModule } from '@fuse/shared.module';

// import { PdfViewerModule } from 'ng2-pdf-viewer';
import {
    MatButtonModule, MatIconModule, MatSnackBar,MatAutocomplete, MatSnackBarModule, MatDialogModule, MatToolbarModule,
    MAT_DATE_LOCALE, MatProgressSpinnerModule, MatProgressBarModule, MatExpansionModule, MatTableModule, MatFormFieldModule, MatAutocompleteModule, MatBadgeModule, MatBottomSheetModule, MatButtonToggleModule, MatCardModule, MatCheckboxModule, MatChipsModule, MatStepperModule, MatDividerModule, MatGridListModule, MatInputModule, MatListModule, MatMenuModule, MatPaginatorModule, MatRadioModule, MatRippleModule, MatSelectModule, MatSidenavModule, MatSliderModule, MatSlideToggleModule, MatSortModule, MatTabsModule, MatTooltipModule
} from '@angular/material';
import {MatTreeModule} from '@angular/material/tree';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
// import { NgxUploaderModule } from 'ngx-uploader';
import {
    FuseCountdownModule,
    FuseHighlightModule, 
    FuseMaterialColorPickerModule,
    FuseWidgetModule
} from '@fuse/components';

import { FuseSharedModule } from '@fuse/shared.module';
import { FormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard/dashboard.component';
import {NgApexchartsModule} from 'ng-apexcharts';
import { DecimalPipe } from '@angular/common';
import { DocumentCenterComponent } from './document-center/document-center.component';
import {FlexLayoutModule, BREAKPOINT} from '@angular/flex-layout';
// import { NewDoucumentComponent } from '../new-doucument/new-doucument.component';
// import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgxFileDropModule } from 'ngx-file-drop';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
// import { MatDatepickerModule, MatMomentDateModule } from '@coachcare/datepicker';
import { DigitalSigningComponent } from './digital-signing/digital-signing.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import {​​​​​​​​ SignaturePadModule }​​​​​​​​ from'angular2-signaturepad';
import { NgxUploaderModule } from 'ngx-uploader';
import { OwnerRemarksComponent } from './digital-signing/owner-remarks/owner-remarks.component';
// import { DragDropModule } from '@angular/cdk/drag-drop';
 
import { SigndocumentComponent } from './/digital-signing/signdocument/signdocument.component';
import {SignaturePadorImgComponent} from './digital-signing/signature-pador-img/signature-pador-img.component';
import { GeardialogComponent } from './new-doucument/geardialog/geardialog.component';
import { RepositoryComponent } from './repository/repository.component';
import { CreatedialogComponent } from './repository/createdialog/createdialog.component';
import { SearchdocumentComponent } from './searchdocument/searchdocument.component';
import { AadhardocumentsComponent } from './digital-signing/aadhardocuments/aadhardocuments.component';
import { AttachmentviewComponent } from './new-doucument/attachmentview/attachmentview.component';
import { NewDoucumentComponent } from './new-doucument/new-doucument.component';
import { CursorSignPageComponent } from './digital-signing/cursor-sign-page/cursor-sign-page.component';
import { TagdocumentComponent } from './digital-signing/tagdocument/tagdocument.component';
import { OutboxComponent } from '../pages/outbox/outbox.component';
import { SignPageComponent } from './new-doucument/sign-page/sign-page/sign-page.component';
import { EmailComponent } from 'app/email/email.component';
// import { NgxSpinnerModule } from "ngx-spinner";


const routes = [
    {
        path: 'dashboard',
        component: DashboardComponent
    },
    {
        path: 'center',
        component: DocumentCenterComponent
    },
    {
        path: 'create',
        component: NewDoucumentComponent
    },
    {
        path: 'sign',
        component: DigitalSigningComponent
    },
    {
        path: 'repo',
        component: RepositoryComponent
    },
    {
        path: 'output',
        component: OutboxComponent
    },
    {
        path: 'search',
        component: SearchdocumentComponent
    },
    {
        path: 'cursor',
        component: CursorSignPageComponent
    },
    {
        path: 'email',
        component: EmailComponent
    },
    {
        path: '**',
        redirectTo: '/auth/login'
    }
];

@NgModule({
    imports: [
        // NgxDropzoneModule,
        NgxFileDropModule,
        // NgxSpinnerModule,
        NgxUploaderModule,
        MatMomentDateModule ,
        FuseSearchBarModule,
        FuseShortcutsModule,
        DragDropModule,
        RouterModule.forChild(routes),
        FlexLayoutModule,
        // PdfViewerModule,
        // HttpClientModule,
        // TranslateModule,
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
        MatTreeModule,
        // NgxUploaderModule,
        SignaturePadModule,
        NgxChartsModule,

        FuseSharedModule,
        FuseSidebarModule,

        FuseCountdownModule,
        FuseHighlightModule,
        FuseMaterialColorPickerModule,
        FuseWidgetModule,
        NgApexchartsModule,
        FormsModule
    ],
    declarations: [DashboardComponent,
        DocumentCenterComponent,NewDoucumentComponent,DigitalSigningComponent,
        OwnerRemarksComponent,SigndocumentComponent,
        SignaturePadorImgComponent,
        GeardialogComponent,
        RepositoryComponent,
        CreatedialogComponent,
        SearchdocumentComponent,
        AadhardocumentsComponent,
        AttachmentviewComponent,
        CursorSignPageComponent,
        TagdocumentComponent,
        OutboxComponent,
        SignPageComponent,
        EmailComponent
        ],
    providers: [
        DecimalPipe
    ],
    entryComponents: [SigndocumentComponent,
        OwnerRemarksComponent,
        SignaturePadorImgComponent,TagdocumentComponent,
        GeardialogComponent,CreatedialogComponent,AadhardocumentsComponent,AttachmentviewComponent,SignPageComponent,CursorSignPageComponent],
        // schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class PagesModule { }
