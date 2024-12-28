import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import {
	BUSINESS_SERVICE_BASE_URL,
	FORM_DATA_HEADERS,
} from '../shared/app.constants';
import { ILogin } from './components/login/login.types';

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	constructor(private _http: HttpClient) {}

	registerNewDonor(payload: FormData) {
		const url = BUSINESS_SERVICE_BASE_URL + 'users/register';
		return this._http.post(url, payload);
	}

    login(payload: ILogin) {
        const url = BUSINESS_SERVICE_BASE_URL + 'users/login';
		return this._http.post(url, payload);
    }
}
