import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelectChange } from '@angular/material/select';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { donors } from '../../dashboard.constant';

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

	constructor() {
		this.dataSource = new MatTableDataSource(users);
	}

	ngAfterViewInit() {
		this.dataSource.paginator = this.paginator;
		this.dataSource.sort = this.sort;
	}

	applyFilter(event: Event) {
		const filterValue = (event.target as HTMLInputElement).value;
		this.dataSource.filter = filterValue.trim().toLowerCase();

		if (this.dataSource.paginator) {
			this.dataSource.paginator.firstPage();
		}
	}

	filterUserByBloodGroup(event: MatSelectChange) {
		const userList = users.filter((user) => user.bloodGroup === event.value);
    this.dataSource = new MatTableDataSource(userList);
	}

	ngOnInit(): void {}

  reset() {
    this.dataSource = new MatTableDataSource(users);
  }
}
