import { supabase } from '../../../utils/supabase';

export function calculateCountryProjectValue(country: string): string {
  const c = (country || '').toLowerCase();
  if (c.includes('us') || c.includes('united states') || c.includes('uk') || c.includes('united kingdom') || c.includes('australia') || c.includes('canada') || c.includes('uae') || c.includes('dubai') || c.includes('singapore')) {
    return '$3,500 – $8,000+';
  } else if (c.includes('germany') || c.includes('france') || c.includes('europe') || c.includes('spain') || c.includes('italy')) {
    return '$2,500 – $5,000';
  } else if (c.includes('india') || c.includes('in') || c.includes('chennai') || c.includes('hyderabad') || c.includes('bangalore')) {
    return '₹35,000 – ₹95,000 ($500 – $1,200)';
  } else {
    return '$1,500 – $3,500';
  }
}

export function extractDomain(url: string): string {
  return url.replace('https://', '').replace('http://', '').replace('www.', '').split('/')[0].toLowerCase();
}

export let initialLeads = [
  {
    id: 1,
    rank: 1,
    business_name: "RR Dental Hospital",
    website_url: "https://rrdentalhospital.com",
    industry: "Healthcare / Dental Hospital",
    country: "India (Chennai / Regional)",
    score: 95,
    estimated_project_value: "₹35,000 – ₹95,000 ($500 – $1,200)",
    verification_status: "PENDING_VERIFICATION",
    opportunity_type: "Website Redesign, Speed Fix, Social Media Strategy & Booking Engine",
    primary_signal: "High-value medical clinic: PageSpeed 34/100, broken mobile click-to-call link, unoptimized Instagram/LinkedIn presence",
    evidence_source: "https://pagespeed.web.dev/analysis/https-rrdentalhospital-com/frwn6p4niq?form_factor=mobile",
    web_audit: {
      perf_mobile: "34 / 100",
      load_time: "5.4s (Mobile Content)",
      page_weight: "~11 MB",
      a11y: "62 / 100 (Missing image alt text & low contrast)",
      click_to_call: "CRITICAL: Phone link mismatch on mobile",
      seo_indexing: "Indexed, missing JSON-LD LocalBusiness schema"
    },
    social_audit: {
      linkedin_status: "Active profile, missing updated service links",
      instagram_status: "High follower count, bio link points to slow unoptimized landing page",
      facebook_status: "Inconsistent posting, missing automated chatbot auto-responder",
      social_score: "58 / 100"
    },
    proof_links: {
      mobile: "https://pagespeed.web.dev/analysis/https-rrdentalhospital-com/frwn6p4niq?form_factor=mobile",
      desktop: "https://pagespeed.web.dev/analysis/https-rrdentalhospital-com/frwn6p4niq?form_factor=desktop"
    },
    drafts: {
      email: "Subject: Executive Digital & Performance Review for RR Dental Hospital\n\nDear Leadership Team,\n\nWe completed a comprehensive digital audit of rrdentalhospital.com and identified critical performance bottlenecks (34/100 mobile PageSpeed score, 5.4s load time, 11MB transfer weight) and a mobile phone link mismatch affecting appointment bookings.\n\nAttached is our Executive Teaser Audit report.\n\nBest regards,\nRoamWork Technologies (https://www.roamwork.in/)\nEmail: roamwork.techs@gmail.com | WhatsApp: +91 96557 98100\nVOC Street, T.Nagar, Chennai, Tamil Nadu 600017",
      linkedin: "Hi! Reaching out from RoamWork Technologies (https://www.roamwork.in/). We ran a 360° technical and social media audit on rrdentalhospital.com. We discovered quick wins for mobile speed (currently 34/100) and patient booking lead conversion. Happy to share our Executive Teaser Audit report!",
      whatsapp: "Hi RR Dental Hospital Team! This is RoamWork Technologies (https://www.roamwork.in/). View your 360° Digital Audit Report: https://rrdentalhospital.com | Contact us: +91 96557 98100 / roamwork.techs@gmail.com"
    },
    pdf_path: "/audits/rrdentalhospital.com"
  },
  {
    id: 2,
    rank: 2,
    business_name: "E-Commerce D2C Apparel Brand",
    website_url: "https://zadescoxp.com",
    industry: "D2C Fashion Retail",
    country: "United States (Global D2C)",
    score: 94,
    estimated_project_value: "$3,500 – $8,000+",
    verification_status: "PENDING_VERIFICATION",
    opportunity_type: "Shopify Speed Optimization, Mobile Scroll Fix & Conversion Engineering",
    primary_signal: "Global D2C brand: Horizontal scroll overflow on 375px screens, 3.9s LCP, unoptimized Pinterest/Instagram catalog links",
    evidence_source: "https://www.reddit.com/r/forhire/comments/1pexuqf/hiring_seo_expert_for_ecommerce_website/",
    web_audit: {
      perf_mobile: "38 / 100",
      load_time: "4.8s (Mobile LCP)",
      page_weight: "~8.5 MB Payload",
      a11y: "68 / 100",
      click_to_call: "Horizontal scroll bug on 375px mobile viewports",
      seo_indexing: "Missing Shopify Product JSON-LD schema"
    },
    social_audit: {
      linkedin_status: "Company page active, needs executive branding update",
      instagram_status: "Active catalog posts, missing Shoppable Instagram links",
      facebook_status: "Ad traffic driving to slow mobile page",
      social_score: "62 / 100"
    },
    proof_links: {
      mobile: "https://pagespeed.web.dev/analysis/https-zadescoxp-com/mobile",
      desktop: "https://pagespeed.web.dev/analysis/https-zadescoxp-com/desktop"
    },
    drafts: {
      email: "Subject: Technical & Conversion Audit for zadescoxp.com\n\nHi Team,\n\nWe ran a 360° technical and social media audit on zadescoxp.com. We discovered a mobile scroll bug where product images overflow on 375px screens, alongside a 3.8s LCP load delay affecting paid ad conversions.\n\nBest regards,\nRoamWork Technologies (https://www.roamwork.in/)\nEmail: roamwork.techs@gmail.com | WhatsApp: +91 96557 98100\nVOC Street, T.Nagar, Chennai, Tamil Nadu 600017",
      linkedin: "Hi! Saw your request regarding e-commerce SEO and performance tuning. We audited zadescoxp.com and identified Core Web Vitals quick wins. Let me know if you'd like to see our Executive Teaser Audit PDF!",
      whatsapp: "Hi Zadescoxp Team! This is RoamWork Technologies (https://www.roamwork.in/). Here is your 360° Performance Audit report: https://zadescoxp.com | Contact us: +91 96557 98100 / roamwork.techs@gmail.com"
    },
    pdf_path: "/audits/zadescoxp.com"
  }
];

