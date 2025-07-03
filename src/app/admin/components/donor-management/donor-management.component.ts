import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { DonorService } from '../../../shared/services/donor.service';
import { DonorDetailsModalComponent } from '../donor-details-modal/donor-details-modal.component';
import { AddEditDonorDialogComponent } from '../add-edit-donor-dialog/add-edit-donor-dialog.component';
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
  locationFilter = new FormControl(''); // New location filter
  statusFilter = new FormControl('');
  eligibilityFilter = new FormControl('');

  // Filter Options
  bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  genders = [
    { value: 'Male', label: 'পুরুষ' },
    { value: 'Female', label: 'নারী' },
    { value: 'Other', label: 'অন্যান্য' }
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
  locations: string[] = []; // New locations array

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
    // Server-side pagination - don't bind paginator to dataSource
    if (this.paginator) {
      this.paginator.page.subscribe((event) => {
        this.currentPage = event.pageIndex;
        this.pageSize = event.pageSize;
        this.loadDonors(); // API call with new page
      });
    }
    
    this.dataSource.sort = this.sort;
  }

  setupFilters() {
    // Search filter with debounce - server-side filtering
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => {
        this.currentPage = 0; // Reset to first page
        this.loadDonors(); // API call with search filter
      });

    // Other filters - server-side filtering
    [this.bloodGroupFilter, this.genderFilter, this.cityFilter, this.locationFilter, this.statusFilter, this.eligibilityFilter]
      .forEach(control => {
        control.valueChanges.subscribe(() => {
          this.currentPage = 0; // Reset to first page
          this.loadDonors(); // API call with filters
        });
      });
  }

  applyFilters() {
    // Trigger filter by updating the filter value
    this.dataSource.filter = Date.now().toString();
  }

  loadDonors() {
    this.isLoading = true;
    this.error = null;

    // Server-side filtering and pagination
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

    const location = this.locationFilter.value;
    if (location) {
      params.location = location;
    }

    const gender = this.genderFilter.value;
    if (gender) {
      params.gender = gender;
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
          
          // Update paginator manually for server-side pagination
          if (this.paginator) {
            this.paginator.length = this.totalRecords;
          }
          
          this.extractCities();
          this.extractLocations();
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

  extractLocations() {
    const uniqueLocations = [...new Set(this.dataSource.data.map(donor => donor.location))];
    this.locations = uniqueLocations.sort();
  }

  clearFilters() {
    this.searchControl.setValue('');
    this.bloodGroupFilter.setValue('');
    this.genderFilter.setValue('');
    this.cityFilter.setValue('');
    this.locationFilter.setValue('');
    this.statusFilter.setValue('');
    this.eligibilityFilter.setValue('');
    // Reset pagination and reload
    this.currentPage = 0;
    if (this.paginator) {
      this.paginator.pageIndex = 0;
    }
    this.loadDonors();
  }

  addDonor() {
    const dialogRef = this.dialog.open(AddEditDonorDialogComponent, {
      width: '800px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      data: {
        donor: null,
        mode: 'add'
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.success) {
        this.snackBar.open('নতুন রক্তদাতা সফলভাবে যোগ করা হয়েছে', 'বন্ধ করুন', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.loadDonors(); // Refresh the table
      }
    });
  }

  viewDonorDetails(donor: DonorAdmin) {
    const dialogRef = this.dialog.open(DonorDetailsModalComponent, {
      width: '900px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      data: { donorId: donor._id },
      panelClass: 'donor-details-dialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      // Handle any actions after modal closes if needed
      if (result) {
        // Refresh data if donor was updated
        this.loadDonors();
      }
    });
  }

  editDonor(donor: DonorAdmin) {
    const dialogRef = this.dialog.open(AddEditDonorDialogComponent, {
      width: '800px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      data: {
        donor: donor,
        mode: 'edit'
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.success) {
        this.snackBar.open('রক্তদাতার তথ্য সফলভাবে আপডেট করা হয়েছে', 'বন্ধ করুন', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.loadDonors(); // Refresh the table
      }
    });
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

  getDaysSinceLastDonation(dateString: string): number {
    if (!dateString) return 0;
    const lastDonation = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - lastDonation.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}
