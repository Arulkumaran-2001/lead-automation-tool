# Roamwork OS — Lead Generation & Digital Growth CRM Platform

## Local Testing Instructions (On Your Machine)

1. **Navigate to the Project Directory**:
   ```bash
   cd roamwork-os-app
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Run Next.js Local Development Server**:
   ```bash
   npm run dev
   ```
   * Open `http://localhost:3000` in your web browser to test the interactive Dashboard, 360° Audit Inspector, and WhatsApp/Email outreach controls.

4. **Run 5-Hour Audit Engine Manually**:
   ```bash
   python3 scripts/audit_engine.py https://zadescoxp.com
   ```

---

## Deploying to Vercel (Production Cloud Showcase)

Once local testing is complete, deploy the application to Vercel in 3 simple steps:

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy Application**:
   ```bash
   vercel --prod
   ```
   * Vercel will build the project and provide a live public URL (e.g., `https://roamwork-os.vercel.app`) to showcase the platform.
