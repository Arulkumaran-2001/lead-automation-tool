import { NextResponse } from 'next/server';

let leadsStore = [
  {
    id: 1,
    rank: 1,
    business_name: "RR Dental Hospital",
    website_url: "https://rrdentalhospital.com",
    industry: "Healthcare / Dental Hospital",
    location: "Chennai, TN, India",
    score: 95,
    verification_status: "PENDING_VERIFICATION",
    primary_signal: "Public Lead: 25+ yrs operating, 1,884+ reviews (4.9★), but PageSpeed 34/100 & 11MB Homepage",
    evidence_source: "https://pagespeed.web.dev/analysis/https-rrdentalhospital-com/frwn6p4niq?form_factor=mobile",
    audit_findings: {
      perf_mobile: "34 / 100 (Google Lighthouse)",
      load_time: "5.4s (Mobile Content Visible)",
      page_weight: "~11 MB Homepage Total Weight",
      a11y: "62 / 100 (Missing image alt text & contrast issues)",
      click_to_call: "CRITICAL: Click-to-call number link mismatch (losing call leads)"
    },
    proof_links: {
      mobile: "https://pagespeed.web.dev/analysis/https-rrdentalhospital-com/frwn6p4niq?form_factor=mobile",
      desktop: "https://pagespeed.web.dev/analysis/https-rrdentalhospital-com/frwn6p4niq?form_factor=desktop"
    },
    custom_pitch: "Hi! I was reviewing RR Dental Hospital's website (rrdentalhospital.com) and noticed your Google PageSpeed score is currently 34/100 on mobile, with a 5.4s load time and an 11MB homepage payload. Also, your mobile click-to-call link has a phone number mismatch. We compiled a short Executive Teaser Audit with quick wins.",
    pdf_path: "/audits/RR_Dental_Hospital_Teaser_Audit.pdf"
  },
  {
    id: 2,
    rank: 2,
    business_name: "E-Commerce D2C Apparel Brand",
    website_url: "https://zadescoxp.com",
    industry: "D2C Fashion Retail",
    location: "US / Remote",
    score: 94,
    verification_status: "PENDING_VERIFICATION",
    primary_signal: "Public Hiring Post: 'SEO Expert for E-commerce website'",
    evidence_source: "https://www.reddit.com/r/forhire/comments/1pexuqf/hiring_seo_expert_for_ecommerce_website/",
    audit_findings: {
      perf_mobile: "38 / 100 (High Latency)",
      load_time: "4.8s (Mobile LCP)",
      page_weight: "~8.5 MB Payload",
      a11y: "68 / 100 (Contrast & ARIA gaps)",
      click_to_call: "Horizontal scroll overflow on 375px screens"
    },
    proof_links: {
      mobile: "https://pagespeed.web.dev/analysis/https-zadescoxp-com/mobile",
      desktop: "https://pagespeed.web.dev/analysis/https-zadescoxp-com/desktop"
    },
    custom_pitch: "Hi! I noticed a mobile scroll issue on zadescoxp.com where products overflow on 375px screens. We ran a 360 audit and identified quick wins for Core Web Vitals speed and schema indexation.",
    pdf_path: "/audits/rrdentalhospital_com_Teaser_Audit.pdf"
  }
];

export async function GET() {
  return NextResponse.json({ success: true, leads: leadsStore });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { id, verification_status, custom_pitch } = body;
  
  leadsStore = leadsStore.map(lead => {
    if (lead.id === id) {
      return {
        ...lead,
        verification_status: verification_status || lead.verification_status,
        custom_pitch: custom_pitch || lead.custom_pitch
      };
    }
    return lead;
  });

  return NextResponse.json({ success: true, message: "Lead updated successfully", leads: leadsStore });
}
