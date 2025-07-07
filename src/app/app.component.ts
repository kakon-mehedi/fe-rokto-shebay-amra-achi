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
        this.showNavigation = !navigationEvent.url.startsWith('/admin');
        this.showFooter = !navigationEvent.url.startsWith('/admin');
      });
  }
}
