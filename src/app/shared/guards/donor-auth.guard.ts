import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { DonorService } from '../services/donor.service';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DonorAuthGuard implements CanActivate {
  
  constructor(
    private donorService: DonorService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> {
    if (!this.donorService.isAuthenticated()) {
      this.router.navigate(['/auth/donor-login'], {
        queryParams: { returnUrl: state.url }
      });
      return false;
    }

    // Check donor status and redirect accordingly
    const currentDonor = this.donorService.getCurrentDonor();
    if (currentDonor) {
      return this.handleDonorStatus(currentDonor.accountStatus, state.url);
    }

    // If no current donor data, fetch from server
    return this.donorService.getCurrentProfile().pipe(
      map((response: any) => {
        const donor = response.data;
        if (donor) {
          return this.handleDonorStatus(donor.accountStatus, state.url);
        }
        return false;
      }),
      catchError(() => {
        this.router.navigate(['/auth/donor-login']);
        return of(false);
      })
    );
  }

  private handleDonorStatus(accountStatus: string, requestedUrl: string): boolean {
    switch (accountStatus) {
      case 'PENDING':
        if (!requestedUrl.includes('/pending')) {
          this.router.navigate(['/donors/pending']);
          return false;
        }
        return true;

      case 'ACTIVE':
        if (requestedUrl.includes('/pending')) {
          this.router.navigate(['/donors']);
          return false;
        }
        return true;

      case 'SUSPENDED':
      case 'INACTIVE':
        // For suspended/inactive accounts, show limited access
        if (!requestedUrl.includes('/suspended') && !requestedUrl.includes('/pending')) {
          this.router.navigate(['/donors/pending']); // Reuse pending component for suspended status
          return false;
        }
        return true;

      default:
        return true;
    }
  }
}
