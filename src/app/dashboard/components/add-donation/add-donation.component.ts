import { Component, Inject, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DonorService } from '../../../shared/services/donor.service';

@Component({
  selector: 'app-add-donation',
  templateUrl: './add-donation.component.html',
  styleUrls: ['./add-donation.component.scss']
})
export class AddDonationComponent {
  donationForm: FormGroup;
  isLoading = false;
  donorId?: string; // Optional donor ID for admin use

  constructor(
    private fb: FormBuilder,
    private donorService: DonorService,
    private dialogRef: MatDialogRef<AddDonationComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data?: { donorId: string }
  ) {
    // If data is provided (admin mode), use the donorId
    this.donorId = data?.donorId;
    
    this.donationForm = this.fb.group({
      lastDonationDate: [new Date(), Validators.required],
      location: ['', Validators.required],
      notes: ['']
    });
  }

  onSubmit() {
    if (this.donationForm.valid) {
      this.isLoading = true;
      const donationData = this.donationForm.value;
      
      // Check if this is admin mode (with donorId) or donor self-update mode
      if (this.donorId) {
        // Admin mode: update specific donor's donation
        this.donorService.updateDonationAsAdmin(this.donorId, donationData).subscribe({
          next: (response) => {
            console.log('Donation added successfully (admin mode):', response);
            this.dialogRef.close(true);
          },
          error: (error) => {
            console.error('Error adding donation (admin mode):', error);
            this.isLoading = false;
          }
        });
      } else {
        // Donor mode: update own donation using auth token
        this.donorService.updateOwnDonation(donationData).subscribe({
          next: (response) => {
            console.log('Donation added successfully (donor mode):', response);
            this.dialogRef.close(true);
          },
          error: (error) => {
            console.error('Error adding donation (donor mode):', error);
            this.isLoading = false;
          }
        });
      }
    }
  }

  onCancel() {
    this.dialogRef.close(false);
  }
}
