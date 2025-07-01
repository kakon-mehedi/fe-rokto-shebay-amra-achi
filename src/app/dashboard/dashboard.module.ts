import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { DashboardDefaultComponent } from './components/dashboard-default/dashboard-default.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DonorDetailsComponent } from './components/donor-details/donor-details.component';
import { AddDonorComponent } from './components/add-donor/add-donor.component';
import { DonorProfileDashboardComponent } from './components/donor-profile-dashboard/donor-profile-dashboard.component';
import { DonorPendingComponent } from './components/donor-pending/donor-pending.component';
import { DonorProfileEditComponent } from './components/donor-profile-edit/donor-profile-edit.component';
import { DonorChangePasswordComponent } from './components/donor-change-password/donor-change-password.component';
import { DonorAuthGuard } from '../shared/guards/donor-auth.guard';
import { AuthGuard } from '../shared/guards/auth.guard';

const routes:Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: DonorProfileDashboardComponent,
    canActivate: [DonorAuthGuard],
    data: { title: 'দাতা ড্যাশবোর্ড' }
  },
  {
    path: 'profile',
    component: DonorProfileDashboardComponent,
    canActivate: [DonorAuthGuard],
    data: { title: 'দাতার প্রোফাইল' }
  },
  {
    path: 'pending',
    component: DonorPendingComponent,
    canActivate: [DonorAuthGuard],
    data: { title: 'অনুমোদনের অপেক্ষায়' }
  },
  {
    path: 'profile/edit',
    component: DonorProfileEditComponent,
    canActivate: [DonorAuthGuard],
    data: { title: 'প্রোফাইল সম্পাদনা' }
  },
  {
    path: 'profile/change-password',
    component: DonorChangePasswordComponent,
    canActivate: [DonorAuthGuard],
    data: { title: 'পাসওয়ার্ড পরিবর্তন' }
  },
  {
    path: 'admin',
    component: DashboardDefaultComponent,
    canActivate: [AuthGuard],
    data: { title: 'অ্যাডমিন ড্যাশবোর্ড' }
  },
  {
    path: 'admin/add',
    component: AddDonorComponent,
    canActivate: [AuthGuard],
    data: { title: 'দাতা যোগ করুন' }
  },
  {
    path: 'admin/edit/:id',
    component: AddDonorComponent,
    canActivate: [AuthGuard],
    data: { title: 'দাতা সম্পাদনা' }
  },
  {
    path: 'admin/details/:id',
    component: DonorDetailsComponent,
    canActivate: [AuthGuard],
    data: { title: 'দাতার বিস্তারিত' }
  }
]

@NgModule({
  declarations: [
    DashboardDefaultComponent, 
    DonorDetailsComponent,
    AddDonorComponent,
    DonorProfileDashboardComponent,
    DonorPendingComponent,
    DonorProfileEditComponent,
    DonorChangePasswordComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule
  ]
})
export class DashboardModule { 
  constructor(){
    console.log('Dashboard module run')
  }
}
