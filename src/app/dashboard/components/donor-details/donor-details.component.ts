import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DonorService } from '../../services/donor-service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-donor-details',
  templateUrl: './donor-details.component.html',
  styleUrls: ['./donor-details.component.scss'],
})
export class DonorDetailsComponent implements OnInit {
  donor: any;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly donorService: DonorService,
    private readonly location: Location
  ) {}

  ngOnInit(): void {
    const donorId = this.route.snapshot.paramMap.get('id');
    if (donorId) {
      this.donor = this.donorService.getDonorById(donorId); // Fetch donor details
    }
  }

  goBack(): void {
   this.location.back();
  }

  contactDonor(): void {
    // Implement contact logic
    console.log('Contacting donor:', this.donor.mobileNumber);
  }

  requestDonation(): void {
    // Implement donation request logic
    console.log('Requesting donation from:', this.donor.name);
  }
}