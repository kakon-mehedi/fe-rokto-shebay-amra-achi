import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {  IUser } from './signup.types';
import { AuthService } from '../../auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
	selector: 'app-sign-up',
	templateUrl: './sign-up.component.html',
	styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {
	bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
	today = new Date();

	newDonorRegistrationForm!: FormGroup;

	constructor(
		private _fb: FormBuilder,
		private _authService: AuthService,
		private _snackbar: MatSnackBar
	) {
		this.initNewDonorRegistrationForm();
	}

	ngOnInit(): void {}

	initNewDonorRegistrationForm() {
		this.newDonorRegistrationForm = this._fb.group({
			name: ['', Validators.required],
			email: [],
			password: ['', Validators.required],
			addressLine: ['', Validators.required],
			mobileNumber: ['', Validators.required],
			bloodGroup: ['', Validators.required],
			lastDonationDate: [],
			totalNumberOfDonation: [],
			profilePhoto: ['', Validators.required],
		});
	}

	onSubmit() {
		const payload = this.makeNewUserRegistrationForm();

		this._authService.registerNewDonor(payload).subscribe({
			next: (res) => {
				this._snackbar.open('User Registered Successfully', '', { duration: 500 });
			},
			error: (err) => {
				this._snackbar.open(err.message || 'Unexpected Error Occurred', '', { duration: 500 });
			},
		});
	}

	makeNewUserRegistrationForm(): FormData {
		const formVal = this.newDonorRegistrationForm.getRawValue();

		const {
			name,
			email,
			password,
			addressLine,
			mobileNumber,
			bloodGroup,
			lastDonationDate,
			totalNumberOfDonation,
			profilePhoto,
		} = formVal;

		const address = {
			addressLine,
			mobileNumber,
		}

		const payload: IUser = {
			name,
			email,
			password,
			address: {
				addressLine,
				mobileNumber,
			},
			bloodGroup,
			lastDonationDate,
			totalNumberOfDonation,
			profilePhoto,
		};

		const formData = new FormData();
		formData.append('name', name);
		formData.append('email', email);
		formData.append('password', password);
		formData.append('address', JSON.stringify(address));
		formData.append('bloodGroup', bloodGroup);
		formData.append('lastDonationDate', lastDonationDate);
		formData.append('totalNumberOfDonation', totalNumberOfDonation);
		formData.append('profilePhoto', profilePhoto);
		

		return formData;
	}
}
