import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-edit-donor-dialog',
  template: `
    <div class="dialog-container">
      <h2 mat-dialog-title>
        {{ data ? 'রক্তদাতা সম্পাদনা' : 'নতুন রক্তদাতা যোগ' }}
      </h2>
      
      <mat-dialog-content>
        <div class="coming-soon-content">
          <mat-icon>construction</mat-icon>
          <h3>শীঘ্রই আসছে</h3>
          <p>রক্তদাতা যোগ/সম্পাদনা ফর্ম শীঘ্রই যোগ করা হবে।</p>
        </div>
      </mat-dialog-content>
      
      <mat-dialog-actions align="end">
        <button mat-button (click)="close()">বন্ধ করুন</button>
        <button mat-raised-button color="primary" disabled>সংরক্ষণ</button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .dialog-container {
      min-width: 400px;
      max-width: 600px;
    }

    .coming-soon-content {
      text-align: center;
      padding: 40px 20px;
      
      mat-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
        color: #666;
        margin-bottom: 16px;
      }
      
      h3 {
        margin: 0 0 12px 0;
        color: #333;
      }
      
      p {
        margin: 0;
        color: #666;
      }
    }
  `]
})
export class AddEditDonorDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<AddEditDonorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
  }

  close(): void {
    this.dialogRef.close();
  }

}
