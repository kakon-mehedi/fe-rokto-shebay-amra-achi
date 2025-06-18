import { Injectable } from '@angular/core';
import { Donor } from '../interfaces/donor.interface';

@Injectable({
	providedIn: 'root',
})
export class DonorService {
	constructor() {}

	getDonors(): Donor[] {
		return [
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
	}
	getDonorById(donorId: string): Donor {
		return {
			name: 'John Doe',
			address: 'Dhaka',
			bloodGroup: 'A+',
			mobileNumber: '0123456789',
			lastDonationDate: '2024-01-15',
			totalDonations: 5,
			isAvailable: true,
		};
	}
}
