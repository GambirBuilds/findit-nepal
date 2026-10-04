export interface ProvinceInfo {
  id: string;
  nameEn: string;
  nameNe: string;
  majorDistricts: string[];
}

export const NEPAL_PROVINCES: ProvinceInfo[] = [
  {
    id: 'bagmati',
    nameEn: 'Bagmati Province',
    nameNe: 'बागमती प्रदेश',
    majorDistricts: ['Kathmandu', 'Lalitpur', 'Bhaktapur', 'Chitwan', 'Kavrepalanchok', 'Makwanpur (Hetauda)', 'Dhading', 'Nuwakot', 'Sindhupalchok']
  },
  {
    id: 'gandaki',
    nameEn: 'Gandaki Province',
    nameNe: 'गण्डकी प्रदेश',
    majorDistricts: ['Kaski (Pokhara)', 'Tanahun', 'Syangja', 'Nawalpur', 'Gorkha', 'Lamjung', 'Baglung', 'Parbat']
  },
  {
    id: 'koshi',
    nameEn: 'Koshi Province',
    nameNe: 'कोशी प्रदेश',
    majorDistricts: ['Morang (Biratnagar)', 'Sunsari (Dharan/Itahari)', 'Jhapa', 'Ilam', 'Udayapur', 'Dhankuta']
  },
  {
    id: 'madhesh',
    nameEn: 'Madhesh Province',
    nameNe: 'मधेश प्रदेश',
    majorDistricts: ['Parsa (Birgunj)', 'Dhanusha (Janakpur)', 'Sarlahi', 'Bara', 'Siraha', 'Mahottari', 'Rautahat', 'Saptari']
  },
  {
    id: 'lumbini',
    nameEn: 'Lumbini Province',
    nameNe: 'लुम्बिनी प्रदेश',
    majorDistricts: ['Rupandehi (Butwal/Bhairahawa)', 'Dang (Ghorahi/Tulsipur)', 'Banke (Nepalgunj)', 'Kapilvastu', 'Palpa']
  },
  {
    id: 'karnali',
    nameEn: 'Karnali Province',
    nameNe: 'कर्णाली प्रदेश',
    majorDistricts: ['Surkhet (Birendranagar)', 'Jumla', 'Dailekh', 'Salyan', 'Rukum West']
  },
  {
    id: 'sudurpashchim',
    nameEn: 'Sudurpashchim Province',
    nameNe: 'सुदूरपश्चिम प्रदेश',
    majorDistricts: ['Kailali (Dhangadhi)', 'Kanchanpur (Mahendranagar)', 'Doti', 'Dadeldhura', 'Baitadi']
  }
];

export const NEPAL_CATEGORIES = [
  { id: 'citizenship', nameEn: 'Citizenship (Nagarikta)', nameNe: 'नागरिकता प्रमाणपत्र', icon: 'CreditCard' },
  { id: 'bluebook', nameEn: 'Vehicle Bluebook', nameNe: 'सवारी दर्ता किताब (ब्लुबुक)', icon: 'Book' },
  { id: 'license', nameEn: 'Driving License', nameNe: 'सवारी चालक अनुमतिपत्र (लाइसेन्स)', icon: 'FileText' },
  { id: 'nid', nameEn: 'National ID / PAN Card', nameNe: 'राष्ट्रिय परिचयपत्र / प्यान', icon: 'CreditCard' },
  { id: 'electronics', nameEn: 'Phone / Laptop / Gadgets', nameNe: 'मोबाइल / ल्यापटप / इलेक्ट्रोनिक्स', icon: 'Smartphone' },
  { id: 'wallet', nameEn: 'Wallet / Purse / ATM Cards', nameNe: 'वालेट / पर्स / बैंक कार्ड', icon: 'Wallet' },
  { id: 'keys', nameEn: 'Motorbike / Vehicle Keys', nameNe: 'मोटरसाइकल / गाडीको चाबी', icon: 'Key' },
  { id: 'bag', nameEn: 'Bag / Backpack / Luggage', nameNe: 'झोला / ब्याग / ब्याकप्याक', icon: 'Briefcase' },
  { id: 'documents', nameEn: 'Academic / Official Certificates', nameNe: 'शैक्षिक / सरकारी प्रमाणपत्र', icon: 'FileText' },
  { id: 'jewelry', nameEn: 'Jewelry / Gold / Watch', nameNe: 'गरगहना / घडी / सुन', icon: 'Watch' },
  { id: 'other', nameEn: 'Other Belongings', nameNe: 'अन्य सामग्री', icon: 'Package' },
];

export const NEPAL_POLICE_HELPLINES = [
  { nameEn: 'Nepal Police Control', nameNe: 'नेपाल प्रहरी कन्ट्रोल', number: '100' },
  { nameEn: 'Traffic Police Lost & Found', nameNe: 'ट्राफिक प्रहरी (हराएको/भेटिएको)', number: '103' },
  { nameEn: 'Tourist Police (Bhrikutimandap)', nameNe: 'पर्यटक प्रहरी', number: '1144' },
  { nameEn: 'Emergency Ambulance', nameNe: 'एम्बुलेन्स सेवा', number: '102' }
];

export const POPULAR_NEPAL_HUBS = [
  'Tribhuvan International Airport (TIA), Kathmandu',
  'Ratna Park Micro & Bus Park, Kathmandu',
  'New Road / Khichapokhari, Kathmandu',
  'Pulchowk Engineering Campus, Lalitpur',
  'Thamel Tourism Hub, Kathmandu',
  'Patan Durbar Square / Mangalbazar, Lalitpur',
  'Koteshwor Chowk, Kathmandu',
  'Kalanki Bus Terminal, Kathmandu',
  'Lakeside, Pokhara',
  'Chitwan Bharatpur Bus Terminal',
  'Bhairahawa Airport, Lumbini',
  'Bhaktapur Durbar Square'
];
