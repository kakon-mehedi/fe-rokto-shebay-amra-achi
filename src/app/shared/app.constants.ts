import { HttpHeaders } from "@angular/common/http";

export const BUSINESS_SERVICE_BASE_URL = 'http://localhost:8080/api/v1/';

export const HEADERS = {
    headers: new HttpHeaders({
		'Content-Type': 'application/json',
	})
}

export const FORM_DATA_HEADERS = {
    headers: new HttpHeaders({
		'Content-Type': 'multipart/form-data',
	})
}