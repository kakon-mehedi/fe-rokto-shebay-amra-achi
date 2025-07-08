import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { DonorListComponent } from './donor-list.component';
import { DonorDetailsDialogComponent } from './donor-details-dialog.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

const routes: Routes = [
  { path: '', component: DonorListComponent }
];

@NgModule({
  declarations: [DonorListComponent, DonorDetailsDialogComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    MatDialogModule,
    MatIconModule,
    MatButtonModule
  ],
  providers: [DatePipe],
  exports: [DonorListComponent]
})
export class DonorListModule {}
