import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// Angular CDK
import { LayoutModule } from '@angular/cdk/layout';

// Angular Material Imports
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';

// Components
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { AdminLayoutComponent } from './components/admin-layout/admin-layout.component';
import { DonorManagementComponent } from './components/donor-management/donor-management.component';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { DashboardStatsComponent } from './components/dashboard-stats/dashboard-stats.component';
import { AddEditDonorDialogComponent } from './components/add-edit-donor-dialog/add-edit-donor-dialog.component';
import { DonorDetailsModalComponent } from './components/donor-details-modal/donor-details-modal.component';
import { AdminProfileComponent } from './components/admin-profile/admin-profile.component';
import { TeamMemberManagementComponent } from './components/team-member-management/team-member-management.component';

// Shared Module
import { SharedModule } from '../shared/shared.module';

// Guards (temporarily removed until auth is properly implemented)
// import { AdminGuard } from '../shared/guards/admin.guard';

const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    // canActivate: [AdminGuard], // Temporarily disabled
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'donors', component: DonorManagementComponent },
      { path: 'users', component: UserManagementComponent },
      { path: 'team-members', component: TeamMemberManagementComponent },
      { path: 'profile', component: AdminProfileComponent },
    ]
  }
];

@NgModule({
  declarations: [
    AdminDashboardComponent,
    AdminLayoutComponent,
    DonorManagementComponent,
    UserManagementComponent,
    DashboardStatsComponent,
    AddEditDonorDialogComponent,
    DonorDetailsModalComponent,
    AdminProfileComponent,
    TeamMemberManagementComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    
    // Angular CDK
    LayoutModule,
    
    // Angular Material
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatBadgeModule,
    MatTooltipModule,
    MatMenuModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSlideToggleModule,
    MatCheckboxModule
  ]
})
export class AdminModule { }
