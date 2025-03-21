import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import { Location } from '@angular/common';
import { Donor } from '../../interfaces/donor.interface';
import { differenceInMonths, parseISO } from 'date-fns';
import { Router } from '@angular/router';

@Component({
	selector: 'app-dashboard-default',
	templateUrl: './dashboard-default.component.html',
	styleUrls: ['./dashboard-default.component.scss'],
})
export class DashboardDefaultComponent implements OnInit {
	displayedColumns: string[] = [
		'name',
		'address',
		'bloodGroup',
		'mobileNumber',
		'lastDonationDate',
		'totalDonations',
	];

	donors: Donor[] = [
		{
			name: 'John Doe',
			address: 'Dhaka',
			bloodGroup: 'A+',
			mobileNumber: '0123456789',
			lastDonationDate: '2024-01-15',
			totalDonations: 5,
			isAvailable: true,
		},
		{
			name: 'Jane Smith',
			address: 'Chittagong',
			bloodGroup: 'B-',
			mobileNumber: '0987654321',
			lastDonationDate: '2024-03-05',
			totalDonations: 3,
			isAvailable: true,
		},
		{
			name: 'Alex Johnson',
			address: 'Sylhet',
			bloodGroup: 'O+',
			mobileNumber: '01712345678',
			lastDonationDate: '2023-12-10',
			totalDonations: 10,
			isAvailable: true,
		},
	];

	dataSource = new MatTableDataSource<Donor>(this.donors);

	searchDonorControl = new FormControl('');
	bloodGroupControl = new FormControl('');
	availableDonorControl = new FormControl(false);

	@ViewChild(MatPaginator) paginator!: MatPaginator;
	@ViewChild(MatSort) sort!: MatSort;

	constructor(
		private readonly _location: Location,
		private readonly _router: Router
	) {}

	ngOnInit() {
		this.dataSource.paginator = this.paginator;
		this.dataSource.sort = this.sort;

		this.searchDonorControl.valueChanges.subscribe(() =>
			this.applyFilter()
		);
		this.bloodGroupControl.valueChanges.subscribe(() => this.applyFilter());
		this.availableDonorControl.valueChanges.subscribe(() =>
			this.applyFilter()
		);
	}

	applyFilter() {
		const searchTerm = this.searchDonorControl.value?.toLowerCase() || '';
		const bloodGroupFilter = this.bloodGroupControl.value || '';
		const onlyAvailable = this.availableDonorControl.value;

		this.dataSource.data = this.donors.filter((donor) => {
			const matchesSearch = donor.name.toLowerCase().includes(searchTerm);
			const matchesBloodGroup =
				!bloodGroupFilter || donor.bloodGroup === bloodGroupFilter;
			const matchesAvailability =
				!onlyAvailable || this.isDonorAvailable(donor);

			return matchesSearch && matchesBloodGroup && matchesAvailability;
		});
	}

	resetFilters() {
		this.searchDonorControl.setValue('');
		this.bloodGroupControl.setValue('');
		this.availableDonorControl.setValue(false);
		this.applyFilter();
	}

	isDonorAvailable(donor: Donor): boolean {
		return (
			differenceInMonths(new Date(), parseISO(donor.lastDonationDate)) >=
			3
		);
	}

	goBack() {
		this._location.back();
	}

	onRowClick(donor: Donor) {
		this._router.navigate([`/donors/details/${donor.name}`]);
	}
}