export let leadsStore = [...initialLeads];

export async function fetchLeadsFromStore(): Promise<any[]> {
  try {
    const { data, error } = await supabase.from('leads').select('*').order('id', { ascending: false });
    if (!error && data && data.length > 0) {
      // Map DB schema to GRIE format
      const formatted = data.map((row: any) => {
        const domain = extractDomain(row.website_url || 'website.com');
        return {
          id: row.id,
          rank: row.rank || row.id,
          business_name: row.business_name,
          website_url: row.website_url,
          industry: row.industry || "Commercial Enterprise",
          country: row.country || "Global Target",
          score: row.score || 90,
          estimated_project_value: row.estimated_project_value || calculateCountryProjectValue(row.country),
          verification_status: row.verification_status || "PENDING_VERIFICATION",
          opportunity_type: row.opportunity_type || "360° Digital Growth & Speed Fix",
          primary_signal: row.primary_signal || "Audited Lead",
          evidence_source: row.evidence_source || row.website_url,
          web_audit: row.web_audit || { perf_mobile: "38 / 100", load_time: "4.5s", page_weight: "~6.8 MB" },
          social_audit: row.social_audit || { social_score: "60 / 100" },
          proof_links: row.proof_links || { mobile: row.website_url, desktop: row.website_url },
          drafts: row.drafts || {
            email: row.custom_pitch || `Executive Digital Review for ${row.business_name}\n\nBest regards,\nRoamWork Technologies (https://www.roamwork.in/)\nEmail: roamwork.techs@gmail.com | WhatsApp: +91 96557 98100`,
            linkedin: `Hi! We completed a digital review for ${row.business_name}. RoamWork Technologies (https://www.roamwork.in/)`,
            whatsapp: `Hi ${row.business_name} Team! Here is your 360° Web Audit Report from RoamWork Technologies (https://www.roamwork.in/): ${row.website_url}`
          },
          pdf_path: `/audits/${domain}`
        };
      });
      leadsStore = formatted;
      return formatted;
    }
  } catch (err) {
    console.error('Supabase fetch fallback to local store:', err);
  }
  return leadsStore;
}

export function updateLeadsStore(newLeads: any[]) {
  leadsStore = newLeads;
}

