import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { DonorService } from '../../../shared/services/donor.service';
import { 
  AdminDonorResponse, 
  AdminDonorsListResponse, 
  DonorFilterParams,
  ApiResponse 
} from '../../../shared/interfaces/donor.interface';

// Interfaces
interface DonorAdmin extends AdminDonorResponse {}

interface Statistics {
  totalDonors: number;
  activeDonors: number;
  pendingDonors: number;
  eligibleDonors: number;
  totalDonations: number;
}

@Component({
  selector: 'app-donor-management',
  templateUrl: './donor-management.component.html',
  styleUrls: ['./donor-management.component.scss']
})
export class DonorManagementComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Table Configuration
  displayedColumns: string[] = [
    'profilePhoto',
    'name',
    'phone',
    'bloodGroup',
    'gender',
    'city',
    'totalDonations',
    'lastDonationDate',
    'accountStatus',
    'eligibilityStatus',
    'actions'
  ];

  dataSource = new MatTableDataSource<DonorAdmin>();
  
  // Search and Filter
  searchControl = new FormControl('');
  bloodGroupFilter = new FormControl('');
  genderFilter = new FormControl('');
  cityFilter = new FormControl('');
  statusFilter = new FormControl('');
  eligibilityFilter = new FormControl('');

  // Filter Options
  bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  genders = [
    { value: 'male', label: 'পুরুষ' },
    { value: 'female', label: 'নারী' },
    { value: 'other', label: 'অন্যান্য' }
  ];
  statuses = [
    { value: 'PENDING', label: 'অপেক্ষমাণ' },
    { value: 'ACTIVE', label: 'সক্রিয়' },
    { value: 'SUSPENDED', label: 'স্থগিত' }
  ];
  eligibilityStatuses = [
    { value: 'ELIGIBLE', label: 'যোগ্য' },
    { value: 'NOT_ELIGIBLE', label: 'অযোগ্য' },
    { value: 'UNKNOWN', label: 'অজানা' }
  ];

  // Loading and Stats
  isLoading = false;
  error: string | null = null;
  totalDonors = 0;
  activeDonors = 0;
  pendingDonors = 0;
  suspendedDonors = 0;
  cities: string[] = [];

  // Pagination
  currentPage = 0;
  pageSize = 10;
  totalRecords = 0;

  // Statistics
  statistics: Statistics = {
    totalDonors: 0,
    activeDonors: 0,
    pendingDonors: 0,
    eligibleDonors: 0,
    totalDonations: 0
  };

  constructor(
    private donorService: DonorService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.setupFilters();
    this.loadDonors();
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.paginator.page.subscribe(() => {
        this.currentPage = this.paginator.pageIndex;
        this.pageSize = this.paginator.pageSize;
        this.loadDonors();
      });
    }
    
    // Don't set paginator to dataSource as we're doing server-side pagination
    this.dataSource.sort = this.sort;
  }

  setupFilters() {
    // Search filter with debounce
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => {
        this.currentPage = 0; // Reset to first page
        this.loadDonors();
      });

    // Other filters
    [this.bloodGroupFilter, this.cityFilter, this.statusFilter, this.eligibilityFilter]
      .forEach(control => {
        control.valueChanges.subscribe(() => {
          this.currentPage = 0; // Reset to first page
          this.loadDonors();
        });
      });
  }

  loadDonors() {
    this.isLoading = true;
    this.error = null;

    const params: DonorFilterParams = {
      page: this.currentPage + 1, // API expects 1-based page
      limit: this.pageSize
    };

    // Add filters if they have values
    const searchValue = this.searchControl.value;
    if (searchValue) {
      params.search = searchValue;
    }

    const bloodGroup = this.bloodGroupFilter.value;
    if (bloodGroup) {
      params.bloodGroup = bloodGroup;
    }

    const city = this.cityFilter.value;
    if (city) {
      params.city = city;
    }

    const accountStatus = this.statusFilter.value;
    if (accountStatus) {
      params.accountStatus = accountStatus;
    }

    const eligibilityStatus = this.eligibilityFilter.value;
    if (eligibilityStatus) {
      params.eligibilityStatus = eligibilityStatus;
    }

    this.donorService.getAllDonorsForAdmin(params).subscribe({
      next: (response: ApiResponse<AdminDonorsListResponse>) => {
        if (response.success) {
          this.dataSource.data = response.data.donors;
          this.totalRecords = response.data.total;
          this.statistics = response.data.statistics;
          this.extractCities();
          this.isLoading = false;
        } else {
          this.handleError('ডেটা লোড করতে সমস্যা হয়েছে');
        }
      },
      error: (error) => {
        console.error('Error loading donors:', error);
        this.handleError('সার্ভার থেকে ডেটা আনতে সমস্যা হয়েছে');
      }
    });
  }

  private handleError(message: string) {
    this.error = message;
    this.isLoading = false;
    this.snackBar.open(message, 'বন্ধ করুন', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }

  loadStatistics() {
    // Statistics are loaded from the API response in loadDonors()
    // This method is kept for any additional stats calculation if needed
  }

  extractCities() {
    const uniqueCities = [...new Set(this.dataSource.data.map(donor => donor.city))];
    this.cities = uniqueCities.sort();
  }

  clearFilters() {
    this.searchControl.setValue('');
    this.bloodGroupFilter.setValue('');
    this.cityFilter.setValue('');
    this.statusFilter.setValue('');
    this.eligibilityFilter.setValue('');
    // Trigger reload
    this.currentPage = 0;
    this.loadDonors();
  }

  addDonor() {
    // TODO: Open add donor dialog
    console.log('Add donor');
  }

  editDonor(donor: DonorAdmin) {
    // TODO: Open edit donor dialog
    console.log('Edit donor:', donor);
  }

  deleteDonor(donor: DonorAdmin) {
    // TODO: Implement delete confirmation and API call
    console.log('Delete donor:', donor);
  }

  updateStatus(donor: DonorAdmin, status: string) {
    // TODO: Update donor status
    console.log('Update status:', donor, status);
  }

  exportData() {
    // TODO: Export filtered data to Excel/CSV
    console.log('Export data');
  }

  refreshData() {
    this.loadDonors();
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
      case 'NOT_ELIGIBLE': return 'eligibility-not-eligible';
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
      'NOT_ELIGIBLE': 'অযোগ্য',
      'UNKNOWN': 'অজানা'
    };
    return eligibilityMap[status as keyof typeof eligibilityMap] || status;
  }

  getGenderLabel(gender: string): string {
    const genderMap = {
      'male': 'পুরুষ',
      'female': 'নারী',
      'other': 'অন্যান্য'
    };
    return genderMap[gender as keyof typeof genderMap] || gender;
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('bn-BD');
  }

  getDaysSinceLastDonation(dateString: string): number {
    if (!dateString) return 0;
    const lastDonation = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - lastDonation.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}
