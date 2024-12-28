export interface IDonor {
	name: string;
	address: string;
	mobileNumber: string;
	bloodGroup: string;
	lastDonationDate?: Date;
	totalNumberOfDonation?: number;
	profilePhoto?: string;
}