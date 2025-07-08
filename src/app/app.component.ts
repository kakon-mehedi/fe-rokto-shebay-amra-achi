import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'fresh-angular-13';
  showNavigation = true;
  showFooter = true;

  constructor(private router: Router) {}

  ngOnInit() {
    // Listen to route changes to show/hide navigation and footer
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event) => {
        const navigationEvent = event as NavigationEnd;
        // Hide navigation and footer on admin routes
        const isAdminRoute = navigationEvent.url.startsWith('/admin');
        this.showNavigation = !isAdminRoute;
        this.showFooter = !isAdminRoute;
        // Toggle has-navbar class on body for correct padding
        if (isAdminRoute) {
          document.body.classList.remove('has-navbar');
        } else {
          document.body.classList.add('has-navbar');
        }
      });
    // Set initial state on load
    const isAdminRoute = this.router.url.startsWith('/admin');
    if (isAdminRoute) {
      document.body.classList.remove('has-navbar');
    } else {
      document.body.classList.add('has-navbar');
    }
  }
}
