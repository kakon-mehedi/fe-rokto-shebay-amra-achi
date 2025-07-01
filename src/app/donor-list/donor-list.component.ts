import { Component, OnInit } from '@angular/core';
import { DonorService } from '../shared/services/donor.service';
import { PublicDonorResponse } from '../shared/interfaces/donor.interface';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BANGLADESH_DISTRICTS, BLOOD_GROUPS } from '../shared/data/bangladesh-data';
import { MatDialog } from '@angular/material/dialog';
import { DonorDetailsDialogComponent } from './donor-details-dialog.component';

@Component({
  selector: 'app-donor-list',
  templateUrl: './donor-list.component.html',
  styleUrls: ['./donor-list.component.scss']
})
export class DonorListComponent implements OnInit {
  donors: PublicDonorResponse[] = [];
  isLoading = true;
  error: string | null = null;
  filterForm: FormGroup;
  BANGLADESH_DISTRICTS = BANGLADESH_DISTRICTS;
  BLOOD_GROUPS = BLOOD_GROUPS;
  selectedDistrict: string = '';
  upazilas: { id: number; name: string; nameEn: string }[] = [];

  constructor(
    private donorService: DonorService,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {
    this.filterForm = this.fb.group({
      search: [''],
      bloodGroup: [''],
      city: [''],
      location: ['']
    });
  }

  ngOnInit(): void {
    this.getDonors();
    this.filterForm.get('city')?.valueChanges.subscribe((districtName) => {
      const district = this.BANGLADESH_DISTRICTS.find(d => d.name === districtName);
      this.upazilas = district ? district.upazilas : [];
      this.filterForm.get('location')?.setValue('');
      this.getDonors();
    });
    this.filterForm.get('location')?.valueChanges.subscribe(() => {
      this.getDonors();
    });
    this.filterForm.get('bloodGroup')?.valueChanges.subscribe(() => {
      this.getDonors();
    });
    this.filterForm.get('search')?.valueChanges.subscribe(() => {
      this.getDonors();
    });
  }

  getDonors(): void {
    this.isLoading = true;
    const params: any = {};
    const { search, bloodGroup, city, location } = this.filterForm.value;
    if (search) params.search = search;
    if (bloodGroup) params.bloodGroup = bloodGroup;
    if (city) params.city = city;
    if (location) params.location = location;
    this.donorService.getPublicDonors(params).subscribe({
      next: (res) => {
        this.donors = res.data?.donors || [];
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'ডোনার তালিকা লোড করা যায়নি';
        this.isLoading = false;
      }
    });
  }

  openDonorDetails(donor: PublicDonorResponse): void {
    this.dialog.open(DonorDetailsDialogComponent, {
      data: donor,
      width: '380px',
      maxWidth: '98vw'
    });
  }
}
