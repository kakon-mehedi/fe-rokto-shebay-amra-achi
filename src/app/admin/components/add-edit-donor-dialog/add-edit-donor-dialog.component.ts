import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DonorService } from '../../../shared/services/donor.service';
import { AdminDonorResponse } from '../../../shared/interfaces/donor.interface';
import { BANGLADESH_DISTRICTS, District, Upazila } from '../../../shared/data/bangladesh-data';

interface DialogData {
  donor: AdminDonorResponse | null;
  mode: 'add' | 'edit';
}

@Component({
  selector: 'app-add-edit-donor-dialog',
  templateUrl: './add-edit-donor-dialog.component.html',
  styleUrls: ['./add-edit-donor-dialog.component.scss']
})
export class AddEditDonorDialogComponent implements OnInit {
  donorForm!: FormGroup;
  isLoading = false;
  isEdit = false;

  // Bangladesh data
  allDistricts: District[] = BANGLADESH_DISTRICTS;
  cities: { value: string, label: string }[] = [];
  locations: { value: string, label: string }[] = [];

  // Form options
  bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  genders = [
    { value: 'Male', label: 'পুরুষ' },
    { value: 'Female', label: 'নারী' },
    { value: 'Other', label: 'অন্যান্য' }
  ];
  religions = [
    { value: 'Islam', label: 'ইসলাম' },
    { value: 'Hinduism', label: 'হিন্দু' },
    { value: 'Buddhism', label: 'বৌদ্ধ' },
    { value: 'Christianity', label: 'খ্রিস্টান' },
    { value: 'Other', label: 'অন্যান্য' }
  ];
  accountStatuses = [
    { value: 'PENDING', label: 'অপেক্ষমাণ' },
    { value: 'ACTIVE', label: 'সক্রিয়' },
    { value: 'SUSPENDED', label: 'স্থগিত' },
    { value: 'INACTIVE', label: 'নিষ্ক্রিয়' }
  ];
  eligibilityStatuses = [
    { value: 'PENDING', label: 'অপেক্ষমাণ' },
    { value: 'ELIGIBLE', label: 'যোগ্য' },
    { value: 'TEMPORARILY_INELIGIBLE', label: 'অস্থায়ীভাবে অযোগ্য' },
    { value: 'PERMANENTLY_INELIGIBLE', label: 'স্থায়ীভাবে অযোগ্য' }
  ];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddEditDonorDialogComponent>,
    private donorService: DonorService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.isEdit = data?.mode === 'edit' && !!data.donor;
  }

  ngOnInit() {
    this.loadBangladeshData();
    this.initializeForm();
    this.setupCityLocationFilter();
  }

  private loadBangladeshData() {
    // Load all districts as cities
    this.cities = this.allDistricts.map(district => ({
      value: district.name,
      label: district.name
    })).sort((a, b) => a.label.localeCompare(b.label, 'bn'));

    // Initially load all upazilas as locations
    this.locations = this.allDistricts
      .flatMap(district => district.upazilas)
      .map(upazila => ({
        value: upazila.name,
        label: upazila.name
      }))
      .sort((a, b) => a.label.localeCompare(b.label, 'bn'));
  }

  private setupCityLocationFilter() {
    // When city changes, update location options
    this.donorForm.get('city')?.valueChanges.subscribe(selectedCity => {
      if (selectedCity) {
        const selectedDistrict = this.allDistricts.find(district => district.name === selectedCity);
        if (selectedDistrict) {
          this.locations = selectedDistrict.upazilas.map(upazila => ({
            value: upazila.name,
            label: upazila.name
          })).sort((a, b) => a.label.localeCompare(b.label, 'bn'));
          
          // Reset location if it's not valid for selected city
          const currentLocation = this.donorForm.get('location')?.value;
          if (currentLocation && !this.locations.find(loc => loc.value === currentLocation)) {
            this.donorForm.get('location')?.setValue('');
          }
        }
      } else {
        // If no city selected, show all upazilas
        this.loadBangladeshData();
      }
    });
  }

  private initializeForm() {
    const donor = this.data?.donor;
    
    this.donorForm = this.fb.group({
      // Basic Information
      name: [donor?.name || '', [Validators.required, Validators.maxLength(100)]],
      phone: [donor?.phone || '', [Validators.required, Validators.pattern(/^(\+88)?01[3-9]\d{8}$/)]],
      email: [donor?.email || '', [Validators.email]],
      
      // Personal Information
      gender: [donor?.gender || '', Validators.required],
      religion: [donor?.religion || '', Validators.required],
      dateOfBirth: [donor?.dateOfBirth ? new Date(donor.dateOfBirth) : '', Validators.required],
      profession: [donor?.profession || '', Validators.maxLength(100)],
      
      // Location Information
      city: [donor?.city || '', Validators.required],
      location: [donor?.location || '', Validators.required],
      address: [donor?.address || '', Validators.required],
      
      // Medical Information
      bloodGroup: [donor?.bloodGroup || '', Validators.required],
      weight: [donor?.weight || '', [Validators.min(45), Validators.max(200)]],
      height: [donor?.height || '', [Validators.min(120), Validators.max(250)]],
      
      // Initial Donation Information (for registration)
      initialTotalDonations: ['', [Validators.min(0), Validators.max(100)]],
      initialLastDonationDate: [''],
      
      // Emergency Contact
      emergencyContactName: [donor?.emergencyContact?.name || ''],
      emergencyContactPhone: [donor?.emergencyContact?.phone || '', Validators.pattern(/^(\+88)?01[3-9]\d{8}$/)],
      emergencyContactRelation: [donor?.emergencyContact?.relation || ''],
      
      // Administrative (for edit mode)
      accountStatus: [donor?.accountStatus || 'ACTIVE'],
      eligibilityStatus: [donor?.eligibilityStatus || 'ELIGIBLE'],
      
      // Additional Information
      nationalId: [donor?.nationalId || '', Validators.pattern(/^\d{10}$|^\d{13}$|^\d{17}$/)],
      totalDonations: [donor?.totalDonations || 0, Validators.min(0)],
      lastDonationDate: [donor?.lastDonationDate ? new Date(donor.lastDonationDate) : '']
    });

    // Set up field validation dependencies
    this.setupFormValidation();
  }

  private setupFormValidation() {
    // Set up validation dependencies between initial donation fields
    const initialTotalDonations = this.donorForm.get('initialTotalDonations');
    const initialLastDonationDate = this.donorForm.get('initialLastDonationDate');

    // If total donations is provided, make last donation date required
    initialTotalDonations?.valueChanges.subscribe(value => {
      if (value && value > 0) {
        initialLastDonationDate?.setValidators([Validators.required]);
      } else {
        initialLastDonationDate?.clearValidators();
      }
      initialLastDonationDate?.updateValueAndValidity();
    });
  }

  onSubmit() {
    if (this.donorForm.valid) {
      this.isLoading = true;
      const formData = this.prepareFormData();
      
      if (this.isEdit && this.data.donor) {
        this.updateDonor(this.data.donor._id, formData);
      } else {
        this.createDonor(formData);
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  private prepareFormData() {
    const formValue = this.donorForm.value;
    
    const donorData = {
      ...formValue,
      emergencyContact: {
        name: formValue.emergencyContactName,
        phone: formValue.emergencyContactPhone,
        relation: formValue.emergencyContactRelation
      }
    };

    // Add initial donation data for new donors
    if (!this.isEdit) {
      if (formValue.initialTotalDonations && formValue.initialTotalDonations > 0) {
        donorData.initialTotalDonations = formValue.initialTotalDonations;
      }
      if (formValue.initialLastDonationDate) {
        donorData.initialLastDonationDate = formValue.initialLastDonationDate;
      }
    }

    // Clean up undefined values
    Object.keys(donorData).forEach(key => {
      if (donorData[key] === '' || donorData[key] === null) {
        delete donorData[key];
      }
    });

    return donorData;
  }

  private updateDonor(id: string, donorData: any) {
    this.donorService.updateDonorAsAdmin(id, donorData).subscribe({
      next: (response: any) => {
        this.snackBar.open('রক্তদাতার তথ্য সফলভাবে আপডেট করা হয়েছে', 'বন্ধ করুন', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.dialogRef.close({ success: true, donor: response.data });
      },
      error: (error: any) => {
        this.snackBar.open('রক্তদাতার তথ্য আপডেট করতে ত্রুটি হয়েছে', 'বন্ধ করুন', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        this.isLoading = false;
      }
    });
  }

  private createDonor(donorData: any) {
    this.donorService.addDonorAsAdmin(donorData).subscribe({
      next: (response: any) => {
        this.snackBar.open(
          `নতুন রক্তদাতা সফলভাবে যোগ করা হয়েছে। ${response.data?.donorId ? 'ডোনার আইডি: ' + response.data.donorId : ''}`, 
          'বন্ধ করুন', 
          {
            duration: 5000,
            panelClass: ['success-snackbar']
          }
        );
        this.dialogRef.close({ success: true, donor: response.data });
      },
      error: (error: any) => {
        const errorMessage = error.error?.message || 'নতুন রক্তদাতা যোগ করতে ত্রুটি হয়েছে';
        this.snackBar.open(errorMessage, 'বন্ধ করুন', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        this.isLoading = false;
      }
    });
  }

  private markFormGroupTouched() {
    Object.keys(this.donorForm.controls).forEach(key => {
      const control = this.donorForm.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const control = this.donorForm.get(fieldName);
    if (control?.errors && control.touched) {
      if (control.errors['required']) return 'এই ক্ষেত্রটি আবশ্যক';
      if (control.errors['email']) return 'বৈধ ইমেইল ঠিকানা দিন';
      if (control.errors['pattern']) return 'সঠিক ফরম্যাটে দিন';
      if (control.errors['maxlength']) return 'অক্ষর সংখ্যা বেশি';
      if (control.errors['min']) return 'মান কম';
      if (control.errors['max']) return 'মান বেশি';
    }
    return '';
  }

  close() {
    this.dialogRef.close();
  }
}
