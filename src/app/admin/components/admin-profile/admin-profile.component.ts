import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { 
  AdminService, 
  AdminProfile, 
  AdminProfileUpdateRequest, 
  ChangePasswordRequest 
} from '../../../shared/services/admin.service';

@Component({
  selector: 'app-admin-profile',
  templateUrl: './admin-profile.component.html',
  styleUrls: ['./admin-profile.component.scss']
})
export class AdminProfileComponent implements OnInit {
  profileForm: FormGroup;
  passwordForm: FormGroup;
  isEditMode = false;
  isLoading = false;
  isChangingPassword = false;
  selectedFile: File | null = null;
  selectedImagePreview: string | null = null;

  adminProfile: AdminProfile = {
    _id: '',
    name: '',
    email: '',
    role: 'ADMIN',
    address: {
      mobileNumber: ''
    },
    permissions: [],
    isActive: true,
    joinDate: '',
    createdAt: '',
    updatedAt: ''
  };

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      street: [''],
      city: [''],
      district: [''],
      division: [''],
      postalCode: [''],
      mobileNumber: ['', [Validators.required, Validators.pattern(/^(\+88)?01[3-9]\d{8}$/)]]
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit() {
    this.loadAdminProfile();
  }

  loadAdminProfile() {
    this.isLoading = true;
    this.adminService.getAdminProfile().subscribe({
      next: (response) => {
        if (response.success) {
          this.adminProfile = response.data;
          this.updateFormValues();
        } else {
          this.showError('প্রোফাইল লোড করতে সমস্যা হয়েছে');
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading admin profile:', error);
        this.showError('প্রোফাইল লোড করতে সমস্যা হয়েছে');
        this.isLoading = false;
      }
    });
  }

  updateFormValues() {
    // Parse address data if it comes as string from backend
    let addressData = this.adminProfile.address;
    if (typeof addressData === 'string') {
      try {
        addressData = JSON.parse(addressData);
      } catch (e) {
        console.warn('Error parsing address data:', e);
        addressData = { mobileNumber: '' };
      }
    }

    // If addressLine exists but individual fields don't, try to parse addressLine
    if ((addressData as any)?.addressLine && !addressData.street && !addressData.city) {
      const addressParts = (addressData as any).addressLine.split(',').map((part: string) => part.trim()).filter((part: string) => part);
      if (addressParts.length >= 1) addressData.street = addressParts[0] || '';
      if (addressParts.length >= 2) addressData.city = addressParts[1] || '';
      if (addressParts.length >= 3) addressData.district = addressParts[2] || '';
      if (addressParts.length >= 4) addressData.division = addressParts[3] || '';
    }

    this.profileForm.patchValue({
      name: this.adminProfile.name,
      email: this.adminProfile.email,
      street: addressData?.street || '',
      city: addressData?.city || '',
      district: addressData?.district || '',
      division: addressData?.division || '',
      postalCode: addressData?.postalCode || '',
      mobileNumber: addressData?.mobileNumber || ''
    });

    console.log('Address data loaded:', addressData);
    console.log('Form values after patch:', this.profileForm.value);
  }

  onEditToggle() {
    this.isEditMode = !this.isEditMode;
    if (!this.isEditMode) {
      this.updateFormValues(); // Reset form values if canceling edit
      this.selectedFile = null;
      this.selectedImagePreview = null;
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        this.showError('অনুগ্রহ করে একটি ছবি ফাইল নির্বাচন করুন');
        return;
      }

      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        this.showError('ছবির সাইজ ২ MB এর বেশি হতে পারবে না');
        return;
      }

      this.selectedFile = file;

      // Create image preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedImagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  changePhoto() {
    const fileInput = document.getElementById('profilePhotoInput') as HTMLInputElement;
    fileInput?.click();
  }

