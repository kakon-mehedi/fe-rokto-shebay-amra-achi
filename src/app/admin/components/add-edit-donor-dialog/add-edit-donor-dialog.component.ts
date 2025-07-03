import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DonorService } from '../../../shared/services/donor.service';
import { AdminDonorResponse } from '../../../shared/interfaces/donor.interface';

interface DialogData {
  donor: AdminDonorResponse | null;
  mode: 'add' | 'edit';
}

@Component({
  selector: 'app-add-edit-donor-dialog',
  templateUrl: './add-edit-donor-dialog.component.html',
  styleUrls: ['./add-edit-donor-dialog.component.scss']
})
export class AddEditDonorDialogComponent implements OnInit {
  donorForm!: FormGroup;
  isLoading = false;
  isEdit = false;

  // Form options
  bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  genders = [
    { value: 'Male', label: 'পুরুষ' },
    { value: 'Female', label: 'নারী' },
    { value: 'Other', label: 'অন্যান্য' }
  ];
  religions = [
    { value: 'Islam', label: 'ইসলাম' },
    { value: 'Hinduism', label: 'হিন্দু' },
    { value: 'Buddhism', label: 'বৌদ্ধ' },
    { value: 'Christianity', label: 'খ্রিস্টান' },
    { value: 'Other', label: 'অন্যান্য' }
  ];
  accountStatuses = [
    { value: 'PENDING', label: 'অপেক্ষমাণ' },
    { value: 'ACTIVE', label: 'সক্রিয়' },
    { value: 'SUSPENDED', label: 'স্থগিত' },
    { value: 'INACTIVE', label: 'নিষ্ক্রিয়' }
  ];
  eligibilityStatuses = [
    { value: 'PENDING', label: 'অপেক্ষমাণ' },
    { value: 'ELIGIBLE', label: 'যোগ্য' },
    { value: 'TEMPORARILY_INELIGIBLE', label: 'অস্থায়ীভাবে অযোগ্য' },
    { value: 'PERMANENTLY_INELIGIBLE', label: 'স্থায়ীভাবে অযোগ্য' }
  ];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddEditDonorDialogComponent>,
    private donorService: DonorService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.isEdit = data?.mode === 'edit' && !!data.donor;
  }

  ngOnInit() {
    this.initializeForm();
  }

  private initializeForm() {
    const donor = this.data?.donor;
    
    this.donorForm = this.fb.group({
      // Basic Information
      name: [donor?.name || '', [Validators.required, Validators.maxLength(100)]],
      phone: [donor?.phone || '', [Validators.required, Validators.pattern(/^(\+88)?01[3-9]\d{8}$/)]],
      email: [donor?.email || '', [Validators.email]],
      
      // Personal Information
      gender: [donor?.gender || '', Validators.required],
      religion: [donor?.religion || '', Validators.required],
      dateOfBirth: [donor?.dateOfBirth ? new Date(donor.dateOfBirth) : '', Validators.required],
      profession: [donor?.profession || '', Validators.maxLength(100)],
      
      // Location Information
      city: [donor?.city || '', Validators.required],
      location: [donor?.location || '', Validators.required],
      address: [donor?.address || '', Validators.required],
      
      // Medical Information
      bloodGroup: [donor?.bloodGroup || '', Validators.required],
      weight: [donor?.weight || '', [Validators.min(45), Validators.max(200)]],
      height: [donor?.height || '', [Validators.min(120), Validators.max(250)]],
      
      // Emergency Contact
      emergencyContactName: [donor?.emergencyContact?.name || ''],
      emergencyContactPhone: [donor?.emergencyContact?.phone || '', Validators.pattern(/^(\+88)?01[3-9]\d{8}$/)],
      emergencyContactRelation: [donor?.emergencyContact?.relation || ''],
      
      // Administrative
      accountStatus: [donor?.accountStatus || 'PENDING'],
      eligibilityStatus: [donor?.eligibilityStatus || 'PENDING'],
      
      // Additional Information
      nationalId: [donor?.nationalId || '', Validators.pattern(/^\d{10}$|^\d{13}$|^\d{17}$/)],
      totalDonations: [donor?.totalDonations || 0, Validators.min(0)],
      lastDonationDate: [donor?.lastDonationDate ? new Date(donor.lastDonationDate) : '']
    });
  }

  onSubmit() {
    if (this.donorForm.valid) {
      this.isLoading = true;
      const formData = this.prepareFormData();
      
      if (this.isEdit && this.data.donor) {
        this.updateDonor(this.data.donor._id, formData);
      } else {
        this.createDonor(formData);
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  private prepareFormData() {
    const formValue = this.donorForm.value;
    
    return {
      ...formValue,
      emergencyContact: {
        name: formValue.emergencyContactName,
        phone: formValue.emergencyContactPhone,
        relation: formValue.emergencyContactRelation
      }
    };
  }

  private updateDonor(id: string, donorData: any) {
    this.donorService.updateDonorAsAdmin(id, donorData).subscribe({
      next: (response: any) => {
        this.snackBar.open('রক্তদাতার তথ্য সফলভাবে আপডেট করা হয়েছে', 'বন্ধ করুন', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.dialogRef.close({ success: true, donor: response.data });
      },
      error: (error: any) => {
        this.snackBar.open('রক্তদাতার তথ্য আপডেট করতে ত্রুটি হয়েছে', 'বন্ধ করুন', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        this.isLoading = false;
      }
    });
  }

  private createDonor(donorData: any) {
    // TODO: Implement create donor functionality
    this.snackBar.open('নতুন রক্তদাতা যোগ করার ফিচার শীঘ্রই আসছে', 'বন্ধ করুন', {
      duration: 3000
    });
    this.isLoading = false;
  }

  private markFormGroupTouched() {
    Object.keys(this.donorForm.controls).forEach(key => {
      const control = this.donorForm.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const control = this.donorForm.get(fieldName);
    if (control?.errors && control.touched) {
      if (control.errors['required']) return 'এই ক্ষেত্রটি আবশ্যক';
      if (control.errors['email']) return 'বৈধ ইমেইল ঠিকানা দিন';
      if (control.errors['pattern']) return 'সঠিক ফরম্যাটে দিন';
      if (control.errors['maxlength']) return 'অক্ষর সংখ্যা বেশি';
      if (control.errors['min']) return 'মান কম';
      if (control.errors['max']) return 'মান বেশি';
    }
    return '';
  }

  close() {
    this.dialogRef.close();
  }
}
