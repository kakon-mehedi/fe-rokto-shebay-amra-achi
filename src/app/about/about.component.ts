import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AboutComponent implements OnInit {

  teamMembers = [
    {
      name: 'মোঃ শাহীন মাহমুদ ',
      position: 'প্রতিষ্ঠাতা ও চেয়ারম্যান',
      qualification: '',
      image: './../assets/images/team/chairman.jpg',
      description: 'সামাজিক কাজে ১০ বছরের অভিজ্ঞতা'
    },
    {
      name: 'মোঃ রেজওয়ান খন্দকার',
      position: 'মেডিকেল অ্যাডভাইজার',
      qualification: 'physiotherapist',
      image: 'assets/images/team/medical-advisor.jpg',
      description: 'ফিজিওথেরাপিস্ট'
    },

    {
        name: 'মোঃ শহীদ আলম',
        position: 'উপদেষ্টা',
        qualification: 'Honors in Business Administration',
        image: '../../assets/images/team/shahid_alam.jpg',
        description: 'সমাজকর্ম বিশেষজ্ঞ এবং স্বেচ্ছাসেবক দল পরিচালক।'
      },
    {
      name: 'মো. রিফাত হোসেন ',
      position: 'ফার্মাসিস্ট ',
      qualification: 'Degree in Accounting',
      image: 'assets/images/team/executive-director.jpg',
      description: 'সমাজসেবক এবং ফার্মাসিস্ট।'
    },
    
    {
      name: 'মোঃ মেহেদী হাসান কাকন',
      position: 'প্রযুক্তি পরিচালক ও উপদেষ্টা ',
      qualification: 'BSc in CSE, RUET',
      image: '../../assets/images/team/tech-director.jpg',
      description: 'সফটওয়্যার ডেভেলপমেন্ট এবং সিস্টেম ডিজাইনে ৬ বছরের অভিজ্ঞতা।'
    },
    {
      name: 'মোঃ মাসুদুর রহমান ',
      position: 'ডেভেলপার এবং ডিজাইনার',
      qualification: 'BSc in CSE, NUB',
      image: '../../assets/images/team/masud.webp',
      description: 'সফটওয়্যার ডেভেলপমেন্টে ৩ বছরের অভিজ্ঞতা।'
    }
  ];

  achievements = [
    {
      number: '২০০০+',
      title: 'রক্তদাতা নিবন্ধিত',
      icon: 'people'
    },
    {
      number: '১০০০+',
      title: 'সফল রক্তদান',
      icon: 'favorite'
    },
    {
      number: '০+',
      title: 'হাসপাতাল সংযুক্ত',
      icon: 'local_hospital'
    },
    {
      number: '৬৪',
      title: 'জেলায় সেবা',
      icon: 'location_on'
    },
    {
      number: '24/7',
      title: 'জরুরি সেবা',
      icon: 'access_time'
    },
    {
      number: '৫০০+',
      title: 'জীবন রক্ষা',
      icon: 'security'
    }
  ];

  partners = [
    {
      name: 'স্বাস্থ্য মন্ত্রণালয়',
      type: 'সরকারি অংশীদার',
      logo: 'assets/images/partners/health-ministry.png'
    },
    {
      name: 'বাংলাদেশ রেড ক্রিসেন্ট',
      type: 'আন্তর্জাতিক সংস্থা',
      logo: 'assets/images/partners/red-crescent.png'
    },
    {
      name: 'ঢাকা মেডিকেল কলেজ',
      type: 'শিক্ষা প্রতিষ্ঠান',
      logo: 'assets/images/partners/dmc.png'
    },
    {
      name: 'স্কয়ার হাসপাতাল',
      type: 'বেসরকারি হাসপাতাল',
      logo: 'assets/images/partners/square.png'
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  }
}
