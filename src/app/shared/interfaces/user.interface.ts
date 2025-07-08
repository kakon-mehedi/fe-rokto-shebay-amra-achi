export interface User {
  _id?: string;
  name: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  profilePhoto?: string;
  address: {
    addressLine: string;
    mobileNumber: string;
  };
  bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'O+' | 'O-' | 'AB+' | 'AB-';
  role?: 'user' | 'admin';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  data: string; // access token
  message: string;
  statusCode: number;
  success: boolean;
}

export interface RegisterRequest {
  name: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  address: {
    addressLine: string;
    mobileNumber: string;
  };
  bloodGroup: string;
  profilePhoto?: File;
}
