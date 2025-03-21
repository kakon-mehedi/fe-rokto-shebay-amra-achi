import { Injectable } from '@angular/core';
import { Donor } from '../interfaces/donor.interface';

@Injectable({
	providedIn: 'root',
})
export class DonorService {
    constructor() {
        
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
