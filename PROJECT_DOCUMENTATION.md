# রক্তসেবায় আমরা আছি (Rokto Shebay Amra Achi) - Blood Donation Management System

## প্রজেক্ট সম্পর্কে (About the Project)

এটি একটি Angular 13 ভিত্তিক ওয়েব অ্যাপ্লিকেশন যা রক্তদান ব্যবস্থাপনার জন্য তৈরি করা হয়েছে। এই সিস্টেমের মাধ্যমে রক্তদাতাদের তথ্য সংরক্ষণ, ব্যবস্থাপনা এবং রক্তের প্রয়োজনের সময় দ্রুত রক্তদাতা খুঁজে পাওয়া যায়।

This is an Angular 13-based web application designed for blood donation management. This system allows storing and managing blood donor information and quickly finding donors when blood is needed.

## ✨ প্রজেক্টের বৈশিষ্ট্য (Features)

- 🏠 **হোম পেজ**: সকল মডিউলের লিঙ্ক সহ ড্যাশবোর্ড
- 👤 **ডোনার রেজিস্ট্রেশন**: নতুন রক্তদাতার তথ্য সংরক্ষণ
- 🔐 **এডমিন লগইন**: অ্যাডমিন প্যানেল অ্যাক্সেস
- 📋 **ডোনার লিস্ট**: সকল রক্তদাতার তালিকা এবং বিস্তারিত তথ্য
- 🩸 **ব্লাড গ্রুপ ভিত্তিক অনুসন্ধান**: রক্তের গ্রুপ অনুযায়ী ডোনার খোঁজা
- 🚨 **ইমারজেন্সি কন্ট্যাক্ট**: জরুরি যোগাযোগের ব্যবস্থা
- 📱 **রেসপন্সিভ ডিজাইন**: মোবাইল ও ডেস্কটপ বান্ধব ইন্টারফেস

## 🛠️ ব্যবহৃত প্রযুক্তি (Technologies Used)

- **Frontend Framework**: Angular 13.3.0
- **UI Library**: Angular Material 13.3.9
- **Layout**: Angular Flex Layout 13.0.0
- **Styling**: SCSS
- **Date Handling**: date-fns 2.29.3
- **Icons**: Material Icons
- **Development Language**: TypeScript 4.6.2

## 📁 প্রজেক্ট স্ট্রাকচার (Project Structure)

```
src/
├── app/
│   ├── auth/                    # অথেন্টিকেশন মডিউল
│   │   ├── components/
│   │   │   ├── login/          # লগইন কম্পোনেন্ট
│   │   │   └── sign-up/        # সাইন আপ কম্পোনেন্ট
│   │   └── auth.module.ts
│   ├── dashboard/               # ড্যাশবোর্ড মডিউল
│   │   ├── components/
│   │   │   ├── dashboard-default/
│   │   │   └── donor-details/   # ডোনার বিস্তারিত তথ্য
│   │   ├── interfaces/
│   │   │   └── donor.interface.ts # ডোনার ইন্টারফেস
│   │   ├── services/
│   │   │   └── donor-service.ts  # ডোনার সার্ভিস
│   │   └── dashboard.module.ts
│   ├── home/                    # হোম মডিউল
│   │   ├── components/
│   │   │   └── home/           # মূল হোম পেজ
│   │   └── home.module.ts
│   ├── shared/                  # শেয়ার্ড কম্পোনেন্ট
│   │   ├── components/
│   │   │   ├── footer/         # ফুটার
│   │   │   └── navigation/     # নেভিগেশন
│   │   ├── modules/
│   │   │   └── material.module.ts # ম্যাটেরিয়াল মডিউল
│   │   └── services/
│   └── app-routing.module.ts    # রাউটিং কনফিগারেশন
├── assets/
│   └── images/
│       ├── backgrounds/
│       └── logo/
├── environments/                # এনভায়রনমেন্ট কনফিগারেশন
└── styles/                      # গ্লোবাল স্টাইল
    └── themes/
```

## 🏃‍♂️ প্রজেক্ট রান করার নিয়ম (How to Run the Project)

### পূর্বশর্ত (Prerequisites)

1. **Node.js**: সর্বনিম্ন 14.x সংস্করণ প্রয়োজন
2. **npm**: Node.js এর সাথে ইনস্টল হয়ে আসে
3. **Angular CLI**: (ঐচ্ছিক কিন্তু সুবিধাজনক)

### ধাপে ধাপে ইনস্টলেশন (Step by Step Installation)

#### ১. Node.js ইনস্টল করুন
```bash
# Node.js ওয়েবসাইট থেকে ডাউনলোড করুন: https://nodejs.org/
# অথবা Chocolatey ব্যবহার করে (Windows):
choco install nodejs

# Version চেক করুন:
node --version
npm --version
```

#### ২. প্রজেক্ট ক্লোন বা ডাউনলোড করুন
```bash
# যদি Git ব্যবহার করেন:
git clone [repository-url]
cd fe-rokto-shebay-amra-achi-dev

# অথবা ZIP ফাইল ডাউনলোড করে extract করুন
```

#### ৩. Dependencies ইনস্টল করুন
```bash
# প্রজেক্ট ফোল্ডারে গিয়ে রান করুন:
npm install

# অথবা yarn ব্যবহার করলে:
yarn install
```

#### ৪. অ্যাপ্লিকেশন রান করুন
```bash
# Development server শুরু করুন:
npm start

# অথবা:
ng serve

# অথবা yarn ব্যবহার করলে:
yarn start
```

