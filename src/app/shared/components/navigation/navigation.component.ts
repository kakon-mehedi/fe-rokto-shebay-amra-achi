import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { Component, OnInit, Input } from '@angular/core';
import { Observable, map, shareReplay } from "rxjs";
import { NavigationService } from "../../services/navigation.service";
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  type: 'primary' | 'warn' | 'accent';
  icon: string;
  read: boolean;
}

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

  @Input() hidden: boolean = false;
  
  isLoggedIn: boolean = false;
  isLoading: boolean = false;
  openNotificationPanel: boolean = false;
  sidenavOpened: boolean = false;

  // Sample notifications data
  notifications: Notification[] = [
    {
      id: 1,
      title: 'নতুন রক্তদাতা নিবন্ধিত',
      message: 'মোহাম্মদ আব্দুল করিম (AB+) আজ নিবন্ধিত হয়েছেন',
      time: '২ মিনিট আগে',
      type: 'primary',
      icon: 'person_add',
      read: false
    },
    {
      id: 2,
      title: 'জরুরি রক্তের প্রয়োজন',
      message: 'ঢাকা মেডিকেল কলেজে O- গ্রুপের রক্ত দরকার',
      time: '১৫ মিনিট আগে',
      type: 'warn',
      icon: 'emergency',
      read: false
    },
    {
      id: 3,
      title: 'সিস্টেম আপডেট',
      message: 'রক্তদাতা ডেটাবেস সফলভাবে আপডেট হয়েছে',
      time: '১ ঘন্টা আগে',
      type: 'accent',
      icon: 'system_update',
      read: true
    }
  ];

  isHandset: boolean = false;

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private navigationService: NavigationService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    // Check authentication status
    this.isLoggedIn = this.authService.isAuthenticated();
    
    // Subscribe to authentication changes
    this.authService.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user || this.authService.isAuthenticated();
    });

    // Subscribe to handset changes
    this.isHandset$.subscribe(isHandset => {
      this.isHandset = isHandset;
    });
    
    console.log('Navigation comp run', { isLoggedIn: this.isLoggedIn });
  }

  onSignOut() {
    this.authService.logout();
    this.isLoggedIn = false;
    this.router.navigate(['/']);
    this.snackBar.open('সফলভাবে লগআউট হয়েছে', 'বন্ধ করুন', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  onLogin() {
    this.router.navigate(['/users/login']);
  }

  toggleNotification() {
    this.openNotificationPanel = !this.openNotificationPanel;
  }

  get unreadNotificationCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  closeSidenav() {
    this.sidenavOpened = false;
  }

  toggleSidenav() {
    this.sidenavOpened = !this.sidenavOpened;
  }
}
