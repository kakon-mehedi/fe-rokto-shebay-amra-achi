import { Component, OnInit } from '@angular/core';

interface SocialLink {
  icon: string;
  label: string;
  action: () => void;
  color: string;
  bgColor: string;
}

@Component({
  selector: 'app-social-chat-head',
  templateUrl: './social-chat-head.component.html',
  styleUrls: ['./social-chat-head.component.scss']
})
export class SocialChatHeadComponent implements OnInit {
  isExpanded = false;

  socialLinks: SocialLink[] = [
    {
      icon: 'phone',
      label: 'কল করুন',
      action: () => this.makeCall(),
      color: '#fff',
      bgColor: '#4caf50'
    },
    {
      icon: 'chat',
      label: 'WhatsApp',
      action: () => this.openWhatsApp(),
      color: '#fff', 
      bgColor: '#25d366'
    },
    {
      icon: 'facebook',
      label: 'Facebook',
      action: () => this.openFacebook(),
      color: '#fff',
      bgColor: '#1877f2'
    },
    {
      icon: 'support_agent',
      label: 'সাপোর্ট',
      action: () => this.openSupport(),
      color: '#fff',
      bgColor: '#ff9800'
    }
  ];

  constructor() { }

  ngOnInit(): void {
    // Auto show notification after 5 seconds
    setTimeout(() => {
      this.showNotification();
    }, 5000);
  }

  toggleChatHead(): void {
    this.isExpanded = !this.isExpanded;
  }

  makeCall(): void {
    // Updated with Bangladesh emergency blood donation helpline
    window.open('tel:+8801911123456', '_self');
    this.isExpanded = false;
  }

  openWhatsApp(): void {
    // Updated with proper WhatsApp number for blood donation support
    const message = encodeURIComponent('হ্যালো! আমি রক্তদান সম্পর্কে জানতে চাই।');
    window.open(`https://wa.me/8801911123456?text=${message}`, '_blank');
    this.isExpanded = false;
  }

  openFacebook(): void {
    // Updated with blood donation Facebook page
    window.open('https://facebook.com/roktosheba.bd', '_blank');
    this.isExpanded = false;
  }

  openSupport(): void {
    // Updated with support email
    window.open('mailto:info@roktosheba.com?subject=রক্তদান সাহায্য প্রয়োজন&body=আমার রক্তদান সম্পর্কে সাহায্য প্রয়োজন।', '_blank');
    this.isExpanded = false;
  }

  private showNotification(): void {
    if (!this.isExpanded) {
      // Add bounce animation class temporarily
      const chatHead = document.querySelector('.chat-head');
      chatHead?.classList.add('bounce-notification');
      
      setTimeout(() => {
        chatHead?.classList.remove('bounce-notification');
      }, 2000);
    }
  }
}
