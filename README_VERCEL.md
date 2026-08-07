# Vercel Deployment & Persistence Setup Guide (Roamwork OS v3)

## Why the Lead Count Didn't Change on Vercel
Vercel hosts Next.js apps using **Serverless Functions** (ephemeral, stateless environments):
1. **In-Memory Resets**: Local JavaScript variables (`let leadsStore = [...]`) reset on cold starts.
2. **Read-Only Filesystem**: Vercel serverless functions cannot write new PDF files to local disk (`public/audits/`) at runtime.
3. **Standalone Python Scripts**: Python background scripts do not run automatically on Vercel unless triggered via Vercel Cron or an external worker (Railway).

---

## The 3-Step Solution for Vercel

### Step 1: Connect Supabase (Free Database for Persistence)
1. Create a free account at [Supabase.com](https://supabase.com/).
2. Create a new PostgreSQL database and run the SQL table script:
   ```sql
   CREATE TABLE leads (
       id SERIAL PRIMARY KEY,
       rank INT,
       business_name VARCHAR(255),
       website_url VARCHAR(255),
       score INT,
       verification_status VARCHAR(50) DEFAULT 'PENDING_VERIFICATION',
       primary_signal TEXT,
       evidence_source TEXT,
       custom_pitch TEXT,
       pdf_drive_url TEXT,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```
3. Copy your Supabase `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` into your Vercel Project Environment Variables.

### Step 2: Enable Vercel Cron (Automated 5-Hour Audit Trigger)
This project includes a pre-configured `vercel.json` with a 5-hour Cron trigger:
```json
{
  "version": 2,
  "crons": [
    {
      "path": "/api/cron",
      "schedule": "0 */5 * * *"
    }
  ]
}
```
* Every 5 hours (`0 */5 * * *`), Vercel will automatically ping `/api/cron`, run live PageSpeed audits, and insert newly discovered leads into your Supabase database.

### Step 3: Redeploy to Vercel
In your terminal or via GitHub push:
```bash
git add .
git commit -m "Configure Vercel Cron & Supabase persistence"
git push origin main
```
Or via Vercel CLI:
```bash
vercel --prod
```
