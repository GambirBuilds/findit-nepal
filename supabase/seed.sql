-- ====================================================================
-- FINDIT — OPTIONAL DEVELOPMENT SEED DATA
-- [DEV SEED ONLY] — Do NOT run this in production environments!
-- Run this in the Supabase SQL Editor if you want initial test records.
-- ====================================================================

-- 1. Demo Admin and User Profiles
-- Note: In real Supabase, users are created in auth.users first.
-- This script assumes auth users already exist or can be linked.

-- Sample Reports for Demonstration & Testing
-- ID 1: Lost Black Leather Wallet
-- ID 2: Found Black Leather Wallet (Will trigger a 92%+ Smart Match!)
-- ID 3: Lost Sony Headphones
-- ID 4: Found Silver Audio Headphones
-- ID 5: Lost Campus ID Card
-- ID 6: Found Brass House Keys

-- Insert reports with sample test user UUID (replace with your real user_id after signing up):
-- e.g. 00000000-0000-0000-0000-000000000001

SELECT 'To populate seed data into your Supabase instance, register an account via the app, copy your User ID from auth.users, and run the insert statements below with your user ID.' AS notice;
