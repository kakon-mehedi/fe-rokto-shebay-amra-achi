import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PublicDonorResponse } from '../shared/interfaces/donor.interface';

@Component({
  selector: 'app-donor-details-dialog',
  templateUrl: './donor-details-dialog.component.html',
  styleUrls: ['./donor-details-dialog.component.scss']
})
export class DonorDetailsDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DonorDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public donor: PublicDonorResponse
  ) {}

  close(): void {
    this.dialogRef.close();
  }
}
