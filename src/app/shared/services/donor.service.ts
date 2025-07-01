import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { 
  DonorRegisterRequest, 
  DonorLoginRequest, 
  DonorLoginResponse, 
  DonorResponse,
  PublicDonorResponse,
  EligibilityCheck,
  DonationRecord,
  ApiResponse
} from '../interfaces/donor.interface';

@Injectable({
  providedIn: 'root'
})
export class DonorService {
  private readonly API_BASE_URL = environment.apiUrl;
  private currentDonorSubject = new BehaviorSubject<DonorResponse | null>(null);
  public currentDonor$ = this.currentDonorSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadDonorFromStorage();
  }

  // Authentication Methods
  register(donorData: DonorRegisterRequest, profilePhoto?: File): Observable<any> {
    const formData = new FormData();
    
    // Add all donor data to FormData
    Object.keys(donorData).forEach(key => {
      const value = (donorData as any)[key];
      if (value !== undefined && value !== null) {
        if (key === 'emergencyContact' && typeof value === 'object') {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value.toString());
        }
      }
    });

    // Add profile photo if provided
    if (profilePhoto) {
      formData.append('profilePhoto', profilePhoto);
    }

    return this.http.post(`${this.API_BASE_URL}/donor-auth/register`, formData);
  }

  login(loginData: DonorLoginRequest): Observable<DonorLoginResponse> {
    return this.http.post<DonorLoginResponse>(`${this.API_BASE_URL}/donor-auth/login`, loginData)
      .pipe(
        tap(response => {
          if (response.data && response.data.donor) {
            this.setCurrentDonor(response.data.donor);
            this.storeTokens(response.data.accessToken, response.data.refreshToken);
          }
        })
      );
  }

  logout(): Observable<any> {
    return this.http.post(`${this.API_BASE_URL}/donor-auth/logout`, {}, { 
      headers: this.getAuthHeaders() 
    }).pipe(
      tap(() => {
        this.clearDonorData();
      })
    );
  }

  refreshToken(): Observable<any> {
    const refreshToken = localStorage.getItem('donor_refresh_token');
    return this.http.post(`${this.API_BASE_URL}/donor-auth/refresh-token`, {
      refreshToken
    });
  }

  // Profile Methods
  getCurrentProfile(): Observable<ApiResponse<DonorResponse>> {
    return this.http.get<ApiResponse<DonorResponse>>(`${this.API_BASE_URL}/donor-auth/profile`, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(response => {
        if (response.data) {
          this.setCurrentDonor(response.data);
        }
      })
    );
  }

  updateProfile(profileData: Partial<DonorResponse>, profilePhoto?: File): Observable<any> {
    const formData = new FormData();
    
    Object.keys(profileData).forEach(key => {
      const value = (profileData as any)[key];
      if (value !== undefined && value !== null) {
        if (typeof value === 'object') {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value.toString());
        }
      }
    });

    if (profilePhoto) {
      formData.append('profilePhoto', profilePhoto);
    }

    return this.http.patch(`${this.API_BASE_URL}/donor-auth/profile`, formData, {
      headers: this.getAuthHeaders()
    });
  }

  changePassword(oldPassword: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.API_BASE_URL}/donor-auth/change-password`, {
      oldPassword,
      newPassword
    }, {
      headers: this.getAuthHeaders()
    });
  }

  // Donation Methods
  getDonationHistory(): Observable<any> {
    return this.http.get(`${this.API_BASE_URL}/donor-auth/donation-history`, {
      headers: this.getAuthHeaders()
    });
  }

  checkEligibility(): Observable<EligibilityCheck> {
    return this.http.get<any>(`${this.API_BASE_URL}/donor-auth/check-eligibility`, {
      headers: this.getAuthHeaders()
    });
  }

  // Public Methods (No authentication required)
  getPublicDonors(params?: any): Observable<any> {
    let queryString = '';
    if (params) {
      const queryParams = new URLSearchParams(params).toString();
      queryString = queryParams ? `?${queryParams}` : '';
    }
    
    return this.http.get(`${this.API_BASE_URL}/donors${queryString}`);
  }

  getPublicDonorDetails(donorId: string): Observable<PublicDonorResponse> {
    return this.http.get<any>(`${this.API_BASE_URL}/donors/${donorId}`);
  }

  // ======================
  // Admin API Methods
  // ======================

  // Get all donors for admin with pagination and filters
  getAllDonorsForAdmin(params?: {
    page?: number;
    limit?: number;
    bloodGroup?: string;
    city?: string;
    eligibilityStatus?: string;
    accountStatus?: string;
    search?: string;
  }): Observable<any> {
    let queryParams = '';
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString());
        }
      });
      queryParams = searchParams.toString() ? '?' + searchParams.toString() : '';
    }

    const token = localStorage.getItem('access_token'); // Admin token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get(`${this.API_BASE_URL}/donors/admin/all${queryParams}`, { headers });
  }

  // Get single donor details for admin
  getDonorDetailsForAdmin(donorId: string): Observable<any> {
    const token = localStorage.getItem('access_token'); // Admin token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get(`${this.API_BASE_URL}/donors/admin/${donorId}`, { headers });
  }

  // Update donor (admin only)
  updateDonorAsAdmin(donorId: string, updateData: any): Observable<any> {
    const token = localStorage.getItem('access_token'); // Admin token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.put(`${this.API_BASE_URL}/donors/admin/${donorId}`, updateData, { headers });
  }

  // Delete donor (admin only)
  deleteDonorAsAdmin(donorId: string): Observable<any> {
    const token = localStorage.getItem('access_token'); // Admin token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.delete(`${this.API_BASE_URL}/donors/admin/${donorId}`, { headers });
  }

  // Approve donor
  approveDonor(donorId: string): Observable<any> {
    const token = localStorage.getItem('access_token'); // Admin token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.put(`${this.API_BASE_URL}/donors/${donorId}/approve`, {}, { headers });
  }

  // Reject donor
  rejectDonor(donorId: string): Observable<any> {
    const token = localStorage.getItem('access_token'); // Admin token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.put(`${this.API_BASE_URL}/donors/${donorId}/reject`, {}, { headers });
  }

  // Helper Methods
  isAuthenticated(): boolean {
    return !!localStorage.getItem('donor_access_token') && !!this.currentDonorSubject.value;
  }

  getCurrentDonor(): DonorResponse | null {
    return this.currentDonorSubject.value;
  }

  private setCurrentDonor(donor: DonorResponse): void {
    this.currentDonorSubject.next(donor);
    localStorage.setItem('current_donor', JSON.stringify(donor));
  }

  private storeTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('donor_access_token', accessToken);
    localStorage.setItem('donor_refresh_token', refreshToken);
  }

  private clearDonorData(): void {
    this.currentDonorSubject.next(null);
    localStorage.removeItem('current_donor');
    localStorage.removeItem('donor_access_token');
    localStorage.removeItem('donor_refresh_token');
  }

  private loadDonorFromStorage(): void {
    const storedDonor = localStorage.getItem('current_donor');
    if (storedDonor) {
      try {
        const donor = JSON.parse(storedDonor);
        this.currentDonorSubject.next(donor);
      } catch (error) {
        console.error('Error parsing stored donor data:', error);
        this.clearDonorData();
      }
    }
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('donor_access_token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }
}
