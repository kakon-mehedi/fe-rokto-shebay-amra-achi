import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface DashboardStats {
  totalDonors: number;
  activeDonors: number;
  pendingDonors: number;
  suspendedDonors: number;
  totalUsers: number;
  totalDonations: number;
  thisMonthDonations: number;
  emergencyRequests: number;
}

export interface RecentActivity {
  id?: string;
  type: string;
  message: string;
  time: string;
  user?: string;
  status?: string;
}

export interface BloodGroupStats {
  bloodGroup: string;
  count: number;
  percentage: number;
}

export interface DashboardApiResponse {
  stats: DashboardStats;
  bloodGroupStats: BloodGroupStats[];
  recentActivities: RecentActivity[];
}

@Injectable({ providedIn: 'root' })
export class AdminDashboardService {
  private baseUrl = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  getDashboardStats(): Observable<DashboardApiResponse> {
    return this.http.get<DashboardApiResponse>(`${this.baseUrl}/dashboard-stats`);
  }
}
