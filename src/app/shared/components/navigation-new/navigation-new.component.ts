import { Component, OnInit, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navigation-new',
  templateUrl: './navigation-new.component.html',
  styleUrls: ['./navigation-new.component.scss']
})
export class NavigationNewComponent implements OnInit {
  isMobileMenuOpen = false;
  isLegalDropdownOpen = false;
  currentRoute = '';

  // Mock user state (replace with real auth logic)
  isLoggedIn = false;
  isAdmin = false;
  userName = '';
  userAvatar = '';
  isUserDropdownOpen = false;
  isLoginDropdownOpen = false;
  isMobileLoginDropdownOpen = false;
  isMobileUserDropdownOpen = false;

  constructor(private router: Router) {}

  ngOnInit() {
    // Track current route for active link highlighting
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.currentRoute = (event as NavigationEnd).url;
      });
    
    // Set initial route
    this.currentRoute = this.router.url;
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
    this.isLoggedIn = false;
    this.isAdmin = false;
    this.userName = '';
    this.userAvatar = '';
    this.isUserDropdownOpen = false;
    // TODO: Add real logout logic
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