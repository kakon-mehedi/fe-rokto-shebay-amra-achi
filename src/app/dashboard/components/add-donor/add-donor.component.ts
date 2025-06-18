import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DonorService } from '../../services/donor-service';
import { Donor } from '../../interfaces/donor.interface';

@Component({
  selector: 'app-add-donor',
  templateUrl: './add-donor.component.html',
  styleUrls: ['./add-donor.component.scss']
})
export class AddDonorComponent implements OnInit {
  donorForm: FormGroup;
  bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
  isLoading = false;
  selectedFile: File | null = null;
  isEditMode = false;
  donorId: string | null = null;
  pageTitle = 'নতুন ডোনার যোগ করুন';  constructor(
    private fb: FormBuilder,
    private donorService: DonorService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.donorForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      address: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
      mobileNumber: ['', [Validators.required, Validators.pattern(/^(\+880|880|0)?1[3-9]\d{8}$/)]],
      bloodGroup: ['', [Validators.required]],
      lastDonationDate: [''],
      totalNumberOfDonation: [0, [Validators.min(0), Validators.max(100)]]
    });
  }

  ngOnInit(): void {
    // Check if we're in edit mode
    this.donorId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.donorId;
    
    if (this.isEditMode) {
      this.pageTitle = 'ডোনার সম্পাদনা করুন';
      this.loadDonorData(this.donorId!);
    }
  }

  private loadDonorData(donorId: string): void {
    console.log('Loading donor data for edit, ID:', donorId);
    this.isLoading = true;
    
    // Try API first
    this.donorService.getDonorById(donorId).subscribe({
      next: (response) => {
        this.isLoading = false;
        console.log('Edit - API response:', response);
        if (response.success && response.data) {
          this.populateForm(response.data);
        } else {
          console.log('API unsuccessful, trying mock data');
          this.loadFromMockData(donorId);
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.log('API error, trying mock data:', error);
        this.loadFromMockData(donorId);
      }
    });
  }

  private loadFromMockData(donorId: string): void {
    const mockDonors = this.donorService.getMockDonors();
    const donor = mockDonors.find(d => d._id === donorId);
    
    if (donor) {
      console.log('Donor found in mock data for edit:', donor);
      this.populateForm(donor);
    } else {
      console.log('Donor not found in mock data');
      this.snackBar.open('ডোনার পাওয়া যায়নি', 'বন্ধ করুন', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      this.router.navigate(['/donors']);
    }
  }
  private populateForm(donor: Donor): void {
    console.log('Populating form with donor data:', donor);
    this.donorForm.patchValue({
      name: donor.name,
      address: donor.address,
      mobileNumber: donor.mobileNumber,
      bloodGroup: donor.bloodGroup,
      lastDonationDate: donor.lastDonationDate ? new Date(donor.lastDonationDate).toISOString().split('T')[0] : '',
      totalNumberOfDonation: donor.totalNumberOfDonation || 0
    });
  }
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        this.snackBar.open('শুধুমাত্র ছবি ফাইল (JPEG, PNG, WebP) গ্রহণযোগ্য', 'বন্ধ করুন', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        // Clear the input
        event.target.value = '';
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        this.snackBar.open('ফাইলের আকার ৫ মেগাবাইটের কম হতে হবে', 'বন্ধ করুন', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        // Clear the input
        event.target.value = '';
        return;
      }
      
      this.selectedFile = file;
      console.log('File selected:', file.name, 'Size:', (file.size / 1024 / 1024).toFixed(2) + 'MB');
    }
  }
  onSubmit(): void {
    if (this.donorForm.valid && !this.isLoading) {
      this.isLoading = true;
      
      const donorData: Donor = this.donorForm.value;      if (this.isEditMode && this.donorId) {
        // Update existing donor
        console.log('Updating donor:', donorData);
        this.donorService.updateDonor(this.donorId, donorData, this.selectedFile || undefined).subscribe({
          next: (response) => {
            this.isLoading = false;
            console.log('Update response:', response);
            if (response.success) {
              this.snackBar.open('ডোনার সফলভাবে আপডেট হয়েছে!', 'বন্ধ করুন', {
                duration: 3000,
                panelClass: ['success-snackbar']
              });
              this.router.navigate(['/donors']);
            } else {
              this.snackBar.open(response.message || 'আপডেট করতে সমস্যা হয়েছে', 'বন্ধ করুন', {
                duration: 3000,
                panelClass: ['error-snackbar']
              });
            }
          },
          error: (error) => {
            this.isLoading = false;
            console.log('Update error:', error);
            const errorMessage = error.error?.message || 'ডোনার আপডেট করতে ব্যর্থ। আবার চেষ্টা করুন।';
            this.snackBar.open(errorMessage, 'বন্ধ করুন', {
              duration: 5000,
              panelClass: ['error-snackbar']
            });
          }
        });
      } else {
        // Add new donor
        console.log('Adding new donor:', donorData);
        this.donorService.addDonor(donorData, this.selectedFile || undefined).subscribe({
          next: (response) => {
            this.isLoading = false;
            if (response.success) {
              this.snackBar.open('ডোনার সফলভাবে যোগ করা হয়েছে!', 'বন্ধ করুন', {
                duration: 3000,
                panelClass: ['success-snackbar']
              });
              this.router.navigate(['/donors']);
            }
          },
          error: (error) => {
            this.isLoading = false;
            const errorMessage = error.error?.message || 'ডোনার যোগ করতে ব্যর্থ। আবার চেষ্টা করুন।';
            this.snackBar.open(errorMessage, 'বন্ধ করুন', {
              duration: 5000,
              panelClass: ['error-snackbar']
            });
          }
        });
      }
    } else {
      this.markFormGroupTouched();
    }
  }
  private markFormGroupTouched(): void {
    Object.keys(this.donorForm.controls).forEach(key => {
      const control = this.donorForm.get(key);
      control?.markAsTouched();
    });
  }
  getTodayDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  getFileSize(sizeInBytes: number): string {
    if (sizeInBytes < 1024) {
      return sizeInBytes + ' B';
    } else if (sizeInBytes < 1024 * 1024) {
      return (sizeInBytes / 1024).toFixed(1) + ' KB';
    } else {
      return (sizeInBytes / (1024 * 1024)).toFixed(1) + ' MB';
    }
  }

  removeSelectedFile(): void {
    this.selectedFile = null;
    // Reset the file input
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }getErrorMessage(fieldName: string): string {
    const control = this.donorForm.get(fieldName);
    if (control?.hasError('required')) {
      const fieldLabels: { [key: string]: string } = {
        'name': 'নাম',
        'address': 'ঠিকানা',
        'mobileNumber': 'মোবাইল নাম্বার',
        'bloodGroup': 'ব্লাড গ্রুপ'
      };
      const label = fieldLabels[fieldName] || fieldName;
      return `${label} অবশ্যক`;
    }
    if (control?.hasError('minlength')) {
      const fieldLabels: { [key: string]: string } = {
        'name': 'নাম',
        'address': 'ঠিকানা'
      };
      const label = fieldLabels[fieldName] || fieldName;
      const requiredLength = control.errors?.['minlength']?.requiredLength;
      return `${label} কমপক্ষে ${requiredLength} অক্ষরের হতে হবে`;
    }
    if (control?.hasError('maxlength')) {
      const fieldLabels: { [key: string]: string } = {
        'name': 'নাম',
        'address': 'ঠিকানা'
      };
      const label = fieldLabels[fieldName] || fieldName;
      const maxLength = control.errors?.['maxlength']?.requiredLength;
      return `${label} সর্বোচ্চ ${maxLength} অক্ষরের হতে হবে`;
    }
    if (control?.hasError('pattern')) {
      return 'দয়া করে সঠিক বাংলাদেশী মোবাইল নাম্বার দিন';
    }
    if (control?.hasError('min')) {
      return 'রক্তদানের সংখ্যা ০ বা তার বেশি হতে হবে';
    }
    if (control?.hasError('max')) {
      return 'রক্তদানের সংখ্যা ১০০ এর কম হতে হবে';
    }
    return '';
  }
}
