export interface DonorRegisterRequest {
  name: string;
  phone: string;
  city: string;
  location: string;
  address: string;
  bloodGroup: string;
  gender: string;
  religion: string;
  dateOfBirth: string;
  password: string;
  email?: string;
  profession?: string;
  weight?: number;
  height?: number;
  nationalId?: string;
  emergencyContact?: {
    name?: string;
    phone?: string;
    relation?: string;
  };
}

export interface DonorLoginRequest {
  phone?: string;
  email?: string;
  password: string;
}

export interface ApiResponse<T> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
}

export interface DonorResponse {
  _id: string;
  name: string;
  phone?: string;
  email?: string;
  city: string;
  location: string;
  address: string;
  bloodGroup: string;
  gender: string;
  religion: string;
  dateOfBirth: string;
  profession?: string;
  weight?: number;
  height?: number;
  nationalId?: string;
  profilePhoto?: string;
  totalDonations: number;
  lastDonationDate?: string;
  nextEligibleDate?: string;
  accountStatus: 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'INACTIVE';
  eligibilityStatus: 'ELIGIBLE' | 'TEMPORARILY_INELIGIBLE' | 'PERMANENTLY_INELIGIBLE' | 'PENDING';
  registrationDate: string;
  lastLoginDate?: string;
  emergencyContact?: {
    name?: string;
    phone?: string;
    relation?: string;
  };
  privacySettings?: {
    showPhoneToPublic: boolean;
    showEmailToPublic: boolean;
    allowEmergencyContact: boolean;
  };
}

export interface PublicDonorResponse {
  _id: string;
  name: string;
  gender: string;
  religion: string;
  profession?: string;
  address: string;
  bloodGroup: string;
  city: string;
  location: string;
  profilePhoto?: string;
  totalDonations: number;
  lastDonationDate?: string;
}

export interface DonorLoginResponse {
  statusCode: number;
  data: {
    donor: DonorResponse;
    accessToken: string;
    refreshToken: string;
  };
  message: string;
  success: boolean;
}

export interface DonationRecord {
  donationDate: string;
  location: string;
  bloodBank: string;
  units: number;
  notes?: string;
  verifiedBy?: {
    name: string;
    email: string;
  };
}

export interface EligibilityCheck {
  eligible: boolean;
  reason: string;
  nextEligibleDate?: string;
}
