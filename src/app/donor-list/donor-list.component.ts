import { Component, OnInit, OnDestroy, HostListener, ViewChild, ElementRef, AfterViewInit, NgZone, ChangeDetectorRef } from '@angular/core';
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
  // Removed OnPush strategy for now - it was causing loading state issues with infinite scroll
})
export class DonorListComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('scrollSentinel', { static: false }) scrollSentinel!: ElementRef;
  
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
  
  // Cross-browser infinite scroll support
  private intersectionObserver?: IntersectionObserver;
  private scrollThrottleTimeout?: number;

  constructor(
    private donorService: DonorService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initializeFilters();
    this.setupFormSubscriptions();
    this.getDonors(true); // Reset on init
  }

  ngAfterViewInit(): void {
    // Setup IntersectionObserver for cross-browser infinite scroll
    this.setupIntersectionObserver();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    
    // Clean up IntersectionObserver
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
    
    // Clean up scroll throttle timeout
    if (this.scrollThrottleTimeout) {
      clearTimeout(this.scrollThrottleTimeout);
    }
    
    // Clear cache to free memory
    this.donorCache.clear();
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
        this.cdr.detectChanges(); // Force change detection
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

  // Cross-browser compatible infinite scroll listener with throttling
  @HostListener('window:scroll', ['$event'])
  onScroll(): void {
    // Throttle scroll events for better performance
    if (this.scrollThrottleTimeout) {
      clearTimeout(this.scrollThrottleTimeout);
    }
    
    this.scrollThrottleTimeout = window.setTimeout(() => {
      // Wrap in NgZone to ensure change detection
      this.ngZone.run(() => {
        this.checkScrollForInfiniteLoad();
      });
    }, 16); // ~60fps throttling
  }

  // Separate method for better cross-browser compatibility
  private checkScrollForInfiniteLoad(): void {
    // Cross-browser scroll position calculation
    const scrollTop = window.pageYOffset || window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
    
    // Cross-browser viewport height calculation
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight || 0;
    
    // Cross-browser document height calculation
    const documentHeight = Math.max(
      document.body.scrollHeight || 0,
      document.body.offsetHeight || 0,
      document.documentElement.clientHeight || 0,
      document.documentElement.scrollHeight || 0,
      document.documentElement.offsetHeight || 0
    );

    const threshold = 300;
    const currentPosition = scrollTop + viewportHeight;
    const shouldLoad = currentPosition > (documentHeight - threshold);

    if (shouldLoad && !this.isLoadingMore && this.hasMoreData && !this.isLoading) {
      this.loadMoreDonors();
    }
  }

  getDonors(reset: boolean = false): void {
    if (reset) {
      this.currentPage = 1;
      this.hasMoreData = true;
      this.donors = [];
      // Clear cache on reset
      this.donorCache.clear();
    }

    this.isLoading = reset;
    this.isLoadingMore = !reset;
    
    // Force change detection for OnPush strategy
    this.cdr.detectChanges();

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
        const totalPages = parseInt(res.data?.totalPages) || 1;
        const currentPage = parseInt(res.data?.currentPage) || 1;

        this.totalPages = totalPages;

        if (reset) {
          this.donors = newDonors;
        } else {
          this.donors = [...this.donors, ...newDonors];
        }

        // Check if more data available
        this.hasMoreData = this.currentPage < this.totalPages;

        this.calculateBloodGroupStats();
        this.isLoading = false;
        this.isLoadingMore = false;
        
        // Force change detection for OnPush strategy
        this.cdr.detectChanges();
        
        // Re-setup IntersectionObserver after data loads (for new sentinel element)
        if (!reset && this.scrollSentinel?.nativeElement && this.intersectionObserver) {
          setTimeout(() => {
            this.intersectionObserver!.observe(this.scrollSentinel.nativeElement);
          }, 100);
        }
      },
      error: (err) => {
        this.error = 'ডোনার তালিকা লোড করা যায়নি। আবার চেষ্টা করুন।';
        this.isLoading = false;
        this.isLoadingMore = false;
        
        // Force change detection for OnPush strategy
        this.cdr.detectChanges();
      }
    });
  }

  loadMoreDonors(): void {
    if (this.hasMoreData && !this.isLoadingMore) {
      this.currentPage++;
      this.getDonors(false);
      // Force change detection
      this.cdr.detectChanges();
    }
  }

  generateCacheKey(): string {
    // Cache key without page number - we want to cache per filter combination, not per page
    const search = this.searchControl.value || '';
    const donorId = this.donorIdControl.value || '';
    const bloodGroup = this.bloodGroupControl.value || '';
    const city = this.cityControl.value || '';
    const location = this.locationControl.value || '';
    return `${search}-${donorId}-${bloodGroup}-${city}-${location}-page-${this.currentPage}`;
  }

  calculateBloodGroupStats(): void {
    // Calculate stats from all loaded donors, not just current page
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
    
    // Force change detection for OnPush strategy
    this.cdr.detectChanges();
    
    // Reload data
    this.getDonors(true);
  }

  // Performance optimization: TrackBy functions
  trackByDonorId(index: number, donor: PublicDonorResponse): string {
    return donor._id || donor.donorId || index.toString();
  }

  trackByBloodGroup(index: number, stat: { label: string; count: number }): string {
    return stat.label;
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

  // Utility methods (optimized for performance)
  formatPhoneNumber(phone: string): string {
    // Format: 01XXXXXXXXX -> 01XXX-XXXXXX (memory efficient)
    return phone?.length >= 11 ? `${phone.slice(0, 5)}-${phone.slice(5)}` : phone;
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

  private setupIntersectionObserver(): void {
    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) {
      return;
    }

    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        // ✅ Fix: Wrap callback in NgZone to trigger Angular change detection
        this.ngZone.run(() => {
          entries.forEach(entry => {
            if (entry.isIntersecting && !this.isLoadingMore && this.hasMoreData && !this.isLoading) {
              this.loadMoreDonors();
              // Force change detection
              this.cdr.detectChanges();
            }
          });
        });
      },
      {
        rootMargin: '50px', // Start loading 50px before the element comes into view
        threshold: 0.1 // Trigger when 10% of the element is visible
      }
    );

    // Start observing when component is ready
    setTimeout(() => {
      if (this.scrollSentinel?.nativeElement) {
        this.intersectionObserver!.observe(this.scrollSentinel.nativeElement);
      } else {
        // Try again after a longer delay
        setTimeout(() => {
          if (this.scrollSentinel?.nativeElement) {
            this.intersectionObserver!.observe(this.scrollSentinel.nativeElement);
          }
        }, 500);
      }
    }, 100);
  }
}
