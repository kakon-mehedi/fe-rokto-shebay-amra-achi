import { Component, OnInit, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { DonorService } from '../../services/donor.service';
import { User } from '../../interfaces/user.interface';
import { DonorResponse } from '../../interfaces/donor.interface';

@Component({
  selector: 'app-navigation-new',
  templateUrl: './navigation-new.component.html',
  styleUrls: ['./navigation-new.component.scss']
})
export class NavigationNewComponent implements OnInit {
  isMobileMenuOpen = false;
  isLegalDropdownOpen = false;
  currentRoute = '';

  // Real user state
  isLoggedIn = false;
  isAdmin = false;
  isDonor = false;
  userName = '';
  userAvatar = '';
  isUserDropdownOpen = false;
  isLoginDropdownOpen = false;
  isMobileLoginDropdownOpen = false;
  isMobileUserDropdownOpen = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private donorService: DonorService
  ) {}

  ngOnInit() {
    // Track current route for active link highlighting
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.currentRoute = (event as NavigationEnd).url;
      });
    this.currentRoute = this.router.url;

    // Subscribe to AuthService for admin/user
    this.authService.currentUser$.subscribe((user: User | null) => {
      this.isLoggedIn = this.authService.isAuthenticated();
      this.isAdmin = this.authService.isAdmin();
      if (user) {
        this.userName = user.name || '';
        this.userAvatar = user.profilePhoto || '';
      }
    });

    // Subscribe to DonorService for donor
    this.donorService.currentDonor$.subscribe((donor: DonorResponse | null) => {
      this.isDonor = this.donorService.isAuthenticated();
      if (this.isDonor && donor) {
        this.isLoggedIn = true;
        this.isAdmin = false;
        this.userName = donor.name || '';
        this.userAvatar = donor.profilePhoto || '';
      }
    });
  }

  // Close dropdowns when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown')) {
      this.isLegalDropdownOpen = false;
      this.closeUserDropdown();
      this.closeLoginDropdown();
    }
    if (!target.closest('.mobile-login-dropdown')) {
      this.isMobileLoginDropdownOpen = false;
    }
    if (!target.closest('.mobile-user-dropdown')) {
      this.isMobileUserDropdownOpen = false;
    }
  }

  // Close mobile menu on escape key
  @HostListener('document:keydown.escape')
  onEscapeKey() {
    this.closeMobileMenu();
    this.closeLegalDropdown();
    this.closeUserDropdown();
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    // Prevent body scroll when mobile menu is open
    if (this.isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
    document.body.style.overflow = '';
  }

  toggleLegalDropdown() {
    this.isLegalDropdownOpen = !this.isLegalDropdownOpen;
  }

  closeLegalDropdown() {
    this.isLegalDropdownOpen = false;
  }

  isActiveRoute(route: string): boolean {
    return this.currentRoute === route || this.currentRoute.startsWith(route + '/');
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
    this.closeMobileMenu();
    this.closeLegalDropdown();
  }

  // Example: call this after login
  setUser(type: 'donor' | 'admin', name: string, avatar: string) {
    this.isLoggedIn = true;
    this.isAdmin = type === 'admin';
    this.userName = name;
    this.userAvatar = avatar;
  }

  logout() {
    if (this.isAdmin) {
      this.authService.logout();
    } else if (this.isDonor) {
      this.donorService.logout().subscribe();
    }
    this.isLoggedIn = false;
    this.isAdmin = false;
    this.isDonor = false;
    this.userName = '';
    this.userAvatar = '';
    this.isUserDropdownOpen = false;
    this.router.navigate(['/']);
  }

  toggleLoginDropdown(event: Event) {
    event.stopPropagation();
    this.isLoginDropdownOpen = !this.isLoginDropdownOpen;
    if (this.isLoginDropdownOpen) {
      this.isUserDropdownOpen = false;
    }
  }

  closeLoginDropdown() {
    this.isLoginDropdownOpen = false;
  }

  toggleUserDropdown() {
    this.isUserDropdownOpen = !this.isUserDropdownOpen;
    if (this.isUserDropdownOpen) {
      this.isLoginDropdownOpen = false;
    }
  }

  closeUserDropdown() {
    this.isUserDropdownOpen = false;
  }

  toggleMobileLoginDropdown(event: Event) {
    event.stopPropagation();
    this.isMobileLoginDropdownOpen = !this.isMobileLoginDropdownOpen;
    if (this.isMobileLoginDropdownOpen) {
      this.isMobileUserDropdownOpen = false;
    }
  }

  toggleMobileUserDropdown() {
    this.isMobileUserDropdownOpen = !this.isMobileUserDropdownOpen;
    if (this.isMobileUserDropdownOpen) {
      this.isMobileLoginDropdownOpen = false;
    }
  }
}