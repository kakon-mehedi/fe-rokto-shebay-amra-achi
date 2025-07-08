import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-stats',
  template: `
    <div class="dashboard-stats">
      <!-- This component can be used for additional stats -->
    </div>
  `,
  styles: [`
    .dashboard-stats {
      // Add styles here
    }
  `]
})
export class DashboardStatsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
