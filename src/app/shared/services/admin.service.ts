import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AdminProfile {
  _id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'SUPER_ADMIN';
  address: {
    street?: string;
    city?: string;
    district?: string;
    division?: string;
    postalCode?: string;
    mobileNumber: string;
    addressLine?: string; // For backward compatibility
  };
  profilePhoto?: string;
  permissions: string[];
  isActive: boolean;
  joinDate: string;
  lastLoginDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminProfileUpdateRequest {
  name?: string;
  email?: string;
  address?: {
    street?: string;
    city?: string;
    district?: string;
    division?: string;
    postalCode?: string;
    mobileNumber?: string;
  };
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ApiResponse<T> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private baseUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  // Get admin profile
  getAdminProfile(): Observable<ApiResponse<AdminProfile>> {
    return this.http.get<ApiResponse<AdminProfile>>(`${this.baseUrl}/admin/profile`);
  }

  // Update admin profile
  updateAdminProfile(profileData: AdminProfileUpdateRequest, profilePhoto?: File): Observable<ApiResponse<AdminProfile>> {
    const formData = new FormData();
    
    // Add profile data
    Object.keys(profileData).forEach(key => {
      const value = profileData[key as keyof AdminProfileUpdateRequest];
      if (value !== undefined && value !== null) {
        if (typeof value === 'object') {
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

    return this.http.put<ApiResponse<AdminProfile>>(`${this.baseUrl}/admin/profile`, formData);
  }

  // Change admin password
  changePassword(passwordData: ChangePasswordRequest): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.baseUrl}/admin/change-password`, passwordData);
  }

  // Upload profile photo only
  uploadProfilePhoto(photo: File): Observable<ApiResponse<AdminProfile>> {
    const formData = new FormData();
    formData.append('profilePhoto', photo);
    return this.http.put<ApiResponse<AdminProfile>>(`${this.baseUrl}/admin/profile`, formData);
  }
}
