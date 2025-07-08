import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DonorService } from '../../../shared/services/donor.service';

@Component({
  selector: 'app-donor-change-password',
  templateUrl: './donor-change-password.component.html',
  styleUrls: ['./donor-change-password.component.scss']
})
export class DonorChangePasswordComponent implements OnInit {
  changePasswordForm: FormGroup;
  isSubmitting = false;
  hideCurrentPassword = true;
  hideNewPassword = true;
  hideConfirmPassword = true;

  constructor(
    private fb: FormBuilder,
    private donorService: DonorService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.changePasswordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {}

  passwordMatchValidator(control: AbstractControl): { [key: string]: any } | null {
    const newPassword = control.get('newPassword');
    const confirmPassword = control.get('confirmPassword');

    if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  onSubmit(): void {
    if (this.changePasswordForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      
      const { currentPassword, newPassword } = this.changePasswordForm.value;
      
      this.donorService.changePassword(currentPassword, newPassword).subscribe({
        next: (response) => {
          this.snackBar.open('পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে', 'বন্ধ করুন', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.isSubmitting = false;
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error('Error changing password:', error);
          const errorMessage = error.error?.message || 'পাসওয়ার্ড পরিবর্তন করতে সমস্যা হয়েছে';
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
    Object.keys(this.changePasswordForm.controls).forEach(key => {
      const control = this.changePasswordForm.get(key);
      control?.markAsTouched();
    });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.changePasswordForm.get(fieldName);
    
    if (control?.hasError('required')) {
      const fieldMap: { [key: string]: string } = {
        'currentPassword': 'বর্তমান পাসওয়ার্ড',
        'newPassword': 'নতুন পাসওয়ার্ড',
        'confirmPassword': 'পাসওয়ার্ড নিশ্চিতকরণ'
      };
      return `${fieldMap[fieldName] || fieldName} আবশ্যক`;
    }

    if (control?.hasError('minlength')) {
      return 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষর হতে হবে';
    }

    if (fieldName === 'confirmPassword' && this.changePasswordForm.hasError('passwordMismatch')) {
      return 'পাসওয়ার্ড মিল নেই';
    }

    return '';
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}
