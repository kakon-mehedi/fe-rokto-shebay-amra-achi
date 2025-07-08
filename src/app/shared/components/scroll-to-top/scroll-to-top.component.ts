import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { throttleTime } from 'rxjs/operators';

@Component({
  selector: 'app-scroll-to-top',
  template: `
    <button 
      class="scroll-to-top"
      [class.visible]="isVisible"
      (click)="scrollToTop()"
      title="উপরে যান"
    >
      <svg viewBox="0 0 24 24" class="arrow-icon">
        <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/>
      </svg>
    </button>
  `,
  styleUrls: ['./scroll-to-top.component.scss']
})
export class ScrollToTopComponent implements OnInit, OnDestroy {
  isVisible = false;
  private subscriptions = new Subscription();

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.setupScrollListeners();
    this.updateScrollProgress();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private setupScrollListeners(): void {
    // Listen to window scroll
    this.subscriptions.add(
      fromEvent(window, 'scroll').pipe(
        throttleTime(16)
      ).subscribe(() => this.checkScrollPosition())
    );

    // Check for Angular Material containers after route changes
    setTimeout(() => this.addContainerListeners(), 100);
    setTimeout(() => this.addContainerListeners(), 500);
    setTimeout(() => this.addContainerListeners(), 1000);
  }

  private addContainerListeners(): void {
    const selectors = [
      '.mat-sidenav-content',
      '.mat-drawer-content',
      '.admin-main-content',
      '.donor-list-page',
      '.home-container'
    ];

    selectors.forEach(selector => {
      const element = document.querySelector(selector);
      if (element && !element.hasAttribute('data-scroll-listener')) {
        element.setAttribute('data-scroll-listener', 'true');
        this.subscriptions.add(
          fromEvent(element, 'scroll').pipe(
            throttleTime(16)
          ).subscribe(() => this.checkScrollPositionForElement(element))
        );
      }
    });
  }

  private checkScrollPosition(): void {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    const shouldShow = scrollTop > 200;
    
    if (this.isVisible !== shouldShow) {
      this.isVisible = shouldShow;
      this.cdr.detectChanges();
    }
    
    this.updateScrollProgress();
  }

  private checkScrollPositionForElement(element: Element): void {
    const scrollTop = element.scrollTop;
    const shouldShow = scrollTop > 200;
    
    if (this.isVisible !== shouldShow) {
      this.isVisible = shouldShow;
      this.cdr.detectChanges();
    }
  }

  scrollToTop(): void {
    // Method 1: Try window scroll
    this.attemptScroll(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
    
    // Method 2: Try document scroll
    this.attemptScroll(() => {
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    });
    
    // Method 3: Try Angular Material containers
    const containers = [
      '.mat-sidenav-content',
      '.mat-drawer-content',
      '.admin-main-content',
      '.donor-list-page',
      '.home-container'
    ];
    
    containers.forEach(selector => {
      const element = document.querySelector(selector) as HTMLElement;
      if (element) {
        this.attemptScroll(() => element.scrollTo({ top: 0, behavior: 'smooth' }));
      }
    });
  }

  private attemptScroll(scrollFunction: () => void): void {
    try {
      scrollFunction();
    } catch (error) {
      // Silently handle scroll errors
    }
  }

  private updateScrollProgress(): void {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollProgress = Math.min((scrollTop / Math.max(scrollHeight, 1)) * 100, 100);
    
    document.documentElement.style.setProperty('--scroll-progress', `${scrollProgress}%`);
  }
}
