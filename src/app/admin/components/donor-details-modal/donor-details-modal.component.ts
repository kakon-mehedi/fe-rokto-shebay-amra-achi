import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DonorService } from '../../../shared/services/donor.service';
import { AdminDonorResponse, ApiResponse } from '../../../shared/interfaces/donor.interface';

@Component({
  selector: 'app-donor-details-modal',
  templateUrl: './donor-details-modal.component.html',
  styleUrls: ['./donor-details-modal.component.scss']
})
export class DonorDetailsModalComponent implements OnInit {
  donor: AdminDonorResponse | null = null;
  isLoading = false;
  error: string | null = null;

  constructor(
    public dialogRef: MatDialogRef<DonorDetailsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { donorId: string },
    private donorService: DonorService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadDonorDetails();
  }

  loadDonorDetails() {
    this.isLoading = true;
    this.error = null;

    this.donorService.getDonorDetailsForAdmin(this.data.donorId).subscribe({
      next: (response: ApiResponse<AdminDonorResponse>) => {
        if (response.success) {
          this.donor = response.data;
          this.isLoading = false;
        } else {
          this.error = 'ডেটা লোড করতে সমস্যা হয়েছে';
          this.isLoading = false;
        }
      },
      error: (error) => {
        console.error('Error loading donor details:', error);
        this.error = 'সার্ভার থেকে ডেটা আনতে সমস্যা হয়েছে';
        this.isLoading = false;
      }
    });
  }

  // Phone number actions
  copyPhoneNumber(phone: string) {
    navigator.clipboard.writeText(phone).then(() => {
      this.snackBar.open('ফোন নম্বর কপি হয়েছে', 'বন্ধ করুন', {
        duration: 3000,
        panelClass: ['success-snackbar']
      });
    }).catch(() => {
      this.snackBar.open('কপি করতে সমস্যা হয়েছে', 'বন্ধ করুন', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
    });
  }

  callPhoneNumber(phone: string) {
    window.open(`tel:${phone}`, '_self');
  }

  // Email actions
  copyEmail(email: string) {
    navigator.clipboard.writeText(email).then(() => {
      this.snackBar.open('ইমেইল কপি হয়েছে', 'বন্ধ করুন', {
        duration: 3000,
        panelClass: ['success-snackbar']
      });
    });
  }

  sendEmail(email: string) {
    window.open(`mailto:${email}`, '_self');
  }

  // Address actions
  copyAddress(address: string) {
    navigator.clipboard.writeText(address).then(() => {
      this.snackBar.open('ঠিকানা কপি হয়েছে', 'বন্ধ করুন', {
        duration: 3000,
        panelClass: ['success-snackbar']
      });
    });
  }

  openMaps(address: string) {
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
  }

  // Donor ID copy action
  copyDonorId(id: string) {
    navigator.clipboard.writeText(id).then(() => {
      this.snackBar.open('ডোনার আইডি কপি হয়েছে', 'বন্ধ করুন', {
        duration: 3000,
        panelClass: ['success-snackbar']
      });
    }).catch(() => {
      this.snackBar.open('কপি করতে সমস্যা হয়েছে', 'বন্ধ করুন', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
    });
  }

  // Helper methods
  getStatusClass(status: string): string {
    switch (status) {
      case 'ACTIVE': return 'status-active';
      case 'PENDING': return 'status-pending';
      case 'SUSPENDED': return 'status-suspended';
      default: return '';
    }
  }

  getEligibilityClass(status: string): string {
    switch (status) {
      case 'ELIGIBLE': return 'eligibility-eligible';
      case 'TEMPORARILY_INELIGIBLE': return 'eligibility-not-eligible';
      case 'UNKNOWN': return 'eligibility-unknown';
      default: return '';
    }
  }

  getStatusLabel(status: string): string {
    const statusMap = {
      'ACTIVE': 'সক্রিয়',
      'PENDING': 'অপেক্ষমাণ',
      'SUSPENDED': 'স্থগিত'
    };
    return statusMap[status as keyof typeof statusMap] || status;
  }

  getEligibilityLabel(status: string): string {
    const eligibilityMap = {
      'ELIGIBLE': 'যোগ্য',
      'TEMPORARILY_INELIGIBLE': 'অযোগ্য',
      'UNKNOWN': 'অজানা'
    };
    return eligibilityMap[status as keyof typeof eligibilityMap] || status;
  }

  getGenderLabel(gender: string): string {
    const genderMap = {
      'Male': 'পুরুষ',
      'Female': 'নারী',
      'Other': 'অন্যান্য'
    };
    return genderMap[gender as keyof typeof genderMap] || gender;
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('bn-BD');
  }

  calculateAge(dateOfBirth: string): number {
    if (!dateOfBirth) return 0;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }

  getDaysSinceLastDonation(dateString: string): number {
    if (!dateString) return 0;
    const lastDonation = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - lastDonation.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  close() {
    this.dialogRef.close();
  }
}
