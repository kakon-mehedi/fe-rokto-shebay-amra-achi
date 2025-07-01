import { Component, OnInit } from '@angular/core';

interface DashboardStats {
  totalDonors: number;
  activeDonors: number;
  pendingDonors: number;
  suspendedDonors: number;
  totalUsers: number;
  totalDonations: number;
  thisMonthDonations: number;
  emergencyRequests: number;
}

interface RecentActivity {
  id: string;
  type: 'registration' | 'donation' | 'emergency' | 'approval';
  message: string;
  time: string;
  user?: string;
  status?: string;
}

interface BloodGroupStats {
  bloodGroup: string;
  count: number;
  percentage: number;
}

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

  constructor() {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.isLoading = true;
    
    // TODO: Replace with actual API calls
    setTimeout(() => {
      // Mock stats data
      this.stats = {
        totalDonors: 1250,
        activeDonors: 1180,
        pendingDonors: 45,
        suspendedDonors: 25,
        totalUsers: 850,
        totalDonations: 3420,
        thisMonthDonations: 145,
        emergencyRequests: 8
      };

      // Mock recent activities
      this.recentActivities = [
        {
          id: '1',
          type: 'registration',
          message: 'নতুন রক্তদাতা নিবন্ধন করেছেন',
          time: '৫ মিনিট আগে',
          user: 'মোঃ রহিম উদ্দিন',
          status: 'pending'
        },
        {
          id: '2',
          type: 'donation',
          message: 'রক্তদান সম্পন্ন হয়েছে',
          time: '১৫ মিনিট আগে',
          user: 'সালমা খাতুন',
          status: 'completed'
        },
        {
          id: '3',
          type: 'emergency',
          message: 'জরুরি রক্তের প্রয়োজন',
          time: '৩০ মিনিট আগে',
          user: 'ঢাকা মেডিকেল কলেজ',
          status: 'urgent'
        },
        {
          id: '4',
          type: 'approval',
          message: 'রক্তদাতা অনুমোদিত হয়েছে',
          time: '১ ঘন্টা আগে',
          user: 'করিম আহমেদ',
          status: 'approved'
        },
        {
          id: '5',
          type: 'registration',
          message: 'নতুন ব্যবহারকারী যোগ দিয়েছেন',
          time: '২ ঘন্টা আগে',
          user: 'ফাতেমা বেগম',
          status: 'active'
        }
      ];

      // Mock blood group statistics
      this.bloodGroupStats = [
        { bloodGroup: 'O+', count: 285, percentage: 22.8 },
        { bloodGroup: 'A+', count: 275, percentage: 22.0 },
        { bloodGroup: 'B+', count: 225, percentage: 18.0 },
        { bloodGroup: 'AB+', count: 125, percentage: 10.0 },
        { bloodGroup: 'O-', count: 115, percentage: 9.2 },
        { bloodGroup: 'A-', count: 95, percentage: 7.6 },
        { bloodGroup: 'B-', count: 85, percentage: 6.8 },
        { bloodGroup: 'AB-', count: 45, percentage: 3.6 }
      ];

      this.isLoading = false;
    }, 1000);
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

  navigateToSection(section: string) {
    // TODO: Implement navigation to specific sections
    console.log('Navigate to:', section);
  }
}
