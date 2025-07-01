// Bangladesh Districts and Upazilas data
export interface District {
  id: number;
  name: string;
  nameEn: string;
  upazilas: Upazila[];
}

export interface Upazila {
  id: number;
  name: string;
  nameEn: string;
}

export const BLOOD_GROUPS = [
  { value: 'A+', label: 'এ পজিটিভ (A+)' },
  { value: 'A-', label: 'এ নেগেটিভ (A-)' },
  { value: 'B+', label: 'বি পজিটিভ (B+)' },
  { value: 'B-', label: 'বি নেগেটিভ (B-)' },
  { value: 'O+', label: 'ও পজিটিভ (O+)' },
  { value: 'O-', label: 'ও নেগেটিভ (O-)' },
  { value: 'AB+', label: 'এবি পজিটিভ (AB+)' },
  { value: 'AB-', label: 'এবি নেগেটিভ (AB-)' }
];

export const GENDERS = [
  { value: 'Male', label: 'পুরুষ' },
  { value: 'Female', label: 'মহিলা' },
  { value: 'Other', label: 'অন্যান্য' }
];

export const RELIGIONS = [
  { value: 'Islam', label: 'ইসলাম' },
  { value: 'Hinduism', label: 'হিন্দু' },
  { value: 'Buddhism', label: 'বৌদ্ধ' },
  { value: 'Christianity', label: 'খ্রিস্টান' },
  { value: 'Other', label: 'অন্যান্য' }
];