#### ৫. ব্রাউজারে দেখুন
অ্যাপ্লিকেশন চালু হওয়ার পর ব্রাউজারে যান: **http://localhost:4200**

## 🔧 অন্যান্য কমান্ড (Other Commands)

### Development Commands
```bash
# Development server চালু করুন (Hot reload সহ):
ng serve
# অথবা
npm start

# Specific port এ চালু করতে:
ng serve --port 4500

# Production build তৈরি করুন:
ng build
# অথবা
npm run build

# Production build (optimized):
ng build --prod
```

### Code Generation Commands
```bash
# নতুন component তৈরি করুন:
ng generate component component-name

# নতুন service তৈরি করুন:
ng generate service service-name

# নতুন module তৈরি করুন:
ng generate module module-name
```

### Testing Commands
```bash
# Unit tests চালু করুন:
ng test
# অথবা
npm test

# Code coverage দেখুন:
ng test --code-coverage
```

## 🎯 মূল ফিচার সমূহ (Main Features)

### ১. হোম পেজ (Home Page)
- সকল মডিউলের সহজ অ্যাক্সেস
- বাংলা ভাষায় মেনু
- Material Design ইন্টারফেস

### ২. ডোনার রেজিস্ট্রেশন (Donor Registration)
- নাম, ঠিকানা, মোবাইল নম্বর
- রক্তের গ্রুপ নির্বাচন
- শেষ রক্তদানের তারিখ
- মোট রক্তদানের সংখ্যা
- বর্তমান অবস্থা (Available/Not Available)

### ৩. ডোনার তালিকা (Donor List)
- সকল রক্তদাতার তালিকা
- রক্তের গ্রুপ অনুযায়ী ফিল্টার
- ডোনার বিস্তারিত তথ্য দেখা
- যোগাযোগের তথ্য

### ৪. এডমিন প্যানেল (Admin Panel)
- সিকিউর লগইন সিস্টেম
- ডোনার তথ্য ম্যানেজমেন্ট
- ডাটা এডিট ও ডিলিট অপশন

## 🔐 ডাটা মডেল (Data Model)

### Donor Interface
```typescript
interface Donor {
    name: string;              // ডোনারের নাম
    address: string;           // ঠিকানা
    bloodGroup: string;        // রক্তের গ্রুপ (A+, A-, B+, B-, AB+, AB-, O+, O-)
    mobileNumber: string;      // মোবাইল নম্বর
    lastDonationDate: string;  // শেষ রক্তদানের তারিখ
    totalDonations: number;    // মোট রক্তদানের সংখ্যা
    isAvailable: boolean;      // বর্তমানে রক্তদানে সক্ষম কিনা
}
```

## 🌐 রাউটিং (Routing)

- **/** → হোম পেজ
- **/users/register** → নতুন ডোনার রেজিস্ট্রেশন
- **/users/login** → এডমিন লগইন
- **/donors** → ডোনার লিস্ট
- **/dashboard** → ইমারজেন্সি কন্ট্যাক্ট

## 🎨 UI/UX ফিচার

- **Angular Material**: Modern UI components
- **Responsive Design**: সকল ডিভাইসে কাজ করে
- **Bengali Language Support**: বাংলা ভাষায় ইন্টারফেস
- **Material Icons**: সুন্দর আইকন
- **Custom Theming**: কাস্টম রঙের থিম

## 📱 ব্রাউজার সাপোর্ট (Browser Support)

- Chrome (সর্বশেষ ২ সংস্করণ)
- Firefox (সর্বশেষ ২ সংস্করণ)
- Safari (সর্বশেষ ২ সংস্করণ)
- Edge (সর্বশেষ ২ সংস্করণ)

## 🚀 ডিপ্লয়মেন্ট (Deployment)

### Production Build
```bash
# Production build তৈরি করুন:
ng build --prod

# Build files পাবেন dist/ ফোল্ডারে
# এই ফাইলগুলো যেকোনো web server এ আপলোড করুন
```

### Firebase Hosting
```bash
# Firebase CLI ইনস্টল করুন:
npm install -g firebase-tools

# Firebase project setup করুন:
firebase init hosting

# Deploy করুন:
firebase deploy
```

### Netlify Deployment
1. dist/ ফোল্ডার zip করুন
2. Netlify.com এ গিয়ে drag & drop করুন
3. অথবা Git repository connect করুন

## 🐛 সমস্যা সমাধান (Troubleshooting)

### সাধারণ সমস্যা:

#### Port already in use:
```bash
# Different port ব্যবহার করুন:
ng serve --port 4300
```

#### Node modules error:
```bash
# node_modules ডিলিট করে পুনরায় ইনস্টল করুন:
rm -rf node_modules
npm install
```

#### Angular CLI not found:
```bash
# Globally Angular CLI ইনস্টল করুন:
npm install -g @angular/cli
```

## 🤝 কন্ট্রিবিউশন (Contribution)

1. Fork করুন প্রজেক্টটি
2. Feature branch তৈরি করুন (`git checkout -b feature/AmazingFeature`)
3. Changes commit করুন (`git commit -m 'Add some AmazingFeature'`)
4. Branch এ push করুন (`git push origin feature/AmazingFeature`)
5. Pull Request তৈরি করুন

## 📞 সাপোর্ট (Support)

কোনো সমস্যার জন্য যোগাযোগ করুন অথবা GitHub issue তৈরি করুন।

## 📄 লাইসেন্স (License)

এই প্রজেক্টটি MIT License এর অধীনে রয়েছে।

---

**Made with ❤️ for Blood Donation Community in Bangladesh**
