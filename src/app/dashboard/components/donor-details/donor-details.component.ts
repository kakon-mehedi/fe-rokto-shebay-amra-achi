import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DonorService } from '../../services/donor-service';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Donor } from '../../interfaces/donor.interface';
import { differenceInMonths, parseISO } from 'date-fns';

@Component({
  selector: 'app-donor-details',
  templateUrl: './donor-details.component.html',
  styleUrls: ['./donor-details.component.scss'],
})
export class DonorDetailsComponent implements OnInit {
  donor: Donor | null = null;
  isLoading = false;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly donorService: DonorService,
    private readonly location: Location,
    private readonly cdr: ChangeDetectorRef,
    private readonly snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const donorId = this.route.snapshot.paramMap.get('id');
    console.log('Donor Details - ID from route:', donorId);
    
    if (donorId) {
      this.loadDonorDetails(donorId);
    } else {
      console.log('No donor ID found in route');
      this.snackBar.open('ডোনার আইডি পাওয়া যায়নি', 'বন্ধ করুন', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
    }
  }

  private loadDonorDetails(donorId: string): void {
    this.isLoading = true;
    
    // First try to get from API
    this.donorService.getDonorById(donorId).subscribe({
      next: (response) => {
        this.isLoading = false;
        console.log('API response:', response);
        if (response.success && response.data) {
          this.donor = response.data;
          console.log('Donor loaded from API:', this.donor);
        } else {
          console.log('API response unsuccessful, trying mock data');
          this.loadFromMockData(donorId);
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.log('API error, trying mock data:', error);
        this.loadFromMockData(donorId);
      }
    });
  }

  private loadFromMockData(donorId: string): void {
    console.log('Loading from mock data for ID:', donorId);
    const mockDonors = this.donorService.getMockDonors();
    this.donor = mockDonors.find(d => d._id === donorId) || null;
    
    if (this.donor) {
      console.log('Donor found in mock data:', this.donor);
    } else {
      console.log('Donor not found in mock data');
      this.snackBar.open('ডোনার পাওয়া যায়নি', 'বন্ধ করুন', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
    }
  }

  goBack(): void {
    this.location.back();
    this.cdr.detectChanges();
  }

  isDonorAvailable(): boolean {
    if (!this.donor?.lastDonationDate) {
      return true; // If no previous donation, available
    }

    const lastDonation = typeof this.donor.lastDonationDate === 'string' 
      ? parseISO(this.donor.lastDonationDate) 
      : this.donor.lastDonationDate;
    return differenceInMonths(new Date(), lastDonation) >= 3;
  }

  getNextDonationDate(): Date | null {
    if (!this.donor?.lastDonationDate) {
      return null;
    }

    const lastDonation = typeof this.donor.lastDonationDate === 'string' 
      ? parseISO(this.donor.lastDonationDate) 
      : this.donor.lastDonationDate;
    const nextDonation = new Date(lastDonation);
    nextDonation.setMonth(nextDonation.getMonth() + 3);

    return nextDonation > new Date() ? nextDonation : null;
  }

  contactDonor(): void {
    if (this.donor?.mobileNumber) {
      console.log('Contacting donor:', this.donor.mobileNumber);
    }
  }

  requestDonation(): void {
    if (this.donor?.name) {
      console.log('Requesting donation from:', this.donor.name);
    }
  }

  callDonor(): void {
    if (this.donor?.mobileNumber) {
      window.open(`tel:${this.donor.mobileNumber}`, '_self');
    }
  }

  sendEmail(): void {
    // Since Donor interface doesn't have email, we'll skip this or use SMS
    this.snackBar.open('ইমেইল ফিচার শীঘ্রই আসছে', 'বন্ধ করুন', {
      duration: 3000
    });
  }

  viewOnMap(): void {
    if (this.donor?.address) {
      const encodedAddress = encodeURIComponent(this.donor.address);
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`,
        '_blank'
      );
    }
  }

  shareDonorInfo(): void {
    if (navigator.share) {
      navigator.share({
        title: `রক্তদাতা: ${this.donor?.name}`,
        text: `রক্তের গ্রুপ: ${this.donor?.bloodGroup}\nমোবাইল: ${this.donor?.mobileNumber}\nঠিকানা: ${this.donor?.address}`,
        url: window.location.href,
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      const donorInfo = `রক্তদাতা: ${this.donor?.name}\nরক্তের গ্রুপ: ${this.donor?.bloodGroup}\nমোবাইল: ${this.donor?.mobileNumber}\nঠিকানা: ${this.donor?.address}`;
      navigator.clipboard.writeText(donorInfo).then(() => {
        alert('ডোনারের তথ্য কপি করা হয়েছে!');
      });
    }
  }
}