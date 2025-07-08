import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { EmergencyContactComponent } from './components/emergency-contact/emergency-contact.component';

const routes: Routes = [
  {
    path: '',
    component: EmergencyContactComponent
  }
];

@NgModule({
  declarations: [
    EmergencyContactComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class EmergencyModule { }
