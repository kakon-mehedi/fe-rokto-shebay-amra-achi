import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DonorService } from '../../donor.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IDonor } from '../../donor.types';

@Component({
	selector: 'app-register-donors',
	templateUrl: './register-donors.component.html',
	styleUrls: ['./register-donors.component.scss'],
})
export class RegisterDonorsComponent {
	bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
	today = new Date();
	donorRegistrationForm!: FormGroup;
	constructor(
		private _fb: FormBuilder,
		private _donorService: DonorService,
		private _snackbar: MatSnackBar
	) {
		this.initDonorRegistrationForm();
	}

	ngOnInit(): void {}

	initDonorRegistrationForm() {
		this.donorRegistrationForm = this._fb.group({
			name: ['', Validators.required],
			address: ['', Validators.required],
			mobileNumber: ['', Validators.required],
			bloodGroup: ['', Validators.required],
			lastDonationDate: [],
			totalNumberOfDonation: [],
			profilePhoto: ['', Validators.required],
		});
	}

	onSubmit() {
		const payload = this.makeNewUserRegistrationForm();

		this._donorService.registerNewDonor(payload).subscribe({
			next: (res) => {
				this._snackbar.open('User Registered Successfully', '', {
					duration: 500,
				});
			},
			error: (err) => {
				this._snackbar.open(
					err.message || 'Unexpected Error Occurred',
					'',
					{ duration: 500 }
				);
			},
		});
	}

	makeNewUserRegistrationForm(): IDonor {
		const formVal = this.donorRegistrationForm.getRawValue();

		const {
			name,
			address,
			mobileNumber,
			bloodGroup,
			lastDonationDate,
			totalNumberOfDonation,
			profilePhoto,
		} = formVal;

		const payload: IDonor = {
			name,
			address,
			mobileNumber,
			bloodGroup,
			lastDonationDate,
			totalNumberOfDonation,
			profilePhoto,
		};

		return payload;
	}
}
