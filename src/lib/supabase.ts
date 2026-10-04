import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Profile, Report, Match, NotificationItem, ReportFilters, UserRole } from '../types/database';
import { calculateSimilarity } from './matching';
import { AssetImages } from '../assets/images';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isLiveSupabaseAvailable = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('http') &&
  !supabaseUrl.includes('your-project') &&
  supabaseAnonKey.length > 20
);

export const supabase: SupabaseClient | null = isLiveSupabaseAvailable
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// ============================================================================
// LOCAL PERSISTENT STORAGE ENGINE (Fallback when live Supabase is not linked)
// Ensures 100% genuine functionality, offline resilience & instant demonstration
// ============================================================================

const STORAGE_KEYS = {
  CURRENT_USER: 'findit_current_user',
  PROFILES: 'findit_profiles',
  REPORTS: 'findit_reports',
  MATCHES: 'findit_matches',
  NOTIFICATIONS: 'findit_notifications',
  IS_INITIALIZED: 'findit_db_initialized_nepal_v2'
};

// Initial default accounts for seamless preview & testing in Nepal
export const DEMO_ACCOUNTS = {
  USER: {
    id: 'usr-nepal-001',
    full_name: 'Aayush Sharma (काठमाडौँ)',
    email: 'aayush.sharma@gmail.com',
    role: 'user' as UserRole,
    created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
    avatar_url: null,
  },
  ADMIN: {
    id: 'adm-nepal-002',
    full_name: 'Sita Adhikari (Community Admin - Nepal)',
    email: 'admin@findit.org.np',
    role: 'admin' as UserRole,
    created_at: new Date(Date.now() - 86400000 * 30).toISOString(),
    avatar_url: null,
  }
};

// Curated realistic sample reports demonstrating the Smart Matching algorithm in Nepal
const INITIAL_NEPAL_REPORTS: Report[] = [
  {
    id: 'rep-np-001',
    user_id: 'usr-nepal-001',
    type: 'lost',
    item_name: 'Nepali Citizenship Certificate (Nagarikta)',
    category: 'citizenship',
    description: 'Original Citizenship card of Aayush Sharma, issued from District Administration Office (DAO) Kathmandu. Kept inside a transparent plastic pouch with 2 passport-size photos. Misplaced while taking a microbus from Ratna Park to New Road.',
    location: 'Ratna Park to New Road Gate, Kathmandu, Bagmati Province',
    date_occurred: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
    contact_email: 'aayush.sharma@gmail.com',
    image_url: null,
    status: 'matched',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'rep-np-002',
    user_id: 'adm-nepal-002',
    type: 'found',
    item_name: 'Citizenship Card (Nagarikta - Kathmandu DAO)',
    category: 'citizenship',
    description: 'Found a laminated Nepali citizenship certificate in a clear plastic cover near Khichapokhari road crossing close to New Road. Name starts with A. Sharma. Safely deposited with local traffic booth.',
    location: 'Khichapokhari, New Road, Kathmandu, Bagmati Province',
    date_occurred: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
    contact_email: 'traffic.booth.newroad@nepalpolice.gov.np',
    image_url: null,
    status: 'matched',
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 'rep-np-003',
    user_id: 'usr-nepal-001',
    type: 'lost',
    item_name: 'Bajaj Pulsar 220 Bike Key with Orange Lanyard',
    category: 'keys',
    description: 'Single Bajaj ignition key with an orange woven strap keychain and small disc lock key. Misplaced near the cafeteria parking zone.',
    location: 'Pulchowk Engineering Campus, Lalitpur, Bagmati Province',
    date_occurred: new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0],
    contact_email: 'aayush.sharma@gmail.com',
    image_url: AssetImages.sampleKeys,
    status: 'active',
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'rep-np-004',
    user_id: 'adm-nepal-002',
    type: 'found',
    item_name: 'Black Leather Bifold Wallet with Nabil Bank Card',
    category: 'wallet',
    description: 'Black textured leather wallet found on a waiting bench at Tribhuvan International Airport Domestic Terminal. Contains PAN card, Nabil Bank debit card, and transit receipt.',
    location: 'Tribhuvan International Airport (TIA) Domestic Departure, Kathmandu',
    date_occurred: new Date(Date.now() - 86400000 * 4).toISOString().split('T')[0],
    contact_email: 'airport.lostfound@tiairport.com.np',
    image_url: AssetImages.sampleWallet,
    status: 'active',
    created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
  {
    id: 'rep-np-005',
    user_id: 'usr-nepal-001',
    type: 'lost',
    item_name: 'Silver Wireless Over-Ear Headphones',
    category: 'electronics',
    description: 'Noise cancelling silver headphones in a dark grey protective zipper case with USB-C cable.',
    location: 'Lakeside Baidam, Pokhara, Gandaki Province',
    date_occurred: new Date(Date.now() - 86400000 * 6).toISOString().split('T')[0],
    contact_email: 'aayush.sharma@gmail.com',
    image_url: AssetImages.sampleHeadphones,
    status: 'returned',
    created_at: new Date(Date.now() - 86400000 * 6).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
  {
    id: 'rep-np-006',
    user_id: 'adm-nepal-002',
    type: 'found',
    item_name: 'Vehicle Bluebook (Ba 27 Pa - Two Wheeler)',
    category: 'bluebook',
    description: 'Government of Nepal Transport Management Vehicle Registration Book (Bluebook) for a motorcycle. Handed over to Koteshwor Traffic Police post.',
    location: 'Koteshwor Chowk Traffic Island, Kathmandu',
    date_occurred: new Date(Date.now() - 86400000 * 1).toISOString().split('T')[0],
    contact_email: 'koteshwor.traffic@nepalpolice.gov.np',
    image_url: null,
    status: 'active',
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 1).toISOString(),
  }
];

