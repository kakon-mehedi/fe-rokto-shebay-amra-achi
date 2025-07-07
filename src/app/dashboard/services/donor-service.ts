import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Donor, ApiResponse } from '../interfaces/donor.interface';
import { AuthService } from '../../shared/services/auth.service';

@Injectable({
	providedIn: 'root',
})
export class DonorService {
	private apiUrl = environment.apiUrl;

	constructor(private http: HttpClient, private authService: AuthService) {}

	private getAuthHeaders(): HttpHeaders {
		const token = this.authService.getToken();
		return new HttpHeaders({
			'Authorization': `Bearer ${token}`,
			'Content-Type': 'application/json'
		});
	}

	private getFormDataHeaders(): HttpHeaders {
		const token = this.authService.getToken();
		return new HttpHeaders({
			'Authorization': `Bearer ${token}`
			// Don't set Content-Type for FormData, let browser set it
		});
	}

	// Public endpoint - Add donor
	addDonor(donorData: Donor, profilePhoto?: File): Observable<ApiResponse<Donor>> {
		const formData = new FormData();
		
		formData.append('name', donorData.name);
		formData.append('address', donorData.address);
		formData.append('mobileNumber', donorData.mobileNumber);
		formData.append('bloodGroup', donorData.bloodGroup);
		
		// Add new fields
		if (donorData.lastDonationDate) {
			formData.append('lastDonationDate', donorData.lastDonationDate.toString());
		}
		if (donorData.totalNumberOfDonation !== undefined) {
			formData.append('totalNumberOfDonation', donorData.totalNumberOfDonation.toString());
		}
		
		if (profilePhoto) {
			formData.append('profilePhoto', profilePhoto);
		}

		return this.http.post<ApiResponse<Donor>>(`${this.apiUrl}/donors`, formData);
	}

	// Admin only endpoints
	getDonors(): Observable<ApiResponse<Donor[]>> {
		return this.http.get<ApiResponse<Donor[]>>(`${this.apiUrl}/donors`, {
			headers: this.getAuthHeaders()
		});
	}

	getDonorById(id: string): Observable<ApiResponse<Donor>> {
		console.log('getDonorById called with ID:', id);
		
		// Check if authenticated and use API
		if (this.authService.isAuthenticated()) {
			console.log('Fetching donor from API...');
			return this.http.get<ApiResponse<Donor>>(`${this.apiUrl}/donors/${id}`, {
				headers: this.getAuthHeaders()
			});
		} else {
			// Fallback to mock data for non-authenticated users
			console.log('Not authenticated, using mock data...');
			const mockDonors = this.getMockDonors();
			console.log('Available mock donors:', mockDonors.map(d => ({ id: d._id, name: d.name })));
			
			const donor = mockDonors.find(d => d._id === id);
			console.log('Found donor:', donor);
			
			if (donor) {
				// Simulate successful API response
				const response: ApiResponse<Donor> = {
					success: true,
					data: donor,
					message: 'Donor found successfully',
					statusCode: 200
				};
				return new Observable(observer => {
					setTimeout(() => {
						console.log('Returning successful response:', response);
						observer.next(response);
						observer.complete();
					}, 300);
				});
			} else {
				// Return error response
				const response: ApiResponse<Donor> = {
					success: false,
					data: null as any,
					message: 'Donor not found',
					statusCode: 404
				};
				return new Observable(observer => {
					setTimeout(() => {
						console.log('Returning error response:', response);
						observer.next(response);
					}, 300);
				});
			}
		}
	}

	updateDonor(id: string, donorData: Partial<Donor>, profilePhoto?: File): Observable<ApiResponse<Donor>> {
		if (profilePhoto) {
			// If there's a file upload, use FormData
			const formData = new FormData();
			
			Object.keys(donorData).forEach(key => {
				const value = donorData[key as keyof Donor];
				if (value !== undefined && value !== null) {
					if (value instanceof Date) {
						formData.append(key, value.toISOString());
					} else {
						formData.append(key, value.toString());
					}
				}
			});
			
			formData.append('profilePhoto', profilePhoto);
			
			return this.http.put<ApiResponse<Donor>>(`${this.apiUrl}/donors/${id}`, formData, {
				headers: this.getFormDataHeaders()
			});
		} else {
			// Regular JSON update
			return this.http.put<ApiResponse<Donor>>(`${this.apiUrl}/donors/${id}`, donorData, {
				headers: this.getAuthHeaders()
			});
		}
	}

	deleteDonor(id: string): Observable<ApiResponse<Donor>> {
		return this.http.delete<ApiResponse<Donor>>(`${this.apiUrl}/donors/${id}`, {
			headers: this.getAuthHeaders()
		});
	}

	updateDonationDate(id: string, donationData: any): Observable<ApiResponse<Donor>> {
		return this.http.put<ApiResponse<Donor>>(`${this.apiUrl}/donors/${id}/update-donation`, 
			donationData, {
			headers: this.getAuthHeaders()
		});
	}

	// Mock data for fallback (when not authenticated)
	getMockDonors(): Donor[] {
		return [
			{
				_id: '685280e5c407d6a8a8093542',
				name: 'মোহাম্মদ রহিম',
				address: 'ঢাকা, বাংলাদেশ',
				bloodGroup: 'A+',
				mobileNumber: '01712345678',
				lastDonationDate: new Date('2024-01-15'),
				totalNumberOfDonation: 5,
			},
			{
				_id: '685280e5c407d6a8a8093543',
				name: 'ফাতেমা খাতুন',
				address: 'চট্টগ্রাম, বাংলাদেশ',
				bloodGroup: 'B-',
				mobileNumber: '01987654321',
				lastDonationDate: new Date('2024-03-05'),
				totalNumberOfDonation: 3,
			},
			{
				_id: '685280e5c407d6a8a8093544',
				name: 'আবুল হাসান',
				address: 'সিলেট, বাংলাদেশ',
				bloodGroup: 'O+',
				mobileNumber: '01555666777',
				lastDonationDate: new Date('2023-12-10'),
				totalNumberOfDonation: 10,
			},
			{
				_id: '685280e5c407d6a8a8093545',
				name: 'সালমা বেগম',
				address: 'রাজশাহী, বাংলাদেশ',
				bloodGroup: 'AB+',
				mobileNumber: '01666777888',
				lastDonationDate: new Date('2024-02-20'),
				totalNumberOfDonation: 7,
			},
			{
				_id: '685280e5c407d6a8a8093546',
				name: 'করিম উদ্দিন',
				address: 'বরিশাল, বাংলাদেশ',
				bloodGroup: 'O-',
				mobileNumber: '01777888999',
				lastDonationDate: new Date('2023-11-05'),
				totalNumberOfDonation: 12,
			}
		];
	}
}
