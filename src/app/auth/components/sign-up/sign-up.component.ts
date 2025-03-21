import { Location } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-sign-up',
	templateUrl: './sign-up.component.html',
	styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {
	constructor(
		private readonly _location: Location,
		private readonly _cdr: ChangeDetectorRef
	) {}

	ngOnInit(): void {}

	bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
	today = new Date();

	goBack() {
		this._location.back();
		this._cdr.detectChanges();
	}
}