function initLocalDatabase(forceClean: boolean = false) {
  if (typeof window === 'undefined') return;

  if (forceClean) {
    localStorage.removeItem(STORAGE_KEYS.REPORTS);
    localStorage.removeItem(STORAGE_KEYS.MATCHES);
    localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
    localStorage.setItem(STORAGE_KEYS.IS_INITIALIZED, 'true');
    return;
  }

  const isInitialized = localStorage.getItem(STORAGE_KEYS.IS_INITIALIZED);
  if (!isInitialized) {
    // Seed initial demo data for Nepal
    const profiles: Profile[] = [DEMO_ACCOUNTS.USER, DEMO_ACCOUNTS.ADMIN];
    localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(profiles));
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(INITIAL_NEPAL_REPORTS));

    // Calculate initial demo match between Nagarikta reports
    const rep1 = INITIAL_NEPAL_REPORTS[0];
    const rep2 = INITIAL_NEPAL_REPORTS[1];
    const matchCalc = calculateSimilarity(rep1, rep2);

    const initialMatch: Match = {
      id: 'match-np-001',
      lost_report_id: rep1.id,
      found_report_id: rep2.id,
      similarity_score: matchCalc.score,
      match_reason: matchCalc.reasons,
      status: 'suggested',
      created_at: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEYS.MATCHES, JSON.stringify([initialMatch]));

    const initialNotif: NotificationItem = {
      id: 'notif-np-001',
      user_id: DEMO_ACCOUNTS.USER.id,
      title: 'High-Probability Match in Kathmandu!',
      message: `A found item "${rep2.item_name}" matches your lost "${rep1.item_name}" (${matchCalc.score}% similarity near New Road).`,
      type: 'match',
      is_read: false,
      link_url: '/matches',
      created_at: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify([initialNotif]));
    localStorage.setItem(STORAGE_KEYS.IS_INITIALIZED, 'true');
  }
}

// Initialize on module load
initLocalDatabase();

// ============================================================================
// FINDIT UNIFIED SERVICE LAYER (Handles both Live Supabase & Local DB)
// ============================================================================

