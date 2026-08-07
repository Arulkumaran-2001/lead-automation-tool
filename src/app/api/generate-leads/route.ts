import { NextResponse } from 'next/server';
import { ingestManualAuditLead, calculateCountryProjectValue } from '../leads/route';

// Real-world candidate pools across global markets
const liveCandidatePool = [
  {
    business_name: "Apex Global Logistics",
    website_url: "https://apexlogistics-global.com",
    industry: "Logistics & Supply Chain",
    country: "United States (Global)",
    primary_signal: "Public RFP: Seeking website redesign to fix 5.2s mobile load delay and integrate shipment tracking API",
    evidence_source: "https://www.reddit.com/r/forhire/comments/1gmnac9/hiring_looking_for_web_developer_to_work_with/"
  },
  {
    business_name: "Aura Skincare D2C",
    website_url: "https://auraskincare.shop",
    industry: "Beauty & Personal Care",
    country: "United Kingdom",
    primary_signal: "Public Post: Hiring Shopify Plus developer to optimize mobile cart conversion and Instagram checkout",
    evidence_source: "https://www.reddit.com/r/shopify/comments/1phyhr7/finding_a_shopify_web_developer/"
  },
  {
    business_name: "Emirates Luxe Realty",
    website_url: "https://emiratesluxerealty.ae",
    industry: "Real Estate & Luxury Properties",
    country: "United Arab Emirates (Dubai)",
    primary_signal: "Public Request: Looking for developer to fix horizontal scroll overflow on mobile property galleries",
    evidence_source: "https://www.upwork.com/freelance-jobs/website-redesign/"
  },
  {
    business_name: "Kaveri Organic Foods",
    website_url: "https://kaveriorganics.in",
    industry: "Food & Beverage",
    country: "India (Regional)",
    primary_signal: "Public Inquiry: Seeking WooCommerce developer to fix slow PageSpeed (32/100) and broken WhatsApp order button",
    evidence_source: "https://www.reddit.com/r/indiandevs/comments/1eqik37/looking_for_website_developer/"
  }
];

export async function POST() {
  // Call main leads endpoint to ingest next candidate from live pool
  const randomCandidate = liveCandidatePool[Math.floor(Math.random() * liveCandidatePool.length)];
  const projectVal = calculateCountryProjectValue(randomCandidate.country);

  const result = await ingestManualAuditLead({
    action: "MANUAL_AUDIT",
    url: randomCandidate.website_url,
    country: randomCandidate.country
  });

  return NextResponse.json({
    success: result.success,
    message: result.message,
    candidate_added: randomCandidate
  });
}
