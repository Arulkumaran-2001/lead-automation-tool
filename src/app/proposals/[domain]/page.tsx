'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function ProposalPage() {
  const params = useParams();
  const rawDomain = (params?.domain as string) || 'client-target.com';
  const cleanDomain = decodeURIComponent(rawDomain).replace('https://', '').replace('http://', '').replace('www.', '').split('/')[0];
  
  const [lead, setLead] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeadData();
  }, [cleanDomain]);

  const fetchLeadData = async () => {
    try {
      const res = await fetch('/api/leads');
      const data = await res.json();
      if (data.leads) {
        const found = data.leads.find((l: any) => l.website_url.toLowerCase().includes(cleanDomain.toLowerCase()));
        if (found) {
          setLead(found);
        } else {
          setLead({
            business_name: `${cleanDomain.charAt(0).toUpperCase() + cleanDomain.slice(1)} Enterprise`,
            website_url: `https://${cleanDomain}`,
            country: 'United States',
            score: 92,
            estimated_project_value: '$3,500 – $8,000+',
            web_audit: {
              perf_mobile: '38 / 100',
              load_time: '4.5s',
              page_weight: '~6.8 MB',
              a11y: '68 / 100'
            }
          });
        }
      }
    } catch (err) {
      console.error('Failed to fetch lead data for proposal', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center font-inter">
        <div className="animate-pulse text-sm font-semibold">Generating Formal Proposal & SOW for {cleanDomain}...</div>
      </div>
    );
  }

  const formatName = (domainStr: string) => {
    const namePart = domainStr.split('.')[0];
    const spaced = namePart.replace(/[-_]/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2');
    return spaced.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  const businessName = (lead?.business_name && !lead.business_name.includes('.shop Business')) ? lead.business_name : formatName(cleanDomain);
  const websiteUrl = lead?.website_url || `https://${cleanDomain}`;
  const country = lead?.country || 'Global Target';
  const investment = lead?.estimated_project_value || '$3,500 – $8,000+';

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-inter p-4 sm:p-8 print:p-0 print:bg-white">
      {/* Floating Control Bar */}
      <div className="max-w-4xl mx-auto mb-6 flex justify-between items-center bg-slate-900 text-white p-4 rounded-2xl shadow-xl print:hidden">
        <div>
          <h1 className="font-bold text-sm font-poppins">Formal Project Proposal & Statement of Work (SOW)</h1>
          <p className="text-xs text-slate-400">Client: <span className="text-white font-semibold">{businessName}</span> ({cleanDomain})</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => window.print()}
            className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-lg flex items-center space-x-2 font-poppins"
          >
            <span>📥 Print / Save Proposal as PDF</span>
          </button>
        </div>
      </div>

      {/* Proposal Document */}
      <div className="max-w-4xl mx-auto bg-white p-8 sm:p-12 rounded-2xl shadow-2xl border border-slate-200 print:shadow-none print:border-none print:p-0 print:max-w-full space-y-8">
        
        {/* Cover Header */}
        <div className="border-b-2 border-blue-600 pb-6 flex justify-between items-start">
          <div>
            <span className="text-xs font-extrabold text-blue-600 uppercase tracking-widest block font-poppins mb-1">
              PROJECT PROPOSAL & STATEMENT OF WORK
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900 font-poppins tracking-tight">
              Digital Transformation & Conversion Engineering
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Prepared exclusively for: <strong className="text-slate-800">{businessName}</strong> (<a href={websiteUrl} target="_blank" className="text-blue-600 underline">{cleanDomain}</a>)
            </p>
            <div className="mt-2 text-xs text-slate-500">
              Target Region: <span className="font-semibold text-slate-700">{country}</span>
            </div>
          </div>

          <div className="text-right flex flex-col items-end">
            <img src="/brand/logo.png" alt="RoamWork Technologies" className="h-12 w-auto object-contain mb-2" />
            <span className="font-extrabold text-sm text-blue-600 font-poppins">RoamWork Technologies</span>
            <a href="https://www.roamwork.in/" target="_blank" className="text-xs text-slate-600 underline">www.roamwork.in</a>
            <span className="text-[11px] text-slate-500">roamwork.techs@gmail.com</span>
            <span className="text-[11px] text-slate-500">WhatsApp: +91 96557 98100</span>
          </div>
        </div>

        {/* Executive Overview */}
        <section>
          <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider font-poppins mb-2 border-b border-slate-200 pb-1">
            1. Executive Overview
          </h2>
          <p className="text-xs text-slate-700 leading-relaxed">
            RoamWork Technologies conducted a comprehensive 360° technical, performance, and conversion audit for <strong>{businessName}</strong>. This Statement of Work outlines the engineering deliverables required to resolve mobile performance bottlenecks, implement security hardening, optimize Core Web Vitals, and deploy an automated AI Lead Qualification Chatbot.
          </p>
        </section>

        {/* Detailed Scope of Work */}
        <section>
          <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider font-poppins mb-3 border-b border-slate-200 pb-1">
            2. Scope of Work (SOW Deliverables)
          </h2>

          <div className="space-y-4 text-xs">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <h3 className="font-bold text-slate-900 text-xs font-poppins mb-1">
                Phase 1: Core Performance Acceleration & Security Hardening (Weeks 1–2)
              </h3>
              <ul className="list-disc list-inside text-slate-700 space-y-1 text-[11px]">
                <li>Compress and convert all media assets into WebP/AVIF format (cutting payload size by ~60%).</li>
                <li>Eliminate render-blocking JavaScript and CSS resources to achieve target mobile PageSpeed score 80+.</li>
                <li>Configure HTTPS enforcement, SSL verification, and HTTP Security Headers (HSTS, CSP, X-Frame-Options).</li>
                <li>Fix mobile viewport layout overflow and click-to-call phone link mismatches.</li>
              </ul>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <h3 className="font-bold text-slate-900 text-xs font-poppins mb-1">
                Phase 2: Conversion Rate Optimization & AI Lead Chatbot (Weeks 2–3)
              </h3>
              <ul className="list-disc list-inside text-slate-700 space-y-1 text-[11px]">
                <li>Deploy automated AI Customer Support Chatbot to qualify inbound traffic into CRM 24/7.</li>
                <li>Optimize mobile appointment/order booking funnel and sticky call-to-action bar.</li>
                <li>Integrate Google Analytics 4 (GA4), Meta Pixel, and event conversion tracking.</li>
              </ul>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <h3 className="font-bold text-slate-900 text-xs font-poppins mb-1">
                Phase 3: Search Engine Optimization & GEO Schema Markup (Weeks 3–4)
              </h3>
              <ul className="list-disc list-inside text-slate-700 space-y-1 text-[11px]">
                <li>Inject JSON-LD structured data schema for LocalBusiness, Organization, and Service offerings.</li>
                <li>Optimize metadata, OpenGraph tags, and semantic HTML5 hierarchy for Google & AI answer engines (ChatGPT, Gemini).</li>
                <li>Deliver 30-day post-launch Core Web Vitals monitoring and performance guarantee.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Investment & Milestone Pricing */}
        <section>
          <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider font-poppins mb-3 border-b border-slate-200 pb-1">
            3. Project Investment & Milestone Breakdown
          </h2>

          <div className="overflow-hidden border border-slate-200 rounded-xl mb-3">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold font-poppins">
                <tr>
                  <th className="p-3">Milestone Deliverable</th>
                  <th className="p-3">Timeline</th>
                  <th className="p-3">Investment Allocation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="p-3 font-medium">Deposit & Phase 1 (Performance & Security)</td>
                  <td className="p-3">Week 1–2</td>
                  <td className="p-3 font-bold text-slate-900">40% Upfront</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium">Phase 2 (AI Chatbot & CRO Funnel)</td>
                  <td className="p-3">Week 2–3</td>
                  <td className="p-3 font-bold text-slate-900">40% Midway</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium">Phase 3 (SEO/GEO Schema & Final Delivery)</td>
                  <td className="p-3">Week 3–4</td>
                  <td className="p-3 font-bold text-slate-900">20% Upon Sign-off</td>
                </tr>
                <tr className="bg-blue-50/50">
                  <td className="p-3 font-extrabold text-slate-900 font-poppins" colSpan={2}>Estimated Total Project Investment ({country})</td>
                  <td className="p-3 font-extrabold text-blue-700 text-sm font-poppins">{investment}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Guarantee & Terms */}
        <section className="text-xs text-slate-700 space-y-2">
          <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider font-poppins mb-2 border-b border-slate-200 pb-1">
            4. Service Level Agreement & Guarantee
          </h2>
          <p className="leading-relaxed">
            RoamWork Technologies guarantees a minimum 30% improvement in mobile PageSpeed performance score and full WCAG accessibility compliance upon completion. All source code and intellectual property will be fully owned by <strong>{businessName}</strong>.
          </p>
        </section>

        {/* Client Acceptance & Signature Block */}
        <section className="pt-4 border-t-2 border-slate-200">
          <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider font-poppins mb-4">
            5. Formal Acceptance & Sign-off
          </h2>

          <div className="grid grid-cols-2 gap-8 text-xs">
            <div className="space-y-4">
              <span className="font-bold text-slate-900 font-poppins block">For RoamWork Technologies:</span>
              <div className="border-b border-slate-300 pb-1 font-semibold text-slate-800">Arul Kumaran, Managing Director</div>
              <div className="text-slate-500">Date: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
            </div>

            <div className="space-y-4">
              <span className="font-bold text-slate-900 font-poppins block">Accepted for {businessName}:</span>
              <div className="border-b border-slate-300 pb-1 text-slate-400 font-medium">Authorized Signature: ______________________</div>
              <div className="text-slate-500">Name & Title: _____________________________</div>
              <div className="text-slate-500">Date: ___________________________________</div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
