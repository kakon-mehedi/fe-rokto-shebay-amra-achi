import { ChangeDetectorRef, Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import { Location } from '@angular/common';
import { Donor } from '../../interfaces/donor.interface';
import { differenceInMonths, parseISO } from 'date-fns';
import { Router } from '@angular/router';
import { DonorService } from '../../services/donor-service';
import { AuthService } from '../../../shared/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
	selector: 'app-dashboard-default',
	templateUrl: './dashboard-default.component.html',
	styleUrls: ['./dashboard-default.component.scss'],
})
export class DashboardDefaultComponent implements OnInit, AfterViewInit {
	displayedColumns: string[] = [
		'name',
		'bloodGroup',
		'mobileNumber',
		'address',
		'lastDonationDate',
		'status'
	];

	get dynamicColumns(): string[] {
		if (this.isAuthenticated) {
			return [...this.displayedColumns, 'actions'];
		}
		return this.displayedColumns;
	}

	donors: Donor[] = [];
	isLoading = false;
	isAuthenticated = false;

	dataSource = new MatTableDataSource<Donor>();

	searchDonorControl = new FormControl('');
	addressSearchControl = new FormControl('');
	bloodGroupControl = new FormControl('');
	availableDonorControl = new FormControl(false);

	bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

	@ViewChild(MatPaginator) paginator!: MatPaginator;
	@ViewChild(MatSort) sort!: MatSort;

	constructor(
		private readonly _location: Location,
		private readonly _router: Router,
		private readonly _donorService: DonorService,
		private readonly _cdr: ChangeDetectorRef,
		private readonly authService: AuthService,
		private readonly snackBar: MatSnackBar
	) {}

	ngOnInit() {
		console.log('Dashboard component initialized');
		this.isAuthenticated = this.authService.isAuthenticated();
		console.log('Is authenticated:', this.isAuthenticated);
		this.getDonors();

		// Initialize filters
		this.searchDonorControl.valueChanges.subscribe(() =>
			this.applyFilter()
		);
		this.addressSearchControl.valueChanges.subscribe(() =>
			this.applyFilter()
		);
		this.bloodGroupControl.valueChanges.subscribe(() => this.applyFilter());
		this.availableDonorControl.valueChanges.subscribe(() =>
			this.applyFilter()
		);
	}

	ngAfterViewInit() {
		this.dataSource.paginator = this.paginator;
		this.dataSource.sort = this.sort;
	}

	getDonors() {
		console.log('Getting donors, isAuthenticated:', this.isAuthenticated);
		if (this.isAuthenticated) {
			this.isLoading = true;
			this._donorService.getDonors().subscribe({
				next: (response) => {
					this.isLoading = false;
					console.log('Donors API response:', response);
					if (response.success) {
						this.donors = response.data;
						this.dataSource.data = this.donors;
						console.log('Loaded donors from API:', this.donors);
					}
				},
				error: (error) => {
					this.isLoading = false;
					console.log('API error, using mock data:', error);
					this.snackBar.open('Failed to load donors', 'Close', {
						duration: 3000,
						panelClass: ['error-snackbar']
					});
					// Fallback to mock data
					this.donors = this._donorService.getMockDonors();
					this.dataSource.data = this.donors;
					console.log('Using mock donors:', this.donors);
				}
			});
		} else {
			// Use mock data for public view
			console.log('Not authenticated, using mock data');
			this.donors = this._donorService.getMockDonors();
			this.dataSource.data = this.donors;
			console.log('Mock donors loaded:', this.donors);
		}
	}

	applyFilter() {
		const searchTerm = this.searchDonorControl.value?.toLowerCase() || '';
		const addressSearchTerm = this.addressSearchControl.value?.toLowerCase() || '';
		const bloodGroupFilter = this.bloodGroupControl.value || '';
		const onlyAvailable = this.availableDonorControl.value;

		this.dataSource.data = this.donors.filter((donor) => {
			const matchesNameSearch = donor.name.toLowerCase().includes(searchTerm);
			const matchesAddressSearch = donor.address.toLowerCase().includes(addressSearchTerm);
			const matchesBloodGroup =
				!bloodGroupFilter || donor.bloodGroup === bloodGroupFilter;
			const matchesAvailability =
				!onlyAvailable || this.isDonorAvailable(donor);

			return matchesNameSearch && matchesAddressSearch && matchesBloodGroup && matchesAvailability;
		});
	}

	resetFilters() {
		this.searchDonorControl.setValue('');
		this.addressSearchControl.setValue('');
		this.bloodGroupControl.setValue('');
		this.availableDonorControl.setValue(false);
		this.applyFilter();
	}

	isDonorAvailable(donor: Donor): boolean {
		if (!donor.lastDonationDate) return true;
		const lastDonation = typeof donor.lastDonationDate === 'string' 
			? parseISO(donor.lastDonationDate) 
			: donor.lastDonationDate;
		return differenceInMonths(new Date(), lastDonation) >= 3;
	}

	goBack() {
		this._location.back();
		this._cdr.detectChanges();
	}

	onRowClick(donor: Donor) {
		console.log('Row clicked, donor:', donor);
		console.log('All donors in list:', this.donors);
		if (donor._id) {
			console.log('Navigating to details:', `/donors/details/${donor._id}`);
			this._router.navigate([`/donors/details/${donor._id}`]);
		} else {
			console.log('No donor ID found');
			this.snackBar.open('ডোনার তথ্য পাওয়া যায়নি', 'বন্ধ করুন', {
				duration: 3000,
				panelClass: ['error-snackbar']
			});
		}
	}

	onEditDonor(donor: Donor) {
		console.log('Edit clicked, donor:', donor);
		if (donor._id) {
			console.log('Navigating to edit:', `/donors/edit/${donor._id}`);
			this._router.navigate([`/donors/edit/${donor._id}`]);
		} else {
			console.log('No donor ID found for edit');
			this.snackBar.open('ডোনার তথ্য পাওয়া যায়নি', 'বন্ধ করুন', {
				duration: 3000,
				panelClass: ['error-snackbar']
			});
		}
	}

	onDeleteDonor(donor: Donor) {
		if (donor._id && this.isAuthenticated) {
			if (confirm('Are you sure you want to delete this donor?')) {
				this._donorService.deleteDonor(donor._id).subscribe({
					next: (response) => {
						if (response.success) {
							this.snackBar.open('Donor deleted successfully', 'Close', {
								duration: 3000,
								panelClass: ['success-snackbar']
							});
							this.getDonors(); // Refresh the list
						}
					},
					error: (error) => {
						this.snackBar.open('Failed to delete donor', 'Close', {
							duration: 3000,
							panelClass: ['error-snackbar']
						});
					}
				});
			}
		}
	}

	addNewDonor() {
		this._router.navigate(['/donors/add']);
	}

	login() {
		this._router.navigate(['/users/login']);
	}

	callDonor(donor: any): void {
		if (donor?.mobileNumber) {
			window.open(`tel:${donor.mobileNumber}`, '_self');
		}
	}
}
