import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { TeamMemberService, TeamMember } from '../shared/services/team-member.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AboutComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  teamMembers: TeamMember[] = [];
  isLoadingTeamMembers = false;

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

  constructor(
    private teamMemberService: TeamMemberService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadTeamMembers();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadTeamMembers(): void {
    if (this.isLoadingTeamMembers) {
      return; // Prevent multiple concurrent requests
    }
    
    this.isLoadingTeamMembers = true;
    this.teamMemberService.getAllTeamMembers()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.teamMembers = response.data;
          }
          this.isLoadingTeamMembers = false;
        },
        error: (error) => {
          console.error('Error loading team members:', error);
          this.isLoadingTeamMembers = false;
          // Fallback to empty array or show error message
          this.teamMembers = [];
        }
      });
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

  onImageError(event: any): void {
    if (event.target && event.target.src !== 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiBmaWxsPSIjRjVGNUY1Ii8+CjxjaXJjbGUgY3g9IjYwIiBjeT0iNDAiIHI9IjIwIiBmaWxsPSIjQ0NDIi8+CjxwYXRoIGQ9Ik0yNSA5NUw5NSA5NUw4NSA3NUwyNSA3NVoiIGZpbGw9IiNDQ0MiLz4KPC9zdmc+') {
      // Use inline SVG as fallback to prevent infinite loop
      event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiBmaWxsPSIjRjVGNUY1Ii8+CjxjaXJjbGUgY3g9IjYwIiBjeT0iNDAiIHI9IjIwIiBmaWxsPSIjQ0NDIi8+CjxwYXRoIGQ9Ik0yNSA5NUw5NSA5NUw4NSA3NUwyNSA3NVoiIGZpbGw9IiNDQ0MiLz4KPC9zdmc+';
    }
  }

  // Copy phone number to clipboard
  copyPhoneNumber(phone: string): void {
    navigator.clipboard.writeText(phone).then(() => {
      this.snackBar.open(`ফোন নম্বর কপি হয়েছে: ${phone}`, 'বন্ধ করুন', {
        duration: 3000,
        panelClass: ['success-snackbar']
      });
    }).catch(err => {
      console.error('ফোন নম্বর কপি করতে সমস্যা হয়েছে: ', err);
      this.snackBar.open('ফোন নম্বর কপি করতে সমস্যা হয়েছে', 'বন্ধ করুন', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
    });
  }

  // Call phone number
  callPhoneNumber(phone: string): void {
    window.location.href = `tel:${phone}`;
  }
}
