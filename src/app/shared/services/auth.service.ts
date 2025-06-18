import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User, LoginRequest, LoginResponse, RegisterRequest } from '../interfaces/user.interface';
import { ApiResponse } from '../../dashboard/interfaces/donor.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private tokenKey = 'roktoShebaAccessToken';
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
            // You might want to fetch user details here
          }
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
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

  private loadUserFromStorage(): void {
    const token = this.getToken();
    if (token && this.isAuthenticated()) {
      // You might want to fetch current user details from API
      // For now, we'll just set authentication state
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
}
