import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-blood-donation-guide',
  templateUrl: './blood-donation-guide.component.html',
  styleUrls: ['./blood-donation-guide.component.scss']
})
export class BloodDonationGuideComponent implements OnInit {
  socialPostTemplate: string = `🆘 জীবন-মরণ প্রশ্ন! জরুরি রক্তের প্রয়োজন 🩸\n\n🩺 রোগের ধরন: [যদি চান: থ্যালাসেমিয়া/সিজারিয়ান/অস্ত্রোপচার]\n🩸 রক্তের গ্রুপ: [A+/O-/B+ ইত্যাদি]\n📦 রক্তের পরিমাণ : [২ ইউনিট] রক্ত\n🧪 হিমোগ্লোবিন: [যদি জানেন, যেমন: 5.2 gm/dL]\n🏥 রক্ত দানের স্থান: [হাসপাতালের নাম, জেলা]\n📅 রক্ত দানের তারিখ : [তারিখ]\n⏰ সময়: [যত দ্রুত সম্ভব]\n\n📞 যোগাযোগ: [নাম ও মোবাইল নম্বর]\n📌 রেফারেন্স : [নাম ও মোবাইল নম্বর]\n\n❗ একজন মানুষ বাঁচাতে আপনার ১ ব্যাগ রক্তই যথেষ্ট হতে পারে।\n\n🤲 দয়া করে সাহায্যের হাত বাড়ান এবং পোস্টটি শেয়ার করুন।\n\n📢 আগ্রহীরা ইনবক্স করুন বা সরাসরি কল করুন।\n\n—\n\n🏷️ #রক্তসেবায়আমরাআছি #রক্তদাতা #মানবতা #জরুরীরক্তপ্রয়োজন #roktosebayamraachi #BloodDonation #DonateBloodSaveLife #রক্তদান #RoktoLagbe`;

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

  copySocialPost() {
    navigator.clipboard.writeText(this.socialPostTemplate).then(() => {
      alert('পোস্টটি কপি হয়েছে! এখনই সোশ্যাল মিডিয়ায় শেয়ার করুন।');
    });
  }
}
