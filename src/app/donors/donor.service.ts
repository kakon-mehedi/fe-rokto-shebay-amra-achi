import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IDonor } from './donor.types';
import { BUSINESS_SERVICE_BASE_URL } from '../shared/app.constants';

@Injectable({
	providedIn: 'root',
})
export class DonorService {
    constructor(private _http: HttpClient) {}

    registerNewDonor(donor: IDonor) {
        const url = BUSINESS_SERVICE_BASE_URL + 'donors';
		return this._http.post(url, donor);
    }

    getDonors() {
        const url = BUSINESS_SERVICE_BASE_URL + 'donors';
		return this._http.get(url);
    }
}
