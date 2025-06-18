import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-blood-donation-guide',
  templateUrl: './blood-donation-guide.component.html',
  styleUrls: ['./blood-donation-guide.component.scss']
})
export class BloodDonationGuideComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  // Scroll to specific section
  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
