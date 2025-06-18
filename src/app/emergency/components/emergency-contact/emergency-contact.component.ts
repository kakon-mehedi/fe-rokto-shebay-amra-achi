import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-emergency-contact',
  templateUrl: './emergency-contact.component.html',
  styleUrls: ['./emergency-contact.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EmergencyContactComponent implements OnInit {

  emergencyContacts = [
    {
      title: 'ঢাকা মেডিকেল কলেজ হাসপাতাল',
      phone: '০২-৯৬৬১০২৫',
      address: 'রমনা, ঢাকা-১০০০',
      bloodBank: '০২-৯৬৬৭৭৫৫',
      type: 'সরকারি'
    },
    {
      title: 'বঙ্গবন্ধু শেখ মুজিব মেডিকেল বিশ্ববিদ্যালয়',
      phone: '০২-৯৬৬৮৮৫৫',
      address: 'শাহবাগ, ঢাকা-১০০০',
      bloodBank: '০২-৯৬৬৮৮৬৬',
      type: 'সরকারি'
    },
    {
      title: 'জাতীয় হৃদরোগ ইনস্টিটিউট',
      phone: '০২-৮৬১৬৭৯৮',
      address: 'শের-ই-বাংলা নগর, ঢাকা-১২০৭',
      bloodBank: '০২-৮৬১৬৭৯৯',
      type: 'বিশেষায়িত'
    },
    {
      title: 'স্কয়ার হাসপাতাল',
      phone: '১০৬৭৮',
      address: '১৮/এফ, বীর উত্তম কাজী নজরুল ইসলাম এভিনিউ, ঢাকা',
      bloodBank: '০২-৮১৪৪৪০০',
      type: 'বেসরকারি'
    },
    {
      title: 'ইউনাইটেড হাসপাতাল',
      phone: '০২-৮৮৩৬৪৪৪',
      address: 'গুলশান-২, ঢাকা-১২১২',
      bloodBank: '০২-৮৮৩৬৪৫৫',
      type: 'বেসরকারি'
    },
    {
      title: 'এভারকেয়ার হাসপাতাল',
      phone: '১০৬৭৮',
      address: 'প্লট নং ৮১, ব্লক-ই, বসুন্ধরা আর/এ, ঢাকা',
      bloodBank: '০৯৬১৩-৭৮৬৭৮৬',
      type: 'বেসরকারি'
    }
  ];

  bloodGroups = [
    { group: 'A+', donors: 125, available: true },
    { group: 'A-', donors: 45, available: true },
    { group: 'B+', donors: 89, available: true },
    { group: 'B-', donors: 32, available: false },
    { group: 'O+', donors: 156, available: true },
    { group: 'O-', donors: 28, available: false },
    { group: 'AB+', donors: 67, available: true },
    { group: 'AB-', donors: 18, available: false }
  ];

  constructor() { }

  ngOnInit(): void {
  }

  callNumber(phone: string): void {
    window.open(`tel:${phone}`, '_self');
  }

  getDirections(address: string): void {
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://maps.google.com/?q=${encodedAddress}`, '_blank');
  }

  callEmergency(): void {
    window.open('tel:999', '_self');
  }

  getTypeIcon(type: string): string {
    switch (type) {
      case 'সরকারি':
        return 'account_balance';
      case 'বেসরকারি':
        return 'business';
      case 'বিশেষায়িত':
        return 'medical_services';
      default:
        return 'local_hospital';
    }
  }

}
