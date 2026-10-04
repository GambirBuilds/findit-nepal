import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  PlusCircle,
  Compass,
  ArrowRight,
  Shield,
  Sparkles,
  Users,
  CheckCircle2,
  Package,
  FileText,
  Key,
  Wallet,
  Smartphone,
  Briefcase,
  Shirt,
  Watch,
  CreditCard,
  Book,
  PhoneCall,
  MapPin
} from 'lucide-react';
import { dataService } from '../lib/supabase';
import { Report, CATEGORIES_LIST } from '../types/database';
import { NEPAL_PROVINCES, NEPAL_POLICE_HELPLINES } from '../lib/nepalData';
import { useLanguage } from '../hooks/useLanguage';
import { ItemCard } from '../components/ItemCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { AssetImages } from '../assets/images';

export const Home: React.FC = () => {
  const { language, t } = useLanguage();
  const [stats, setStats] = useState({
    totalReports: 0,
    foundItems: 0,
    returnedItems: 0,
    activeUsers: 0,
  });
  const [recentReports, setRecentReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function loadHomeData() {
      try {
        const [analyticsData, reports] = await Promise.all([
          dataService.getAnalytics(),
          dataService.getReports()
        ]);
        setStats({
          totalReports: analyticsData.totalReports,
          foundItems: analyticsData.foundItems,
          returnedItems: analyticsData.returnedItems,
          activeUsers: analyticsData.activeUsers,
        });
        setRecentReports(reports.slice(0, 4));
      } catch (err) {
        console.error('Error loading home data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadHomeData();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/browse?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/browse');
    }
  };

  const getCategoryIcon = (id: string) => {
    switch (id) {
      case 'citizenship': return <CreditCard className="w-5 h-5 text-rose-600" />;
      case 'bluebook': return <Book className="w-5 h-5 text-blue-600" />;
      case 'license': return <FileText className="w-5 h-5 text-emerald-600" />;
      case 'nid': return <CreditCard className="w-5 h-5 text-amber-600" />;
      case 'electronics': return <Smartphone className="w-5 h-5 text-purple-600" />;
      case 'wallet': return <Wallet className="w-5 h-5 text-orange-600" />;
      case 'keys': return <Key className="w-5 h-5 text-yellow-600" />;
      case 'bag': return <Briefcase className="w-5 h-5 text-teal-600" />;
      case 'documents': return <FileText className="w-5 h-5 text-indigo-600" />;
      case 'jewelry': return <Watch className="w-5 h-5 text-amber-500" />;
      default: return <Package className="w-5 h-5 text-neutral-500" />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-10 pb-14 lg:pt-16 lg:pb-20 border-b border-neutral-200/80 dark:border-neutral-800 bg-gradient-to-b from-white via-orange-50/20 to-neutral-50 dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Headlines & CTAs */}
            <div className="lg:col-span-7 space-y-5 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-100/90 dark:bg-orange-950/70 border border-orange-200 dark:border-orange-800/80 text-xs font-bold text-orange-800 dark:text-orange-300">
                <span className="w-2 h-2 rounded-full bg-orange-600 animate-ping" />
                <span>{t.nepalPlatform} · ७ वटै प्रदेशमा सक्रिय</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-neutral-900 dark:text-white leading-[1.15] font-sans">
                {t.heroTitle1}<br />
                <span className="text-orange-600">{t.heroTitle2}</span>
              </h1>

              <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 max-w-xl leading-relaxed">
                {t.heroDesc}
              </p>

              {/* Primary Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Link
                  to="/report/lost"
                  className="px-5 py-2.5 sm:px-6 sm:py-3 text-xs sm:text-sm font-bold text-white bg-orange-600 hover:bg-orange-700 active:bg-orange-800 rounded-xl transition-all shadow-sm hover:shadow flex items-center gap-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>{t.reportLost}</span>
                </Link>

                <Link
                  to="/report/found"
                  className="px-5 py-2.5 sm:px-6 sm:py-3 text-xs sm:text-sm font-bold text-neutral-900 dark:text-white bg-white dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 border border-neutral-300 dark:border-neutral-700 rounded-xl transition-colors flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>{t.reportFound}</span>
                </Link>

                <Link
                  to="/browse"
                  className="px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white rounded-xl transition-colors inline-flex items-center gap-1.5"
                >
                  <span>{t.browse}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Live Search Bar tailored to Nepal */}
              <form onSubmit={handleSearchSubmit} className="pt-2 max-w-xl">
                <div className="relative flex items-center">
                  <Search className="absolute left-4 w-4 h-4 sm:w-5 sm:h-5 text-neutral-400 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t.searchPlaceholder}
                    className="w-full pl-11 pr-24 py-3 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-2xl text-xs sm:text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-xs"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 px-3.5 py-1.5 text-xs font-bold text-white bg-neutral-900 dark:bg-neutral-100 dark:text-neutral-900 hover:bg-neutral-800 rounded-xl transition-colors"
                  >
                    खोज्नुहोस्
                  </button>
                </div>
              </form>
            </div>

            {/* Right Column: Hero Visual Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 aspect-[4/3] group">
                <img
                  src={AssetImages.heroReunion}
                  alt="FindIt Nepal reunion"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-neutral-950/25 to-transparent flex flex-col justify-end p-6 text-white">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/20 backdrop-blur-md text-[11px] font-semibold w-max mb-2">
                    <Shield className="w-3.5 h-3.5 text-orange-400" />
                    <span>नागरिक गोपनीयता र सुरक्षा</span>
                  </div>
                  <p className="text-sm sm:text-base font-bold leading-snug">
                    काठमाडौँ उपत्यका, पोखरा, र नेपालका सबै जिल्लामा हराएका सामान फेला पार्न सहज माध्यम।
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nepal Police & Emergency Helplines Strip */}
      <section className="bg-neutral-900 text-neutral-200 py-3.5 px-4 text-xs border-b border-neutral-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <PhoneCall className="w-4 h-4 text-orange-500 shrink-0" />
            <span className="font-semibold text-white">
              {language === 'ne' ? 'नेपाल आपतकालीन सम्पर्क:' : 'Nepal Emergency Contacts:'}
            </span>
            <span className="text-neutral-400 hidden sm:inline">{t.trafficNotice}</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
            {NEPAL_POLICE_HELPLINES.map(line => (
              <span key={line.number} className="flex items-center gap-1 text-neutral-300">
                <span className="text-neutral-400 text-[11px] font-sans">
                  {language === 'ne' ? line.nameNe : line.nameEn}:
                </span>
                <strong className="text-orange-400 font-bold">{line.number}</strong>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Real Database Statistics Section */}
      <section className="py-8 bg-white dark:bg-neutral-900 border-b border-neutral-200/80 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 divide-y md:divide-y-0 md:divide-x divide-neutral-100 dark:divide-neutral-800">
            <div className="pt-3 md:pt-0 md:px-4 text-center">
              <p className="text-3xl sm:text-4xl font-extrabold text-neutral-900 dark:text-white tabular-nums font-mono">
                {stats.totalReports}
              </p>
              <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 mt-1 uppercase tracking-wider">
                {t.itemsReported}
              </p>
            </div>
            <div className="pt-3 md:pt-0 md:px-4 text-center">
              <p className="text-3xl sm:text-4xl font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums font-mono">
                {stats.foundItems}
              </p>
              <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 mt-1 uppercase tracking-wider">
                {t.itemsFound}
              </p>
            </div>
            <div className="pt-3 md:pt-0 md:px-4 text-center">
              <p className="text-3xl sm:text-4xl font-extrabold text-orange-600 dark:text-orange-400 tabular-nums font-mono">
                {stats.returnedItems}
              </p>
              <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 mt-1 uppercase tracking-wider">
                {t.successfulReturns}
              </p>
            </div>
            <div className="pt-3 md:pt-0 md:px-4 text-center">
              <p className="text-3xl sm:text-4xl font-extrabold text-neutral-900 dark:text-white tabular-nums font-mono">
                {stats.activeUsers}
              </p>
              <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 mt-1 uppercase tracking-wider">
                {t.activeUsers}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Explore by 7 Provinces of Nepal */}
      <section className="py-8 bg-neutral-100/60 dark:bg-neutral-950/40 border-b border-neutral-200/80 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-orange-600" />
              {language === 'ne' ? 'नेपालका ७ वटै प्रदेश अनुसार खोज्नुहोस्' : 'Filter Notices by Nepal Province'}
            </h3>
            <span className="text-[11px] text-neutral-400">Kathmandu · Pokhara · Biratnagar · Butwal</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {NEPAL_PROVINCES.map(prov => (
              <Link
                key={prov.id}
                to={`/browse?location=${encodeURIComponent(prov.nameEn)}`}
                className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:border-orange-500 hover:text-orange-600 transition-colors whitespace-nowrap shadow-2xs"
              >
                {language === 'ne' ? prov.nameNe : prov.nameEn}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Nepal-Specific Category Shortcuts */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
              {t.exploreByCategory}
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              {t.exploreSub}
            </p>
          </div>
          <Link
            to="/browse"
            className="text-xs font-semibold text-orange-600 dark:text-orange-400 hover:underline inline-flex items-center gap-1"
          >
            All Items <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
          {CATEGORIES_LIST.map((cat) => (
            <Link
              key={cat.id}
              to={`/browse?category=${cat.id}`}
              className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 hover:border-orange-500 hover:shadow-sm dark:hover:border-orange-500 transition-all text-neutral-700 dark:text-neutral-300 hover:text-orange-600 dark:hover:text-orange-400 group text-center"
            >
              <div className="w-12 h-12 rounded-xl bg-neutral-100 dark:bg-neutral-800 group-hover:bg-orange-50 dark:group-hover:bg-orange-950/50 flex items-center justify-center mb-2.5 transition-colors">
                {getCategoryIcon(cat.id)}
              </div>
              <span className="text-xs font-bold truncate max-w-full">
                {language === 'ne' && cat.nameNe ? cat.nameNe : cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. Recent Reports Showcase */}
      <section className="py-12 bg-neutral-100/50 dark:bg-neutral-950/60 border-t border-b border-neutral-200/80 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
                {t.recentReports}
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                Latest lost declarations and found notices across Nepal
              </p>
            </div>
            <Link
              to="/browse"
              className="px-4 py-2 text-xs font-semibold text-neutral-800 dark:text-neutral-200 bg-white dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-700 rounded-xl hover:bg-neutral-50 transition-colors shadow-xs"
            >
              {language === 'ne' ? 'सबै सूची हेर्नुहोस्' : 'View All Notices'}
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner text="Loading recent listings..." />
          ) : recentReports.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-8">
              <Package className="w-12 h-12 text-neutral-300 dark:text-neutral-600 mx-auto mb-3" />
              <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                हाल कुनै सामान दर्ता भएको छैन
              </p>
              <p className="text-xs text-neutral-400 mt-1">
                तपाईंको हराएको वा भेटिएको सामान तुरुन्तै दर्ता गर्नुहोस्।
              </p>
              <div className="mt-4">
                <Link
                  to="/report/lost"
                  className="px-4 py-2 text-xs font-semibold text-white bg-orange-600 rounded-xl"
                >
                  {t.reportLost}
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recentReports.map((report) => (
                <ItemCard key={report.id} report={report} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 6. Why FindIt in Nepal */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
            {language === 'ne' ? 'FindIt Nepal ले कसरी काम गर्छ?' : 'How FindIt Unites Nepal'}
          </h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2">
            नागरिकता, ब्लुबुक वा बहुमूल्य सामान हराउँदा झन्झटमुक्त सुरक्षित समाधान।
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-xs relative">
            <span className="text-3xl font-black text-orange-200 dark:text-orange-950 font-mono mb-4 block">01</span>
            <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 mb-2">
              {language === 'ne' ? '१. विवरण दर्ता गर्नुहोस्' : 'File a Clear Report'}
            </h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              स्थान (जस्तै: नयाँ सडक, रत्नपार्क, पुल्चोक), मिति, र फोटो सहित हराएको वा फेला परेको सामग्रीको विवरण भर्नुहोस्।
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-xs relative">
            <span className="text-3xl font-black text-orange-200 dark:text-orange-950 font-mono mb-4 block">02</span>
            <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 mb-2">
              {language === 'ne' ? '२. स्मार्ट म्याचिङ प्रणाली' : 'Automated Similarity Scan'}
            </h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              हाम्रो प्रणालीले दर्ता भएका सामानहरूको नाम, स्थान, वर्ग र मिति तुलना गरी मिलोमतो पत्ता लगाउँछ र तुरुन्तै नोटिफिकेसन पठाउँछ।
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-xs relative">
            <span className="text-3xl font-black text-orange-200 dark:text-orange-950 font-mono mb-4 block">03</span>
            <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 mb-2">
              {language === 'ne' ? '३. सुरक्षित फिर्ता' : 'Secure Safe Handover'}
            </h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              नजिकैको प्रहरी बिट, क्याम्पस प्रशासन वा सार्वजनिक स्थानमा भेटी प्रमाण जाँच गरेर सामान फिर्ता गर्नुहोस्।
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
