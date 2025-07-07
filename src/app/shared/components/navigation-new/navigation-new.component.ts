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
    }
  }

  // Close mobile menu on escape key
  @HostListener('document:keydown.escape')
  onEscapeKey() {
    this.closeMobileMenu();
    this.closeLegalDropdown();
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
}