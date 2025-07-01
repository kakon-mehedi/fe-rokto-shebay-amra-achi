import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DonorService } from '../../../shared/services/donor.service';
import { DonorResponse } from '../../../shared/interfaces/donor.interface';
import { BANGLADESH_DISTRICTS, District, GENDERS, RELIGIONS, BLOOD_GROUPS } from '../../../shared/data/bangladesh-data';

@Component({
  selector: 'app-donor-profile-edit',
  templateUrl: './donor-profile-edit.component.html',
  styleUrls: ['./donor-profile-edit.component.scss']
})
export class DonorProfileEditComponent implements OnInit {
  profileForm: FormGroup;
  currentDonor: DonorResponse | null = null;
  isLoading = false;
  isSubmitting = false;
  selectedProfilePhoto: File | null = null;
  profilePhotoPreview: string | null = null;
  
  // Data for dropdowns
  districts = BANGLADESH_DISTRICTS;
  selectedUpazilas: any[] = [];
  bloodGroups = BLOOD_GROUPS;
  genders = GENDERS;
  religions = RELIGIONS;

  constructor(
    private fb: FormBuilder,
    private donorService: DonorService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['', [Validators.required, Validators.pattern(/^(\+88)?01[3-9]\d{8}$/)]],
      email: ['', [Validators.email]],
      city: ['', [Validators.required]],
      location: ['', [Validators.required]],
      address: ['', [Validators.required]],
      bloodGroup: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      religion: ['', [Validators.required]],
      dateOfBirth: ['', [Validators.required]],
      profession: [''],
      weight: ['', [Validators.min(40), Validators.max(200)]],
      height: ['', [Validators.min(100), Validators.max(250)]],
      totalDonations: ['', [Validators.min(0)]],
      lastDonationDate: [''],
      emergencyContact: this.fb.group({
        name: ['', [Validators.required]],
        phone: ['', [Validators.required, Validators.pattern(/^(\+88)?01[3-9]\d{8}$/)]],
        relation: ['', [Validators.required]]
      })
    });
  }

  ngOnInit(): void {
    this.loadCurrentDonor();
  }

  loadCurrentDonor(): void {
    this.isLoading = true;
    this.donorService.getCurrentProfile().subscribe({
      next: (response) => {
        this.currentDonor = response.data;
        this.populateForm();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading donor profile:', error);
        this.snackBar.open('প্রোফাইল লোড করতে সমস্যা হয়েছে', 'বন্ধ করুন', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        this.isLoading = false;
      }
    });
  }

  populateForm(): void {
    if (this.currentDonor) {
      // Update upazilas based on selected district
      this.onDistrictChange(this.currentDonor.city);
      
      this.profileForm.patchValue({
        name: this.currentDonor.name,
        phone: this.currentDonor.phone,
        email: this.currentDonor.email || '',
        city: this.currentDonor.city,
        location: this.currentDonor.location,
        address: this.currentDonor.address,
        bloodGroup: this.currentDonor.bloodGroup,
        gender: this.currentDonor.gender,
        religion: this.currentDonor.religion,
        dateOfBirth: this.currentDonor.dateOfBirth ? new Date(this.currentDonor.dateOfBirth).toISOString().split('T')[0] : '',
        profession: this.currentDonor.profession || '',
        weight: this.currentDonor.weight || '',
        height: this.currentDonor.height || '',
        totalDonations: this.currentDonor.totalDonations || 0,
        lastDonationDate: this.currentDonor.lastDonationDate ? new Date(this.currentDonor.lastDonationDate).toISOString().split('T')[0] : '',
        emergencyContact: {
          name: this.currentDonor.emergencyContact?.name || '',
          phone: this.currentDonor.emergencyContact?.phone || '',
          relation: this.currentDonor.emergencyContact?.relation || ''
        }
      });
      
      // Set profile photo preview if exists
      if (this.currentDonor.profilePhoto) {
        this.profilePhotoPreview = this.currentDonor.profilePhoto;
      }
    }
  }

  triggerFileInput(): void {
    const fileInput = document.getElementById('profilePhotoInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  onProfilePhotoSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        this.snackBar.open('শুধুমাত্র JPG, JPEG বা PNG ফাইল আপলোড করুন', 'বন্ধ করুন', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.snackBar.open('ফাইল সাইজ ৫ এমবির কম হতে হবে', 'বন্ধ করুন', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        return;
      }

      this.selectedProfilePhoto = file;
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.profilePhotoPreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  removeProfilePhoto(): void {
    this.selectedProfilePhoto = null;
    this.profilePhotoPreview = this.currentDonor?.profilePhoto || null;
    
    // Reset file input
    const fileInput = document.getElementById('profilePhotoInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  onDistrictChange(district: string): void {
    const selectedDistrict = this.districts.find((d: District) => d.name === district);
    this.selectedUpazilas = selectedDistrict ? selectedDistrict.upazilas : [];
    
    // Reset location if district changed
    if (this.profileForm.get('city')?.value !== district) {
      this.profileForm.patchValue({ location: '' });
    }
  }

  onSubmit(): void {
    if (this.profileForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      
      const updateData = { ...this.profileForm.value };
      
      this.donorService.updateProfile(updateData, this.selectedProfilePhoto || undefined).subscribe({
        next: (response) => {
          this.snackBar.open('প্রোফাইল সফলভাবে আপডেট হয়েছে', 'বন্ধ করুন', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.isSubmitting = false;
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error('Error updating profile:', error);
          const errorMessage = error.error?.message || 'প্রোফাইল আপডেট করতে সমস্যা হয়েছে';
          this.snackBar.open(errorMessage, 'বন্ধ করুন', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
          this.isSubmitting = false;
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.profileForm.controls).forEach(key => {
      const control = this.profileForm.get(key);
      control?.markAsTouched();
      
      // For nested form groups
      if (control instanceof FormGroup) {
        Object.keys(control.controls).forEach(nestedKey => {
          control.get(nestedKey)?.markAsTouched();
        });
      }
    });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.profileForm.get(fieldName);
    
    if (control?.hasError('required')) {
      const fieldMap: { [key: string]: string } = {
        'name': 'নাম',
        'phone': 'মোবাইল নম্বর',
        'email': 'ইমেইল',
        'city': 'জেলা',
        'location': 'উপজেলা/এলাকা',
        'address': 'ঠিকানা',
        'bloodGroup': 'রক্তের গ্রুপ',
        'gender': 'লিঙ্গ',
        'religion': 'ধর্ম',
        'dateOfBirth': 'জন্ম তারিখ',
        'totalDonations': 'মোট রক্তদান',
        'lastDonationDate': 'শেষ রক্তদানের তারিখ'
      };
      return `${fieldMap[fieldName] || fieldName} আবশ্যক`;
    }

    if (control?.hasError('email')) {
      return 'বৈধ ইমেইল ঠিকানা লিখুন';
    }

    if (control?.hasError('pattern')) {
      if (fieldName === 'phone') {
        return 'বৈধ বাংলাদেশী মোবাইল নম্বর লিখুন';
      }
    }

    if (control?.hasError('minlength')) {
      return 'নাম কমপক্ষে ২ অক্ষর হতে হবে';
    }

    if (control?.hasError('min')) {
      if (fieldName === 'weight') {
        return 'ওজন ৪০ কেজির বেশি হতে হবে';
      }
      if (fieldName === 'height') {
        return 'উচ্চতা ১০০ সেমির বেশি হতে হবে';
      }
    }

    if (control?.hasError('max')) {
      if (fieldName === 'weight') {
        return 'ওজন ২০০ কেজির কম হতে হবে';
      }
      if (fieldName === 'height') {
        return 'উচ্চতা ২৫০ সেমির কম হতে হবে';
      }
    }

    if (control?.hasError('min') && fieldName === 'totalDonations') {
      return 'রক্তদানের সংখ্যা ০ এর চেয়ে কম হতে পারে না';
    }

    return '';
  }

  getNestedErrorMessage(groupName: string, fieldName: string): string {
    const control = this.profileForm.get(`${groupName}.${fieldName}`);
    
    if (control?.hasError('required')) {
      const fieldMap: { [key: string]: string } = {
        'name': 'নাম',
        'phone': 'মোবাইল নম্বর',
        'relation': 'সম্পর্ক'
      };
      return `${fieldMap[fieldName] || fieldName} আবশ্যক`;
    }

    if (control?.hasError('pattern') && fieldName === 'phone') {
      return 'বৈধ বাংলাদেশী মোবাইল নম্বর লিখুন';
    }

    return '';
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}
