-- ====================================================================
-- FINDIT — LOST & FOUND PLATFORM
-- Complete PostgreSQL Database Schema & Security Policies for Supabase
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUM TYPES
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('user', 'admin');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE report_type AS ENUM ('lost', 'found');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE report_status AS ENUM ('active', 'matched', 'returned', 'closed', 'pending_review');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE match_status AS ENUM ('suggested', 'accepted', 'rejected');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 3. PROFILES TABLE (Linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  avatar_url TEXT,
  role user_role DEFAULT 'user'::user_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Seed Categories
INSERT INTO public.categories (id, name, icon)
VALUES
  ('electronics', 'Electronics', 'Smartphone'),
  ('wallet', 'Wallet', 'Wallet'),
  ('keys', 'Keys', 'Key'),
  ('documents', 'Documents', 'FileText'),
  ('bag', 'Bag', 'Briefcase'),
  ('clothing', 'Clothing', 'Shirt'),
  ('jewelry', 'Jewelry', 'Watch'),
  ('accessories', 'Accessories', 'Glasses'),
  ('books', 'Books', 'Book'),
  ('id_card', 'ID Card', 'CreditCard'),
  ('other', 'Other', 'Package')
ON CONFLICT (id) DO NOTHING;

-- 5. REPORTS TABLE
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  type report_type NOT NULL,
  item_name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  date_occurred DATE NOT NULL,
  contact_email TEXT NOT NULL,
  image_url TEXT,
  status report_status DEFAULT 'active'::report_status NOT NULL,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Indexes for search & filtering
CREATE INDEX IF NOT EXISTS idx_reports_type_status ON public.reports(type, status);
CREATE INDEX IF NOT EXISTS idx_reports_category ON public.reports(category);
CREATE INDEX IF NOT EXISTS idx_reports_user_id ON public.reports(user_id);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON public.reports(created_at DESC);

-- 6. MATCHES TABLE
CREATE TABLE IF NOT EXISTS public.matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lost_report_id UUID REFERENCES public.reports(id) ON DELETE CASCADE NOT NULL,
  found_report_id UUID REFERENCES public.reports(id) ON DELETE CASCADE NOT NULL,
  similarity_score NUMERIC(5,2) NOT NULL,
  match_reason TEXT[] NOT NULL DEFAULT '{}',
  status match_status DEFAULT 'suggested'::match_status NOT NULL,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  CONSTRAINT unique_match_pair UNIQUE (lost_report_id, found_report_id)
);

CREATE INDEX IF NOT EXISTS idx_matches_lost ON public.matches(lost_report_id);
CREATE INDEX IF NOT EXISTS idx_matches_found ON public.matches(found_report_id);

-- 7. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'system' NOT NULL,
  is_read BOOLEAN DEFAULT FALSE NOT NULL,
  link_url TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON public.notifications(user_id, is_read);

-- 8. TRIGGER: Automatic Profile Creation on Supabase Auth Signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.email,
    'user'::user_role
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 9. ROW LEVEL SECURITY (RLS) POLICIES

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Helper to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'::user_role
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- PROFILES POLICIES
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- CATEGORIES POLICIES
CREATE POLICY "Categories viewable by everyone"
  ON public.categories FOR SELECT USING (true);

-- REPORTS POLICIES
CREATE POLICY "Reports viewable by all users"
  ON public.reports FOR SELECT
  USING (status != 'pending_review' OR auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Authenticated users can create reports"
  ON public.reports FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reports"
  ON public.reports FOR UPDATE
  USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can delete their own reports or admins"
  ON public.reports FOR DELETE
  USING (auth.uid() = user_id OR public.is_admin());

-- MATCHES POLICIES
CREATE POLICY "Users can view matches related to their reports or admins"
  ON public.matches FOR SELECT
  USING (
    public.is_admin() OR
    EXISTS (
      SELECT 1 FROM public.reports r
      WHERE (r.id = matches.lost_report_id OR r.id = matches.found_report_id)
        AND r.user_id = auth.uid()
    )
  );

CREATE POLICY "System/Users can insert matches"
  ON public.matches FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update matches on their reports"
  ON public.matches FOR UPDATE
  USING (
    public.is_admin() OR
    EXISTS (
      SELECT 1 FROM public.reports r
      WHERE (r.id = matches.lost_report_id OR r.id = matches.found_report_id)
        AND r.user_id = auth.uid()
    )
  );

-- NOTIFICATIONS POLICIES
CREATE POLICY "Users can view their own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications (mark read)"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- 10. STORAGE BUCKET FOR ITEM IMAGES
-- (Run in Supabase Dashboard -> Storage or via script)
INSERT INTO storage.buckets (id, name, public)
VALUES ('item-images', 'item-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Item images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'item-images');

CREATE POLICY "Authenticated users can upload item images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'item-images' AND auth.role() = 'authenticated');
