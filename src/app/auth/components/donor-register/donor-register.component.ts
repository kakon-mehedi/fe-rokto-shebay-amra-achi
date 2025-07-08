import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DonorService } from '../../../shared/services/donor.service';
import { DonorRegisterRequest } from '../../../shared/interfaces/donor.interface';
import { 
  BLOOD_GROUPS, 
  GENDERS, 
  RELIGIONS, 
  BANGLADESH_DISTRICTS, 
  District 
} from '../../../shared/data/bangladesh-data';

@Component({
  selector: 'app-donor-register',
  templateUrl: './donor-register.component.html',
  styleUrls: ['./donor-register.component.scss']
})
export class DonorRegisterComponent implements OnInit {
  registerForm: FormGroup;
  isLoading = false;
  hidePassword = true;
  hideConfirmPassword = true;
  selectedFile: File | null = null;
  previewUrl: string | null = null;

  // Static data
  bloodGroups = BLOOD_GROUPS;
  genders = GENDERS;
  religions = RELIGIONS;
  districts = BANGLADESH_DISTRICTS;
  
  // Dynamic data
  selectedDistrict: District | null = null;
  availableLocations: any[] = [];

  // Current step for multi-step form
  currentStep = 1;
  totalSteps = 3;

  constructor(
    private fb: FormBuilder,
    private donorService: DonorService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.registerForm = this.fb.group({
      // Step 1: Basic Information
      name: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['', [Validators.required, Validators.pattern(/^(\+88)?01[3-9]\d{8}$/)]],
      email: ['', [Validators.email]],
      dateOfBirth: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      religion: ['', [Validators.required]],
      bloodGroup: ['', [Validators.required]],
      
      // Step 2: Address Information
      city: ['', [Validators.required]],
      location: ['', [Validators.required]],
      address: ['', [Validators.required]],
      
      // Step 3: Additional Information & Security
      profession: [''],
      weight: ['', [Validators.min(45), Validators.max(200)]],
      height: ['', [Validators.min(120), Validators.max(250)]],
      nationalId: ['', [Validators.pattern(/^\d{10}$|^\d{13}$|^\d{17}$/)]],
      
      // Previous Donation History (Optional)
      initialTotalDonations: ['', [Validators.min(0), Validators.max(100)]],
      initialLastDonationDate: [''],
      
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      
      // Emergency Contact
      emergencyContactName: [''],
      emergencyContactPhone: ['', [Validators.pattern(/^(\+88)?01[3-9]\d{8}$/)]],
      emergencyContactRelation: [''],
      
      // Agreements
      termsAccepted: [false, [Validators.requiredTrue]],
      privacyAccepted: [false, [Validators.requiredTrue]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  ngOnInit(): void {
    // Check if already authenticated
    if (this.donorService.isAuthenticated()) {
      this.router.navigate(['/donor-dashboard']);
    }

    // Watch for city changes
    this.registerForm.get('city')?.valueChanges.subscribe(cityName => {
      this.onCityChange(cityName);
    });
  }

  // Custom validator for password matching
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ mismatch: true });
      return { passwordMismatch: true };
    }
    
    if (confirmPassword?.errors?.['mismatch']) {
      delete confirmPassword.errors['mismatch'];
      if (Object.keys(confirmPassword.errors).length === 0) {
        confirmPassword.setErrors(null);
      }
    }
    
    return null;
  }

