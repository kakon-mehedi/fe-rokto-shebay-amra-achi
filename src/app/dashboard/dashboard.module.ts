import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { DashboardDefaultComponent } from './components/dashboard-default/dashboard-default.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DonorDetailsComponent } from './components/donor-details/donor-details.component';
import { AddDonorComponent } from './components/add-donor/add-donor.component';

const routes:Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: DashboardDefaultComponent
  },
  {
    path: 'add',
    component: AddDonorComponent
  },
  {
    path: 'edit/:id',
    component: AddDonorComponent  // Reuse the same component for editing
  },
  {
    path: 'details/:id',
    component: DonorDetailsComponent
  }
]

@NgModule({
  declarations: [
    DashboardDefaultComponent, 
    DonorDetailsComponent,
    AddDonorComponent
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