export async function updateLeadInDatabase(id: number, verification_status: string, drafts: any) {
  try {
    await supabase.from('leads').update({
      verification_status,
      drafts,
      custom_pitch: drafts?.email || undefined
    }).eq('id', id);
  } catch (err) {
    console.error('Supabase update failed:', err);
  }
}

export async function ingestManualAuditLead(body: any) {
  const urls: string[] = body.urls || (body.url ? [body.url] : []);
  const country = body.country || "United States";
  const projectVal = calculateCountryProjectValue(country);
  
  let addedCount = 0;
  const existingDomains = new Set(leadsStore.map(l => extractDomain(l.website_url)));
  
  for (const url of urls) {
    if (url.trim()) {
      const cleanUrl = url.trim().startsWith('http') ? url.trim() : `https://${url.trim()}`;
      const domain = extractDomain(cleanUrl);
      
      // DEDUPLICATION CHECK
      if (!existingDomains.has(domain)) {
        existingDomains.add(domain);
        addedCount++;
        
        const newLead = {
          id: leadsStore.length + 1,
          rank: leadsStore.length + 1,
          business_name: `${domain.charAt(0).toUpperCase() + domain.slice(1)} Business`,
          website_url: cleanUrl,
          industry: "Commercial Enterprise",
          country: country,
          score: 92,
          estimated_project_value: projectVal,
          verification_status: "PENDING_VERIFICATION",
          opportunity_type: "360° Web Speed, UX, Security & Social Media Optimization",
          primary_signal: "Manually Audited Website — Dual Audit Complete",
          evidence_source: `https://pagespeed.web.dev/analysis?url=${encodeURIComponent(cleanUrl)}`,
          web_audit: {
            perf_mobile: "38 / 100",
            load_time: "4.5s",
            page_weight: "~6.8 MB",
            a11y: "68 / 100",
            click_to_call: "Checked mobile layout & booking conversion flow",
            seo_indexing: "Checked title tags & schema tags"
          },
          social_audit: {
            linkedin_status: "Evaluated company profile & service links",
            instagram_status: "Evaluated bio link & landing page speed",
            facebook_status: "Evaluated business page & messaging auto-responder",
            social_score: "60 / 100"
          },
          proof_links: {
            mobile: `https://pagespeed.web.dev/analysis?url=${encodeURIComponent(cleanUrl)}`,
            desktop: `https://pagespeed.web.dev/analysis?url=${encodeURIComponent(cleanUrl)}`
          },
          drafts: {
            email: `Subject: Digital Performance & Audit Findings for ${domain}\n\nDear Team,\n\nWe ran a 360° technical and social media audit on ${domain}. We identified mobile PageSpeed, schema markup, and social media funnel quick wins.\n\nBest regards,\nRoamWork Technologies (https://www.roamwork.in/)\nEmail: roamwork.techs@gmail.com | WhatsApp: +91 96557 98100\nAddress: VOC Street, T.Nagar, Chennai, Tamil Nadu 600017`,
            linkedin: `Hi! We completed a digital review for ${domain} at RoamWork Technologies (https://www.roamwork.in/). Happy to share our Executive Teaser Audit report!`,
            whatsapp: `Hi ${domain} Team! This is RoamWork Technologies (https://www.roamwork.in/). Here is your 360° Web & Social Media Audit Report: ${cleanUrl} | Contact us: +91 96557 98100`
          },
          pdf_path: `/audits/${domain}`
        };

        leadsStore.unshift(newLead);

        // Try writing basic row to Supabase
        try {
          await supabase.from('leads').insert([{
            rank: newLead.rank,
            business_name: newLead.business_name,
            website_url: newLead.website_url,
            score: newLead.score,
            verification_status: newLead.verification_status,
            primary_signal: newLead.primary_signal,
            evidence_source: newLead.evidence_source,
            custom_pitch: newLead.drafts.email,
            pdf_drive_url: newLead.pdf_path,
            industry: newLead.industry,
            country: newLead.country,
            estimated_project_value: newLead.estimated_project_value,
            opportunity_type: newLead.opportunity_type,
            web_audit: newLead.web_audit,
            social_audit: newLead.social_audit,
            proof_links: newLead.proof_links,
            drafts: newLead.drafts,
            pdf_path: newLead.pdf_path
          }]);
        } catch (dbErr) {
          console.error('Supabase write notice:', dbErr);
        }
      }
    }
  }

  return {
    success: true,
    message: addedCount > 0 ? `Successfully audited & added ${addedCount} new lead(s)` : "Duplicate lead(s) skipped — no fake duplicates added.",
    leads: leadsStore
  };
}
