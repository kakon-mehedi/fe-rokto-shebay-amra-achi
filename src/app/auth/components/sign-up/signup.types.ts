export interface IUser {
	name: string;
	email: string;
	password: string;
	address: {
		addressLine: string;
		mobileNumber: string;
	};
	bloodGroup: string;
	lastDonationDate: string;
	totalNumberOfDonation: string;
	profilePhoto: File;
}
