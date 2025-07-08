import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DonorService } from '../../../shared/services/donor.service';
import { DonorResponse } from '../../../shared/interfaces/donor.interface';

@Component({
  selector: 'app-donor-pending',
  templateUrl: './donor-pending.component.html',
  styleUrls: ['./donor-pending.component.scss']
})
export class DonorPendingComponent implements OnInit {
  donorProfile: DonorResponse | null = null;
  isLoading = false;

  constructor(
    private donorService: DonorService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDonorProfile();
  }

  loadDonorProfile(): void {
    this.isLoading = true;
    this.donorService.getCurrentProfile().subscribe({
      next: (response: any) => {
        this.donorProfile = response.data;
        
        // If account is not pending, redirect to appropriate page
        if (this.donorProfile?.accountStatus === 'ACTIVE') {
          this.router.navigate(['/donors']);
        } else if (this.donorProfile?.accountStatus === 'SUSPENDED') {
          this.router.navigate(['/donors/suspended']);
        }
        
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading donor profile:', error);
        this.isLoading = false;
      }
    });
  }

  logout(): void {
    this.donorService.logout().subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (error: any) => {
        console.error('Logout error:', error);
        // Clear local storage anyway
        localStorage.removeItem('donor_access_token');
        this.router.navigate(['/']);
      }
    });
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'PENDING':
        return 'অনুমোদনের অপেক্ষায়';
      case 'ACTIVE':
        return 'সক্রিয়';
      case 'INACTIVE':
        return 'নিষ্ক্রিয়';
      case 'SUSPENDED':
        return 'স্থগিত';
      default:
        return status;
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('bn-BD', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
