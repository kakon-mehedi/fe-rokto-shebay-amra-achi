import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { User } from '../../../shared/interfaces/user.interface';

interface MenuItem {
  icon: string;
  label: string;
  route: string;
  badge?: number;
}

interface Notification {
  id: string;
  type: 'new-donor' | 'blood-request' | 'emergency';
  title: string;
  description: string;
  time: string;
  isRead: boolean;
}

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent implements OnInit {
  @ViewChild('drawer') drawer!: MatSidenav;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  menuItems: MenuItem[] = [
    { icon: 'dashboard', label: 'ড্যাশবোর্ড', route: '/admin/dashboard' },
    { icon: 'people', label: 'রক্তদাতা ব্যবস্থাপনা', route: '/admin/donors' },
    { icon: 'person', label: 'ব্যবহারকারী ব্যবস্থাপনা', route: '/admin/users' },
    { icon: 'analytics', label: 'রিপোর্ট ও পরিসংখ্যান', route: '/admin/reports' },
    { icon: 'settings', label: 'সেটিংস', route: '/admin/settings' },
  ];

  currentUser: User | null = null;
  openNotificationPanel: boolean = false;
  openUserPanel: boolean = false;
  
  notifications: Notification[] = [
    {
      id: '1',
      type: 'new-donor',
      title: 'নতুন রক্তদাতা নিবন্ধন',
      description: 'মোহাম্মদ আলী রহমান নিবন্ধন করেছেন',
      time: '৫ মিনিট আগে',
      isRead: false
    },
    {
      id: '2',
      type: 'blood-request',
      title: 'রক্তদানের অনুরোধ',
      description: 'A+ রক্তের জরুরি প্রয়োজন - ঢাকা মেডিকেল',
      time: '১৫ মিনিট আগে',
      isRead: false
    },
    {
      id: '3',
      type: 'emergency',
      title: 'জরুরি রক্তের প্রয়োজন',
      description: 'O- রক্তের জন্য জরুরি অনুরোধ',
      time: '৩০ মিনিট আগে',
      isRead: false
    }
  ];

  constructor(
    private breakpointObserver: BreakpointObserver,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadCurrentUser();
  }

  loadCurrentUser() {
    // Get current user from auth service
    this.currentUser = this.authService.getCurrentUser();
    
    // Subscribe to user changes
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  closeSidenavOnMobile() {
    this.isHandset$.subscribe(isHandset => {
      if (isHandset && this.drawer) {
        this.drawer.close();
      }
    });
  }

  // Get unread notification count
  get unreadNotificationCount(): number {
    return this.notifications.filter(n => !n.isRead).length;
  }

  // Mark notification as read
  markNotificationAsRead(notificationId: string) {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.isRead = true;
    }
  }

  // Mark all notifications as read
  markAllNotificationsAsRead() {
    this.notifications.forEach(n => n.isRead = true);
  }

  // View all notifications
  viewAllNotifications() {
    this.router.navigate(['/admin/notifications']);
  }

  // Get notification icon based on type
  getNotificationIcon(type: string): string {
    switch (type) {
      case 'new-donor':
        return 'person_add';
      case 'blood-request':
        return 'favorite';
      case 'emergency':
        return 'warning';
      default:
        return 'notifications';
    }
  }

  // Toggle notification panel
  toggleNotification(): void {
    this.openNotificationPanel = !this.openNotificationPanel;
    this.openUserPanel = false; // Close user panel if open
  }

  // Toggle user panel
  toggleUserPanel(): void {
    this.openUserPanel = !this.openUserPanel;
    this.openNotificationPanel = false; // Close notification panel if open
  }

  // Close all panels
  closeAllPanels(): void {
    this.openNotificationPanel = false;
    this.openUserPanel = false;
  }
}