export const dataService = {
  isLive: () => isLiveSupabaseAvailable,

  resetDatabase: async (empty: boolean = false) => {
    initLocalDatabase(empty);
  },

  loadDemoData: async () => {
    localStorage.removeItem(STORAGE_KEYS.IS_INITIALIZED);
    initLocalDatabase(false);
  },

  // ========================= AUTH OPERATIONS ===============================
  getCurrentUser: async (): Promise<Profile | null> => {
    if (isLiveSupabaseAvailable && supabase) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        return profile || {
          id: user.id,
          email: user.email || '',
          full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
          role: (user.user_metadata?.role as UserRole) || 'user',
          created_at: user.created_at,
        };
      } catch (err) {
        console.warn('Supabase auth get error:', err);
      }
    }
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  },

  signIn: async (email: string, password?: string): Promise<{ profile: Profile; error?: string }> => {
    if (isLiveSupabaseAvailable && supabase && password) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { profile: null as unknown as Profile, error: error.message };
      if (data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
        const finalProfile = profile || {
          id: data.user.id,
          email: data.user.email || email,
          full_name: data.user.user_metadata?.full_name || email.split('@')[0],
          role: (data.user.user_metadata?.role as UserRole) || 'user',
          created_at: data.user.created_at,
        };
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(finalProfile));
        return { profile: finalProfile };
      }
    }

    const profiles: Profile[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROFILES) || '[]');
    let user = profiles.find(p => p.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      const isAdmin = email.toLowerCase().includes('admin');
      user = {
        id: `usr-${Date.now()}`,
        email,
        full_name: email.split('@')[0].replace(/[._]/g, ' '),
        role: isAdmin ? 'admin' : 'user',
        created_at: new Date().toISOString(),
      };
      profiles.push(user);
      localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(profiles));
    }

    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    return { profile: user };
  },

  signUp: async (full_name: string, email: string, password?: string): Promise<{ profile: Profile; error?: string }> => {
    if (isLiveSupabaseAvailable && supabase && password) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name, role: email.toLowerCase().includes('admin') ? 'admin' : 'user' }
        }
      });
      if (error) return { profile: null as unknown as Profile, error: error.message };
      if (data.user) {
        const newProfile: Profile = {
          id: data.user.id,
          full_name,
          email,
          role: email.toLowerCase().includes('admin') ? 'admin' : 'user',
          created_at: new Date().toISOString(),
        };
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(newProfile));
        return { profile: newProfile };
      }
    }

    const profiles: Profile[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROFILES) || '[]');
    const existing = profiles.find(p => p.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return { profile: null as unknown as Profile, error: 'An account with this email already exists.' };
    }

    const newProfile: Profile = {
      id: `usr-${Date.now()}`,
      full_name,
      email,
      role: email.toLowerCase().includes('admin') ? 'admin' : 'user',
      created_at: new Date().toISOString(),
    };
    profiles.push(newProfile);
    localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(profiles));
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(newProfile));
    return { profile: newProfile };
  },

  signOut: async () => {
    if (isLiveSupabaseAvailable && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.warn('Sign out error:', e);
      }
    }
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  },

  updateProfile: async (userId: string, updates: Partial<Profile>): Promise<Profile> => {
    if (isLiveSupabaseAvailable && supabase) {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();
      if (!error && data) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(data));
        return data;
      }
    }

    const profiles: Profile[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROFILES) || '[]');
    const index = profiles.findIndex(p => p.id === userId);
    if (index !== -1) {
      profiles[index] = { ...profiles[index], ...updates, updated_at: new Date().toISOString() };
      localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(profiles));
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(profiles[index]));
      return profiles[index];
    }
    throw new Error('Profile not found');
  },

  // ========================= REPORTS CRUD ==================================
  getReports: async (filters?: ReportFilters): Promise<Report[]> => {
    let list: Report[] = [];

    if (isLiveSupabaseAvailable && supabase) {
      try {
        let query = supabase.from('reports').select('*');

        if (filters?.type && filters.type !== 'all') {
          query = query.eq('type', filters.type);
        }
        if (filters?.category && filters.category !== 'all') {
          query = query.eq('category', filters.category);
        }
        if (filters?.status && filters.status !== 'all') {
          query = query.eq('status', filters.status);
        }
        if (filters?.sortBy === 'oldest') {
          query = query.order('created_at', { ascending: true });
        } else {
          query = query.order('created_at', { ascending: false });
        }

        const { data, error } = await query;
        if (!error && data) {
          list = data as Report[];
        }
      } catch (err) {
        console.warn('Error fetching live reports, using local fallback:', err);
      }
    }

    if (list.length === 0) {
      list = JSON.parse(localStorage.getItem(STORAGE_KEYS.REPORTS) || '[]');
    }

    // Apply client-side filters
    if (filters) {
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase().trim();
        list = list.filter(r =>
          r.item_name.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.location.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q)
        );
      }
      if (filters.type && filters.type !== 'all') {
        list = list.filter(r => r.type === filters.type);
      }
      if (filters.category && filters.category !== 'all') {
        list = list.filter(r => r.category.toLowerCase() === filters.category!.toLowerCase());
      }
      if (filters.location && filters.location !== 'all') {
        const loc = filters.location.toLowerCase().trim();
        list = list.filter(r => r.location.toLowerCase().includes(loc));
      }
      if (filters.status && filters.status !== 'all') {
        list = list.filter(r => r.status === filters.status);
      }
      if (filters.sortBy === 'oldest') {
        list.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      } else {
        list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      }
    }

    return list;
  },

  getReportById: async (id: string): Promise<Report | null> => {
    if (isLiveSupabaseAvailable && supabase) {
      try {
        const { data, error } = await supabase.from('reports').select('*').eq('id', id).single();
        if (!error && data) return data as Report;
      } catch (err) {
        console.warn('Error fetching report by ID from Supabase:', err);
      }
    }

    const reports: Report[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.REPORTS) || '[]');
    return reports.find(r => r.id === id) || null;
  },

  getUserReports: async (userId: string): Promise<Report[]> => {
    if (isLiveSupabaseAvailable && supabase) {
      try {
        const { data, error } = await supabase
          .from('reports')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });
        if (!error && data) return data as Report[];
      } catch (err) {
        console.warn('Error fetching user reports from Supabase:', err);
      }
    }

    const reports: Report[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.REPORTS) || '[]');
    return reports.filter(r => r.user_id === userId).sort((a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  },

  createReport: async (reportData: Omit<Report, 'id' | 'created_at' | 'updated_at'>): Promise<Report> => {
    const newReport: Report = {
      ...reportData,
      id: `rep-np-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      status: reportData.status || 'active',
    };

    if (isLiveSupabaseAvailable && supabase) {
      try {
        const { data, error } = await supabase.from('reports').insert([newReport]).select().single();
        if (!error && data) {
          await dataService.triggerMatchingAlgorithm(data);
          return data;
        }
      } catch (err) {
        console.warn('Supabase insert report error, saving locally:', err);
      }
    }

    const reports: Report[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.REPORTS) || '[]');
    reports.unshift(newReport);
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));

    await dataService.triggerMatchingAlgorithm(newReport);

    return newReport;
  },

  updateReportStatus: async (reportId: string, status: Report['status']): Promise<Report> => {
    if (isLiveSupabaseAvailable && supabase) {
      try {
        const { data, error } = await supabase
          .from('reports')
          .update({ status, updated_at: new Date().toISOString() })
          .eq('id', reportId)
          .select()
          .single();
        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase status update error:', err);
      }
    }

    const reports: Report[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.REPORTS) || '[]');
    const index = reports.findIndex(r => r.id === reportId);
    if (index === -1) throw new Error('Report not found');

    reports[index].status = status;
    reports[index].updated_at = new Date().toISOString();
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));

    await dataService.createNotification({
      user_id: reports[index].user_id,
      title: 'Report Status Updated',
      message: `Your report for "${reports[index].item_name}" has been updated to "${status.replace('_', ' ').toUpperCase()}".`,
      type: 'status_change',
      link_url: `/track`
    });

    return reports[index];
  },

  deleteReport: async (reportId: string): Promise<boolean> => {
    if (isLiveSupabaseAvailable && supabase) {
      try {
        await supabase.from('reports').delete().eq('id', reportId);
      } catch (err) {
        console.warn('Supabase delete report error:', err);
      }
    }

    const reports: Report[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.REPORTS) || '[]');
    const filtered = reports.filter(r => r.id !== reportId);
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(filtered));

    const matches: Match[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.MATCHES) || '[]');
    const remainingMatches = matches.filter(m => m.lost_report_id !== reportId && m.found_report_id !== reportId);
    localStorage.setItem(STORAGE_KEYS.MATCHES, JSON.stringify(remainingMatches));

    return true;
  },

  // ========================= AUTOMATIC MATCHING =============================
  triggerMatchingAlgorithm: async (newReport: Report): Promise<Match[]> => {
    const allReports = await dataService.getReports();
    const oppositeType = newReport.type === 'lost' ? 'found' : 'lost';
    const candidates = allReports.filter(r => r.type === oppositeType && r.id !== newReport.id && r.status !== 'closed');

    const generatedMatches: Match[] = [];
    const existingMatches: Match[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.MATCHES) || '[]');

    for (const candidate of candidates) {
      const lostReport = newReport.type === 'lost' ? newReport : candidate;
      const foundReport = newReport.type === 'found' ? newReport : candidate;

      const result = calculateSimilarity(lostReport, foundReport);

      if (result.score >= 60) {
        const matchRecord: Match = {
          id: `match-np-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          lost_report_id: lostReport.id,
          found_report_id: foundReport.id,
          similarity_score: result.score,
          match_reason: result.reasons,
          status: 'suggested',
          created_at: new Date().toISOString(),
          lost_report: lostReport,
          found_report: foundReport,
        };

        generatedMatches.push(matchRecord);
        existingMatches.unshift(matchRecord);

        if (result.score >= 70) {
          await dataService.createNotification({
            user_id: lostReport.user_id,
            title: 'Possible Match Found in Nepal!',
            message: `A found item "${foundReport.item_name}" matches your lost "${lostReport.item_name}" (${result.score}% similarity).`,
            type: 'match',
            link_url: '/matches'
          });

          if (foundReport.user_id !== lostReport.user_id) {
            await dataService.createNotification({
              user_id: foundReport.user_id,
              title: 'Owner Might Have Been Found!',
              message: `A lost report for "${lostReport.item_name}" may match the item you reported (${result.score}% similarity).`,
              type: 'match',
              link_url: '/matches'
            });
          }
        }
      }
    }

    localStorage.setItem(STORAGE_KEYS.MATCHES, JSON.stringify(existingMatches));
    return generatedMatches;
  },

  getMatches: async (userId?: string): Promise<Match[]> => {
    let matches: Match[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.MATCHES) || '[]');
    const reports = await dataService.getReports();

    matches = matches.map(m => ({
      ...m,
      lost_report: reports.find(r => r.id === m.lost_report_id),
      found_report: reports.find(r => r.id === m.found_report_id)
    })).filter(m => m.lost_report && m.found_report);

    if (userId) {
      matches = matches.filter(m =>
        m.lost_report?.user_id === userId || m.found_report?.user_id === userId
      );
    }

    return matches.sort((a, b) => b.similarity_score - a.similarity_score);
  },

  updateMatchStatus: async (matchId: string, status: Match['status']): Promise<Match> => {
    const matches: Match[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.MATCHES) || '[]');
    const index = matches.findIndex(m => m.id === matchId);
    if (index === -1) throw new Error('Match not found');

    matches[index].status = status;
    localStorage.setItem(STORAGE_KEYS.MATCHES, JSON.stringify(matches));
    return matches[index];
  },

  // ========================= NOTIFICATIONS =================================
  getNotifications: async (userId: string): Promise<NotificationItem[]> => {
    const list: NotificationItem[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS) || '[]');
    return list.filter(n => n.user_id === userId).sort((a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  },

  createNotification: async (notif: Omit<NotificationItem, 'id' | 'created_at' | 'is_read'>): Promise<NotificationItem> => {
    const newNotif: NotificationItem = {
      ...notif,
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      is_read: false,
      created_at: new Date().toISOString()
    };
    const list: NotificationItem[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS) || '[]');
    list.unshift(newNotif);
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(list));
    return newNotif;
  },

  markNotificationAsRead: async (id: string): Promise<void> => {
    const list: NotificationItem[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS) || '[]');
    const target = list.find(n => n.id === id);
    if (target) {
      target.is_read = true;
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(list));
    }
  },

  markAllNotificationsAsRead: async (userId: string): Promise<void> => {
    const list: NotificationItem[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS) || '[]');
    list.forEach(n => {
      if (n.user_id === userId) n.is_read = true;
    });
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(list));
  },

  // ========================= ANALYTICS ======================================
  getAnalytics: async () => {
    const reports = await dataService.getReports();
    const profiles: Profile[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROFILES) || '[]');
    const matches = await dataService.getMatches();

    const totalReports = reports.length;
    const lostItems = reports.filter(r => r.type === 'lost').length;
    const foundItems = reports.filter(r => r.type === 'found').length;
    const returnedItems = reports.filter(r => r.status === 'returned').length;
    const matchedItems = reports.filter(r => r.status === 'matched').length;
    const activeUsers = Math.max(1, profiles.length);

    const returnRate = totalReports > 0 ? Math.round((returnedItems / totalReports) * 100) : 0;

    const categoryCounts: Record<string, number> = {};
    reports.forEach(r => {
      const cat = r.category || 'other';
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });

    const categoryData = Object.entries(categoryCounts).map(([cat, count]) => ({
      name: cat.charAt(0).toUpperCase() + cat.slice(1).replace('_', ' '),
      count,
    }));

    const daysMap: Record<string, { lost: number; found: number; returned: number }> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000);
      const key = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      daysMap[key] = { lost: 0, found: 0, returned: 0 };
    }

    reports.forEach(r => {
      const d = new Date(r.created_at);
      const key = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (daysMap[key]) {
        if (r.type === 'lost') daysMap[key].lost += 1;
        if (r.type === 'found') daysMap[key].found += 1;
        if (r.status === 'returned') daysMap[key].returned += 1;
      }
    });

    const timelineData = Object.entries(daysMap).map(([day, counts]) => ({
      date: day,
      lost: counts.lost,
      found: counts.found,
      returned: counts.returned,
    }));

    return {
      totalReports,
      lostItems,
      foundItems,
      returnedItems,
      matchedItems,
      activeUsers,
      returnRate,
      categoryData,
      timelineData,
      totalMatches: matches.length,
    };
  },

  getAdminStats: async () => {
    const reports = await dataService.getReports();
    const profiles: Profile[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROFILES) || '[]');
    const matches = await dataService.getMatches();

    const pendingReviews = reports.filter(r => r.status === 'pending_review').length;
    const returnedItems = reports.filter(r => r.status === 'returned').length;

    return {
      totalUsers: profiles.length,
      totalReports: reports.length,
      pendingReviews,
      returnedItems,
      possibleMatches: matches.length,
    };
  },

  getAllUsers: async (): Promise<Profile[]> => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.PROFILES) || '[]');
  },

  uploadImage: async (file: File): Promise<string> => {
    if (isLiveSupabaseAvailable && supabase) {
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
        const filePath = `items/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('item-images')
          .upload(filePath, file);

        if (!uploadError) {
          const { data } = supabase.storage.from('item-images').getPublicUrl(filePath);
          if (data?.publicUrl) return data.publicUrl;
        }
      } catch (err) {
        console.warn('Storage upload error, falling back to data URL:', err);
      }
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const maxDim = 800;

          if (width > height && width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const compressed = canvas.toDataURL('image/jpeg', 0.85);
            resolve(compressed);
          } else {
            resolve(e.target?.result as string);
          }
        };
        img.onerror = () => resolve(e.target?.result as string);
        img.src = e.target?.result as string;
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  }
};
