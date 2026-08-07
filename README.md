# Global Revenue Intelligence Engine (GRIE) OS v3

> **Internal AI-Powered Business Opportunity Discovery, 360° Technical Audit & Dynamic Proposal Engine**  
> *Built for RoamWork Technologies (`https://www.roamwork.in/`)*

---

## 🌟 Executive Overview

**Global Revenue Intelligence Engine (GRIE)** is an enterprise SaaS-ready internal platform designed to discover high-value businesses globally, evaluate their technical and digital vulnerabilities, convert weaknesses into high-impact project opportunities, and generate tailored client outreach pitches, executive teaser audit PDFs, and formal 5-page Statements of Work (SOW).

---

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router) + React 18
- **Language**: TypeScript & Node.js
- **Styling**: TailwindCSS & Custom CSS Design System (Slate Dark Mode)
- **Database**: Supabase PostgreSQL (`@supabase/supabase-js`)
- **PDF Engine**: Executive Teaser Audit Route (`/audits/[domain]`) & ReportLab Python Engine (`scripts/pdf_generator.py`)
- **Deployment**: Vercel Serverless + Vercel Cron Jobs

---

## ✨ Features & Architecture

1. **Automated Buyer-Intent Lead Discovery**:
   - Discovers high-potential healthcare, e-commerce, and software businesses.
   - Calculates country-aware valuations:
     - **US / UK / EU / UAE**: `$3,500 – $8,000+`
     - **India**: `₹35,000 – ₹95,000 ($500 – $1,200)`

2. **360° Technical & PageSpeed Quality Scan**:
   - Evaluates mobile Lighthouse PageSpeed scores, LCP load delays, payload sizes, accessibility contrast errors, and Google PageSpeed proof links.
   - Detects SSL validity, HTTP Security Headers (HSTS, CSP, X-Frame-Options), and tracking tags (GA4 `gtag.js`, Meta Pixel).

3. **Automated Tech Stack Classifier**:
   - Classifies target infrastructure into **Shopify / D2C Commerce**, **WordPress / Healthcare CMS**, **Next.js / TypeScript App**, or **Custom Infrastructure**.

4. **Executive Teaser Audit PDF Generator (`/audits/[domain]`)**:
   - Generates pixel-perfect per-lead PDF audit reports featuring official **RoamWork Technologies** agency branding, contact credentials, PageSpeed proof links, and a **"Before vs. After Optimization"** impact preview (**34/100 ➔ 94/100 PageSpeed**, **5.4s ➔ 0.9s Load Time**).

5. **5-Page Formal Proposal & Statement of Work (`/proposals/[domain]`)**:
   - Generates formal proposals with a 3-Phase deliverable scope, payment milestones (40/40/20), SLA performance guarantees, client sign-off signature block, and live currency switching (**USD $**, **EUR €**, **GBP £**, **AED AED**, **INR ₹**).

6. **Dedicated Client Directory & Pipeline (`/clients`)**:
   - Filterable CRM pipeline with assignable Client Email, WhatsApp Number, and LinkedIn Profile URL.
   - **1-Click Targeted Dispatch**:
     - 💬 **WhatsApp**: Opens `https://api.whatsapp.com/send?phone={phone}&text={pitch}` directly targeting the client's phone.
     - ✉️ **Gmail**: Opens `mailto:{email}?subject=...` pre-filled with the audit pitch targeting the client.
     - 💼 **LinkedIn**: Copies tailored pitch and opens the client's LinkedIn company page.
   - **1-Click CSV Pipeline Exporter**: Export client records and financial pipeline data into CSV.
   - **Real-Time Instant Search Bar**: Search by domain, business name, framework, or country.
   - **Bulk Pipeline Checkbox Manager**: Select multiple rows to bulk update CRM stages (*Approved*, *Contacted*, *Proposal Sent*, *Converted*).

7. **320px Mobile Responsiveness**:
   - Tested down to 320px screens (Mobile S viewports) with a collapsible drawer menu and responsive grid layouts.

---

## 🚀 Environment Setup & Local Development

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/Arulkumaran-2001/lead-automation-tool.git
cd lead-automation-tool
npm install
```

### 2. Configure Environment Variables (`.env.local`)
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=https://mkqynvcfmifpizacfiiz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Custom Subdomain Setup (`grie.roamwork.in`)

To route report links directly through your agency domain:
1. Go to **Vercel Project Settings** ➔ **Domains** ➔ Add `grie.roamwork.in`.
2. In your DNS provider for `roamwork.in`, create a `CNAME` record:
   - **Type**: `CNAME`
   - **Name**: `grie`
   - **Target**: `cname.vercel-dns.com`

---

## 📄 Agency Contact Reference

- **Agency Name**: RoamWork Technologies
- **Website**: [https://www.roamwork.in/](https://www.roamwork.in/)
- **Email**: `roamwork.techs@gmail.com`
- **WhatsApp / Phone**: `+91 96557 98100`
- **Address**: VOC Street, T.Nagar, Chennai, Tamil Nadu 600017, India
