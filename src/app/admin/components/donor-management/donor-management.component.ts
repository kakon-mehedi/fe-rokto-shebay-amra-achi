import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import * as XLSX from 'xlsx';
import { DonorService } from '../../../shared/services/donor.service';
import { DonorDetailsModalComponent } from '../donor-details-modal/donor-details-modal.component';
import { AddEditDonorDialogComponent } from '../add-edit-donor-dialog/add-edit-donor-dialog.component';
import { AddDonationComponent } from '../../../dashboard/components/add-donation/add-donation.component';
import { 
  AdminDonorResponse, 
  AdminDonorsListResponse, 
  DonorFilterParams,
  ApiResponse 
} from '../../../shared/interfaces/donor.interface';
import { BANGLADESH_DISTRICTS, District, Upazila } from '../../../shared/data/bangladesh-data';

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
    'donorId',
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
  donorIdFilter = new FormControl('');
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
    { value: 'TEMPORARILY_INELIGIBLE', label: 'অযোগ্য' },
    { value: 'UNKNOWN', label: 'অজানা' }
  ];

  // Loading and Stats
  isLoading = false;
  error: string | null = null;
  totalDonors = 0;
  activeDonors = 0;
  pendingDonors = 0;
  suspendedDonors = 0;
  
  // Bangladesh data for filters
  allDistricts: District[] = BANGLADESH_DISTRICTS;
  cities: { value: string, label: string }[] = [];
  locations: { value: string, label: string }[] = [];
  selectedDistrict: string = '';

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
    this.loadBangladeshData();
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

    // Donor ID filter with debounce - server-side filtering
    this.donorIdFilter.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => {
        this.currentPage = 0; // Reset to first page
        this.loadDonors(); // API call with donorId filter
      });

    // City filter with special handling for location update
    this.cityFilter.valueChanges.subscribe((selectedCity) => {
      this.onCityFilterChange(selectedCity);
      this.currentPage = 0; // Reset to first page
      this.loadDonors(); // API call with filters
    });

    // Other filters - server-side filtering
    [this.bloodGroupFilter, this.genderFilter, this.locationFilter, this.statusFilter, this.eligibilityFilter]
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

    const donorId = this.donorIdFilter.value;
    if (donorId) {
      params.donorId = donorId;
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

  loadBangladeshData() {
    // Load all districts as cities for filter
    this.cities = this.allDistricts.map(district => ({
      value: district.name,
      label: district.name
    })).sort((a, b) => a.label.localeCompare(b.label, 'bn'));

    // Initially load all upazilas as locations
    this.locations = this.allDistricts
      .flatMap(district => district.upazilas)
      .map(upazila => ({
        value: upazila.name,
        label: upazila.name
      }))
      .sort((a, b) => a.label.localeCompare(b.label, 'bn'));
  }

  onCityFilterChange(selectedCity: string) {
    if (selectedCity) {
      // Find the selected district
      const selectedDistrict = this.allDistricts.find(district => district.name === selectedCity);
      
      if (selectedDistrict) {
        // Update locations to show only upazilas of selected district
        this.locations = selectedDistrict.upazilas.map(upazila => ({
          value: upazila.name,
          label: upazila.name
        })).sort((a, b) => a.label.localeCompare(b.label, 'bn'));
        
        // Reset location filter when city changes
        this.locationFilter.setValue('');
      }
    } else {
      // If no city selected, show all upazilas
      this.loadBangladeshData();
      this.locationFilter.setValue('');
    }
  }

  extractCities() {
    // This method is now replaced by loadBangladeshData()
    // Keep it for backward compatibility but don't use
  }

  extractLocations() {
    // This method is now replaced by loadBangladeshData()
    // Keep it for backward compatibility but don't use
  }

  clearFilters() {
    this.searchControl.setValue('');
    this.donorIdFilter.setValue('');
    this.bloodGroupFilter.setValue('');
    this.genderFilter.setValue('');
    this.cityFilter.setValue('');
    this.locationFilter.setValue('');
    this.statusFilter.setValue('');
    this.eligibilityFilter.setValue('');
    
    // Reset location data to show all upazilas
    this.loadBangladeshData();
    
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

  // নতুন রক্তদান রেকর্ড করার জন্য dialog খোলা
  addDonation(donor: DonorAdmin) {
    if (!donor || !donor._id) {
      this.snackBar.open('রক্তদাতার তথ্যে সমস্যা রয়েছে', 'বন্ধ করুন', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }
    
    const dialogRef = this.dialog.open(AddDonationComponent, {
      width: '650px',
      data: { donorId: donor._id },
      
      maxWidth: '90vw',
      panelClass: 'responsive-dialog',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.snackBar.open('রক্তদান সফলভাবে রেকর্ড করা হয়েছে!', 'বন্ধ করুন', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        
        // Donor list reload করি
        this.loadDonors();
        this.loadStatistics();
      }
    });
  }

  // Update donor status
  updateStatus(donor: DonorAdmin, newStatus: string) {
    // Display confirmation dialog
    const statusLabel = this.getStatusLabel(newStatus);
    const confirmMessage = newStatus === 'SUSPENDED' ? 
      `আপনি কি নিশ্চিত যে ${donor.name} কে স্থগিত করতে চান?` : 
      `আপনি কি নিশ্চিত যে ${donor.name} কে ${statusLabel} করতে চান?`;

    if (confirm(confirmMessage)) {
      this.isLoading = true;
      
      this.donorService.updateDonorStatus(donor._id, newStatus).subscribe({
        next: (response: any) => {
          this.snackBar.open(`রক্তদাতার স্ট্যাটাস ${statusLabel} করা হয়েছে`, 'বন্ধ করুন', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          
          // Update the donor in the dataSource
          const index = this.dataSource.data.findIndex(d => d._id === donor._id);
          if (index !== -1) {
            const updatedData = [...this.dataSource.data];
            updatedData[index] = { 
              ...updatedData[index], 
              accountStatus: newStatus as 'ACTIVE' | 'PENDING' | 'SUSPENDED' 
            };
            this.dataSource.data = updatedData;
          }
          
          this.isLoading = false;
          this.loadDonors(); // Refresh data
        },
        error: (error) => {
          console.error('Error updating donor status:', error);
          this.snackBar.open('স্ট্যাটাস আপডেট করতে সমস্যা হয়েছে', 'বন্ধ করুন', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
          this.isLoading = false;
        }
      });
    }
  }

  // Delete donor
  deleteDonor(donor: DonorAdmin) {
    // Display confirmation dialog
    if (confirm(`আপনি কি নিশ্চিত যে আপনি ${donor.name} কে মুছে ফেলতে চান? এই কাজটি পূর্বাবস্থায় ফেরানো যাবে না।`)) {
      this.isLoading = true;
      
      this.donorService.deleteDonorAsAdmin(donor._id).subscribe({
        next: (response: any) => {
          this.snackBar.open('রক্তদাতা সফলভাবে মুছে ফেলা হয়েছে', 'বন্ধ করুন', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          
          // Remove the donor from the dataSource
          const updatedData = this.dataSource.data.filter(d => d._id !== donor._id);
          this.dataSource.data = updatedData;
          
          this.isLoading = false;
          this.loadDonors(); // Refresh data and statistics
        },
        error: (error) => {
          console.error('Error deleting donor:', error);
          this.snackBar.open('রক্তদাতা মুছে ফেলতে সমস্যা হয়েছে', 'বন্ধ করুন', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
          this.isLoading = false;
        }
      });
    }
  }

  exportData(format: 'excel' | 'csv' = 'excel') {
    // Show loading state
    this.isLoading = true;

    // First get all donors with current filters (without pagination)
    const params: DonorFilterParams = {
      page: 1,
      limit: 10000 // Get all records
    };

    // Add current filters
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
          if (format === 'excel') {
            this.exportToExcel(response.data.donors);
          } else {
            this.exportToCSV(response.data.donors);
          }
        } else {
          this.snackBar.open('এক্সপোর্ট করতে সমস্যা হয়েছে', 'বন্ধ করুন', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error exporting data:', error);
        this.snackBar.open('ডেটা এক্সপোর্ট করতে সমস্যা হয়েছে', 'বন্ধ করুন', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        this.isLoading = false;
      }
    });
  }

  private exportToExcel(donors: DonorAdmin[]) {
    // Prepare data for export
    const exportData = donors.map((donor, index) => ({
      'ক্রমিক নং': index + 1,
      'নাম': donor.name,
      'ফোন': donor.phone,
      'ইমেইল': donor.email || 'N/A',
      'রক্তের গ্রুপ': donor.bloodGroup,
      'লিঙ্গ': this.getGenderLabel(donor.gender),
      'জন্ম তারিখ': donor.dateOfBirth ? new Date(donor.dateOfBirth).toLocaleDateString('bn-BD') : 'N/A',
      'বয়স': donor.dateOfBirth ? this.calculateAge(donor.dateOfBirth) : 'N/A',
      'শহর': donor.city,
      'এলাকা': donor.location,
      'ঠিকানা': donor.address,
      'ধর্ম': donor.religion,
      'পেশা': donor.profession || 'N/A',
      'ওজন (কেজি)': donor.weight || 'N/A',
      'উচ্চতা (সেমি)': donor.height || 'N/A',
      'জাতীয় পরিচয়পত্র': donor.nationalId || 'N/A',
      'মোট রক্তদান': donor.totalDonations,
      'শেষ রক্তদানের তারিখ': donor.lastDonationDate ? this.formatDate(donor.lastDonationDate) : 'কোনো দান নেই',
      'শেষ রক্তদানের পর দিন': donor.lastDonationDate ? this.getDaysSinceLastDonation(donor.lastDonationDate) + ' দিন আগে' : 'N/A',
      'পরবর্তী যোগ্যতার তারিখ': donor.nextEligibleDate ? this.formatDate(donor.nextEligibleDate) : 'N/A',
      'রক্তদানের যোগ্যতা': this.getEligibilityLabel(this.getRealEligibilityStatus(donor)),
      'অ্যাকাউন্ট স্ট্যাটাস': this.getStatusLabel(donor.accountStatus),
      'নিবন্ধনের তারিখ': donor.createdAt ? this.formatDate(donor.createdAt) : 'N/A',
      'সর্বশেষ আপডেট': donor.updatedAt ? this.formatDate(donor.updatedAt) : 'N/A',
      'জরুরি যোগাযোগের নাম': donor.emergencyContact?.name || 'N/A',
      'জরুরি যোগাযোগের ফোন': donor.emergencyContact?.phone || 'N/A',
      'জরুরি যোগাযোগের সম্পর্ক': donor.emergencyContact?.relation || 'N/A',
      'মোট রক্তদানের ইতিহাস': donor.donationHistory ? donor.donationHistory.length : 0
    }));

    // Create workbook and worksheet
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    
    // Set column widths
    const colWidths = [
      { wch: 8 },  // ক্রমিক নং
      { wch: 20 }, // নাম
      { wch: 15 }, // ফোন
      { wch: 25 }, // ইমেইল
      { wch: 10 }, // রক্তের গ্রুপ
      { wch: 8 },  // লিঙ্গ
      { wch: 12 }, // জন্ম তারিখ
      { wch: 6 },  // বয়স
      { wch: 15 }, // শহর
      { wch: 15 }, // এলাকা
      { wch: 30 }, // ঠিকানা
      { wch: 10 }, // ধর্ম
      { wch: 15 }, // পেশা
      { wch: 8 },  // ওজন
      { wch: 8 },  // উচ্চতা
      { wch: 15 }, // জাতীয় পরিচয়পত্র
      { wch: 10 }, // মোট রক্তদান
      { wch: 15 }, // শেষ রক্তদানের তারিখ
      { wch: 15 }, // শেষ রক্তদানের পর দিন
      { wch: 18 }, // পরবর্তী যোগ্যতার তারিখ
      { wch: 15 }, // রক্তদানের যোগ্যতা
      { wch: 12 }, // অ্যাকাউন্ট স্ট্যাটাস
      { wch: 15 }, // নিবন্ধনের তারিখ
      { wch: 15 }, // সর্বশেষ আপডেট
      { wch: 20 }, // জরুরি যোগাযোগের নাম
      { wch: 15 }, // জরুরি যোগাযোগের ফোন
      { wch: 15 }, // জরুরি যোগাযোগের সম্পর্ক
      { wch: 12 }  // মোট রক্তদানের ইতিহাস
    ];
    ws['!cols'] = colWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'রক্তদাতার তালিকা');

    // Generate filename with current date and filters
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];
    let filename = `রক্তদাতার_তালিকা_${dateStr}`;
    
    // Add filter info to filename if any filters are applied
    const appliedFilters: string[] = [];
    if (this.searchControl.value) appliedFilters.push('অনুসন্ধান');
    if (this.bloodGroupFilter.value) appliedFilters.push(this.bloodGroupFilter.value);
    if (this.cityFilter.value) appliedFilters.push(this.cityFilter.value);
    if (this.genderFilter.value) appliedFilters.push(this.getGenderLabel(this.genderFilter.value));
    if (this.statusFilter.value) appliedFilters.push(this.getStatusLabel(this.statusFilter.value));
    
    if (appliedFilters.length > 0) {
      filename += `_ফিল্টার_${appliedFilters.join('_')}`;
    }

    // Save the file
    XLSX.writeFile(wb, `${filename}.xlsx`);

    // Show success message
    this.snackBar.open(`${donors.length}টি রক্তদাতার তথ্য সফলভাবে এক্সপোর্ট করা হয়েছে`, 'বন্ধ করুন', {
      duration: 5000,
      panelClass: ['success-snackbar']
    });
  }

  private exportToCSV(donors: DonorAdmin[]) {
    // Prepare data for CSV export
    const csvData = donors.map((donor, index) => [
      index + 1, // ক্রমিক নং
      donor.name, // নাম
      donor.phone, // ফোন
      donor.email || 'N/A', // ইমেইল
      donor.bloodGroup, // রক্তের গ্রুপ
      this.getGenderLabel(donor.gender), // লিঙ্গ
      donor.dateOfBirth ? new Date(donor.dateOfBirth).toLocaleDateString('bn-BD') : 'N/A', // জন্ম তারিখ
      donor.dateOfBirth ? this.calculateAge(donor.dateOfBirth) : 'N/A', // বয়স
      donor.city, // শহর
      donor.location, // এলাকা
      donor.address, // ঠিকানা
      donor.religion, // ধর্ম
      donor.profession || 'N/A', // পেশা
      donor.weight || 'N/A', // ওজন
      donor.height || 'N/A', // উচ্চতা
      donor.nationalId || 'N/A', // জাতীয় পরিচয়পত্র
      donor.totalDonations, // মোট রক্তদান
      donor.lastDonationDate ? this.formatDate(donor.lastDonationDate) : 'কোনো দান নেই', // শেষ রক্তদানের তারিখ
      donor.lastDonationDate ? this.getDaysSinceLastDonation(donor.lastDonationDate) + ' দিন আগে' : 'N/A', // শেষ রক্তদানের পর দিন
      donor.nextEligibleDate ? this.formatDate(donor.nextEligibleDate) : 'N/A', // পরবর্তী যোগ্যতার তারিখ
      this.getEligibilityLabel(this.getRealEligibilityStatus(donor)), // রক্তদানের যোগ্যতা
      this.getStatusLabel(donor.accountStatus), // অ্যাকাউন্ট স্ট্যাটাস
      donor.createdAt ? this.formatDate(donor.createdAt) : 'N/A', // নিবন্ধনের তারিখ
      donor.updatedAt ? this.formatDate(donor.updatedAt) : 'N/A', // সর্বশেষ আপডেট
      donor.emergencyContact?.name || 'N/A', // জরুরি যোগাযোগের নাম
      donor.emergencyContact?.phone || 'N/A', // জরুরি যোগাযোগের ফোন
      donor.emergencyContact?.relation || 'N/A', // জরুরি যোগাযোগের সম্পর্ক
      donor.donationHistory ? donor.donationHistory.length : 0 // মোট রক্তদানের ইতিহাস
    ]);

    // CSV Headers
    const headers = [
      'ক্রমিক নং',
      'নাম',
      'ফোন',
      'ইমেইল',
      'রক্তের গ্রুপ',
      'লিঙ্গ',
      'জন্ম তারিখ',
      'বয়স',
      'শহর',
      'এলাকা',
      'ঠিকানা',
      'ধর্ম',
      'পেশা',
      'ওজন (কেজি)',
      'উচ্চতা (সেমি)',
      'জাতীয় পরিচয়পত্র',
      'মোট রক্তদান',
      'শেষ রক্তদানের তারিখ',
      'শেষ রক্তদানের পর দিন',
      'পরবর্তী যোগ্যতার তারিখ',
      'রক্তদানের যোগ্যতা',
      'অ্যাকাউন্ট স্ট্যাটাস',
      'নিবন্ধনের তারিখ',
      'সর্বশেষ আপডেট',
      'জরুরি যোগাযোগের নাম',
      'জরুরি যোগাযোগের ফোন',
      'জরুরি যোগাযোগের সম্পর্ক',
      'মোট রক্তদানের ইতিহাস'
    ];

    // Create worksheet and workbook
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([headers, ...csvData]);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'রক্তদাতার তালিকা');

    // Generate filename with current date and filters
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];
    let filename = `রক্তদাতার_তালিকা_${dateStr}`;
    
    // Add filter info to filename if any filters are applied
    const appliedFilters: string[] = [];
    if (this.searchControl.value) appliedFilters.push('অনুসন্ধান');
    if (this.bloodGroupFilter.value) appliedFilters.push(this.bloodGroupFilter.value);
    if (this.cityFilter.value) appliedFilters.push(this.cityFilter.value);
    if (this.genderFilter.value) appliedFilters.push(this.getGenderLabel(this.genderFilter.value));
    if (this.statusFilter.value) appliedFilters.push(this.getStatusLabel(this.statusFilter.value));
    
    if (appliedFilters.length > 0) {
      filename += `_ফিল্টার_${appliedFilters.join('_')}`;
    }

    // Save the file as CSV
    XLSX.writeFile(wb, `${filename}.csv`);

    // Show success message
    this.snackBar.open(`${donors.length}টি রক্তদাতার তথ্য CSV ফরম্যাটে সফলভাবে এক্সপোর্ট করা হয়েছে`, 'বন্ধ করুন', {
      duration: 5000,
      panelClass: ['success-snackbar']
    });
  }

  private calculateAge(dateOfBirth: string): number {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
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
      case 'TEMPORARILY_INELIGIBLE': return 'eligibility-temporarily-ineligible';
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

  getDaysSinceLastDonation(dateString: string): number {
    if (!dateString) return 0;
    const lastDonation = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - lastDonation.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  // Calculate real eligibility status based on last donation date
  getRealEligibilityStatus(donor: DonorAdmin): string {
    if (!donor.lastDonationDate) {
      return 'ELIGIBLE'; // If no donation, donor is eligible
    }
    
    const lastDonation = new Date(donor.lastDonationDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - lastDonation.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Blood donors are typically eligible to donate again after 120 days (4 months)
    if (diffDays >= 120) {
      return 'ELIGIBLE';
    } else {
      return 'TEMPORARILY_INELIGIBLE';
    }
  }
}
