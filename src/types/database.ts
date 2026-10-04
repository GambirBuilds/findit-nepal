export type UserRole = 'user' | 'admin';

export type ReportType = 'lost' | 'found';

export type ReportStatus = 'active' | 'matched' | 'returned' | 'closed' | 'pending_review';

export type MatchStatus = 'suggested' | 'accepted' | 'rejected';

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string | null;
  role: UserRole;
  created_at: string;
  updated_at?: string;
}

export interface Report {
  id: string;
  user_id: string;
  type: ReportType;
  item_name: string;
  category: string;
  description: string;
  location: string;
  date_occurred: string;
  contact_email: string;
  image_url?: string | null;
  status: ReportStatus;
  created_at: string;
  updated_at?: string;
  user?: Profile; // expanded relation
}

export interface Match {
  id: string;
  lost_report_id: string;
  found_report_id: string;
  similarity_score: number;
  match_reason: string[];
  status: MatchStatus;
  created_at: string;
  lost_report?: Report;
  found_report?: Report;
}

export interface NotificationItem {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'match' | 'status_change' | 'system' | 'admin';
  is_read: boolean;
  link_url?: string;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  description?: string;
}

export const CATEGORIES_LIST: { id: string; name: string; nameNe?: string; icon: string }[] = [
  { id: 'citizenship', name: 'Citizenship (नागरिकता)', nameNe: 'नागरिकता प्रमाणपत्र', icon: 'CreditCard' },
  { id: 'bluebook', name: 'Vehicle Bluebook (ब्लुबुक)', nameNe: 'सवारी दर्ता किताब (ब्लुबुक)', icon: 'Book' },
  { id: 'license', name: 'Driving License (लाइसेन्स)', nameNe: 'सवारी चालक अनुमतिपत्र', icon: 'FileText' },
  { id: 'nid', name: 'National ID / PAN Card', nameNe: 'राष्ट्रिय परिचयपत्र / प्यान', icon: 'CreditCard' },
  { id: 'electronics', name: 'Mobile / Laptop / Gadgets', nameNe: 'मोबाइल / ल्यापटप / ग्याजेट्स', icon: 'Smartphone' },
  { id: 'wallet', name: 'Wallet / Purse / ATM Cards', nameNe: 'वालेट / पर्स / बैंक कार्ड', icon: 'Wallet' },
  { id: 'keys', name: 'Motorbike / Vehicle Keys', nameNe: 'मोटरसाइकल / गाडीको चाबी', icon: 'Key' },
  { id: 'bag', name: 'Bag / Backpack / Luggage', nameNe: 'झोला / ब्याकप्याक', icon: 'Briefcase' },
  { id: 'documents', name: 'Academic / Official Certificates', nameNe: 'शैक्षिक / आधिकारिक कागजात', icon: 'FileText' },
  { id: 'jewelry', name: 'Jewelry / Watch', nameNe: 'गरगहना / घडी', icon: 'Watch' },
  { id: 'clothing', name: 'Clothing / Apparel', nameNe: 'कपडा / पोसाक', icon: 'Shirt' },
  { id: 'other', name: 'Other Belongings', nameNe: 'अन्य सामग्री', icon: 'Package' },
];

export interface ReportFilters {
  searchQuery?: string;
  type?: 'all' | 'lost' | 'found';
  category?: string;
  location?: string;
  status?: string;
  sortBy?: 'newest' | 'oldest' | 'relevant';
}
