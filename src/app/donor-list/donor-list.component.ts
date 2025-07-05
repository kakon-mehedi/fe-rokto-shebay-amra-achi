import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { DonorService } from '../shared/services/donor.service';
import { PublicDonorResponse } from '../shared/interfaces/donor.interface';
import { FormControl } from '@angular/forms';
import { BANGLADESH_DISTRICTS, BLOOD_GROUPS } from '../shared/data/bangladesh-data';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DonorDetailsDialogComponent } from './donor-details-dialog.component';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-donor-list',
  templateUrl: './donor-list.component.html',
  styleUrls: ['./donor-list.component.scss']
})
export class DonorListComponent implements OnInit, OnDestroy {
  donors: PublicDonorResponse[] = [];
  isLoading = true;
  isLoadingMore = false;
  error: string | null = null;
  
  // Admin style filters using FormControl
  searchControl = new FormControl('');
  donorIdControl = new FormControl('');
  bloodGroupControl = new FormControl('');
  cityControl = new FormControl('');
  locationControl = new FormControl('');
  
  BANGLADESH_DISTRICTS = BANGLADESH_DISTRICTS;
  BLOOD_GROUPS = BLOOD_GROUPS;
  selectedDistrict: string = '';
  upazilas: { id: number; name: string; nameEn: string }[] = [];
  bloodGroupStats: { label: string; count: number }[] = [];

  // Infinite scroll properties
  currentPage = 1;
  itemsPerPage = 20; // Backend এর মতো বেশি items
  totalPages = 1;
  hasMoreData = true;

  // Caching
  private donorCache = new Map<string, PublicDonorResponse[]>();
  private destroy$ = new Subject<void>();

  constructor(
    private donorService: DonorService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initializeFilters();
    this.setupFormSubscriptions();
    this.getDonors(true); // Reset on init
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  initializeFilters(): void {
    // Initialize first load
    this.currentPage = 1;
    this.hasMoreData = true;
    this.donors = [];
  }

  setupFormSubscriptions(): void {
    // Admin style filter setup with FormControl
    
    // City change subscription
    this.cityControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((districtName: string | null) => {
        const district = this.BANGLADESH_DISTRICTS.find(d => d.name === districtName);
        this.upazilas = district ? district.upazilas : [];
        this.locationControl.setValue('');
        this.getDonors(true); // Reset on city change
      });

    // Search with debouncing (Admin style)
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300), // Admin এ 300ms
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.getDonors(true); // Reset on search
      });

    // Donor ID search with debouncing (Admin style)
    this.donorIdControl.valueChanges
      .pipe(
        debounceTime(300), // Admin এর মতো same delay
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.getDonors(true); // Reset on donor ID search
      });

    // Other filters (immediate - Admin style)
    this.locationControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.getDonors(true); // Reset on location change
      });

    this.bloodGroupControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.getDonors(true); // Reset on blood group change
      });
  }

  // Infinite scroll listener
  @HostListener('window:scroll', ['$event'])
  onScroll(): void {
    const threshold = 300; // একটু বেশি threshold
    const position = window.pageYOffset + window.innerHeight;
    const height = document.documentElement.scrollHeight;

    if (position > height - threshold && !this.isLoadingMore && this.hasMoreData && !this.isLoading) {
      this.loadMoreDonors();
    }
  }

  getDonors(reset: boolean = false): void {
    if (reset) {
      this.currentPage = 1;
      this.hasMoreData = true;
      this.donors = [];
    }

    // Check cache first
    const cacheKey = this.generateCacheKey();
    if (this.donorCache.has(cacheKey) && !reset) {
      const cachedData = this.donorCache.get(cacheKey)!;
      this.donors = [...this.donors, ...cachedData];
      this.isLoading = false;
      return;
    }

    this.isLoading = reset;
    this.isLoadingMore = !reset;

    const params: any = {
      page: this.currentPage,
      limit: this.itemsPerPage
    };

    // Admin style parameter handling with FormControl values
    const search = this.searchControl.value;
    const donorId = this.donorIdControl.value;
    const bloodGroup = this.bloodGroupControl.value;
    const city = this.cityControl.value;
    const location = this.locationControl.value;
    
    // Trim এবং empty check করে parameter যোগ করা (Admin style)
    if (search && search.trim()) params.search = search.trim();
    if (donorId && donorId.trim()) params.donorId = donorId.trim();
    if (bloodGroup && bloodGroup.trim()) params.bloodGroup = bloodGroup.trim();
    if (city && city.trim()) params.city = city.trim();
    if (location && location.trim()) params.location = location.trim();

    this.donorService.getPublicDonors(params).subscribe({
      next: (res) => {
        const newDonors = res.data?.donors || [];
        this.totalPages = res.data?.totalPages || 1;

        if (reset) {
          this.donors = newDonors;
        } else {
          this.donors = [...this.donors, ...newDonors];
        }

        // Cache the data
        this.donorCache.set(cacheKey, newDonors);

        // Check if more data available
        this.hasMoreData = this.currentPage < this.totalPages;

        this.calculateBloodGroupStats();
        this.isLoading = false;
        this.isLoadingMore = false;
      },
      error: (err) => {
        this.error = 'ডোনার তালিকা লোড করা যায়নি। আবার চেষ্টা করুন।';
        this.isLoading = false;
        this.isLoadingMore = false;
        console.error('Error loading donors:', err);
        
        // Clear problematic cache entry
        const cacheKey = this.generateCacheKey();
        this.donorCache.delete(cacheKey);
      }
    });
  }

  loadMoreDonors(): void {
    if (this.hasMoreData && !this.isLoadingMore) {
      this.currentPage++;
      this.getDonors(false);
    }
  }

  generateCacheKey(): string {
    const search = this.searchControl.value || '';
    const donorId = this.donorIdControl.value || '';
    const bloodGroup = this.bloodGroupControl.value || '';
    const city = this.cityControl.value || '';
    const location = this.locationControl.value || '';
    return `${search}-${donorId}-${bloodGroup}-${city}-${location}-page-${this.currentPage}`;
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
    // Admin style clear with FormControl (explicit reset)
    this.searchControl.setValue('');
    this.donorIdControl.setValue('');
    this.bloodGroupControl.setValue('');
    this.cityControl.setValue('');
    this.locationControl.setValue('');
    
    // Clear error message
    this.error = null;
    
    // Clear cache and reset pagination
    this.donorCache.clear();
    this.currentPage = 1;
    this.hasMoreData = true;
    this.donors = [];
    
    // Reload data
    this.getDonors(true);
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

  copyDonorId(donorId: string, event: Event): void {
    event.stopPropagation();
    navigator.clipboard.writeText(donorId).then(() => {
      this.snackBar.open('ডোনার আইডি কপি করা হয়েছে!', 'বন্ধ করুন', {
        duration: 2000,
        panelClass: ['success-snackbar']
      });
    }).catch(() => {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = donorId;
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
