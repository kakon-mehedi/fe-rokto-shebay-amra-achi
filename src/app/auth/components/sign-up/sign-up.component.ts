import { Location } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../shared/services/auth.service';
import { RegisterRequest } from '../../../shared/interfaces/user.interface';

@Component({
	selector: 'app-sign-up',
	templateUrl: './sign-up.component.html',
	styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {
	registerForm: FormGroup;
	bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
	hidePassword = true;
	hideConfirmPassword = true;
	isLoading = false;
	selectedFile: File | null = null;

	constructor(
		private readonly _location: Location,
		private readonly _cdr: ChangeDetectorRef,
		private fb: FormBuilder,
		private authService: AuthService,
		private router: Router,
		private snackBar: MatSnackBar
	) {
		this.registerForm = this.fb.group({
			name: ['', [Validators.required, Validators.minLength(2)]],
			email: ['', [Validators.email]], // Optional
			password: [''], // Optional for admin-created users
			confirmPassword: [''],
			addressLine: ['', [Validators.required]],
			mobileNumber: ['', [Validators.required, Validators.pattern(/^(\+880|880|0)?1[3-9]\d{8}$/)]],
			bloodGroup: ['', [Validators.required]],
			agreeToTerms: [false, [Validators.requiredTrue]]
		}, { validators: this.passwordMatchValidator });
	}

	ngOnInit(): void {}

	passwordMatchValidator(form: FormGroup) {
		const password = form.get('password');
		const confirmPassword = form.get('confirmPassword');
		
		if (password?.value && confirmPassword?.value) {
			return password.value === confirmPassword.value ? null : { passwordMismatch: true };
		}
		return null;
	}

	onFileSelected(event: any): void {
		const file = event.target.files[0];
		if (file) {
			// Validate file type
			const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
			if (!allowedTypes.includes(file.type)) {
				this.snackBar.open('অনুগ্রহ করে একটি বৈধ ছবি নির্বাচন করুন (JPEG, JPG, PNG)', 'বন্ধ করুন', {
					duration: 3000,
					panelClass: ['error-snackbar']
				});
				return;
			}
			
			// Validate file size (2MB max)
			if (file.size > 2 * 1024 * 1024) {
				this.snackBar.open('ফাইলের আকার ২MB এর কম হতে হবে', 'বন্ধ করুন', {
					duration: 3000,
					panelClass: ['error-snackbar']
				});
				return;
			}
			
			this.selectedFile = file;
		}
	}

	removeFile(event: Event): void {
		event.preventDefault();
		event.stopPropagation();
		this.selectedFile = null;
	}

	onSubmit(): void {
		if (this.registerForm.valid && !this.isLoading) {
			this.isLoading = true;
			
			const formValue = this.registerForm.value;
			const registerData: RegisterRequest = {
				name: formValue.name,
				email: formValue.email || undefined,
				password: formValue.password || undefined,
				confirmPassword: formValue.confirmPassword || undefined,
				address: {
					addressLine: formValue.addressLine,
					mobileNumber: formValue.mobileNumber
				},
				bloodGroup: formValue.bloodGroup,
				profilePhoto: this.selectedFile || undefined
			};

			this.authService.register(registerData).subscribe({
				next: (response) => {
					this.isLoading = false;
					if (response.success) {
						this.snackBar.open('নিবন্ধন সফল হয়েছে!', 'বন্ধ করুন', {
							duration: 3000,
							panelClass: ['success-snackbar']
						});
						this.router.navigate(['/users/login']);
					}
				},
				error: (error) => {
					this.isLoading = false;
					const errorMessage = error.error?.message || 'নিবন্ধন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।';
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
		Object.keys(this.registerForm.controls).forEach(key => {
			const control = this.registerForm.get(key);
			control?.markAsTouched();
		});
	}

	getErrorMessage(fieldName: string): string {
		const control = this.registerForm.get(fieldName);
		if (control?.hasError('required')) {
			const fieldMap: { [key: string]: string } = {
				'name': 'নাম',
				'addressLine': 'ঠিকানা',
				'mobileNumber': 'মোবাইল নম্বর',
				'bloodGroup': 'রক্তের গ্রুপ',
				'agreeToTerms': 'শর্তাবলী'
			};
			return `${fieldMap[fieldName] || fieldName} আবশ্যক`;
		}
		if (control?.hasError('email')) {
			return 'বৈধ ইমেইল ঠিকানা লিখুন';
		}
		if (control?.hasError('minlength')) {
			return `কমপক্ষে ${control.errors?.['minlength']?.requiredLength} অক্ষর হতে হবে`;
		}
		if (control?.hasError('pattern')) {
			return 'বৈধ বাংলাদেশী মোবাইল নম্বর লিখুন';
		}
		if (this.registerForm.hasError('passwordMismatch') && (fieldName === 'confirmPassword')) {
			return 'পাসওয়ার্ড মিলছে না';
		}
		if (control?.hasError('requiredTrue')) {
			return 'শর্তাবলী গ্রহণ করতে হবে';
		}
		return '';
	}

	togglePasswordVisibility(): void {
		this.hidePassword = !this.hidePassword;
	}

	toggleConfirmPasswordVisibility(): void {
		this.hideConfirmPassword = !this.hideConfirmPassword;
	}

	goBack(): void {
		this._location.back();
		this._cdr.detectChanges();
	}
}