  onSubmitProfile() {
    if (this.profileForm.invalid) {
      this.markFormGroupTouched(this.profileForm);
      return;
    }

    this.isLoading = true;
    const formValues = this.profileForm.value;

    const updateData: AdminProfileUpdateRequest = {
      name: formValues.name,
      email: formValues.email,
      address: {
        street: formValues.street,
        city: formValues.city,
        district: formValues.district,
        division: formValues.division,
        postalCode: formValues.postalCode,
        mobileNumber: formValues.mobileNumber
      }
    };

    this.adminService.updateAdminProfile(updateData, this.selectedFile || undefined).subscribe({
      next: (response) => {
        if (response.success) {
          this.adminProfile = response.data;
          this.isEditMode = false;
          this.selectedFile = null;
          this.selectedImagePreview = null;
          this.updateFormValues(); // Refresh form with new data
          this.showSuccess('প্রোফাইল সফলভাবে আপডেট করা হয়েছে');
        } else {
          this.showError('প্রোফাইল আপডেট করতে সমস্যা হয়েছে');
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error updating profile:', error);
        const errorMessage = error.error?.message || 'প্রোফাইল আপডেট করতে সমস্যা হয়েছে';
        this.showError(errorMessage);
        this.isLoading = false;
      }
    });
  }

  onSubmitPassword() {
    if (this.passwordForm.invalid) {
      this.markFormGroupTouched(this.passwordForm);
      return;
    }

    this.isChangingPassword = true;
    const passwordData: ChangePasswordRequest = this.passwordForm.value;

    this.adminService.changePassword(passwordData).subscribe({
      next: (response) => {
        if (response.success) {
          this.passwordForm.reset();
          this.showSuccess('পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে');
        } else {
          this.showError('পাসওয়ার্ড পরিবর্তন করতে সমস্যা হয়েছে');
        }
        this.isChangingPassword = false;
      },
      error: (error) => {
        console.error('Error changing password:', error);
        const errorMessage = error.error?.message || 'পাসওয়ার্ড পরিবর্তন করতে সমস্যা হয়েছে';
        this.showError(errorMessage);
        this.isChangingPassword = false;
      }
    });
  }

  passwordMatchValidator(group: FormGroup) {
    const newPassword = group.get('newPassword');
    const confirmPassword = group.get('confirmPassword');

    if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
    } else {
      if (confirmPassword && confirmPassword.hasError('passwordMismatch')) {
        confirmPassword.setErrors(null);
      }
    }
    return null;
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  showSuccess(message: string) {
    this.snackBar.open(message, 'বন্ধ করুন', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  showError(message: string) {
    this.snackBar.open(message, 'বন্ধ করুন', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }

  toggleEditMode() {
    this.onEditToggle();
  }

  getErrorMessage(fieldName: string, form?: FormGroup): string {
    const formToUse = form || this.profileForm;
    const field = formToUse.get(fieldName);
    
    if (field?.hasError('required')) {
      return 'এই ফিল্ডটি আবশ্যক';
    }
    if (field?.hasError('email')) {
      return 'সঠিক ইমেইল ঠিকানা দিন';
    }
    if (field?.hasError('minlength')) {
      return `কমপক্ষে ${field.errors?.['minlength']?.requiredLength} অক্ষর দিন`;
    }
    if (field?.hasError('pattern')) {
      if (fieldName === 'mobileNumber') {
        return 'সঠিক মোবাইল নম্বর দিন (01XXXXXXXXX)';
      }
      return 'সঠিক ফরম্যাট দিন';
    }
    if (field?.hasError('passwordMismatch')) {
      return 'পাসওয়ার্ড মিল নেই';
    }
    return '';
  }

  // Helper methods for template
  getRoleLabel(role: string): string {
    const roleMap = {
      'ADMIN': 'অ্যাডমিন',
      'SUPER_ADMIN': 'সুপার অ্যাডমিন'
    };
    return roleMap[role as keyof typeof roleMap] || role;
  }

  getPermissionLabel(permission: string): string {
    const permissionMap = {
      'USER_MANAGEMENT': 'ব্যবহারকারী ব্যবস্থাপনা',
      'DONOR_MANAGEMENT': 'রক্তদাতা ব্যবস্থাপনা',
      'REPORT_ACCESS': 'রিপোর্ট অ্যাক্সেস',
      'SYSTEM_SETTINGS': 'সিস্টেম সেটিংস',
      'BLOOD_REQUEST_MANAGEMENT': 'রক্তের অনুরোধ ব্যবস্থাপনা',
      'ANALYTICS': 'পরিসংখ্যান'
    };
    return permissionMap[permission as keyof typeof permissionMap] || permission;
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('bn-BD');
  }

  formatDateTime(dateString: string): string {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('bn-BD');
  }

  getProfileImageUrl(): string {
    // Show selected image preview if available, otherwise show existing profile photo or default
    if (this.selectedImagePreview) {
      return this.selectedImagePreview;
    }
    return this.adminProfile.profilePhoto || 'assets/images/logo/profile_avatar.png';
  }

  // Test method to check what data we're getting
  testAddressData() {
    console.log('=== ADDRESS DEBUG INFO ===');
    console.log('Admin Profile:', this.adminProfile);
    console.log('Address Object:', this.adminProfile.address);
    console.log('Address Type:', typeof this.adminProfile.address);
    console.log('Address JSON:', JSON.stringify(this.adminProfile.address, null, 2));
    console.log('Form Values:', this.profileForm.value);
    
    // Test individual field access
    if (this.adminProfile.address) {
      console.log('Individual Address Fields:');
      console.log('- street:', this.adminProfile.address.street);
      console.log('- city:', this.adminProfile.address.city);
      console.log('- district:', this.adminProfile.address.district);
      console.log('- division:', this.adminProfile.address.division);
      console.log('- postalCode:', this.adminProfile.address.postalCode);
      console.log('- mobileNumber:', this.adminProfile.address.mobileNumber);
      console.log('- addressLine:', (this.adminProfile.address as any).addressLine);
    }
    console.log('========================');
  }
}
