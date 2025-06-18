import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { DashboardDefaultComponent } from './components/dashboard-default/dashboard-default.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DonorDetailsComponent } from './components/donor-details/donor-details.component';

const routes:Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: DashboardDefaultComponent

  },
  {
    path: 'details/:id',
    pathMatch: 'full',
    component: DonorDetailsComponent

  }
]

@NgModule({
  declarations: [DashboardDefaultComponent, DonorDetailsComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class DashboardModule { 
  constructor(){
    console.log('Dashboard module run')
  }
}
