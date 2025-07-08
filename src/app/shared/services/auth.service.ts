import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User, LoginRequest, LoginResponse, RegisterRequest } from '../interfaces/user.interface';
import { ApiResponse } from '../../dashboard/interfaces/donor.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private tokenKey = 'roktoShebaAccessToken';
  private userKey = 'roktoShebaCurrentUser';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  register(userData: RegisterRequest): Observable<ApiResponse<User[]>> {
    const formData = new FormData();
    
    formData.append('name', userData.name);
    if (userData.email) formData.append('email', userData.email);
    if (userData.password) formData.append('password', userData.password);
    if (userData.confirmPassword) formData.append('confirmPassword', userData.confirmPassword);
    formData.append('address[addressLine]', userData.address.addressLine);
    formData.append('address[mobileNumber]', userData.address.mobileNumber);
    formData.append('bloodGroup', userData.bloodGroup);
    
    if (userData.profilePhoto) {
      formData.append('profilePhoto', userData.profilePhoto);
    }

    return this.http.post<ApiResponse<User[]>>(`${this.apiUrl}/users/register`, formData);
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/users/login`, credentials)
      .pipe(
        tap(response => {
          if (response.success) {
            localStorage.setItem(this.tokenKey, response.data);
            this.getCurrentUserProfile().subscribe({
              next: (userResponse) => {
                if (userResponse.success && userResponse.data) {
                  const user = Array.isArray(userResponse.data) ? userResponse.data[0] : userResponse.data;
                  localStorage.setItem(this.userKey, JSON.stringify(user));
                  this.currentUserSubject.next(user);
                }
              },
              error: () => {
                // If we can't get user profile, still proceed with login
                console.warn('Could not fetch user profile after login');
              }
            });
          }
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;
    
    // Check if token is expired (basic check)
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp > Date.now() / 1000;
    } catch {
      return false;
    }
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'admin' || false;
  }

  private getCurrentUserProfile(): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(`${this.apiUrl}/users/profile`, {
      headers: this.getAuthHeaders()
    });
  }

  private loadUserFromStorage(): void {
    const token = this.getToken();
    const userStr = localStorage.getItem(this.userKey);
    
    if (token && this.isAuthenticated() && userStr) {
      try {
        const user = JSON.parse(userStr);
        this.currentUserSubject.next(user);
      } catch {
        // Clear invalid data
        this.logout();
      }
    } else {
      // Clear invalid data
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.userKey);
    }
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // Admin methods
  getUsers(): Observable<ApiResponse<User[]>> {
    return this.http.get<ApiResponse<User[]>>(`${this.apiUrl}/users`, {
      headers: this.getAuthHeaders()
    });
  }

  getUserById(id: string): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(`${this.apiUrl}/users/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  updateUser(id: string, userData: Partial<User>): Observable<ApiResponse<User>> {
    return this.http.put<ApiResponse<User>>(`${this.apiUrl}/users/${id}`, userData, {
      headers: this.getAuthHeaders()
    });
  }

  // Admin check with fallback for development/testing
  adminLogin(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/admin/login`, credentials)
      .pipe(
        tap(response => {
          if (response.success) {
            localStorage.setItem(this.tokenKey, response.data);
            this.getCurrentUserProfile().subscribe({
              next: (userResponse) => {
                if (userResponse.success && userResponse.data) {
                  const user = Array.isArray(userResponse.data) ? userResponse.data[0] : userResponse.data;
                  localStorage.setItem(this.userKey, JSON.stringify(user));
                  this.currentUserSubject.next(user);
                }
              },
              error: () => {
                console.warn('Could not fetch admin profile after login');
              }
            });
          }
        })
      );
  }

  // For development: create temporary admin session
  createTempAdminSession(adminData: User): void {
    const tempToken = btoa(JSON.stringify({ 
      userId: adminData._id || 'temp-admin', 
      role: 'admin',
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
    }));
    
    localStorage.setItem(this.tokenKey, tempToken);
    localStorage.setItem(this.userKey, JSON.stringify(adminData));
    this.currentUserSubject.next(adminData);
  }
}
