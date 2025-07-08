import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../shared/services/auth.service';
import { LoginRequest } from '../../../shared/interfaces/user.interface';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
	loginForm: FormGroup;
	isLoading = false;
	hidePassword = true;

	constructor(
		private fb: FormBuilder,
		private authService: AuthService,
		private router: Router,
		private snackBar: MatSnackBar
	) {
		this.loginForm = this.fb.group({
			email: ['', [Validators.required, Validators.email]],
			password: ['', [Validators.required, Validators.minLength(6)]],
			rememberMe: [false]
		});
	}

	ngOnInit(): void {
		// If already authenticated, redirect to appropriate dashboard
		if (this.authService.isAuthenticated()) {
			if (this.authService.isAdmin()) {
				this.router.navigate(['/admin/dashboard']);
			} else {
				this.router.navigate(['/donors']);
			}
		}
	}

	onSubmit() {
		if (this.loginForm.valid && !this.isLoading) {
			this.isLoading = true;
			const loginData: LoginRequest = this.loginForm.value;

			this.authService.login(loginData).subscribe({
				next: (response) => {
					this.isLoading = false;
					if (response.success) {
						this.snackBar.open('লগইন সফল হয়েছে!', 'বন্ধ করুন', {
							duration: 3000,
							panelClass: ['success-snackbar']
						});
						
						// Wait a moment for user data to load, then redirect based on role
						setTimeout(() => {
							if (this.authService.isAdmin()) {
								window.location.href = '/admin/dashboard';
							} else {
								window.location.href = '/donors';
							}
						}, 1000);
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

	private markFormGroupTouched() {
		Object.keys(this.loginForm.controls).forEach(key => {
			const control = this.loginForm.get(key);
			control?.markAsTouched();
		});
	}

	getErrorMessage(fieldName: string): string {
		const control = this.loginForm.get(fieldName);
		if (control?.hasError('required')) {
			const fieldMap: { [key: string]: string } = {
				'email': 'ইমেইল',
				'password': 'পাসওয়ার্ড'
			};
			return `${fieldMap[fieldName] || fieldName} আবশ্যক`;
		}
		if (control?.hasError('email')) {
			return 'বৈধ ইমেইল ঠিকানা লিখুন';
		}
		if (control?.hasError('minlength')) {
			return 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষর হতে হবে';
		}
		return '';
	}

	togglePasswordVisibility() {
		this.hidePassword = !this.hidePassword;
	}
}
