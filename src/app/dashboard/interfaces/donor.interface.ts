export interface Donor {
  _id?: string;
  name: string;
  address: string;
  mobileNumber: string;
  bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'O+' | 'O-' | 'AB+' | 'AB-';
  lastDonationDate?: Date | string;
  totalNumberOfDonation?: number;
  profilePhoto?: string;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  statusCode: number;
  success: boolean;
}