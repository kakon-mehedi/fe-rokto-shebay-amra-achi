import { Component, OnInit } from '@angular/core';
import { IModule } from '../../interfaces/module-properties.interface';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
	constructor() {}

	ngOnInit(): void {}

	modules: IModule[] = [
		{
			title: 'নতুন ডোনার ফর্ম ফিল আপ',
			url: '/donors',
			icon: 'register',
		},

		// {
		// 	title: 'এডমিন লগইন',
		// 	url: '/users/login',
		// 	icon: 'register',
		// },

		{
			title: 'ডোনার লিস্ট ',
			url: '/dashboard',
			icon: 'register',
		}
	];
}
