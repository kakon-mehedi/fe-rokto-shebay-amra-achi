import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-management',
  template: `
    <div class="user-management-container">
      <div class="page-header">
        <h1>ব্যবহারকারী ব্যবস্থাপনা</h1>
        <p>সকল ব্যবহারকারীর তথ্য দেখুন ও ব্যবস্থাপনা করুন</p>
      </div>
      
      <!-- Coming Soon -->
      <mat-card class="coming-soon-card">
        <mat-card-content>
          <div class="coming-soon-content">
            <mat-icon>construction</mat-icon>
            <h2>শীঘ্রই আসছে</h2>
            <p>ব্যবহারকারী ব্যবস্থাপনা বৈশিষ্ট্য শীঘ্রই যোগ করা হবে।</p>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .user-management-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 24px;
    }

    .page-header {
      margin-bottom: 24px;
      
      h1 {
        margin: 0;
        color: #333;
        font-size: 28px;
        font-weight: 700;
      }
      
      p {
        margin: 8px 0 0 0;
        color: #666;
        font-size: 16px;
      }
    }

    .coming-soon-card {
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    }

    .coming-soon-content {
      text-align: center;
      padding: 60px 20px;
      
      mat-icon {
        font-size: 64px;
        width: 64px;
        height: 64px;
        color: #666;
        margin-bottom: 20px;
      }
      
      h2 {
        margin: 0 0 16px 0;
        color: #333;
        font-size: 24px;
      }
      
      p {
        margin: 0;
        color: #666;
        font-size: 16px;
      }
    }
  `]
})
export class UserManagementComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