export const BANGLADESH_DISTRICTS: District[] = [
    {
        id: 1,
        name: 'বরগুনা',
        nameEn: 'Barguna',
        upazilas: [
            { id: 1, name: 'আমতলী', nameEn: 'Amtali' },
            { id: 2, name: 'বামনা', nameEn: 'Bamna' },
            { id: 3, name: 'বরগুনা সদর', nameEn: 'Barguna Sadar' },
            { id: 4, name: 'বেতাগী', nameEn: 'Betagi' },
            { id: 5, name: 'পাথরঘাটা', nameEn: 'Patharghata' },
            { id: 6, name: 'তালতলী', nameEn: 'Taltali' }
        ]
    },
    {
        id: 2,
        name: 'বরিশাল',
        nameEn: 'Barisal',
        upazilas: [
            { id: 1, name: 'আগৈলঝাড়া', nameEn: 'Agailjhara' },
            { id: 2, name: 'বাবুগঞ্জ', nameEn: 'Babuganj' },
            { id: 3, name: 'বাকেরগঞ্জ', nameEn: 'Bakerganj' },
            { id: 4, name: 'বানারীপাড়া', nameEn: 'Banaripara' },
            { id: 5, name: 'গৌরনদী', nameEn: 'Gaurnadi' },
            { id: 6, name: 'হিজলা', nameEn: 'Hizla' },
            { id: 7, name: 'বরিশাল সদর', nameEn: 'Barisal Sadar' },
            { id: 8, name: 'মেহেন্দিগঞ্জ', nameEn: 'Mehendiganj' },
            { id: 9, name: 'মুলাদী', nameEn: 'Muladi' },
            { id: 10, name: 'উজিরপুর', nameEn: 'Uzirpur' }
        ]
    },
    {
        id: 3,
        name: 'ভোলা',
        nameEn: 'Bhola',
        upazilas: [
            { id: 1, name: 'ভোলা সদর', nameEn: 'Bhola Sadar' },
            { id: 2, name: 'বোরহানউদ্দিন', nameEn: 'Burhanuddin' },
            { id: 3, name: 'চরফ্যাশন', nameEn: 'Char Fasson' },
            { id: 4, name: 'দৌলতখান', nameEn: 'Daulatkhan' },
            { id: 5, name: 'লালমোহন', nameEn: 'Lalmohan' },
            { id: 6, name: 'মনপুরা', nameEn: 'Manpura' },
            { id: 7, name: 'তজুমদ্দিন', nameEn: 'Tazumuddin' }
        ]
    },
    {
        id: 4,
        name: 'ঝালকাঠি',
        nameEn: 'Jhalokati',
        upazilas: [
            { id: 1, name: 'ঝালকাঠি সদর', nameEn: 'Jhalokati Sadar' },
            { id: 2, name: 'কাঁঠালিয়া', nameEn: 'Kathalia' },
            { id: 3, name: 'নলছিটি', nameEn: 'Nalchity' },
            { id: 4, name: 'রাজাপুর', nameEn: 'Rajapur' }
        ]
    },
    {
        id: 5,
        name: 'পটুয়াখালী',
        nameEn: 'Patuakhali',
        upazilas: [
            { id: 1, name: 'বাউফল', nameEn: 'Bauphal' },
            { id: 2, name: 'দশমিনা', nameEn: 'Dashmina' },
            { id: 3, name: 'গলাচিপা', nameEn: 'Galachipa' },
            { id: 4, name: 'কলাপাড়া', nameEn: 'Kalapara' },
            { id: 5, name: 'মির্জাগঞ্জ', nameEn: 'Mirzaganj' },
            { id: 6, name: 'পটুয়াখালী সদর', nameEn: 'Patuakhali Sadar' },
            { id: 7, name: 'রাঙ্গাবালী', nameEn: 'Rangabali' },
            { id: 8, name: 'দুমকি', nameEn: 'Dumki' }
        ]
    },
    {
        id: 6,
        name: 'পিরোজপুর',
        nameEn: 'Pirojpur',
        upazilas: [
            { id: 1, name: 'ভান্ডারিয়া', nameEn: 'Bhandaria' },
            { id: 2, name: 'কাউখালী', nameEn: 'Kawkhali' },
            { id: 3, name: 'মঠবাড়ীয়া', nameEn: 'Mathbaria' },
            { id: 4, name: 'নাজিরপুর', nameEn: 'Nazirpur' },
            { id: 5, name: 'পিরোজপুর সদর', nameEn: 'Pirojpur Sadar' },
            { id: 6, name: 'নেছারাবাদ', nameEn: 'Nesarabad' },
            { id: 7, name: 'জিয়ানগর', nameEn: 'Zianagar' }
        ]
    },
    {
        id: 7,
        name: 'বান্দরবান',
        nameEn: 'Bandarban',
        upazilas: [
            { id: 1, name: 'আলীকদম', nameEn: 'Alikadam' },
            { id: 2, name: 'বান্দরবান সদর', nameEn: 'Bandarban Sadar' },
            { id: 3, name: 'লামা', nameEn: 'Lama' },
            { id: 4, name: 'নাইক্ষ্যংছড়ি', nameEn: 'Naikhongchhari' },
            { id: 5, name: 'রোয়াংছড়ি', nameEn: 'Rowangchhari' },
            { id: 6, name: 'রুমা', nameEn: 'Ruma' },
            { id: 7, name: 'থানচি', nameEn: 'Thanchi' }
        ]
    },
    {
        id: 8,
        name: 'ব্রাহ্মণবাড়িয়া',
        nameEn: 'Brahmanbaria',
        upazilas: [
            { id: 1, name: 'আখাউড়া', nameEn: 'Akhaura' },
            { id: 2, name: 'বাঞ্ছারামপুর', nameEn: 'Bancharampur' },
            { id: 3, name: 'ব্রাহ্মণবাড়িয়া সদর', nameEn: 'Brahmanbaria Sadar' },
            { id: 4, name: 'কসবা', nameEn: 'Kasba' },
            { id: 5, name: 'নবীনগর', nameEn: 'Nabinagar' },
            { id: 6, name: 'নাসিরনগর', nameEn: 'Nasirnagar' },
            { id: 7, name: 'সরাইল', nameEn: 'Sarail' },
            { id: 8, name: 'আশুগঞ্জ', nameEn: 'Ashuganj' },
            { id: 9, name: 'বিজয়নগর', nameEn: 'Bijoynagar' }
        ]
    },
    {
        id: 9,
        name: 'চাঁদপুর',
        nameEn: 'Chandpur',
        upazilas: [
            { id: 1, name: 'চাঁদপুর সদর', nameEn: 'Chandpur Sadar' },
            { id: 2, name: 'ফরিদগঞ্জ', nameEn: 'Faridganj' },
            { id: 3, name: 'হাইমচর', nameEn: 'Haimchar' },
            { id: 4, name: 'হাজীগঞ্জ', nameEn: 'Haziganj' },
            { id: 5, name: 'কচুয়া', nameEn: 'Kachua' },
            { id: 6, name: 'মতলব উত্তর', nameEn: 'Matlab Uttar' },
            { id: 7, name: 'মতলব দক্ষিণ', nameEn: 'Matlab Dakshin' },
            { id: 8, name: 'শাহরাস্তি', nameEn: 'Shahrasti' }
        ]
    },
    {
        id: 10,
        name: 'চট্টগ্রাম',
        nameEn: 'Chattogram',
        upazilas: [
            { id: 1, name: 'আনোয়ারা', nameEn: 'Anwara' },
            { id: 2, name: 'বাঁশখালী', nameEn: 'Banshkhali' },
            { id: 3, 'name': 'বোয়ালখালী', nameEn: 'Boalkhali' },
            { id: 4, name: 'চন্দনাইশ', nameEn: 'Chandanaish' },
            { id: 5, name: 'ফটিকছড়ি', nameEn: 'Fatikchhari' },
            { id: 6, name: 'হাটহাজারী', nameEn: 'Hathazari' },
            { id: 7, name: 'লোহাগাড়া', nameEn: 'Lohagara' },
            { id: 8, name: 'মীরসরাই', nameEn: 'Mirsharai' },
            { id: 9, name: 'পটিয়া', nameEn: 'Patiya' },
            { id: 10, name: 'রাঙ্গুনিয়া', nameEn: 'Rangunia' },
            { id: 11, name: 'রাউজান', nameEn: 'Raozan' },
            { id: 12, name: 'সন্দ্বীপ', nameEn: 'Sandwip' },
            { id: 13, name: 'সাতকানিয়া', nameEn: 'Satkania' },
            { id: 14, name: 'সীতাকুণ্ড', nameEn: 'Sitakunda' },
            { id: 15, name: 'কর্ণফুলী', nameEn: 'Karnaphuli' }
        ]
    },
    {
        id: 11,
        name: 'কুমিল্লা',
        nameEn: 'Cumilla',
        upazilas: [
            { id: 1, name: 'বরুড়া', nameEn: 'Barura' },
            { id: 2, name: 'ব্রাহ্মণপাড়া', nameEn: 'Brahmanpara' },
            { id: 3, name: 'বুড়িচং', nameEn: 'Burichang' },
            { id: 4, name: 'চান্দিনা', nameEn: 'Chandina' },
            { id: 5, name: 'চৌদ্দগ্রাম', nameEn: 'Chauddagram' },
            { id: 6, name: 'দাউদকান্দি', nameEn: 'Daudkandi' },
            { id: 7, name: 'দেবিদ্বার', nameEn: 'Debidwar' },
            { id: 8, name: 'হোমনা', nameEn: 'Homna' },
            { id: 9, name: 'লাকসাম', nameEn: 'Laksam' },
            { id: 10, name: 'মুরাদনগর', nameEn: 'Muradnagar' },
            { id: 11, name: 'নাঙ্গলকোট', nameEn: 'Nangalkot' },
            { id: 12, name: 'কুমিল্লা সদর', nameEn: 'Cumilla Sadar' },
            { id: 13, name: 'মেঘনা', nameEn: 'Meghna' },
            { id: 14, name: 'মনোহরগঞ্জ', nameEn: 'Monohorgonj' },
            { id: 15, name: 'সদর দক্ষিণ', nameEn: 'Sadar Dakshin' },
            { id: 16, name: 'তিতাস', nameEn: 'Titas' },
            { id: 17, name: 'লালমাই', nameEn: 'Lalmai' }
        ]
    },
    {
        id: 12,
        name: 'কক্সবাজার',
        nameEn: 'Cox\'s Bazar',
        upazilas: [
            { id: 1, name: 'চকরিয়া', nameEn: 'Chakaria' },
            { id: 2, name: 'কক্সবাজার সদর', nameEn: 'Cox\'s Bazar Sadar' },
            { id: 3, name: 'কুতুবদিয়া', nameEn: 'Kutubdia' },
            { id: 4, name: 'মহেশখালী', nameEn: 'Maheshkhali' },
            { id: 5, name: 'পেকুয়া', nameEn: 'Pekua' },
            { id: 6, name: 'রামু', nameEn: 'Ramu' },
            { id: 7, name: 'টেকনাফ', nameEn: 'Teknaf' },
            { id: 8, name: 'উখিয়া', nameEn: 'Ukhia' }
        ]
    },
    {
        id: 13,
        name: 'ফেনী',
        nameEn: 'Feni',
        upazilas: [
            { id: 1, name: 'ছাগলনাইয়া', nameEn: 'Chhagalnaiya' },
            { id: 2, name: 'দাগনভূঞা', nameEn: 'Daganbhuiyan' },
            { id: 3, name: 'ফেনী সদর', nameEn: 'Feni Sadar' },
            { id: 4, name: 'পরশুরাম', nameEn: 'Parshuram' },
            { id: 5, name: 'সোনাগাজী', nameEn: 'Sonagazi' },
            { id: 6, name: 'ফুলগাজী', nameEn: 'Fulgazi' }
        ]
    },
    {
        id: 14,
        name: 'খাগড়াছড়ি',
        nameEn: 'Khagrachhari',
        upazilas: [
            { id: 1, name: 'দীঘিনালা', nameEn: 'Dighinala' },
            { id: 2, name: 'খাগড়াছড়ি সদর', nameEn: 'Khagrachhari Sadar' },
            { id: 3, name: 'লক্ষ্মীছড়ি', nameEn: 'Lakshmichhari' },
            { id: 4, name: 'মহালছড়ি', nameEn: 'Mahalchhari' },
            { id: 5, name: 'মানিকছড়ি', nameEn: 'Manikchhari' },
            { id: 6, name: 'মাটিরাঙ্গা', nameEn: 'Matiranga' },
            { id: 7, name: 'পানছড়ি', nameEn: 'Panchhari' },
            { id: 8, name: 'রামগড়', nameEn: 'Ramgarh' },
            { id: 9, name: 'গুইমারা', nameEn: 'Guimara' }
        ]
    },
    {
        id: 15,
        name: 'লক্ষ্মীপুর',
        nameEn: 'Lakshmipur',
        upazilas: [
            { id: 1, name: 'কমলনগর', nameEn: 'Kamalnagar' },
            { id: 2, name: 'লক্ষ্মীপুর সদর', nameEn: 'Lakshmipur Sadar' },
            { id: 3, name: 'রায়পুর', nameEn: 'Raipur' },
            { id: 4, name: 'রামগঞ্জ', nameEn: 'Ramganj' },
            { id: 5, name: 'রামগতি', nameEn: 'Ramgati' }
        ]
    },
    {
        id: 16,
        name: 'নোয়াখালী',
        nameEn: 'Noakhali',
        upazilas: [
            { id: 1, name: 'বেগমগঞ্জ', nameEn: 'Begumganj' },
            { id: 2, name: 'চাটখিল', nameEn: 'Chatkhil' },
            { id: 3, name: 'কোম্পানীগঞ্জ', nameEn: 'Companeeganj' },
            { id: 4, name: 'হাতিয়া', nameEn: 'Hatiya' },
            { id: 5, name: 'কবিরহাট', nameEn: 'Kabirhat' },
            { id: 6, name: 'সেনবাগ', nameEn: 'Senbagh' },
            { id: 7, name: 'সোনাইমুড়ী', nameEn: 'Sonaimuri' },
            { id: 8, name: 'সুবর্ণচর', nameEn: 'Subarnachar' },
            { id: 9, name: 'নোয়াখালী সদর', nameEn: 'Noakhali Sadar' }
        ]
    },
    {
        id: 17,
        name: 'রাঙ্গামাটি',
        nameEn: 'Rangamati',
        upazilas: [
            { id: 1, name: 'বাঘাইছড়ি', nameEn: 'Bagaichhari' },
            { id: 2, name: 'বরকল', nameEn: 'Barkal' },
            { id: 3, name: 'কাউখালী', nameEn: 'Kawkhali' },
            { id: 4, name: 'বিলাইছড়ি', nameEn: 'Belaichhari' },
            { id: 5, name: 'কাপ্তাই', nameEn: 'Kaptai' },
            { id: 6, name: 'জুরাছড়ি', nameEn: 'Juraichhari' },
            { id: 7, name: 'লংগদু', nameEn: 'Langadu' },
            { id: 8, name: 'নানিয়ারচর', nameEn: 'Naniarchar' },
            { id: 9, name: 'রাজস্থলী', nameEn: 'Rajasthali' },
            { id: 10, name: 'রাঙ্গামাটি সদর', nameEn: 'Rangamati Sadar' }
        ]
    },
    {
        id: 18,
        name: 'ঢাকা',
        nameEn: 'Dhaka',
        upazilas: [
      { id: 1, name: 'ধানমন্ডি', nameEn: 'Dhanmondi' },
      { id: 2, name: 'গুলশান', nameEn: 'Gulshan' },
      { id: 3, name: 'বনানী', nameEn: 'Banani' },
      { id: 4, name: 'উত্তরা', nameEn: 'Uttara' },
      { id: 5, name: 'মিরপুর', nameEn: 'Mirpur' },
      { id: 6, name: 'পল্লবী', nameEn: 'Pallabi' },
      { id: 7, name: 'শাহবাগ', nameEn: 'Shahbagh' },
      { id: 8, name: 'নিউ মার্কেট', nameEn: 'New Market' },
      { id: 9, name: 'পুরান ঢাকা', nameEn: 'Old Dhaka' },
      { id: 10, name: 'মতিঝিল', nameEn: 'Motijheel' },
      { id: 11, name: 'রমনা', nameEn: 'Ramna' },
      { id: 12, name: 'তেজগাঁও', nameEn: 'Tejgaon' },
      { id: 13, name: 'বাড্ডা', nameEn: 'Badda' },
      { id: 14, name: 'খিলক্ষেত', nameEn: 'Khilkhet' }
        ]
    },
    {
        id: 19,
        name: 'ফরিদপুর',
        nameEn: 'Faridpur',
        upazilas: [
            { id: 1, name: 'আলফাডাঙ্গা', nameEn: 'Alfadanga' },
            { id: 2, name: 'ভাঙ্গা', nameEn: 'Bhanga' },
            { id: 3, name: 'বোয়ালমারী', nameEn: 'Boalmari' },
            { id: 4, name: 'চরভদ্রাসন', nameEn: 'Charbhadrasan' },
            { id: 5, name: 'ফরিদপুর সদর', nameEn: 'Faridpur Sadar' },
            { id: 6, name: 'মধুখালী', nameEn: 'Madhukhali' },
            { id: 7, name: 'নগরকান্দা', nameEn: 'Nagarkanda' },
            { id: 8, name: 'সদরপুর', nameEn: 'Sadarpur' },
            { id: 9, name: 'সালথা', nameEn: 'Saltha' }
        ]
    },
    {
        id: 20,
        name: 'গাজীপুর',
        nameEn: 'Gazipur',
        upazilas: [
            { id: 1, name: 'গাজীপুর সদর', nameEn: 'Gazipur Sadar' },
            { id: 2, name: 'কালিয়াকৈর', nameEn: 'Kaliakair' },
            { id: 3, name: 'কালীগঞ্জ', nameEn: 'Kaliganj' },
            { id: 4, name: 'কাপাসিয়া', nameEn: 'Kapasia' },
            { id: 5, name: 'শ্রীপুর', nameEn: 'Sreepur' }
        ]
    },
    {
        id: 21,
        name: 'গোপালগঞ্জ',
        nameEn: 'Gopalganj',
        upazilas: [
            { id: 1, name: 'গোপালগঞ্জ সদর', nameEn: 'Gopalganj Sadar' },
            { id: 2, name: 'কাশিয়ানী', nameEn: 'Kashiani' },
            { id: 3, name: 'কোটালীপাড়া', nameEn: 'Kotalipara' },
            { id: 4, name: 'মুকসুদপুর', nameEn: 'Muksudpur' },
            { id: 5, name: 'টুঙ্গীপাড়া', nameEn: 'Tungipara' }
        ]
    },
    {
        id: 22,
        name: 'কিশোরগঞ্জ',
        nameEn: 'Kishoreganj',
        upazilas: [
            { id: 1, name: 'অষ্টগ্রাম', nameEn: 'Astagram' },
            { id: 2, name: 'বাজিতপুর', nameEn: 'Bajitpur' },
            { id: 3, name: 'ভৈরব', nameEn: 'Bhairab' },
            { id: 4, name: 'হোসেনপুর', nameEn: 'Hossainpur' },
            { id: 5, name: 'ইটনা', nameEn: 'Itna' },
            { id: 6, name: 'করিমগঞ্জ', nameEn: 'Karimganj' },
            { id: 7, name: 'কটিয়াদী', nameEn: 'Katiadi' },
            { id: 8, name: 'কিশোরগঞ্জ সদর', nameEn: 'Kishoreganj Sadar' },
            { id: 9, name: 'কুলিয়ারচর', nameEn: 'Kuliarchar' },
            { id: 10, name: 'মিঠামইন', nameEn: 'Mithamain' },
            { id: 11, name: 'নিকলী', nameEn: 'Nikli' },
            { id: 12, name: 'পাকুন্দিয়া', nameEn: 'Pakundia' },
            { id: 13, name: 'তাড়াইল', nameEn: 'Tarail' }
        ]
    },
    {
        id: 23,
        name: 'মাদারীপুর',
        nameEn: 'Madaripur',
        upazilas: [
            { id: 1, name: 'কালকিনি', nameEn: 'Kalkini' },
            { id: 2, name: 'মাদারীপুর সদর', nameEn: 'Madaripur Sadar' },
            { id: 3, name: 'রাজৈর', nameEn: 'Rajoir' },
            { id: 4, name: 'শিবচর', nameEn: 'Shibchar' }
        ]
    },
    {
        id: 24,
        name: 'মানিকগঞ্জ',
        nameEn: 'Manikganj',
        upazilas: [
            { id: 1, name: 'দৌলতপুর', nameEn: 'Daulatpur' },
            { id: 2, name: 'ঘিওর', nameEn: 'Ghior' },
            { id: 3, name: 'হরিরামপুর', nameEn: 'Harirampur' },
            { id: 4, name: 'মানিকগঞ্জ সদর', nameEn: 'Manikganj Sadar' },
            { id: 5, name: 'সাটুরিয়া', nameEn: 'Saturia' },
            { id: 6, name: 'শিবালয়', nameEn: 'Shivalaya' },
            { id: 7, name: 'সিংগাইর', nameEn: 'Singair' }
        ]
    },
    {
        id: 25,
        name: 'মুন্সিগঞ্জ',
        nameEn: 'Munshiganj',
        upazilas: [
            { id: 1, name: 'গজারিয়া', nameEn: 'Gazaria' },
            { id: 2, name: 'লৌহজং', nameEn: 'Lohajang' },
            { id: 3, name: 'মুন্সিগঞ্জ সদর', nameEn: 'Munshiganj Sadar' },
            { id: 4, name: 'সিরাজদিখান', nameEn: 'Sirajdikhan' },
            { id: 5, name: 'শ্রীনগর', nameEn: 'Sreenagar' },
            { id: 6, name: 'টঙ্গিবাড়ী', nameEn: 'Tongibari' }
        ]
    },
    {
        id: 26,
        name: 'নারায়ণগঞ্জ',
        nameEn: 'Narayanganj',
        upazilas: [
            { id: 1, name: 'আড়াইহাজার', nameEn: 'Araihazar' },
            { id: 2, name: 'বন্দর', nameEn: 'Bandar' },
            { id: 3, name: 'নারায়ণগঞ্জ সদর', nameEn: 'Narayanganj Sadar' },
            { id: 4, name: 'রূপগঞ্জ', nameEn: 'Rupganj' },
            { id: 5, name: 'সোনারগাঁও', nameEn: 'Sonargaon' }
        ]
    },
    {
        id: 27,
        name: 'নরসিংদী',
        nameEn: 'Narsingdi',
        upazilas: [
            { id: 1, name: 'বেলাব', nameEn: 'Belabo' },
            { id: 2, name: 'মনোহরদী', nameEn: 'Monohardi' },
            { id: 3, name: 'নরসিংদী সদর', nameEn: 'Narsingdi Sadar' },
            { id: 4, name: 'পলাশ', nameEn: 'Palash' },
            { id: 5, name: 'রায়পুরা', nameEn: 'Raipura' },
            { id: 6, name: 'শিবপুর', nameEn: 'Shibpur' }
        ]
    },
    {
        id: 28,
        name: 'রাজবাড়ী',
        nameEn: 'Rajbari',
        upazilas: [
            { id: 1, name: 'বালিয়াকান্দি', nameEn: 'Baliakandi' },
            { id: 2, name: 'গোয়ালন্দ', nameEn: 'Goalandaghat' },
            { id: 3, name: 'পাংশা', nameEn: 'Pangsha' },
            { id: 4, name: 'রাজবাড়ী সদর', nameEn: 'Rajbari Sadar' },
            { id: 5, name: 'কালুখালী', nameEn: 'Kalukhali' }
        ]
    },
    {
        id: 29,
        name: 'শরীয়তপুর',
        nameEn: 'Shariatpur',
        upazilas: [
            { id: 1, name: 'ভেদরগঞ্জ', nameEn: 'Bhedarganj' },
            { id: 2, name: 'ডামুড্যা', nameEn: 'Damudya' },
            { id: 3, name: 'গোসাইরহাট', nameEn: 'Gosairhat' },
            { id: 4, name: 'নড়িয়া', nameEn: 'Naria' },
            { id: 5, name: 'শরীয়তপুর সদর', nameEn: 'Shariatpur Sadar' },
            { id: 6, name: 'জাজিরা', nameEn: 'Zajira' },
            { id: 7, name: 'সখিপুর', nameEn: 'Shakhipur' }
        ]
    },
    {
        id: 30,
        name: 'টাঙ্গাইল',
        nameEn: 'Tangail',
        upazilas: [
            { id: 1, name: 'বাসাইল', nameEn: 'Basail' },
            { id: 2, name: 'ভুঞাপুর', nameEn: 'Bhuapur' },
            { id: 3, name: 'দেলদুয়ার', nameEn: 'Delduar' },
            { id: 4, name: 'ধনবাড়ী', nameEn: 'Dhanbari' },
            { id: 5, name: 'ঘাটাইল', nameEn: 'Ghatail' },
            { id: 6, name: 'গোপালপুর', nameEn: 'Gopalpur' },
            { id: 7, name: 'কালিহাতী', nameEn: 'Kalihati' },
            { id: 8, name: 'মধুপুর', nameEn: 'Madhupur' },
            { id: 9, name: 'মির্জাপুর', nameEn: 'Mirzapur' },
            { id: 10, name: 'নাগরপুর', nameEn: 'Nagarpur' },
            { id: 11, name: 'সখিপুর', nameEn: 'Sakhipur' },
            { id: 12, name: 'টাঙ্গাইল সদর', nameEn: 'Tangail Sadar' }
        ]
    },
    {
        id: 31,
        name: 'বাগেরহাট',
        nameEn: 'Bagerhat',
        upazilas: [
            { id: 1, name: 'বাগেরহাট সদর', nameEn: 'Bagerhat Sadar' },
            { id: 2, name: 'চিতলমারী', nameEn: 'Chitalmari' },
            { id: 3, name: 'ফকিরহাট', nameEn: 'Fakirhat' },
            { id: 4, name: 'কচুয়া', nameEn: 'Kachua' },
            { id: 5, name: 'মোল্লাহাট', nameEn: 'Mollahat' },
            { id: 6, name: 'মোংলা', nameEn: 'Mongla' },
            { id: 7, name: 'মোড়েলগঞ্জ', nameEn: 'Morrelganj' },
            { id: 8, name: 'রামপাল', nameEn: 'Rampal' },
            { id: 9, name: 'শরণখোলা', nameEn: 'Sarankhola' }
        ]
    },
    {
        id: 32,
        name: 'চুয়াডাঙ্গা',
        nameEn: 'Chuadanga',
        upazilas: [
            { id: 1, name: 'আলমডাঙ্গা', nameEn: 'Alamdanga' },
            { id: 2, name: 'চুয়াডাঙ্গা সদর', nameEn: 'Chuadanga Sadar' },
            { id: 3, name: 'দামুড়হুদা', nameEn: 'Damurhuda' },
            { id: 4, name: 'জীবননগর', nameEn: 'Jibannagar' }
        ]
    },
    {
        id: 33,
        name: 'যশোর',
        nameEn: 'Jashore',
        upazilas: [
            { id: 1, name: 'অভয়নগর', nameEn: 'Abhaynagar' },
            { id: 2, name: 'বাঘারপাড়া', nameEn: 'Bagherpara' },
            { id: 3, name: 'চৌগাছা', nameEn: 'Chaugachha' },
            { id: 4, name: 'ঝিকরগাছা', nameEn: 'Jhikargachha' },
            { id: 5, name: 'কেশবপুর', nameEn: 'Keshabpur' },
            { id: 6, name: 'যশোর সদর', nameEn: 'Jashore Sadar' },
            { id: 7, name: 'মনিরামপুর', nameEn: 'Manirampur' },
            { id: 8, name: 'শার্শা', nameEn: 'Sharsha' }
        ]
    },
    {
        id: 34,
        name: 'ঝিনাইদহ',
        nameEn: 'Jhenaidah',
        upazilas: [
            { id: 1, name: 'হরিণাকুণ্ডু', nameEn: 'Harinakunda' },
            { id: 2, name: 'ঝিনাইদহ সদর', nameEn: 'Jhenaidah Sadar' },
            { id: 3, name: 'কালীগঞ্জ', nameEn: 'Kaliganj' },
            { id: 4, name: 'কোটচাঁদপুর', nameEn: 'Kotchandpur' },
            { id: 5, name: 'মহেশপুর', nameEn: 'Maheshpur' },
            { id: 6, name: 'শৈলকুপা', nameEn: 'Shailkupa' }
        ]
    },
    {
        id: 35,
        name: 'খুলনা',
        nameEn: 'Khulna',
        upazilas: [
            { id: 1, name: 'বটিয়াঘাটা', nameEn: 'Batiaghata' },
            { id: 2, name: 'দাকোপ', nameEn: 'Dacope' },
            { id: 3, name: 'দিঘলিয়া', nameEn: 'Dighalia' },
            { id: 4, name: 'ডুমুরিয়া', nameEn: 'Dumuria' },
            { id: 5, name: 'কয়রা', nameEn: 'Koyra' },
            { id: 6, name: 'পাইকগাছা', nameEn: 'Paikgachha' },
            { id: 7, name: 'ফুলতলা', nameEn: 'Phultala' },
            { id: 8, name: 'রূপসা', nameEn: 'Rupsha' },
            { id: 9, name: 'তেরখাদা', nameEn: 'Terokhada' }
        ]
    },
    {
        id: 36,
        name: 'কুষ্টিয়া',
        nameEn: 'Kushtia',
        upazilas: [
            { id: 1, name: 'ভেড়ামারা', nameEn: 'Bheramara' },
            { id: 2, name: 'দৌলতপুর', nameEn: 'Daulatpur' },
            { id: 3, name: 'খোকসা', nameEn: 'Khoksa' },
            { id: 4, name: 'কুমারখালী', nameEn: 'Kumarkhali' },
            { id: 5, name: 'কুষ্টিয়া সদর', nameEn: 'Kushtia Sadar' },
            { id: 6, name: 'মিরপুর', nameEn: 'Mirpur' }
        ]
    },
    {
        id: 37,
        name: 'মাগুরা',
        nameEn: 'Magura',
        upazilas: [
            { id: 1, name: 'মাগুরা সদর', nameEn: 'Magura Sadar' },
            { id: 2, name: 'মহম্মদপুর', nameEn: 'Mohammadpur' },
            { id: 3, name: 'শালিখা', nameEn: 'Shalikha' },
            { id: 4, name: 'শ্রীপুর', nameEn: 'Sreepur' }
        ]
    },
    {
        id: 38,
        name: 'মেহেরপুর',
        nameEn: 'Meherpur',
        upazilas: [
            { id: 1, name: 'গাংনী', nameEn: 'Gangni' },
            { id: 2, name: 'মেহেরপুর সদর', nameEn: 'Meherpur Sadar' },
            { id: 3, name: 'মুজিবনগর', nameEn: 'Mujibnagar' }
        ]
    },
    {
        id: 39,
        name: 'নড়াইল',
        nameEn: 'Narail',
        upazilas: [
            { id: 1, name: 'কালিয়া', nameEn: 'Kalia' },
            { id: 2, name: 'লোহাগড়া', nameEn: 'Lohagara' },
            { id: 3, name: 'নড়াইল সদর', nameEn: 'Narail Sadar' }
        ]
    },
    {
        id: 40,
        name: 'সাতক্ষীরা',
        nameEn: 'Satkhira',
        upazilas: [
            { id: 1, name: 'কলারোয়া', nameEn: 'Kalaroa' },
            { id: 2, name: 'সাতক্ষীরা সদর', nameEn: 'Satkhira Sadar' },
            { id: 3, name: 'আশাশুনি', nameEn: 'Assasuni' },
            { id: 4, name: 'দেবহাটা', nameEn: 'Debhata' },
            { id: 5, name: 'কালিগঞ্জ', nameEn: 'Kaliganj' },
            { id: 6, name: 'শ্যামনগর', nameEn: 'Shyamnagar' },
            { id: 7, name: 'তালা', nameEn: 'Tala' }
        ]
    },
    {
        id: 41,
        name: 'জামালপুর',
        nameEn: 'Jamalpur',
        upazilas: [
            { id: 1, name: 'বকশীগঞ্জ', nameEn: 'Baksiganj' },
            { id: 2, name: 'দেওয়ানগঞ্জ', nameEn: 'Dewanganj' },
            { id: 3, name: 'ইসলামপুর', nameEn: 'Islampur' },
            { id: 4, name: 'জামালপুর সদর', nameEn: 'Jamalpur Sadar' },
            { id: 5, name: 'মাদারগঞ্জ', nameEn: 'Madarganj' },
            { id: 6, name: 'মেলান্দহ', nameEn: 'Melandah' },
            { id: 7, name: 'সরিষাবাড়ী', nameEn: 'Sarishabari' }
        ]
    },
    {
        id: 42,
        name: 'ময়মনসিংহ',
        nameEn: 'Mymensingh',
        upazilas: [
            { id: 1, name: 'ভালুকা', nameEn: 'Bhaluka' },
            { id: 2, name: 'ধোবাউড়া', nameEn: 'Dhobaura' },
            { id: 3, name: 'ফুলবাড়ীয়া', nameEn: 'Fulbaria' },
            { id: 4, name: 'গফরগাঁও', nameEn: 'Gafargaon' },
            { id: 5, name: 'গৌরীপুর', nameEn: 'Gauripur' },
            { id: 6, name: 'হালুয়াঘাট', nameEn: 'Haluaghat' },
            { id: 7, name: 'ঈশ্বরগঞ্জ', nameEn: 'Ishwarganj' },
            { id: 8, name: 'ময়মনসিংহ সদর', nameEn: 'Mymensingh Sadar' },
            { id: 9, name: 'মুক্তাগাছা', nameEn: 'Muktagachha' },
            { id: 10, name: 'নান্দাইল', nameEn: 'Nandail' },
            { id: 11, name: 'ফুলপুর', nameEn: 'Phulpur' },
            { id: 12, name: 'ত্রিশাল', nameEn: 'Trishal' },
            { id: 13, name: 'তারাকান্দা', nameEn: 'Tarakanda' }
        ]
    },
    {
        id: 43,
        name: 'নেত্রকোনা',
        nameEn: 'Netrokona',
        upazilas: [
            { id: 1, name: 'আটপাড়া', nameEn: 'Atpara' },
            { id: 2, name: 'বারহাট্টা', nameEn: 'Barhatta' },
            { id: 3, name: 'দুর্গাপুর', nameEn: 'Durgapur' },
            { id: 4, name: 'কলমাকান্দা', nameEn: 'Kalmakanda' },
            { id: 5, name: 'কেন্দুয়া', nameEn: 'Kendua' },
            { id: 6, name: 'খালিয়াজুরী', nameEn: 'Khaliajuri' },
            { id: 7, name: 'মদন', nameEn: 'Madan' },
            { id: 8, name: 'মোহনগঞ্জ', nameEn: 'Mohanganj' },
            { id: 9, name: 'নেত্রকোনা সদর', nameEn: 'Netrokona Sadar' },
            { id: 10, name: 'পূর্বধলা', nameEn: 'Purbadhala' }
        ]
    },
    {
        id: 44,
        name: 'শেরপুর',
        nameEn: 'Sherpur',
        upazilas: [
            { id: 1, name: 'ঝিনাইগাতী', nameEn: 'Jhenaigati' },
            { id: 2, name: 'নকলা', nameEn: 'Nakla' },
            { id: 3, name: 'নালিতাবাড়ী', nameEn: 'Nalitabari' },
            { id: 4, name: 'শেরপুর সদর', nameEn: 'Sherpur Sadar' },
            { id: 5, name: 'শ্রীবরদী', nameEn: 'Sreebardi' }
        ]
    },
    {
        id: 45,
        name: 'বগুড়া',
        nameEn: 'Bogura',
        upazilas: [
            { id: 1, name: 'আদমদীঘি', nameEn: 'Adamdighi' },
            { id: 2, name: 'বগুড়া সদর', nameEn: 'Bogura Sadar' },
            { id: 3, name: 'ধুনট', nameEn: 'Dhunat' },
            { id: 4, name: 'দুপচাঁচিয়া', nameEn: 'Dupchanchia' },
            { id: 5, name: 'গাবতলী', nameEn: 'Gabtali' },
            { id: 6, name: 'কাহালু', nameEn: 'Kahaloo' },
            { id: 7, name: 'নন্দীগ্রাম', nameEn: 'Nandigram' },
            { id: 8, name: 'সারিয়াকান্দি', nameEn: 'Sariakandi' },
            { id: 9, name: 'শাজাহানপুর', nameEn: 'Shajahanpur' },
            { id: 10, name: 'শেরপুর', nameEn: 'Sherpur' },
            { id: 11, name: 'শিবগঞ্জ', nameEn: 'Shibganj' },
            { id: 12, name: 'সোনাতলা', nameEn: 'Sonatala' }
        ]
    },
    {
        id: 46,
        name: 'চাঁপাইনবাবগঞ্জ',
        nameEn: 'Chapainawabganj',
        upazilas: [
            { id: 1, name: 'ভোলাহাট', nameEn: 'Bholahat' },
            { id: 2, name: 'গোমস্তাপুর', nameEn: 'Gomastapur' },
            { id: 3, name: 'নাচোল', nameEn: 'Nachole' },
            { id: 4, name: 'নবাবগঞ্জ সদর', nameEn: 'Nawabganj Sadar' },
            { id: 5, name: 'শিবগঞ্জ', nameEn: 'Shibganj' }
        ]
    },
    {
        id: 47,
        name: 'জয়পুরহাট',
        nameEn: 'Joypurhat',
        upazilas: [
            { id: 1, name: 'আক্কেলপুর', nameEn: 'Akkelpur' },
            { id: 2, name: 'জয়পুরহাট সদর', nameEn: 'Joypurhat Sadar' },
            { id: 3, name: 'কালাই', nameEn: 'Kalai' },
            { id: 4, name: 'ক্ষেতলাল', nameEn: 'Khetlal' },
            { id: 5, name: 'পাঁচবিবি', nameEn: 'Panchbibi' }
        ]
    },
    {
        id: 48,
        name: 'নওগাঁ',
        nameEn: 'Naogaon',
        upazilas: [
            { id: 1, name: 'আত্রাই', nameEn: 'Atrai' },
            { id: 2, name: 'বদলগাছী', nameEn: 'Badalgachhi' },
            { id: 3, name: 'মহাদেবপুর', nameEn: 'Manda' },
            { id: 4, name: 'ধামইরহাট', nameEn: 'Dhamoirhat' },
            { id: 5, name: 'মান্দা', nameEn: 'Mahadebpur' },
            { id: 6, name: 'নওগাঁ সদর', nameEn: 'Naogaon Sadar' },
            { id: 7, name: 'নিয়ামতপুর', nameEn: 'Niamatpur' },
            { id: 8, name: 'পত্নীতলা', nameEn: 'Patnitala' },
            { id: 9, name: 'পোরশা', nameEn: 'Porsha' },
            { id: 10, name: 'রানীনগর', nameEn: 'Raninagar' },
            { id: 11, name: 'সাপাহার', nameEn: 'Sapahar' }
        ]
    },
    {
        id: 49,
        name: 'নাটোর',
        nameEn: 'Natore',
        upazilas: [
            { id: 1, name: 'বাগাতিপাড়া', nameEn: 'Bagatipara' },
            { id: 2, name: 'বড়াইগ্রাম', nameEn: 'Baraigram' },
            { id: 3, name: 'গুরুদাসপুর', nameEn: 'Gurudaspur' },
            { id: 4, name: 'লালপুর', nameEn: 'Lalpur' },
            { id: 5, name: 'নাটোর সদর', nameEn: 'Natore Sadar' },
            { id: 6, name: 'সিংড়া', nameEn: 'Singra' },
            { id: 7, name: 'নলডাঙ্গা', nameEn: 'Naldanga' }
        ]
    },
    {
        id: 50,
        name: 'পাবনা',
        nameEn: 'Pabna',
        upazilas: [
            { id: 1, name: 'আটঘরিয়া', nameEn: 'Atgharia' },
            { id: 2, name: 'বেড়া', nameEn: 'Bera' },
            { id: 3, name: 'ভাঙ্গুড়া', nameEn: 'Bhangura' },
            { id: 4, name: 'চাটমোহর', nameEn: 'Chatmohar' },
            { id: 5, name: 'ফরিদপুর', nameEn: 'Faridpur' },
            { id: 6, name: 'ঈশ্বরদী', nameEn: 'Ishwardi' },
            { id: 7, name: 'পাবনা সদর', nameEn: 'Pabna Sadar' },
            { id: 8, name: 'সাঁথিয়া', nameEn: 'Santhia' },
            { id: 9, name: 'সুজানগর', nameEn: 'Sujanagar' }
        ]
    },
    {
        id: 51,
        name: 'রাজশাহী',
        nameEn: 'Rajshahi',
        upazilas: [
            { id: 1, name: 'বাঘা', nameEn: 'Bagha' },
            { id: 2, name: 'বাগমারা', nameEn: 'Bagmara' },
            { id: 3, name: 'চারঘাট', nameEn: 'Charghat' },
            { id: 4, name: 'দুর্গাপুর', nameEn: 'Durgapur' },
            { id: 5, name: 'গোদাগাড়ী', nameEn: 'Godagari' },
            { id: 6, name: 'মোহনপুর', nameEn: 'Mohanpur' },
            { id: 7, name: 'পবা', nameEn: 'Paba' },
            { id: 8, name: 'পুঠিয়া', nameEn: 'Puthia' },
            { id: 9, name: 'তানোর', nameEn: 'Tanore' }
        ]
    },
    {
        id: 52,
        name: 'সিরাজগঞ্জ',
        nameEn: 'Sirajganj',
        upazilas: [
            { id: 1, name: 'বেলকুচি', nameEn: 'Belkuchi' },
            { id: 2, name: 'চৌহালী', nameEn: 'Chauhali' },
            { id: 3, name: 'কামারখন্দ', nameEn: 'Kamarkhanda' },
            { id: 4, name: 'কাজীপুর', nameEn: 'Kazipur' },
            { id: 5, name: 'রায়গঞ্জ', nameEn: 'Raiganj' },
            { id: 6, name: 'শাহজাদপুর', nameEn: 'Shahjadpur' },
            { id: 7, name: 'সিরাজগঞ্জ সদর', nameEn: 'Sirajganj Sadar' },
            { id: 8, name: 'তাড়াশ', nameEn: 'Tarash' },
            { id: 9, name: 'উল্লাপাড়া', nameEn: 'Ullahpara' }
        ]
    },
    {
        id: 53,
        name: 'দিনাজপুর',
        nameEn: 'Dinajpur',
        upazilas: [
            { id: 1, name: 'বিরামপুর', nameEn: 'Birampur' },
            { id: 2, name: 'বীরগঞ্জ', nameEn: 'Birganj' },
            { id: 3, name: 'বিরল', nameEn: 'Biral' },
            { id: 4, name: 'বোচাগঞ্জ', nameEn: 'Bochaganj' },
            { id: 5, name: 'চিরিরবন্দর', nameEn: 'Chirirbandar' },
            { id: 6, name: 'ফুলবাড়ী', nameEn: 'Phulbari' },
            { id: 7, name: 'ঘোড়াঘাট', nameEn: 'Ghoraghat' },
            { id: 8, name: 'হাকিমপুর', nameEn: 'Hakimpur' },
            { id: 9, name: 'কাহারোল', nameEn: 'Kaharole' },
            { id: 10, name: 'খানসামা', nameEn: 'Khansama' },
            { id: 11, name: 'দিনাজপুর সদর', nameEn: 'Dinajpur Sadar' },
            { id: 12, name: 'নবাবগঞ্জ', nameEn: 'Nawabganj' },
            { id: 13, name: 'পার্বতীপুর', nameEn: 'Parbatipur' }
        ]
    },
    {
        id: 54,
        name: 'গাইবান্ধা',
        nameEn: 'Gaibandha',
        upazilas: [
            { id: 1, name: 'ফুলছড়ি', nameEn: 'Phulchhari' },
            { id: 2, name: 'গাইবান্ধা সদর', nameEn: 'Gaibandha Sadar' },
            { id: 3, name: 'গোবিন্দগঞ্জ', nameEn: 'Gobindaganj' },
            { id: 4, name: 'পলাশবাড়ী', nameEn: 'Palashbari' },
            { id: 5, name: 'সাদুল্লাপুর', nameEn: 'Sadullapur' },
            { id: 6, name: 'সাঘাটা', nameEn: 'Saghata' },
            { id: 7, name: 'সুন্দরগঞ্জ', nameEn: 'Sundarganj' }
        ]
    },
    {
        id: 55,
        name: 'কুড়িগ্রাম',
        nameEn: 'Kurigram',
        upazilas: [
            { id: 1, name: 'ভুরুঙ্গামারী', nameEn: 'Bhurungamari' },
            { id: 2, name: 'চর রাজিবপুর', nameEn: 'Char Rajibpur' },
            { id: 3, name: 'চিলমারী', nameEn: 'Chilmari' },
            { id: 4, name: 'ফুলবাড়ী', nameEn: 'Phulbari' },
            { id: 5, name: 'কুড়িগ্রাম সদর', nameEn: 'Kurigram Sadar' },
            { id: 6, name: 'নাগেশ্বরী', nameEn: 'Nageshwari' },
            { id: 7, 'name': 'রাজারহাট', nameEn: 'Rajarhat' },
            { id: 8, name: 'রৌমারী', nameEn: 'Rowmari' },
            { id: 9, name: 'উলিপুর', nameEn: 'Ulipur' }
        ]
    },
    {
        id: 56,
        name: 'লালমনিরহাট',
        nameEn: 'Lalmonirhat',
        upazilas: [
            { id: 1, name: 'আদিতমারী', nameEn: 'Aditmari' },
            { id: 2, name: 'হাতীবান্ধা', nameEn: 'Hatibandha' },
            { id: 3, name: 'কালীগঞ্জ', nameEn: 'Kaliganj' },
            { id: 4, name: 'লালমনিরহাট সদর', nameEn: 'Lalmonirhat Sadar' },
            { id: 5, name: 'পাটগ্রাম', nameEn: 'Patgram' }
        ]
    },
    {
        id: 57,
        name: 'নীলফামারী',
        nameEn: 'Nilphamari',
        upazilas: [
            { id: 1, name: 'ডোমার', nameEn: 'Domar' },
            { id: 2, name: 'ডিমলা', nameEn: 'Dimla' },
            { id: 3, name: 'জলঢাকা', nameEn: 'Jaldhaka' },
            { id: 4, name: 'কিশোরগঞ্জ', nameEn: 'Kishoreganj' },
            { id: 5, name: 'নীলফামারী সদর', nameEn: 'Nilphamari Sadar' },
            { id: 6, name: 'সৈয়দপুর', nameEn: 'Syedpur' }
        ]
    },
    {
        id: 58,
        name: 'পঞ্চগড়',
        nameEn: 'Panchagarh',
        upazilas: [
            { id: 1, name: 'আটোয়ারী', nameEn: 'Atwari' },
            { id: 2, name: 'বোদা', nameEn: 'Boda' },
            { id: 3, name: 'দেবীগঞ্জ', nameEn: 'Debiganj' },
            { id: 4, name: 'পঞ্চগড় সদর', nameEn: 'Panchagarh Sadar' },
            { id: 5, name: 'তেঁতুলিয়া', nameEn: 'Tetulia' }
        ]
    },
    {
        id: 59,
        name: 'রংপুর',
        nameEn: 'Rangpur',
        upazilas: [
            { id: 1, name: 'বদরগঞ্জ', nameEn: 'Badarganj' },
            { id: 2, name: 'গংগাচড়া', nameEn: 'Gangachhara' },
            { id: 3, name: 'কাউনিয়া', nameEn: 'Kaunia' },
            { id: 4, name: 'রংপুর সদর', nameEn: 'Rangpur Sadar' },
            { id: 5, name: 'মিঠাপুকুর', nameEn: 'Mithapukur' },
            { id: 6, name: 'পীরগাছা', nameEn: 'Pirgachha' },
            { id: 7, name: 'পীরগঞ্জ', nameEn: 'Pirganj' },
            { id: 8, name: 'তারাগঞ্জ', nameEn: 'Taraganj' }
        ]
    },
    {
        id: 60,
        name: 'ঠাকুরগাঁও',
        nameEn: 'Thakurgaon',
        upazilas: [
            { id: 1, name: 'বালিয়াডাঙ্গী', nameEn: 'Baliadangi' },
            { id: 2, name: 'হরিপুর', nameEn: 'Haripur' },
            { id: 3, name: 'পীরগঞ্জ', nameEn: 'Pirganj' },
            { id: 4, name: 'রানীশংকৈল', nameEn: 'Ranisankail' },
            { id: 5, name: 'ঠাকুরগাঁও সদর', nameEn: 'Thakurgaon Sadar' }
        ]
    },
    {
        id: 61,
        name: 'হবিগঞ্জ',
        nameEn: 'Habiganj',
        upazilas: [
            { id: 1, name: 'আজমিরীগঞ্জ', nameEn: 'Ajmiriganj' },
            { id: 2, name: 'বানিয়াচং', nameEn: 'Baniachong' },
            { id: 3, name: 'বাহুবল', nameEn: 'Bahubal' },
            { id: 4, name: 'চুনারুঘাট', nameEn: 'Chunarughat' },
            { id: 5, name: 'হবিগঞ্জ সদর', nameEn: 'Habiganj Sadar' },
            { id: 6, name: 'লাখাই', nameEn: 'Lakhai' },
            { id: 7, name: 'মাধবপুর', nameEn: 'Madhabpur' },
            { id: 8, name: 'নবীগঞ্জ', nameEn: 'Nabiganj' },
            { id: 9, name: 'শায়েস্তাগঞ্জ', nameEn: 'Sayestaganj' }
        ]
    },
    {
        id: 62,
        name: 'মৌলভীবাজার',
        nameEn: 'Moulvibazar',
        upazilas: [
            { id: 1, name: 'বড়লেখা', nameEn: 'Barlekha' },
            { id: 2, name: 'কমলগঞ্জ', nameEn: 'Kamalganj' },
            { id: 3, name: 'কুলাউড়া', nameEn: 'Kulaura' },
            { id: 4, name: 'মৌলভীবাজার সদর', nameEn: 'Moulvibazar Sadar' },
            { id: 5, name: 'রাজনগর', nameEn: 'Rajnagar' },
            { id: 6, name: 'শ্রীমঙ্গল', nameEn: 'Sreemangal' },
            { id: 7, name: 'জুড়ী', nameEn: 'Juri' }
        ]
    },
    {
        id: 63,
        name: 'সুনামগঞ্জ',
        nameEn: 'Sunamganj',
        upazilas: [
            { id: 1, name: 'বিশ্বম্ভরপুর', nameEn: 'Bishwamvarpur' },
            { id: 2, name: 'ছাতক', nameEn: 'Chhatak' },
            { id: 3, name: 'দিরাই', nameEn: 'Derai' },
            { id: 4, name: 'ধর্মপাশা', nameEn: 'Dharmapasha' },
            { id: 5, name: 'দোয়ারাবাজার', nameEn: 'Dowarabazar' },
            { id: 6, name: 'জগন্নাথপুর', nameEn: 'Jagannathpur' },
            { id: 7, name: 'জামালগঞ্জ', nameEn: 'Jamalganj' },
            { id: 8, name: 'শাল্লা', nameEn: 'Sulla' },
            { id: 9, name: 'সুনামগঞ্জ সদর', nameEn: 'Sunamganj Sadar' },
            { id: 10, name: 'তাহিরপুর', nameEn: 'Tahirpur' },
            { id: 11, name: 'মধ্যনগর', nameEn: 'Madhyanagar' }
        ]
    },
    {
        id: 64,
        name: 'সিলেট',
        nameEn: 'Sylhet',
        upazilas: [
            { id: 1, name: 'বালাগঞ্জ', nameEn: 'Balaganj' },
            { id: 2, name: 'বিয়ানীবাজার', nameEn: 'Beanibazar' },
            { id: 3, name: 'বিশ্বনাথ', nameEn: 'Bishwanath' },
            { id: 4, name: 'কোম্পানীগঞ্জ', nameEn: 'Companiganj' },
            { id: 5, name: 'ফেঞ্চুগঞ্জ', nameEn: 'Fenchuganj' },
            { id: 6, name: 'গোলাপগঞ্জ', nameEn: 'Golapganj' },
            { id: 7, name: 'গোয়াইনঘাট', nameEn: 'Gowainghat' },
            { id: 8, name: 'জৈন্তাপুর', nameEn: 'Jaintiapur' },
            { id: 9, name: 'কানাইঘাট', nameEn: 'Kanaighat' },
            { id: 10, name: 'সিলেট সদর', nameEn: 'Sylhet Sadar' },
            { id: 11, name: 'জকিগঞ্জ', nameEn: 'Zakiganj' },
            { id: 12, name: 'দক্ষিণ সুরমা', nameEn: 'Dakshin Surma' },
            { id: 13, name: 'ওসমানীনগর', nameEn: 'Osmani Nagar' }
        ]
    }
];
