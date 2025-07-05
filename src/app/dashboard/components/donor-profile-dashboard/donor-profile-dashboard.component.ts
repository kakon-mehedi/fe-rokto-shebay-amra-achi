import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DonorService } from '../../../shared/services/donor.service';
import { 
  DonorResponse, 
  DonationRecord, 
  EligibilityCheck 
} from '../../../shared/interfaces/donor.interface';

@Component({
  selector: 'app-donor-profile-dashboard',
  templateUrl: './donor-profile-dashboard.component.html',
  styleUrls: ['./donor-profile-dashboard.component.scss']
})
export class DonorProfileDashboardComponent implements OnInit {
  donorProfile: DonorResponse | null = null;
  donationHistory: DonationRecord[] = [];
  eligibilityResult: EligibilityCheck | null = null;
  isLoading = false;
  isEligibilityLoading = false;

  // Stats
  totalDonations = 0;
  nextEligibleDate: Date | null = null;
  lastDonationDate: Date | null = null;

  constructor(
    private donorService: DonorService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadDonorProfile();
    this.loadDonationHistory();
    this.checkEligibility();
  }

  loadDonorProfile(): void {
    this.isLoading = true;
    this.donorService.getCurrentProfile().subscribe({
      next: (response: any) => {
        this.donorProfile = response.data;
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading donor profile:', error);
        this.snackBar.open('প্রোফাইল লোড করতে সমস্যা হয়েছে', 'বন্ধ করুন', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
        this.isLoading = false;
      }
    });
  }

  loadDonationHistory(): void {
    this.donorService.getDonationHistory().subscribe({
      next: (response: any) => {
        this.donationHistory = response.data || [];
        this.totalDonations = this.donationHistory.length;
        if (this.donationHistory.length > 0) {
          this.lastDonationDate = new Date(this.donationHistory[0].donationDate);
        }
      },
      error: (error: any) => {
        console.error('Error loading donation history:', error);
        this.snackBar.open('দান ইতিহাস লোড করতে সমস্যা হয়েছে', 'বন্ধ করুন', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
      }
    });
  }

  checkEligibility(): void {
    this.isEligibilityLoading = true;
    this.donorService.checkEligibility().subscribe({
      next: (response: any) => {
        this.eligibilityResult = response.data || response;
        if (this.eligibilityResult?.nextEligibleDate) {
          this.nextEligibleDate = new Date(this.eligibilityResult.nextEligibleDate);
        }
        this.isEligibilityLoading = false;
      },
      error: (error: any) => {
        console.error('Error checking eligibility:', error);
        this.isEligibilityLoading = false;
      }
    });
  }

  updateProfile(): void {
    this.router.navigate(['/dashboard/profile/edit']);
  }

  changePassword(): void {
    this.router.navigate(['/dashboard/profile/change-password']);
  }

  logout(): void {
    this.donorService.logout().subscribe({
      next: () => {
        this.snackBar.open('সফলভাবে লগআউট হয়েছে', 'বন্ধ করুন', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Logout error:', error);
        // Clear local storage anyway
        localStorage.removeItem('donorToken');
        this.router.navigate(['/']);
      }
    });
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'pending':
        return 'অনুমোদনের অপেক্ষায়';
      case 'active':
        return 'সক্রিয়';
      case 'inactive':
        return 'নিষ্ক্রিয়';
      case 'suspended':
        return 'স্থগিত';
      default:
        return status;
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'pending':
        return 'status-pending';
      case 'active':
        return 'status-active';
      case 'inactive':
        return 'status-inactive';
      case 'suspended':
        return 'status-suspended';
      default:
        return '';
    }
  }

  getGenderText(gender: string): string {
    switch (gender) {
      case 'male':
        return 'পুরুষ';
      case 'female':
        return 'মহিলা';
      case 'other':
        return 'অন্যান্য';
      default:
        return gender;
    }
  }

  getReligionText(religion: string): string {
    switch (religion) {
      case 'islam':
        return 'ইসলাম';
      case 'hinduism':
        return 'হিন্দু';
      case 'christianity':
        return 'খ্রিস্টান';
      case 'buddhism':
        return 'বৌদ্ধ';
      case 'other':
        return 'অন্যান্য';
      default:
        return religion;
    }
  }

  getEligibilityStatusClass(status: string): string {
    switch (status) {
      case 'ELIGIBLE':
        return 'eligible';
      case 'TEMPORARILY_INELIGIBLE':
        return 'temporarily-ineligible';
      case 'PERMANENTLY_INELIGIBLE':
        return 'permanently-ineligible';
      case 'PENDING':
        return 'pending';
      default:
        return 'unknown';
    }
  }

  getEligibilityStatusText(status: string): string {
    switch (status) {
      case 'ELIGIBLE':
        return 'রক্তদানের জন্য যোগ্য';
      case 'TEMPORARILY_INELIGIBLE':
        return 'সাময়িকভাবে অযোগ্য';
      case 'PERMANENTLY_INELIGIBLE':
        return 'স্থায়ীভাবে অযোগ্য';
      case 'PENDING':
        return 'যোগ্যতা নির্ধারণের অপেক্ষায়';
      default:
        return 'অজানা অবস্থা';
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('bn-BD', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
