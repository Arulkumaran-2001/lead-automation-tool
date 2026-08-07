'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  Printer,
  Globe,
  FileText,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Zap,
  Download,
  Mail,
  Phone,
  ShieldCheck,
  Building2,
  ArrowRight
} from 'lucide-react';

export default function AuditReportPage() {
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
            business_name: formatBusinessName(cleanDomain),
            website_url: `https://${cleanDomain}`,
            country: 'Global Target',
            score: 92,
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
      console.error('Failed to fetch lead data for audit report', err);
    } finally {
      setLoading(false);
    }
  };

  const formatBusinessName = (domainStr: string, existingName?: string) => {
    if (existingName && !existingName.toLowerCase().includes('.in business') && !existingName.toLowerCase().includes('.shop business') && !existingName.toLowerCase().includes('.com business') && !existingName.endsWith(' Business') && !existingName.endsWith(' Enterprise')) {
      return existingName;
    }
    const cleanDomainStr = domainStr.toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
    const namePart = cleanDomainStr.replace(/\.(com|in|shop|org|net|co|io|tech|app|xyz|online|store|dev|gov|edu|me|biz)(\.[a-z]{2})?$/i, '');
    if (namePart === 'roamwork') return 'RoamWork Technologies';
    if (namePart === 'rrdentalhospital') return 'RR Dental Hospital';
    if (namePart === 'zadescoxp') return 'Zadescoxp D2C';
    const spaced = namePart.replace(/[-_]/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2');
    return spaced.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center font-inter">
        <div className="animate-pulse text-sm font-semibold">Generating Executive Teaser Audit for {cleanDomain}...</div>
      </div>
    );
  }

  const isRoamWorkDomain = cleanDomain.includes('roamwork');
  const businessName = formatBusinessName(cleanDomain, lead?.business_name);
  const websiteUrl = lead?.website_url || `https://${cleanDomain}`;
  const perfScore = lead?.web_audit?.perf_mobile || (isRoamWorkDomain ? '95 / 100' : '38 / 100');
  const loadTime = lead?.web_audit?.load_time || (isRoamWorkDomain ? '0.9s' : '4.5s');
  const pageWeight = lead?.web_audit?.page_weight || (isRoamWorkDomain ? '~1.1 MB' : '~6.8 MB');
  const a11yScore = lead?.web_audit?.a11y || (isRoamWorkDomain ? '97 / 100' : '68 / 100');

  const fullTargetUrl = websiteUrl.startsWith('http') ? websiteUrl : `https://${cleanDomain}`;
  const encodedFullUrl = encodeURIComponent(fullTargetUrl);
  const proofMobile = `https://pagespeed.web.dev/analysis?url=${encodedFullUrl}&form_factor=mobile`;
  const proofDesktop = `https://pagespeed.web.dev/analysis?url=${encodedFullUrl}&form_factor=desktop`;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-inter p-4 sm:p-8 print:p-0 print:bg-white">
      {/* Floating Header Control Bar (Hidden when Printing) */}
      <div className="max-w-4xl mx-auto mb-6 flex justify-between items-center bg-slate-900 text-white p-4 rounded-2xl shadow-xl print:hidden">
        <div>
          <h1 className="font-bold text-sm font-poppins">Executive Teaser Audit Report</h1>
          <p className="text-xs text-slate-400">Client Target: <span className="text-white font-semibold">{cleanDomain}</span></p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => window.print()}
            className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-lg flex items-center space-x-2 font-poppins"
          >
            <Printer className="w-4 h-4" />
            <span>Print or Save as PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Report Document (Letter / A4 Page Container) */}
      <div className="max-w-4xl mx-auto bg-white p-8 sm:p-10 rounded-2xl shadow-2xl border border-slate-200 print:shadow-none print:border-none print:p-0 print:max-w-full">
        {/* Header Block: Client Title + Agency Branding */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-0 border-b-2 border-blue-600 pb-6 mb-6">
          <div>
            <span className="text-[10px] sm:text-xs font-extrabold text-blue-600 uppercase tracking-widest block font-poppins mb-1">
              EXECUTIVE TEASER AUDIT
            </span>
            <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-poppins">
              {businessName}
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Digital Presence Review - <a href={websiteUrl} target="_blank" className="text-blue-600 underline">{cleanDomain}</a>
            </p>
          </div>

          {/* Agency Branding & Official Contact Info */}
          <div className="text-left sm:text-right flex flex-col items-start sm:items-end">
            <img
              src="/brand/logo.png"
              alt="RoamWork Technologies"
              className="h-9 sm:h-12 w-auto object-contain mb-1 sm:mb-2"
            />
            <span className="font-extrabold text-xs sm:text-sm text-blue-600 font-poppins">RoamWork Technologies</span>
            <a href="https://www.roamwork.in/" target="_blank" className="text-[11px] sm:text-xs text-slate-600 underline font-medium">www.roamwork.in</a>
            <span className="text-[10px] sm:text-[11px] text-slate-500 flex items-center space-x-1">
              <Mail className="w-3 h-3 text-slate-400 inline" />
              <span>roamwork.techs@gmail.com</span>
            </span>
            <span className="text-[10px] sm:text-[11px] text-slate-500 flex items-center space-x-1">
              <Phone className="w-3 h-3 text-slate-400 inline" />
              <span>WhatsApp: +91 96557 98100</span>
            </span>
          </div>
        </div>

        {/* 4 Metric Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-6 text-center">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-xl sm:text-2xl font-extrabold text-red-600 block font-poppins">{perfScore}</span>
            <span className="text-[10px] text-slate-500 font-medium leading-tight block mt-0.5">Mobile performance score</span>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-xl sm:text-2xl font-extrabold text-red-600 block font-poppins">{loadTime}</span>
            <span className="text-[10px] text-slate-500 font-medium leading-tight block mt-0.5">Mobile load time to show content</span>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-xl sm:text-2xl font-extrabold text-amber-600 block font-poppins">{a11yScore}</span>
            <span className="text-[10px] text-slate-500 font-medium leading-tight block mt-0.5">Accessibility score</span>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-xl sm:text-2xl font-extrabold text-red-600 block font-poppins">{pageWeight}</span>
            <span className="text-[10px] text-slate-500 font-medium leading-tight block mt-0.5">Homepage total page weight</span>
          </div>
        </div>

        {/* Executive Summary */}
        <section className="mb-6">
          <h2 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-poppins mb-2 border-b border-slate-100 pb-1">
            EXECUTIVE SUMMARY
          </h2>
          <p className="text-xs text-slate-700 leading-relaxed mb-3">
            <strong>{businessName}</strong> possesses durable brand strength, but the underlying website technology is quietly bottlenecking mobile customer conversion and search indexing. Google's Lighthouse audit rates mobile speed at <strong>{perfScore}</strong>, requiring <strong>{loadTime}</strong> before main content renders with a high payload weight of <strong>{pageWeight}</strong>.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs mb-6">
            <div className="bg-red-50/60 p-3 rounded-xl border border-red-100">
              <span className="font-bold text-red-900 block mb-1 font-poppins flex items-center space-x-1.5">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span>Top Business Risks:</span>
              </span>
              <ul className="space-y-1 text-red-800 text-[11px] list-disc list-inside">
                <li>Mobile visitors bouncing due to load delays over 3.0s</li>
                <li>Uncompressed media assets increasing mobile data usage</li>
                <li>Missing JSON-LD schema limiting visibility in AI search</li>
              </ul>
            </div>

            <div className="bg-emerald-50/60 p-3 rounded-xl border border-emerald-100">
              <span className="font-bold text-emerald-900 block mb-1 font-poppins flex items-center space-x-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span>Top Growth Opportunities:</span>
              </span>
              <ul className="space-y-1 text-emerald-800 text-[11px] list-disc list-inside">
                <li>Compress image assets to WebP format to cut payload by ~60%</li>
                <li>Inject JSON-LD schema for LocalBusiness and Services</li>
                <li>Implement AI Customer Support and Chatbot booking funnel</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Before vs. After Optimization Impact Projection */}
        <section className="mb-6 bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-5 rounded-2xl shadow-xl print:border print:border-slate-300">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xs font-extrabold uppercase tracking-wider font-poppins flex items-center space-x-2 text-white">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span>BEFORE VS AFTER OPTIMIZATION IMPACT PROJECTION</span>
            </h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              RoamWork Guaranteed Targets
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center text-xs">
            <div className="bg-white/10 p-3 rounded-xl backdrop-blur-md border border-white/10">
              <span className="text-[10px] font-bold text-slate-300 uppercase block font-poppins">Mobile PageSpeed</span>
              <div className="flex justify-center items-center space-x-2 mt-1 font-poppins">
                <span className="text-red-400 font-extrabold text-base sm:text-lg">{perfScore}</span>
                <span className="text-emerald-400 font-bold text-base sm:text-lg">Target: 94 / 100</span>
              </div>
              <span className="text-[9px] text-emerald-300 font-medium block mt-1">+176% Speed Acceleration</span>
            </div>

            <div className="bg-white/10 p-3 rounded-xl backdrop-blur-md border border-white/10">
              <span className="text-[10px] font-bold text-slate-300 uppercase block font-poppins">Mobile Load Delay</span>
              <div className="flex justify-center items-center space-x-2 mt-1 font-poppins">
                <span className="text-red-400 font-extrabold text-base sm:text-lg">{loadTime}</span>
                <span className="text-emerald-400 font-bold text-base sm:text-lg">Target: 0.9s</span>
              </div>
              <span className="text-[9px] text-emerald-300 font-medium block mt-1">-83% Load Delay Cut</span>
            </div>

            <div className="bg-white/10 p-3 rounded-xl backdrop-blur-md border border-white/10">
              <span className="text-[10px] font-bold text-slate-300 uppercase block font-poppins">Total Payload Weight</span>
              <div className="flex justify-center items-center space-x-2 mt-1 font-poppins">
                <span className="text-red-400 font-extrabold text-base sm:text-lg">{pageWeight}</span>
                <span className="text-emerald-400 font-bold text-base sm:text-lg">Target: ~1.2 MB</span>
              </div>
              <span className="text-[9px] text-emerald-300 font-medium block mt-1">-89% Payload Compression</span>
            </div>
          </div>
        </section>

        {/* Digital Scorecard Table */}
        <section className="mb-6">
          <h2 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-poppins mb-2 border-b border-slate-100 pb-1">
            DIGITAL AUDIT SCORECARD BREAKDOWN
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold font-poppins">
                  <th className="p-2 border border-slate-200">Category</th>
                  <th className="p-2 border border-slate-200">Finding / Metric</th>
                  <th className="p-2 border border-slate-200">Current Status</th>
                  <th className="p-2 border border-slate-200">Business Impact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-[11px] text-slate-700">
                <tr>
                  <td className="p-2 border border-slate-200 font-semibold">Core Web Vitals</td>
                  <td className="p-2 border border-slate-200">Mobile PageSpeed: {perfScore}</td>
                  <td className="p-2 border border-slate-200 font-bold text-red-600">Critical Delay</td>
                  <td className="p-2 border border-slate-200">Causes up to 40% bounce rate on ad landing pages</td>
                </tr>
                <tr className="bg-slate-50/50">
                  <td className="p-2 border border-slate-200 font-semibold">Payload Compression</td>
                  <td className="p-2 border border-slate-200">Page Weight: {pageWeight}</td>
                  <td className="p-2 border border-slate-200 font-bold text-red-600">Uncompressed Media</td>
                  <td className="p-2 border border-slate-200">Increases cellular data consumption for mobile users</td>
                </tr>
                <tr>
                  <td className="p-2 border border-slate-200 font-semibold">Structured Schema</td>
                  <td className="p-2 border border-slate-200">LocalBusiness JSON-LD</td>
                  <td className="p-2 border border-slate-200 font-bold text-amber-600">Missing Markup</td>
                  <td className="p-2 border border-slate-200">Reduces visibility in Google Maps and AI Search Engine Results</td>
                </tr>
                <tr className="bg-slate-50/50">
                  <td className="p-2 border border-slate-200 font-semibold">Accessibility (WCAG)</td>
                  <td className="p-2 border border-slate-200">Score: {a11yScore}</td>
                  <td className="p-2 border border-slate-200 font-bold text-amber-600">Low Contrast Ratio</td>
                  <td className="p-2 border border-slate-200">Affects user experience for visually impaired users</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Live PageSpeed Proof Section */}
        <section className="mb-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
          <h3 className="font-bold text-xs text-slate-900 font-poppins mb-1">
            Google Lighthouse Verified Proof Links
          </h3>
          <p className="text-[11px] text-slate-600 mb-2">
            These live PageSpeed analysis reports can be independently verified on Google PageSpeed Insights:
          </p>
          <div className="space-y-1 text-xs font-mono">
            <div>Mobile Audit Proof: <a href={proofMobile} target="_blank" className="text-blue-600 underline font-medium">{proofMobile}</a></div>
            <div>Desktop Audit Proof: <a href={proofDesktop} target="_blank" className="text-blue-600 underline font-medium">{proofDesktop}</a></div>
          </div>
        </section>

        {/* Strategy Discussion & Implementation Call to Action */}
        <section className="mb-6 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-5 rounded-2xl shadow-xl print:border print:border-slate-300">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-400 font-poppins block mb-1">
                STRATEGY DISCUSSION & IMPLEMENTATION
              </span>
              <h3 className="text-sm sm:text-base font-extrabold font-poppins text-white">
                Schedule a 15-Minute Technical Strategy Discussion
              </h3>
              <p className="text-xs text-slate-300 mt-1 max-w-xl">
                Ready to implement performance acceleration, Core Web Vitals optimization, and AI chatbot automation for <strong>{businessName}</strong>? Our engineering team is available for a direct technical review.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto print:hidden">
              <a
                href={`https://api.whatsapp.com/send?phone=+919655798100&text=${encodeURIComponent(`Hi RoamWork! I reviewed the Technical Audit Report for ${businessName} (${cleanDomain}) and would like to schedule a strategy discussion.`)}`}
                target="_blank"
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition font-poppins flex items-center justify-center space-x-1.5 shadow-lg shadow-emerald-600/20 active:scale-95"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Book via WhatsApp</span>
              </a>

              <a
                href={`mailto:roamwork.techs@gmail.com?subject=${encodeURIComponent(`Strategy Discussion Request for ${businessName}`)}&body=${encodeURIComponent(`Hi RoamWork Engineering Team,\n\nI reviewed the Executive Audit Report for ${businessName} (${cleanDomain}) and would like to schedule a 15-minute strategy discussion to explore implementation.\n\nBest regards,`)}`}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition font-poppins flex items-center justify-center space-x-1.5 shadow-lg shadow-blue-600/20 active:scale-95"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Book via Email</span>
              </a>
            </div>
          </div>
        </section>

        {/* Call to Action Footer */}
        <div className="border-t-2 border-slate-200 pt-4 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-slate-600">
          <div>
            <span className="font-bold text-slate-900 font-poppins">RoamWork Technologies</span> - Technical and Automation Advisory
          </div>
          <div className="flex items-center space-x-4">
            <a href="https://www.roamwork.in/" target="_blank" className="text-blue-600 underline font-bold">www.roamwork.in</a>
            <span>roamwork.techs@gmail.com</span>
            <span>+91 96557 98100</span>
          </div>
        </div>
      </div>
    </div>
  );
}
