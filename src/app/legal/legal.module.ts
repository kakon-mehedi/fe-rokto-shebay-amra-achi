import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MaterialModule } from '../shared/modules/material.module';

import { TermsComponent } from './components/terms/terms.component';
import { PrivacyComponent } from './components/privacy/privacy.component';

const routes: Routes = [
  {
    path: 'terms',
    component: TermsComponent,
    data: { title: 'শর্তাবলী ও নীতিমালা' }
  },
  {
    path: 'privacy',
    component: PrivacyComponent,
    data: { title: 'গোপনীয়তা নীতি' }
  },
  {
    path: '',
    redirectTo: 'terms',
    pathMatch: 'full'
  }
];

@NgModule({
  declarations: [
    TermsComponent,
    PrivacyComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule.forChild(routes)
  ]
})
export class LegalModule { }
