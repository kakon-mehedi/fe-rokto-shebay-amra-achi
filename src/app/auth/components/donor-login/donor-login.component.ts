import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DonorService } from '../../../shared/services/donor.service';
import { DonorLoginRequest } from '../../../shared/interfaces/donor.interface';

@Component({
  selector: 'app-donor-login',
  templateUrl: './donor-login.component.html',
  styleUrls: ['./donor-login.component.scss']
})
export class DonorLoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = false;
  hidePassword = true;
  loginMethod: 'phone' | 'email' = 'phone';

  constructor(
    private fb: FormBuilder,
    private donorService: DonorService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      phone: ['', [Validators.pattern(/^(\+88)?01[3-9]\d{8}$/)]],
      email: ['', [Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  ngOnInit(): void {
    // If already authenticated, redirect to donor dashboard
    if (this.donorService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }

    // Set initial validators based on login method
    this.updateValidators();
  }

  switchLoginMethod(method: 'phone' | 'email'): void {
    this.loginMethod = method;
    this.updateValidators();
    this.loginForm.patchValue({
      phone: '',
      email: ''
    });
  }

  private updateValidators(): void {
    const phoneControl = this.loginForm.get('phone');
    const emailControl = this.loginForm.get('email');

    if (this.loginMethod === 'phone') {
      phoneControl?.setValidators([Validators.required, Validators.pattern(/^(\+88)?01[3-9]\d{8}$/)]);
      emailControl?.clearValidators();
    } else {
      emailControl?.setValidators([Validators.required, Validators.email]);
      phoneControl?.clearValidators();
    }

    phoneControl?.updateValueAndValidity();
    emailControl?.updateValueAndValidity();
  }

  onSubmit(): void {
    if (this.loginForm.valid && !this.isLoading) {
      this.isLoading = true;
      
      const loginData: DonorLoginRequest = {
        password: this.loginForm.value.password
      };

      if (this.loginMethod === 'phone') {
        loginData.phone = this.loginForm.value.phone;
      } else {
        loginData.email = this.loginForm.value.email;
      }

      console.log('🔐 Login attempt with data:', loginData);

      this.donorService.login(loginData).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.data && response.data.donor) {
            this.snackBar.open('লগইন সফল হয়েছে!', 'বন্ধ করুন', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });

            // Check account status and redirect accordingly
            if (response.data.donor.accountStatus === 'PENDING') {
              this.router.navigate(['/dashboard/pending']);
            } else if (response.data.donor.accountStatus === 'ACTIVE') {
              this.router.navigate(['/dashboard']);
            } else {
              this.router.navigate(['/dashboard/pending']);
            }
          }
        },
        error: (error) => {
          this.isLoading = false;
          const errorMessage = error.error?.message || 'লগইন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।';
          this.snackBar.open(errorMessage, 'বন্ধ করুন', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.loginForm.get(fieldName);
    
    if (control?.hasError('required')) {
      const fieldMap: { [key: string]: string } = {
        'phone': 'মোবাইল নম্বর',
        'email': 'ইমেইল',
        'password': 'পাসওয়ার্ড'
      };
      return `${fieldMap[fieldName] || fieldName} আবশ্যক`;
    }

    if (control?.hasError('email')) {
      return 'বৈধ ইমেইল ঠিকানা লিখুন';
    }

    if (control?.hasError('pattern')) {
      if (fieldName === 'phone') {
        return 'বৈধ বাংলাদেশী মোবাইল নম্বর লিখুন (যেমন: 01712345678)';
      }
    }

    if (control?.hasError('minlength')) {
      return 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষর হতে হবে';
    }

    return '';
  }

  goToRegister(): void {
    this.router.navigate(['/auth/donor-register']);
  }

  goToForgotPassword(): void {
    // Implement forgot password functionality
    this.snackBar.open('পাসওয়ার্ড রিসেট ফিচার শীঘ্রই আসছে', 'বন্ধ করুন', {
      duration: 3000,
      panelClass: ['info-snackbar']
    });
  }

  goToPublicDonors(): void {
    this.router.navigate(['/donor-list']);
  }
}
