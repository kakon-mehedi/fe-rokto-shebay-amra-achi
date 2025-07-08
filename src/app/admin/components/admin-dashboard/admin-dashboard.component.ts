import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminDashboardService, DashboardStats, RecentActivity, BloodGroupStats } from '../../../shared/services/admin-dashboard.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  
  stats: DashboardStats = {
    totalDonors: 0,
    activeDonors: 0,
    pendingDonors: 0,
    suspendedDonors: 0,
    totalUsers: 0,
    totalDonations: 0,
    thisMonthDonations: 0,
    emergencyRequests: 0
  };

  recentActivities: RecentActivity[] = [];
  bloodGroupStats: BloodGroupStats[] = [];
  
  isLoading = true;
  
  // Chart data (placeholder)
  donationChartData: any[] = [];
  registrationChartData: any[] = [];

  constructor(private adminDashboardService: AdminDashboardService, private router: Router) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.isLoading = true;
    this.adminDashboardService.getDashboardStats().subscribe({
      next: (res) => {
        this.stats = res.stats;
        this.bloodGroupStats = res.bloodGroupStats;
        this.recentActivities = res.recentActivities;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        // Optionally show error message
      }
    });
  }

  getActivityIcon(type: string): string {
    switch (type) {
      case 'registration': return 'person_add';
      case 'donation': return 'favorite';
      case 'emergency': return 'emergency';
      case 'approval': return 'check_circle';
      default: return 'info';
    }
  }

  getActivityClass(type: string): string {
    switch (type) {
      case 'registration': return 'activity-registration';
      case 'donation': return 'activity-donation';
      case 'emergency': return 'activity-emergency';
      case 'approval': return 'activity-approval';
      default: return 'activity-default';
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'pending': return 'status-pending';
      case 'completed': return 'status-completed';
      case 'urgent': return 'status-urgent';
      case 'approved': return 'status-approved';
      case 'active': return 'status-active';
      default: return 'status-default';
    }
  }

  refreshDashboard() {
    this.loadDashboardData();
  }

  navigateToSection(section?: string) {
    if (!section) {
      this.router.navigate(['/admin/donors']);
    } else {
      this.router.navigate([`/admin/${section}`]);
    }
  }
}
