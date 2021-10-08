import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {
    // tslint:disable-next-line:max-line-length
    MatButtonModule, MatCardModule, MatFormFieldModule, MatIconModule, MatInputModule, MatSelectModule,
    MatStepperModule, MatListModule, MatMenuModule, MatRadioModule, MatSidenavModule, MatToolbarModule,
    MatProgressSpinnerModule, MatTooltipModule, MatDatepickerModule, MatTableModule, MatPaginatorModule
} from '@angular/material';

import { FuseSharedModule } from '@fuse/shared.module';
import { FileUploadModule } from 'ng2-file-upload';
import { MenuAppComponent } from './menu-app/menu-app.component';
import { RoleComponent } from './role/role.component';
import { UserComponent } from './user/user.component';
import { ReasonComponent } from './reason/reason.component';
import { UserPreferencesComponent } from './user-preferences/user-preferences.component';
import { FuseMaterialColorPickerModule } from '@fuse/components';
import { LogComponent } from '../authentication/log/log.component';
import { MenuAppMainContentComponent } from './menu-app/menu-app-main-content/menu-app-main-content.component';
import { MenuAppSideBarComponent } from './menu-app/menu-app-side-bar/menu-app-side-bar.component';
import { UserMainContentComponent } from './user/user-main-content/user-main-content.component';
import { UserSideBarComponent } from './user/user-side-bar/user-side-bar.component';
import { RoleMainContentComponent } from './role/role-main-content/role-main-content.component';
import { RoleSideBarComponent } from './role/role-side-bar/role-side-bar.component';


const menuRoutes: Routes = [
    {
        path: 'menuApp',
        component: MenuAppComponent,
    },
    {
        path: 'role',
        component: RoleComponent,
    },
    {
        path: 'log',
        component: LogComponent,
    },
    {
        path: 'user',
        component: UserComponent,
    },
    {
        path: 'reason',
        component: ReasonComponent,
    },
    {
        path:'userpreferences',
        component:UserPreferencesComponent
    }
];
@NgModule({
    declarations: [
        UserComponent,
        RoleComponent,
        LogComponent,
        MenuAppComponent,
        ReasonComponent,
        MenuAppMainContentComponent,
        MenuAppSideBarComponent,
        UserMainContentComponent,
        UserSideBarComponent,
        UserPreferencesComponent,
        RoleMainContentComponent,
        RoleSideBarComponent
    ],
    imports: [
        MatButtonModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatSelectModule,
        MatDatepickerModule,
        MatTableModule,
        MatPaginatorModule,
        MatStepperModule,
        MatProgressSpinnerModule,
        MatListModule,
        MatMenuModule,
        MatRadioModule,
        MatSidenavModule,
        MatToolbarModule,
        MatTooltipModule,
        FuseSharedModule,
        FileUploadModule,
        FuseMaterialColorPickerModule,
        RouterModule.forChild(menuRoutes)
    ],
    providers: [

    ]
})
export class MasterModule {
}