  onCityChange(cityName: string): void {
    this.selectedDistrict = this.districts.find(d => d.name === cityName) || null;
    this.availableLocations = this.selectedDistrict ? this.selectedDistrict.upazilas : [];
    
    // Reset location field when city changes
    this.registerForm.patchValue({ location: '' });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        this.snackBar.open('শুধুমাত্র JPG, JPEG এবং PNG ফাইল আপলোড করা যাবে', 'বন্ধ করুন', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.snackBar.open('ফাইলের সাইজ ৫ MB এর বেশি হতে পারবে না', 'বন্ধ করুন', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        return;
      }

      this.selectedFile = file;

      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  removeSelectedFile(): void {
    this.selectedFile = null;
    this.previewUrl = null;
  }

  nextStep(): void {
    if (this.isStepValid(this.currentStep)) {
      this.currentStep++;
    } else {
      this.markStepFieldsAsTouched(this.currentStep);
      this.snackBar.open('দয়া করে সকল আবশ্যক তথ্য পূরণ করুন', 'বন্ধ করুন', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  isStepValid(step: number): boolean {
    const step1Fields = ['name', 'phone', 'dateOfBirth', 'gender', 'religion', 'bloodGroup'];
    const step2Fields = ['city', 'location', 'address'];
    const step3Fields = ['password', 'confirmPassword', 'termsAccepted', 'privacyAccepted'];

    let fieldsToCheck: string[] = [];
    switch(step) {
      case 1:
        fieldsToCheck = step1Fields;
        break;
      case 2:
        fieldsToCheck = step2Fields;
        break;
      case 3:
        fieldsToCheck = step3Fields;
        break;
    }

    return fieldsToCheck.every(field => {
      const control = this.registerForm.get(field);
      return control && control.valid;
    });
  }

  markStepFieldsAsTouched(step: number): void {
    const step1Fields = ['name', 'phone', 'dateOfBirth', 'gender', 'religion', 'bloodGroup'];
    const step2Fields = ['city', 'location', 'address'];
    const step3Fields = ['password', 'confirmPassword', 'termsAccepted', 'privacyAccepted'];

    let fieldsToMark: string[] = [];
    switch(step) {
      case 1:
        fieldsToMark = step1Fields;
        break;
      case 2:
        fieldsToMark = step2Fields;
        break;
      case 3:
        fieldsToMark = step3Fields;
        break;
    }

    fieldsToMark.forEach(field => {
      this.registerForm.get(field)?.markAsTouched();
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid && !this.isLoading) {
      this.isLoading = true;

      const formValue = this.registerForm.value;
      
      const donorData: DonorRegisterRequest = {
        name: formValue.name,
        phone: formValue.phone,
        city: formValue.city,
        location: formValue.location,
        address: formValue.address,
        bloodGroup: formValue.bloodGroup,
        gender: formValue.gender,
        religion: formValue.religion,
        dateOfBirth: formValue.dateOfBirth,
        password: formValue.password
      };

      // Add optional fields
      if (formValue.email) donorData.email = formValue.email;
      if (formValue.profession) donorData.profession = formValue.profession;
      if (formValue.weight) donorData.weight = parseFloat(formValue.weight);
      if (formValue.height) donorData.height = parseFloat(formValue.height);
      if (formValue.nationalId) donorData.nationalId = formValue.nationalId;

      // Add initial donation data if provided
      if (formValue.initialTotalDonations) {
        donorData.initialTotalDonations = parseInt(formValue.initialTotalDonations);
      }
      if (formValue.initialLastDonationDate) {
        donorData.initialLastDonationDate = formValue.initialLastDonationDate;
      }

      // Add emergency contact if provided
      if (formValue.emergencyContactName) {
        donorData.emergencyContact = {
          name: formValue.emergencyContactName,
          phone: formValue.emergencyContactPhone,
          relation: formValue.emergencyContactRelation
        };
      }

      this.donorService.register(donorData, this.selectedFile || undefined).subscribe({
        next: (response) => {
          this.isLoading = false;
          const donorId = response.data?.donorId;
          let successMessage = 'রক্তদাতা নিবন্ধন সফল হয়েছে! অনুমোদনের জন্য অপেক্ষা করুন।';
          if (donorId) {
            successMessage = `রক্তদাতা নিবন্ধন সফল হয়েছে! আপনার ডোনার আইডি: ${donorId}। অনুমোদনের জন্য অপেক্ষা করুন।`;
          }
          this.snackBar.open(successMessage, 'বন্ধ করুন', {
            duration: 8000,
            panelClass: ['success-snackbar']
          });
          this.router.navigate(['/auth/donor-login']);
        },
        error: (error) => {
          this.isLoading = false;
          const errorMessage = error.error?.message || 'রেজিস্ট্রেশন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।';
          this.snackBar.open(errorMessage, 'বন্ধ করুন', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      });
    } else {
      this.markAllFieldsAsTouched();
      this.snackBar.open('দয়া করে সকল আবশ্যক তথ্য সঠিকভাবে পূরণ করুন', 'বন্ধ করুন', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
    }
  }

  private markAllFieldsAsTouched(): void {
    Object.keys(this.registerForm.controls).forEach(key => {
      this.registerForm.get(key)?.markAsTouched();
    });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.registerForm.get(fieldName);
    if (control?.hasError('required')) {
      const fieldMap: { [key: string]: string } = {
        'name': 'নাম',
        'phone': 'মোবাইল নম্বর',
        'dateOfBirth': 'জন্ম তারিখ',
        'gender': 'লিঙ্গ',
        'religion': 'ধর্ম',
        'bloodGroup': 'রক্তের গ্রুপ',
        'city': 'জেলা',
        'location': 'এলাকা',
        'address': 'ঠিকানা',
        'password': 'পাসওয়ার্ড',
        'confirmPassword': 'পাসওয়ার্ড নিশ্চিতকরণ'
      };
      return `${fieldMap[fieldName] || fieldName} আবশ্যক`;
    }

    if (control?.hasError('email')) {
      return 'বৈধ ইমেইল ঠিকানা লিখুন';
    }

    if (control?.hasError('pattern')) {
      if (fieldName === 'phone' || fieldName === 'emergencyContactPhone') {
        return 'বৈধ বাংলাদেশী মোবাইল নম্বর লিখুন (যেমন: 01712345678)';
      }
      if (fieldName === 'nationalId') {
        return 'বৈধ জাতীয় পরিচয়পত্র নম্বর লিখুন';
      }
    }

    if (control?.hasError('minlength')) {
      if (fieldName === 'name') {
        return 'নাম কমপক্ষে ২ অক্ষর হতে হবে';
      }
      if (fieldName === 'password') {
        return 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষর হতে হবে';
      }
    }

    if (control?.hasError('min')) {
      if (fieldName === 'weight') {
        return 'ওজন কমপক্ষে ৪৫ কেজি হতে হবে';
      }
      if (fieldName === 'height') {
        return 'উচ্চতা কমপক্ষে ১২০ সেমি হতে হবে';
      }
      if (fieldName === 'initialTotalDonations') {
        return 'রক্তদানের সংখ্যা ০ এর কম হতে পারবে না';
      }
    }

    if (control?.hasError('max')) {
      if (fieldName === 'weight') {
        return 'ওজন ২০০ কেজির বেশি হতে পারবে না';
      }
      if (fieldName === 'height') {
        return 'উচ্চতা ২৫০ সেমির বেশি হতে পারবে না';
      }
      if (fieldName === 'initialTotalDonations') {
        return 'রক্তদানের সংখ্যা ১০০ এর বেশি হতে পারবে না';
      }
    }

    if (control?.hasError('mismatch')) {
      return 'পাসওয়ার্ড মিল নেই';
    }

    return '';
  }

  getTodayDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  goToLogin(): void {
    this.router.navigate(['/auth/donor-login']);
  }
}
