import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelectChange } from '@angular/material/select';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { donors } from '../../dashboard.constant';
import { FormControl } from '@angular/forms';

const users = donors;

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
	dataSource: MatTableDataSource<any>;
	selectedBg = '';
	bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

	@ViewChild(MatPaginator) paginator!: MatPaginator;
	@ViewChild(MatSort) sort!: MatSort;

	searchDonorControl: FormControl = new FormControl();
	filterDonorControl: FormControl = new FormControl();

	constructor() {
		this.dataSource = new MatTableDataSource(users);
	}

	ngAfterViewInit() {
		this.setPaginators();
	}

	applyFilter(event: Event) {
		const filterValue = (event.target as HTMLInputElement).value;
		this.dataSource.filter = filterValue.trim().toLowerCase();

		if (this.dataSource.paginator) {
			this.dataSource.paginator.firstPage();
		}
	}

	filterUserByBloodGroup(event: MatSelectChange) {
		const userList = users.filter(
			(user) => user.bloodGroup === event.value
		);
		this.dataSource = new MatTableDataSource(userList);
	}

	ngOnInit(): void {}

	reset() {
		this.dataSource = new MatTableDataSource(users);
		this.setPaginators();

		this.searchDonorControl.reset();
		this.filterDonorControl.reset();
	}

	setPaginators() {
		this.dataSource.paginator = this.paginator;
		this.dataSource.sort = this.sort;
	}
}
