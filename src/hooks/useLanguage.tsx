import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'ne';

export const DICTIONARY = {
  en: {
    brandSubtitle: 'Find what matters. Return what belongs.',
    nepalPlatform: 'Nepal Lost & Found Network',
    home: 'Home',
    browse: 'Browse Items',
    track: 'Track My Item',
    matches: 'AI Matches',
    analytics: 'Analytics',
    admin: 'Admin',
    reportLost: 'Report Lost Item',
    reportFound: 'Report Found Item',
    reportItem: 'Report Item',
    signIn: 'Log In',
    signUp: 'Sign Up',
    signOut: 'Sign Out',
    myProfile: 'My Profile',
    searchPlaceholder: 'Search by item, Nagarikta, Bluebook, location...',
    heroTitle1: 'Lost something in Nepal?',
    heroTitle2: 'Found someone’s belonging?',
    heroDesc: 'FindIt Nepal unites communities across all 7 provinces. Report missing citizenships, bluebooks, licenses, gadgets, and keys with automated smart matching.',
    itemsReported: 'Items Reported',
    itemsFound: 'Items Found',
    successfulReturns: 'Successful Returns',
    activeUsers: 'Active Citizens',
    exploreByCategory: 'Explore by Category',
    exploreSub: 'Select a category to filter active notices across Nepal',
    recentReports: 'Recently Reported in Nepal',
    policeHelplines: 'Nepal Police Emergency Contact',
    trafficNotice: 'For lost driving licenses & vehicle documents, Traffic Police (103) is also integrated.',
    confidentialRelay: 'Protected privacy relay: Contact information is safe from public misuse.',
    provinceFilter: 'Select Province',
    allProvinces: 'All 7 Provinces',
  },
  ne: {
    brandSubtitle: 'हराएका सामान खोजौँ, भेटिएका सामान सम्बन्धित व्यक्तिलाई फर्काऔँ।',
    nepalPlatform: 'नेपाल राष्ट्रिय लस्ट एण्ड फाउन्ड मञ्च',
    home: 'गृहपृष्ठ',
    browse: 'सामानहरू हेर्नुहोस्',
    track: 'मेरो सामान ट्र्याक',
    matches: 'स्मार्ट म्याचिङ',
    analytics: 'तथ्याङ्क',
    admin: 'प्रशासक',
    reportLost: 'हराएको सामान दर्ता',
    reportFound: 'भेटिएको सामान दर्ता',
    reportItem: 'सामान दर्ता गर्नुहोस्',
    signIn: 'लग-इन',
    signUp: 'दर्ता हुनुहोस्',
    signOut: 'बाहिरिनुहोस्',
    myProfile: 'मेरो प्रोफाइल',
    searchPlaceholder: 'नागरिकता, ब्लुबुक, लाइसेन्स, स्थान खोज्नुहोस्...',
    heroTitle1: 'के तपाईंको केही हरायो?',
    heroTitle2: 'वा कसैको सामान फेला पर्यो?',
    heroDesc: 'नागरिकता, ब्लुबुक, सवारी चालक अनुमतिपत्र (लाइसेन्स), ल्यापटप, मोबाइल, चाबी तथा अन्य सामान खोज्न र सम्बन्धित धनीलाई सुरक्षित फिर्ता गर्न नेपालभरको साझा मञ्च।',
    itemsReported: 'कुल दर्ता सामान',
    itemsFound: 'फेला परेका सामान',
    successfulReturns: 'सफलतापूर्वक फिर्ता',
    activeUsers: 'सक्रिय नागरिकहरू',
    exploreByCategory: 'सामग्री वर्गीकरण',
    exploreSub: 'नेपालभरका हराएका र भेटिएका सामग्रीहरू वर्ग अनुसार खोज्नुहोस्',
    recentReports: 'हालसालै दर्ता भएका सामानहरू',
    policeHelplines: 'नेपाल प्रहरी तथा ट्राफिक आपतकालीन सम्पर्क',
    trafficNotice: 'हराएको लाइसेन्स तथा ब्लुबुकको लागि ट्राफिक प्रहरी १०३ मा पनि समन्वय गर्न सकिन्छ।',
    confidentialRelay: 'गोपनीयता सुरक्षित: व्यक्तिगत फोन र इमेल सार्वजनिक नगरिकन सन्देश आदानप्रदान हुन्छ।',
    provinceFilter: 'प्रदेश छान्नुहोस्',
    allProvinces: 'सबै ७ प्रदेशहरू',
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: typeof DICTIONARY['en'];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('findit_lang') as Language;
      return saved === 'ne' || saved === 'en' ? saved : 'en';
    }
    return 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('findit_lang', lang);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ne' : 'en');
  };

  const t = DICTIONARY[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
