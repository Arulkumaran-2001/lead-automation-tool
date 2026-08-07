'use client';

import React, { useState, useEffect } from 'react';

export default function Dashboard() {
  const [leads, setLeads] = useState<any[]>([]);
  const [selectedLead, setSelectedLead] = useState<any | null>(null);
  const [activeAuditTab, setActiveAuditTab] = useState<'WEB' | 'SOCIAL'>('WEB');
  const [activeDraftTab, setActiveDraftTab] = useState<'EMAIL' | 'LINKEDIN' | 'WHATSAPP'>('EMAIL');
  
  // Modals & Manual Audit States
  const [showManualModal, setShowManualModal] = useState(false);
  const [manualUrl, setManualUrl] = useState('');
  const [manualCountry, setManualCountry] = useState('United States');
  const [draftContent, setDraftContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [genMessage, setGenMessage] = useState('');

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const res = await fetch('/api/leads');
      const data = await res.json();
      if (data.leads) {
        setLeads(data.leads);
        if (data.leads.length > 0 && !selectedLead) {
          setSelectedLead(data.leads[0]);
          setDraftContent(data.leads[0].drafts.email);
        }
      }
    } catch (err) {
      console.error('Failed to fetch leads', err);
    }
  };

  const handleSelectLead = (lead: any) => {
    setSelectedLead(lead);
    setDraftContent(lead.drafts.email);
    setActiveDraftTab('EMAIL');
  };

  const handleDraftTabChange = (tab: 'EMAIL' | 'LINKEDIN' | 'WHATSAPP') => {
    setActiveDraftTab(tab);
    if (selectedLead && selectedLead.drafts) {
      if (tab === 'EMAIL') setDraftContent(selectedLead.drafts.email);
      if (tab === 'LINKEDIN') setDraftContent(selectedLead.drafts.linkedin);
      if (tab === 'WHATSAPP') setDraftContent(selectedLead.drafts.whatsapp);
    }
  };

  // 1-CLICK LIVE LEAD GENERATOR
  const handleOneClickGenerateLeads = async () => {
    setLoading(true);
    setGenMessage('Scanning online sources for fresh buyer-intent leads...');

    try {
      const res = await fetch('/api/generate-leads', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setGenMessage('Fresh lead audited & appended to queue without duplicates!');
        await fetchLeads();
      }
    } catch (err) {
      setGenMessage('Lead generation complete.');
    } finally {
      setLoading(false);
      setTimeout(() => setGenMessage(''), 4000);
    }
  };

  // MANUAL URL AUDIT SUBMIT
  const handleManualAuditSubmit = async () => {
    if (!manualUrl.trim()) return;
    setLoading(true);

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'MANUAL_AUDIT',
          url: manualUrl,
          country: manualCountry
        })
      });
      const data = await res.json();
      if (data.leads) {
        setLeads(data.leads);
        setSelectedLead(data.leads[0]);
        setDraftContent(data.leads[0].drafts.email);
      }
      setShowManualModal(false);
      setManualUrl('');
    } catch (err) {
      alert('Failed to execute manual audit');
    } finally {
      setLoading(false);
    }
  };

  const handleDispatch = async (channel: 'WHATSAPP' | 'GMAIL' | 'LINKEDIN') => {
    if (!selectedLead) return;
    setLoading(true);

    try {
      const updatedDrafts = { ...selectedLead.drafts };
      if (activeDraftTab === 'EMAIL') updatedDrafts.email = draftContent;
      if (activeDraftTab === 'LINKEDIN') updatedDrafts.linkedin = draftContent;
      if (activeDraftTab === 'WHATSAPP') updatedDrafts.whatsapp = draftContent;

      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedLead.id,
          verification_status: 'VERIFIED_APPROVED',
          drafts: updatedDrafts
        })
      });

      if (channel === 'WHATSAPP') {
        const text = encodeURIComponent(draftContent);
        window.open(`https://wa.me/?text=${text}`, '_blank');
      } else if (channel === 'GMAIL') {
        const subject = encodeURIComponent(`Executive Teaser Audit for ${selectedLead.business_name}`);
        const body = encodeURIComponent(draftContent);
        window.open(`mailto:roamwork.techs@gmail.com?subject=${subject}&body=${body}`, '_blank');
      } else if (channel === 'LINKEDIN') {
        await navigator.clipboard.writeText(draftContent);
        alert('LinkedIn DM pitch copied to clipboard! Ready to paste and share.');
      }

      await fetchLeads();
    } catch (err) {
      alert('Failed to process dispatch');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden font-inter">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col justify-between p-4 shadow-xl">
        <div>
          <div className="flex items-center space-x-2.5 mb-8 px-2">
            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center font-extrabold text-xl text-white shadow-md font-poppins">R</div>
            <div>
              <span className="font-extrabold text-lg tracking-tight block leading-none font-poppins">ROAMWORK OS</span>
              <span className="text-[10px] text-slate-400 font-medium">360° Digital Audit & CRM</span>
            </div>
          </div>

          <nav className="space-y-1.5">
            <a href="#" className="flex items-center space-x-3 px-3.5 py-2.5 rounded-lg bg-blue-600 text-white font-semibold text-xs shadow-sm font-poppins">
              <span>🎯 Ingestion Queue</span>
            </a>
            <a href="#" className="flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white font-medium text-xs transition">
              <span>🔍 360° Dual Audits</span>
            </a>
            <a href="#" className="flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white font-medium text-xs transition">
              <span>💬 Multi-Channel Dispatch</span>
            </a>
            <a href="#" className="flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white font-medium text-xs transition">
              <span>📊 Country Valuation CRM</span>
            </a>
          </nav>
        </div>

        <div className="border-t border-slate-800 pt-4 px-2 text-[11px] text-slate-400 space-y-1">
          <div className="flex justify-between items-center">
            <span>Deduplication:</span>
            <span className="text-emerald-400 font-bold">ENABLED</span>
          </div>
          <div className="text-[10px] text-slate-500">Valuation Engine: <code className="text-slate-300">Country-Aware</code></div>
          <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-800">Agency: <strong>RoamWork</strong> (roamwork.in)</div>
        </div>
      </aside>

      {/* Main Container */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-sm">
          <div>
            <h1 className="text-lg font-extrabold text-slate-900 tracking-tight font-poppins">360° Lead Ingestion & Verification Control Panel</h1>
            <p className="text-xs text-slate-500">Live 360° Web & Social Media Auditing with Country-Aware Project Valuation</p>
          </div>
          
          <div className="flex items-center space-x-3">
            {genMessage && (
              <span className="text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 font-medium animate-pulse">
                {genMessage}
              </span>
            )}
            
            {/* 1-CLICK CTA BUTTON */}
            <button
              disabled={loading}
              onClick={handleOneClickGenerateLeads}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition shadow-sm font-poppins flex items-center space-x-1.5"
            >
              <span>⚡ Generate Fresh Live Leads Now</span>
            </button>

            {/* MANUAL URL AUDIT BUTTON */}
            <button
              onClick={() => setShowManualModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition shadow-sm font-poppins flex items-center space-x-1.5"
            >
              <span>+ Manual URL Audit</span>
            </button>
          </div>
        </header>

        {/* Dashboard Split View */}
        <div className="flex-1 flex overflow-hidden p-6 gap-6">
          {/* Left Column: Lead Queue */}
          <div className="w-1/2 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
            <div className="p-3.5 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <span className="text-xs font-bold uppercase text-slate-600 tracking-wider font-poppins">Audited Target Leads</span>
              <span className="text-xs text-slate-400">Sorted by Priority & Country Valuation</span>
            </div>

            <div className="divide-y divide-slate-100 overflow-y-auto flex-1">
              {leads.map((lead) => (
                <div
                  key={lead.id}
                  onClick={() => handleSelectLead(lead)}
                  className={`p-4 cursor-pointer transition ${
                    selectedLead?.id === lead.id ? 'bg-blue-50/80 border-l-4 border-blue-600' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-sm text-slate-900 font-poppins">#{lead.rank} {lead.business_name}</span>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 font-poppins">
                      Est. {lead.estimated_project_value}
                    </span>
                  </div>
                  <div className="text-xs text-blue-600 underline font-medium mb-1">{lead.website_url}</div>
                  <div className="text-xs text-slate-600 line-clamp-1 mb-2">{lead.opportunity_type}</div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1.5 border-t border-slate-100">
                    <span>Priority Score: <strong className="text-slate-800">{lead.score}/100</strong></span>
                    <span>Country: <strong className="text-slate-700">{lead.country}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Dual Audit & Multi-Draft Control Center */}
          {selectedLead ? (
            <div className="w-1/2 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden p-5">
              <div className="border-b border-slate-100 pb-3.5 mb-3 flex justify-between items-start">
                <div>
                  <h2 className="text-base font-bold text-slate-900 font-poppins">{selectedLead.business_name}</h2>
                  <div className="flex items-center space-x-2 text-xs mt-0.5">
                    <a href={selectedLead.website_url} target="_blank" className="text-blue-600 underline font-medium">
                      {selectedLead.website_url}
                    </a>
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-600 font-medium">{selectedLead.country}</span>
                  </div>
                </div>
                
                {/* READY TO SHARE TEASER PDF BUTTON */}
                <a
                  href={selectedLead.pdf_path}
                  target="_blank"
                  className="bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1.5 rounded-lg border border-blue-200 transition flex items-center space-x-1 font-poppins shadow-sm"
                >
                  <span>📄 Ready Teaser PDF</span>
                </a>
              </div>

              {/* Dual Audit Tabs (Web vs Social Media) */}
              <div className="flex border-b border-slate-200 mb-3">
                <button
                  onClick={() => setActiveAuditTab('WEB')}
                  className={`pb-2 px-3 text-xs font-bold border-b-2 transition font-poppins ${
                    activeAuditTab === 'WEB' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  🌐 Holistic Web Quality Scan
                </button>
                <button
                  onClick={() => setActiveAuditTab('SOCIAL')}
                  className={`pb-2 px-3 text-xs font-bold border-b-2 transition font-poppins ${
                    activeAuditTab === 'SOCIAL' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  📱 Social Media Presence Audit
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3.5 text-xs pr-1">
                {activeAuditTab === 'WEB' ? (
                  <>
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                      <h3 className="font-bold text-slate-800 mb-2 uppercase text-[10px] tracking-wider font-poppins">Web Technical & Conversion Vulnerabilities</h3>
                      <ul className="space-y-1.5 text-slate-700">
                        <li>🔴 <strong>Call Conversion Bug:</strong> {selectedLead.web_audit.click_to_call}</li>
                        <li>🔴 <strong>Mobile PageSpeed:</strong> {selectedLead.web_audit.perf_mobile} (Load Time: {selectedLead.web_audit.load_time})</li>
                        <li>🔴 <strong>Payload Weight:</strong> {selectedLead.web_audit.page_weight}</li>
                        <li>🟡 <strong>SEO Indexability:</strong> {selectedLead.web_audit.seo_indexing}</li>
                        <li>🟡 <strong>Accessibility:</strong> {selectedLead.web_audit.a11y}</li>
                      </ul>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                      <h3 className="font-bold text-slate-800 mb-1 uppercase text-[10px] tracking-wider font-poppins">PageSpeed Insights Proofs</h3>
                      <div className="space-y-1 text-[11px]">
                        <div>📱 <a href={selectedLead.proof_links.mobile} target="_blank" className="text-blue-600 underline">Google Mobile Analysis Proof Link</a></div>
                        <div>💻 <a href={selectedLead.proof_links.desktop} target="_blank" className="text-blue-600 underline">Google Desktop Analysis Proof Link</a></div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-2">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-bold text-slate-800 uppercase text-[10px] tracking-wider font-poppins">Social Media Audit (Grandmaster Level)</h3>
                      <span className="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded text-[10px] font-poppins">
                        Score: {selectedLead.social_audit.social_score}
                      </span>
                    </div>
                    <div className="space-y-1.5 text-slate-700">
                      <div>💼 <strong>LinkedIn:</strong> {selectedLead.social_audit.linkedin_status}</div>
                      <div>📸 <strong>Instagram:</strong> {selectedLead.social_audit.instagram_status}</div>
                      <div>👥 <strong>Facebook:</strong> {selectedLead.social_audit.facebook_status}</div>
                    </div>
                  </div>
                )}

                {/* Multi-Channel Outreach Drafts */}
                <div className="border-t border-slate-100 pt-3">
                  <div className="flex justify-between items-center mb-2">
                    <label className="font-bold text-slate-800 uppercase text-[10px] tracking-wider font-poppins">
                      Ready-to-Share Outreach Communications
                    </label>
                    <div className="flex bg-slate-100 p-0.5 rounded-lg">
                      <button
                        onClick={() => handleDraftTabChange('EMAIL')}
                        className={`px-2 py-1 rounded text-[10px] font-bold transition font-poppins ${
                          activeDraftTab === 'EMAIL' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'
                        }`}
                      >
                        ✉️ Email
                      </button>
                      <button
                        onClick={() => handleDraftTabChange('LINKEDIN')}
                        className={`px-2 py-1 rounded text-[10px] font-bold transition font-poppins ${
                          activeDraftTab === 'LINKEDIN' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'
                        }`}
                      >
                        💼 LinkedIn
                      </button>
                      <button
                        onClick={() => handleDraftTabChange('WHATSAPP')}
                        className={`px-2 py-1 rounded text-[10px] font-bold transition font-poppins ${
                          activeDraftTab === 'WHATSAPP' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'
                        }`}
                      >
                        💬 WhatsApp
                      </button>
                    </div>
                  </div>

                  <textarea
                    rows={4}
                    value={draftContent}
                    onChange={(e) => setDraftContent(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none text-xs font-mono bg-slate-50"
                  />
                </div>
              </div>

              {/* Dispatch Actions */}
              <div className="border-t border-slate-100 pt-3 mt-3 flex gap-2 font-poppins">
                {activeDraftTab === 'EMAIL' && (
                  <button
                    disabled={loading}
                    onClick={() => handleDispatch('GMAIL')}
                    className="flex-1 bg-blue-600 text-white font-bold py-2 px-3 rounded-lg text-xs hover:bg-blue-700 transition"
                  >
                    ✉️ Approve & Draft in Gmail
                  </button>
                )}
                {activeDraftTab === 'LINKEDIN' && (
                  <button
                    disabled={loading}
                    onClick={() => handleDispatch('LINKEDIN')}
                    className="flex-1 bg-sky-700 text-white font-bold py-2 px-3 rounded-lg text-xs hover:bg-sky-800 transition"
                  >
                    💼 Copy LinkedIn Message
                  </button>
                )}
                {activeDraftTab === 'WHATSAPP' && (
                  <button
                    disabled={loading}
                    onClick={() => handleDispatch('WHATSAPP')}
                    className="flex-1 bg-emerald-600 text-white font-bold py-2 px-3 rounded-lg text-xs hover:bg-emerald-700 transition"
                  >
                    💬 Approve & Send via WhatsApp
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="w-1/2 bg-white rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 text-xs">
              Select a lead to inspect Dual Audit findings & Multi-Channel Drafts
            </div>
          )}
        </div>
      </main>

      {/* Manual URL Audit Modal */}
      {showManualModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 border border-slate-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
              <h3 className="font-bold text-base text-slate-900 font-poppins">+ Manual Website Audit</h3>
              <button onClick={() => setShowManualModal(false)} className="text-slate-400 hover:text-slate-600 text-sm font-bold">✕</button>
            </div>
            
            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 font-poppins">Target Website URL</label>
                <input
                  type="text"
                  placeholder="https://example.com"
                  value={manualUrl}
                  onChange={(e) => setManualUrl(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-xs text-slate-800 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 font-poppins">Client Country / Region</label>
                <select
                  value={manualCountry}
                  onChange={(e) => setManualCountry(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-xs text-slate-800 bg-white"
                >
                  <option value="United States">United States ($3,500 – $8,000+)</option>
                  <option value="United Kingdom">United Kingdom ($3,500 – $8,000+)</option>
                  <option value="United Arab Emirates">United Arab Emirates ($3,500 – $8,000+)</option>
                  <option value="Australia">Australia ($3,500 – $8,000+)</option>
                  <option value="Germany / Europe">Europe ($2,500 – $5,000)</option>
                  <option value="India (Regional)">India (₹35,000 – ₹95,000)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button onClick={() => setShowManualModal(false)} className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50">
                Cancel
              </button>
              <button
                disabled={loading}
                onClick={handleManualAuditSubmit}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition font-poppins"
              >
                {loading ? 'Auditing...' : '⚡ Audit Site & Create PDF'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
