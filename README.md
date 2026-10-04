# FindIt — Modern Lost & Found Management Platform

> **"Find what matters. Return what belongs."**

FindIt is a production-ready, full-featured Lost & Found management platform designed for universities, corporate campuses, transit systems, and community hubs. It provides secure reporting, privacy-first community inquiries, multi-factor smart similarity matching, progress lifecycle tracking, real-time analytics, and role-based administrative moderation.

<img width="1919" height="913" alt="image" src="https://github.com/user-attachments/assets/51d2acae-916d-4a55-b796-beee6949f213" />

---

## 🚀 Key Features

### For Users

- **Report Lost Items:** Comprehensive declaration form with category selection, timeline input, detailed descriptions, last seen locations, and drag-and-drop photo attachment.
- **Report Found Items:** Clean logging flow for found property with secure contact masking to prevent scrapers or false claims.
- **Browse & Discovery:** Filter by Lost/Found status, category shortcuts, geographic location, date, and keyword search with tabular density.
- **Item Lifecycle Tracking:** Visual step tracker displaying progress:
  - _Lost:_ Reported ➔ Searching ➔ Possible Match ➔ Confirmed ➔ Returned ➔ Closed.
  - _Found:_ Reported ➔ Searching Owner ➔ Possible Match ➔ Confirmed ➔ Returned ➔ Closed.
- **AI-Assisted Smart Matching:** Multi-factor similarity scoring (0–100%) evaluating title keywords, category consistency, description tokens, geographic proximity, and date closeness.
- **Privacy-Preserving Contact Relay:** Reach listing owners through controlled in-platform messaging without exposing private email addresses publicly.
- **Notifications System:** Real-time in-app alerts when high-confidence matches (>= 70%) or status updates occur.
- **Dark Mode Support:** Fully responsive dark/light mode with persisted user preference.

### For Administrators

- **Executive Metric Dashboard:** Total users, total active reports, pending moderation reviews, reconciled returns, and match pairs.
- **Listing Governance:** Review flagged or suspicious listings, approve pending reports, change statuses, or delete inappropriate content with confirmation safeguards.
- **User Auditing:** View registered users, roles, and registration timelines.

---

## 🛠 Tech Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4
- **Routing:** React Router v7
- **Icons & Visuals:** Lucide React, Canvas Confetti
- **Forms & Validation:** React Hook Form, Zod
- **Data Visualization:** Recharts
- **Backend / Database:** Supabase (PostgreSQL, Row Level Security, Auth, Storage)
- **Fallback Engine:** Resilient client-side persistent storage adapter for offline testing and zero-friction demonstration.

---

## 📁 Project Directory Structure

```text
├── supabase/
│   ├── schema.sql
│   └── seed.sql
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── ConfirmDialog.tsx
│   │   ├── EmptyState.tsx
│   │   ├── Footer.tsx
│   │   ├── ImageUploader.tsx
│   │   ├── ItemCard.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── Navbar.tsx
│   │   ├── NotificationDropdown.tsx
│   │   ├── ProtectedRoute.tsx
│   │   ├── StatusBadge.tsx
│   │   └── Toast.tsx
│   ├── hooks/
│   │   ├── useAuth.tsx
│   │   ├── useNotifications.ts
│   │   └── useTheme.tsx
│   ├── lib/
│   │   ├── matching.ts
│   │   ├── supabase.ts
│   │   └── validation.ts
│   ├── pages/
│   │   ├── Admin.tsx
│   │   ├── Analytics.tsx
│   │   ├── Browse.tsx
│   │   ├── ForgotPassword.tsx
│   │   ├── Home.tsx
│   │   ├── ItemDetails.tsx
│   │   ├── Login.tsx
│   │   ├── Matches.tsx
│   │   ├── NotFound.tsx
│   │   ├── Profile.tsx
│   │   ├── Register.tsx
│   │   ├── ReportFound.tsx
│   │   ├── ReportLost.tsx
│   │   └── TrackItems.tsx
│   ├── types/
│   │   └── database.ts
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── .env.example
└── package.json
```

---

## ⚡ Installation & Local Development

### 1. Clone & Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🗄 Supabase Setup & Deployment

To connect FindIt to your live Supabase cloud database:

1. **Create a Supabase Project:**
   Visit [supabase.com](https://supabase.com) and create a new project.
2. **Execute Schema SQL:**
   Open the **SQL Editor** in your Supabase project dashboard, open the file `supabase/schema.sql`, and execute it. This script sets up:
   - Tables: `profiles`, `reports`, `matches`, `notifications`, `categories`.
   - Automated trigger to create user profiles upon Supabase Auth sign-up.
   - Row Level Security (RLS) policies ensuring users can only edit their own reports while admins have full moderation rights.
3. **Storage Bucket:**
   Under **Storage**, verify the bucket `item-images` is created as a public bucket (the SQL script includes the bucket configuration and public read policy).
4. **Copy API Keys:**
   Copy the `Project URL` and `anon public key` from **Project Settings ➔ API** into your `.env` or Vercel Environment Variables.

---

## 🚢 Production Build & Vercel Deployment

### Build the Application

```bash
npm run build
```

This generates an optimized production bundle inside the `dist/` directory.

### Preview Production Build Locally

```bash
npm run preview
---

---

## 🧪 Testing & Verification Guide

1. **Guest Browsing:** Navigate to `/browse` to test keyword searches, category filters, and sorting.
2. **Instant Role Switching:** In the footer, click `Demo User (Alex)` or `Demo Admin (Sarah)` to test user tracking or admin features without having to register first.
3. **Smart Matching Verification:**
   - Go to `/report/lost` and report a "Black Leather Wallet" lost in "Library".
   - Notice the system automatically pairs it with existing found wallets, updates the match registry at `/matches`, and creates an in-app notification with a similarity score (e.g. 92%).
4. **Item Lifecycle Tracking:** Open `/track` to view the stage tracker and mark items as "Returned" (triggers celebratory confetti and updates database analytics).
5. **Zero-Data State Testing:** In the footer, click `Clear DB (0 data)` to test the clean zero-count statistics on the landing page and empty states across browse and track views. Click `Reload Demo Data` to restore demo items.
```
