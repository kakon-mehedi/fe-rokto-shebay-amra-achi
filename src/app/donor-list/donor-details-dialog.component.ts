import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PublicDonorResponse } from '../shared/interfaces/donor.interface';

@Component({
  selector: 'app-donor-details-dialog',
  templateUrl: './donor-details-dialog.component.html',
  styleUrls: ['./donor-details-dialog.component.scss']
})
export class DonorDetailsDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DonorDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public donor: PublicDonorResponse,
    private snackBar: MatSnackBar
  ) {}

  close(): void {
    this.dialogRef.close();
  }

  copyDonorId(): void {
    if (this.donor.donorId) {
      navigator.clipboard.writeText(this.donor.donorId).then(() => {
        this.snackBar.open('ডোনার আইডি কপি করা হয়েছে!', 'বন্ধ করুন', {
          duration: 2000,
          panelClass: ['success-snackbar']
        });
      }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = this.donor.donorId!;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        this.snackBar.open('ডোনার আইডি কপি করা হয়েছে!', 'বন্ধ করুন', {
          duration: 2000,
          panelClass: ['success-snackbar']
        });
      });
    }
  }

  getGenderInBangla(gender: string): string {
    const genderMap: { [key: string]: string } = {
      'male': 'পুরুষ',
      'female': 'নারী',
      'other': 'অন্যান্য'
    };
    return genderMap[gender?.toLowerCase()] || gender || 'অজানা';
  }

  getReligionInBangla(religion: string): string {
    const religionMap: { [key: string]: string } = {
      'islam': 'ইসলাম',
      'hindu': 'হিন্দু',
      'buddhist': 'বৌদ্ধ',
      'christian': 'খ্রিস্টান',
      'other': 'অন্যান্য'
    };
    return religionMap[religion?.toLowerCase()] || religion || 'অজানা';
  }

  getLastDonationText(): string {
    if (!this.donor.lastDonationDate) {
      return 'কোনো তথ্য নেই';
    }
    
    const lastDonation = new Date(this.donor.lastDonationDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - lastDonation.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'আজ';
    } else if (diffDays === 1) {
      return '১ দিন আগে';
    } else if (diffDays < 30) {
      return `${this.convertToBanglaNumber(diffDays)} দিন আগে`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${this.convertToBanglaNumber(months)} মাস আগে`;
    } else {
      const years = Math.floor(diffDays / 365);
      return `${this.convertToBanglaNumber(years)} বছর আগে`;
    }
  }

  getEligibilityIcon(): string {
    if (!this.donor.lastDonationDate) {
      return 'help';
    }
    
    const daysSinceLastDonation = this.getDaysSinceLastDonation();
    return daysSinceLastDonation >= 120 ? 'check_circle' : 'schedule';
  }

  getEligibilityTitle(): string {
    if (!this.donor.lastDonationDate) {
      return 'তথ্য অনুপস্থিত';
    }
    
    const daysSinceLastDonation = this.getDaysSinceLastDonation();
    return daysSinceLastDonation >= 120 ? 'রক্তদানের জন্য উপযুক্ত' : 'অপেক্ষায় থাকুন';
  }

  getEligibilityColor(): string {
    if (!this.donor.lastDonationDate) {
      return '#999';
    }
    
    const daysSinceLastDonation = this.getDaysSinceLastDonation();
    return daysSinceLastDonation >= 120 ? '#4caf50' : '#ff9800';
  }

  private getDaysSinceLastDonation(): number {
    if (!this.donor.lastDonationDate) {
      return 0;
    }
    
    const lastDonation = new Date(this.donor.lastDonationDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - lastDonation.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  private convertToBanglaNumber(num: number): string {
    const banglaNumbers = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return num.toString().split('').map(digit => banglaNumbers[parseInt(digit)] || digit).join('');
  }
}
