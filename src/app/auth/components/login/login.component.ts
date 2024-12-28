import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
	loginForm!: FormGroup;

	constructor(
		private _fb: FormBuilder,
		private _authService: AuthService,
		private _snackbar: MatSnackBar
	) {
		this.initLoginForm();
	}

	ngOnInit(): void {}

	initLoginForm() {
		this.loginForm = this._fb.group({
			email: [],
			password: ['', Validators.required],
		});
	}

  onSubmit() {
    const formVal = this.loginForm.getRawValue();
    this._authService.login(formVal).subscribe({
      next: () => {},
      error: (err) => {
        console.log(err)
      }
    })

  }
}
