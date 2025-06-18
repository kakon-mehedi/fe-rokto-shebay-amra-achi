import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

// Material Modules
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

// Components
import { BloodDonationGuideComponent } from './blood-donation-guide.component';

const routes: Routes = [
  {
    path: '',
    component: BloodDonationGuideComponent
  }
];

@NgModule({
  declarations: [
    BloodDonationGuideComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule
  ]
})
export class BloodDonationGuideModule { }
