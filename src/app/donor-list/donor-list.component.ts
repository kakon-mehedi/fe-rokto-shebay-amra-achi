import { Component, OnInit } from '@angular/core';
import { DonorService } from '../shared/services/donor.service';
import { PublicDonorResponse } from '../shared/interfaces/donor.interface';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BANGLADESH_DISTRICTS, BLOOD_GROUPS } from '../shared/data/bangladesh-data';
import { MatDialog } from '@angular/material/dialog';
import { DonorDetailsDialogComponent } from './donor-details-dialog.component';

@Component({
  selector: 'app-donor-list',
  templateUrl: './donor-list.component.html',
  styleUrls: ['./donor-list.component.scss']
})
export class DonorListComponent implements OnInit {
  donors: PublicDonorResponse[] = [];
  isLoading = true;
  error: string | null = null;
  filterForm: FormGroup;
  BANGLADESH_DISTRICTS = BANGLADESH_DISTRICTS;
  BLOOD_GROUPS = BLOOD_GROUPS;
  selectedDistrict: string = '';
  upazilas: { id: number; name: string; nameEn: string }[] = [];
  bloodGroupStats: { label: string; count: number }[] = [];

  constructor(
    private donorService: DonorService,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {
    this.filterForm = this.fb.group({
      search: [''],
      bloodGroup: [''],
      city: [''],
      location: ['']
    });
  }

  ngOnInit(): void {
    this.getDonors();
    this.filterForm.get('city')?.valueChanges.subscribe((districtName) => {
      const district = this.BANGLADESH_DISTRICTS.find(d => d.name === districtName);
      this.upazilas = district ? district.upazilas : [];
      this.filterForm.get('location')?.setValue('');
      this.getDonors();
    });
    this.filterForm.get('location')?.valueChanges.subscribe(() => {
      this.getDonors();
    });
    this.filterForm.get('bloodGroup')?.valueChanges.subscribe(() => {
      this.getDonors();
    });
    this.filterForm.get('search')?.valueChanges.subscribe(() => {
      this.getDonors();
    });
  }

  getDonors(): void {
    this.isLoading = true;
    const params: any = {};
    const { search, bloodGroup, city, location } = this.filterForm.value;
    if (search) params.search = search;
    if (bloodGroup) params.bloodGroup = bloodGroup;
    if (city) params.city = city;
    if (location) params.location = location;
    this.donorService.getPublicDonors(params).subscribe({
      next: (res) => {
        this.donors = res.data?.donors || [];
        this.calculateBloodGroupStats();
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'ডোনার তালিকা লোড করা যায়নি';
        this.isLoading = false;
      }
    });
  }

  calculateBloodGroupStats(): void {
    const stats: { [key: string]: number } = {};
    this.donors.forEach(donor => {
      stats[donor.bloodGroup] = (stats[donor.bloodGroup] || 0) + 1;
    });
    
    this.bloodGroupStats = this.BLOOD_GROUPS.map(bg => ({
      label: bg.value,
      count: stats[bg.value] || 0
    })).filter(stat => stat.count > 0);
  }

  resetFilters(): void {
    this.filterForm.reset();
    this.getDonors();
  }

  trackByDonorId(index: number, donor: PublicDonorResponse): string {
    return donor._id || index.toString();
  }

  getDonorStatusClass(donor: PublicDonorResponse): string {
    if (this.isEligibleToDonate(donor)) {
      return 'eligible';
    }
    return 'not-eligible';
  }

  getEligibilityClass(donor: PublicDonorResponse): string {
    if (this.isEligibleToDonate(donor)) {
      return 'eligible';
    }
    return 'not-eligible';
  }

  getEligibilityIcon(donor: PublicDonorResponse): string {
    if (this.isEligibleToDonate(donor)) {
      return 'check_circle';
    }
    return 'cancel';
  }

  getEligibilityText(donor: PublicDonorResponse): string {
    if (this.isEligibleToDonate(donor)) {
      return 'রক্তদানে সক্ষম';
    }
    return 'রক্তদানে অক্ষম';
  }

  isEligibleToDonate(donor: PublicDonorResponse): boolean {
    if (!donor.lastDonationDate) {
      return true; // No previous donation
    }
    
    const lastDonation = new Date(donor.lastDonationDate);
    const today = new Date();
    const daysDiff = Math.floor((today.getTime() - lastDonation.getTime()) / (1000 * 60 * 60 * 24));
    
    return daysDiff >= 120; // 4 months = ~120 days
  }

  getLastDonationText(lastDonationDate: string): string {
    const lastDonation = new Date(lastDonationDate);
    const today = new Date();
    const daysDiff = Math.floor((today.getTime() - lastDonation.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff < 30) {
      return `${daysDiff} দিন আগে`;
    } else if (daysDiff < 365) {
      const months = Math.floor(daysDiff / 30);
      return `${months} মাস আগে`;
    } else {
      const years = Math.floor(daysDiff / 365);
      return `${years} বছর আগে`;
    }
  }

  formatPhoneNumber(phone: string): string {
    // Format: 01XXXXXXXXX -> 01XXX-XXXXXX
    if (phone && phone.length >= 11) {
      return `${phone.slice(0, 5)}-${phone.slice(5)}`;
    }
    return phone;
  }

  callDonor(donor: PublicDonorResponse, event: Event): void {
    event.stopPropagation();
    // Phone number is not available in public response for privacy
    // This will be handled in the donor details modal
    this.openDonorDetails(donor, event);
  }

  openDonorDetails(donor: PublicDonorResponse, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.dialog.open(DonorDetailsDialogComponent, {
      data: donor,
      width: '500px',
      maxWidth: '95vw',
      maxHeight: '90vh'
    });
  }
}
