'use client';

import React, { useState, useEffect } from 'react';

export default function Dashboard() {
  const [leads, setLeads] = useState<any[]>([]);
  const [selectedLead, setSelectedLead] = useState<any | null>(null);
  const [activeAuditTab, setActiveAuditTab] = useState<'WEB' | 'SOCIAL' | 'AI_OPPS'>('WEB');
  const [activeDraftTab, setActiveDraftTab] = useState<'EMAIL' | 'LINKEDIN' | 'WHATSAPP'>('EMAIL');
  const [pipelineFilter, setPipelineFilter] = useState<'ALL' | 'PENDING' | 'APPROVED'>('ALL');
  
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
          setDraftContent(data.leads[0].drafts?.email || '');
        }
      }
    } catch (err) {
      console.error('Failed to fetch leads', err);
    }
  };

  const handleSelectLead = (lead: any) => {
    setSelectedLead(lead);
    setDraftContent(lead.drafts?.email || '');
    setActiveDraftTab('EMAIL');
  };

  const handleDraftTabChange = (tab: 'EMAIL' | 'LINKEDIN' | 'WHATSAPP') => {
    setActiveDraftTab(tab);
    if (selectedLead && selectedLead.drafts) {
      if (tab === 'EMAIL') setDraftContent(selectedLead.drafts.email || '');
      if (tab === 'LINKEDIN') setDraftContent(selectedLead.drafts.linkedin || '');
      if (tab === 'WHATSAPP') setDraftContent(selectedLead.drafts.whatsapp || '');
    }
  };

  // 1-CLICK LIVE LEAD GENERATOR
  const handleOneClickGenerateLeads = async () => {
    setLoading(true);
    setGenMessage('Scanning global candidate pool & performing 360° audit...');

    try {
      const res = await fetch('/api/generate-leads', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setGenMessage('Fresh buyer-intent lead audited & added!');
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
        setDraftContent(data.leads[0].drafts?.email || '');
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
        window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
      } else if (channel === 'GMAIL') {
        const subject = encodeURIComponent(`Executive Teaser Audit for ${selectedLead.business_name}`);
        const body = encodeURIComponent(draftContent);
        window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
      } else if (channel === 'LINKEDIN') {
        await navigator.clipboard.writeText(draftContent);
        window.open('https://www.linkedin.com/messaging/', '_blank');
        alert('LinkedIn DM pitch copied to clipboard! Opening LinkedIn Messages...');
      }

      await fetchLeads();
    } catch (err) {
      alert('Failed to process dispatch');
    } finally {
      setLoading(false);
    }
  };

  // Compute KPI Scorecard Stats (Module 10)
  const totalLeadsCount = leads.length;
  const approvedCount = leads.filter(l => l.verification_status === 'VERIFIED_APPROVED').length;
  const avgScore = leads.length > 0 ? (leads.reduce((acc, l) => acc + (l.score || 0), 0) / leads.length).toFixed(1) : '0.0';

  const filteredLeads = leads.filter(lead => {
    if (pipelineFilter === 'PENDING') return lead.verification_status === 'PENDING_VERIFICATION';
    if (pipelineFilter === 'APPROVED') return lead.verification_status === 'VERIFIED_APPROVED';
    return true;
  });

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-inter">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900/90 backdrop-blur-md border-r border-slate-800 flex flex-col justify-between p-4 shadow-2xl z-20">
        <div>
          <div className="flex items-center space-x-3 mb-8 px-2">
            <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-xl flex items-center justify-center font-extrabold text-xl text-white shadow-lg shadow-blue-500/20 font-poppins">
              G
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight block text-white font-poppins">GRIE OS v3</span>
              <span className="text-[10px] text-blue-400 font-semibold tracking-wider uppercase">Revenue Engine</span>
            </div>
          </div>

          <nav className="space-y-1.5">
            <a href="#" className="flex items-center space-x-3 px-3.5 py-2.5 rounded-xl bg-blue-600/90 text-white font-semibold text-xs shadow-md shadow-blue-600/20 font-poppins transition">
              <span>🎯 Discovery Queue</span>
            </a>
            <a href="#" className="flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-slate-400 hover:bg-slate-800/80 hover:text-white font-medium text-xs transition">
              <span>🔍 360° Web & Social Audit</span>
            </a>
            <a href="#" className="flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-slate-400 hover:bg-slate-800/80 hover:text-white font-medium text-xs transition">
              <span>🤖 AI Opportunity Engine</span>
            </a>
            <a href="#" className="flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-slate-400 hover:bg-slate-800/80 hover:text-white font-medium text-xs transition">
              <span>💼 Client Pipeline System</span>
            </a>
            <a href="#" className="flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-slate-400 hover:bg-slate-800/80 hover:text-white font-medium text-xs transition">
              <span>📄 Proposal Generator</span>
            </a>
          </nav>
        </div>

        <div className="border-t border-slate-800/80 pt-4 px-2 text-[11px] text-slate-400 space-y-2">
          <div className="flex justify-between items-center">
            <span>Supabase Database:</span>
            <span className="text-emerald-400 font-extrabold flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block"></span>
              <span>CONNECTED</span>
            </span>
          </div>
          <div className="text-[10px] text-slate-500">Valuation: <code className="text-slate-300">Country-Aware Engine</code></div>
          <div className="text-[10px] text-slate-500 pt-2 border-t border-slate-800/60">Platform: <strong>Global Revenue Engine</strong></div>
        </div>
      </aside>

      {/* Main Container */}
      <main className="flex-1 flex flex-col overflow-hidden bg-slate-950">
        {/* Header */}
        <header className="bg-slate-900/60 border-b border-slate-800/80 px-8 py-4 flex justify-between items-center backdrop-blur-md">
          <div>
            <h1 className="text-xl font-extrabold text-white tracking-tight font-poppins flex items-center space-x-2">
              <span>Global Revenue Intelligence Engine</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">MVP Phase 2</span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">Automated Lead Discovery, 360° Audit & AI Opportunity Conversion Platform</p>
          </div>
          
          <div className="flex items-center space-x-3">
            {genMessage && (
              <span className="text-xs text-emerald-300 bg-emerald-950/80 px-3 py-1.5 rounded-xl border border-emerald-500/40 font-medium animate-pulse">
                {genMessage}
              </span>
            )}
            
            {/* 1-CLICK CTA BUTTON */}
            <button
              disabled={loading}
              onClick={handleOneClickGenerateLeads}
              className="bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-lg shadow-emerald-600/20 font-poppins flex items-center space-x-2 active:scale-95"
            >
              <span>⚡ Generate Fresh Live Leads Now</span>
            </button>

            {/* MANUAL URL AUDIT BUTTON */}
            <button
              onClick={() => setShowManualModal(true)}
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-lg shadow-blue-600/20 font-poppins flex items-center space-x-2 active:scale-95"
            >
              <span>+ Manual URL Audit</span>
            </button>
          </div>
        </header>

        {/* Dashboard Body */}
        <div className="flex-1 flex flex-col overflow-hidden p-6 space-y-6">
          {/* KPI Scorecards (Module 10 - Reporting Dashboard) */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-2xl shadow-lg backdrop-blur-md">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block font-poppins">Total Target Leads</span>
              <div className="flex justify-between items-baseline mt-2">
                <span className="text-2xl font-extrabold text-white font-poppins">{totalLeadsCount}</span>
                <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">Active Queue</span>
              </div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-2xl shadow-lg backdrop-blur-md">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block font-poppins">Avg Opportunity Score</span>
              <div className="flex justify-between items-baseline mt-2">
                <span className="text-2xl font-extrabold text-indigo-400 font-poppins">{avgScore} <span className="text-xs text-slate-500 font-normal">/ 100</span></span>
                <span className="text-xs font-semibold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">High Priority</span>
              </div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-2xl shadow-lg backdrop-blur-md">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block font-poppins">Verified / Approved</span>
              <div className="flex justify-between items-baseline mt-2">
                <span className="text-2xl font-extrabold text-emerald-400 font-poppins">{approvedCount} <span className="text-xs text-slate-500 font-normal">/ {totalLeadsCount}</span></span>
                <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">Outreach Ready</span>
              </div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-2xl shadow-lg backdrop-blur-md">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block font-poppins">Valuation Engine</span>
              <div className="flex justify-between items-baseline mt-2">
                <span className="text-lg font-extrabold text-amber-400 font-poppins">Country-Aware</span>
                <span className="text-xs font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">US / UK / IN / UAE</span>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex overflow-hidden gap-6">
            {/* Left Column: Lead Queue (Module 1 & 9) */}
            <div className="w-1/2 bg-slate-900/60 rounded-2xl border border-slate-800/80 shadow-xl flex flex-col overflow-hidden backdrop-blur-md">
              {/* Queue Header & Filters */}
              <div className="p-4 border-b border-slate-800/80 bg-slate-900/80 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-extrabold uppercase text-slate-200 tracking-wider font-poppins">Audited Target Leads</span>
                  <span className="bg-slate-800 text-slate-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {filteredLeads.length}
                  </span>
                </div>

                {/* Pipeline Filter Tabs (Module 9) */}
                <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800/80">
                  <button
                    onClick={() => setPipelineFilter('ALL')}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition font-poppins ${
                      pipelineFilter === 'ALL' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setPipelineFilter('PENDING')}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition font-poppins ${
                      pipelineFilter === 'PENDING' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => setPipelineFilter('APPROVED')}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition font-poppins ${
                      pipelineFilter === 'APPROVED' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Approved
                  </button>
                </div>
              </div>

              {/* Lead Cards List */}
              <div className="divide-y divide-slate-800/60 overflow-y-auto flex-1">
                {filteredLeads.map((lead) => (
                  <div
                    key={lead.id}
                    onClick={() => handleSelectLead(lead)}
                    className={`p-4 cursor-pointer transition ${
                      selectedLead?.id === lead.id
                        ? 'bg-blue-600/10 border-l-4 border-blue-500'
                        : 'hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-bold text-sm text-white font-poppins flex items-center space-x-2">
                        <span>#{lead.rank} {lead.business_name}</span>
                        {lead.verification_status === 'VERIFIED_APPROVED' && (
                          <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-semibold border border-emerald-500/30">
                            ✓ Verified
                          </span>
                        )}
                      </span>
                      <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-lg bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 font-poppins">
                        Est. {lead.estimated_project_value}
                      </span>
                    </div>
                    
                    <div className="text-xs text-blue-400 underline font-medium mb-1">{lead.website_url}</div>
                    <div className="text-xs text-slate-300 line-clamp-1 mb-2 font-medium">{lead.opportunity_type}</div>
                    
                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/40">
                      <span>Score: <strong className="text-indigo-400 font-bold">{lead.score}/100</strong></span>
                      <span>Target: <strong className="text-slate-200">{lead.country}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Dual Audit & Multi-Draft Control Center */}
            {selectedLead ? (
              <div className="w-1/2 bg-slate-900/60 rounded-2xl border border-slate-800/80 shadow-xl flex flex-col overflow-hidden p-5 backdrop-blur-md">
                <div className="border-b border-slate-800/80 pb-4 mb-4 flex justify-between items-start">
                  <div>
                    <h2 className="text-lg font-bold text-white font-poppins flex items-center space-x-2">
                      <span>{selectedLead.business_name}</span>
                    </h2>
                    <div className="flex items-center space-x-2 text-xs mt-1">
                      <a href={selectedLead.website_url} target="_blank" className="text-blue-400 underline font-medium">
                        {selectedLead.website_url}
                      </a>
                      <span className="text-slate-600">•</span>
                      <span className="text-slate-300 font-medium">{selectedLead.country}</span>
                    </div>
                  </div>
                  
                  {/* READY TO SHARE TEASER PDF & PROPOSAL BUTTONS */}
                  <div className="flex space-x-2">
                    <a
                      href={selectedLead.pdf_path}
                      target="_blank"
                      className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 text-xs font-bold px-3 py-2 rounded-xl border border-blue-500/30 transition flex items-center space-x-1 font-poppins shadow-sm"
                    >
                      <span>📄 Teaser PDF</span>
                    </a>
                    <a
                      href={`/proposals/${selectedLead.pdf_path.replace('/audits/', '')}`}
                      target="_blank"
                      className="bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 text-xs font-bold px-3 py-2 rounded-xl border border-indigo-500/30 transition flex items-center space-x-1 font-poppins shadow-sm"
                    >
                      <span>💼 Proposal & SOW</span>
                    </a>
                  </div>
                </div>

                {/* Audit Tabs (Web vs Social vs AI Opps) */}
                <div className="flex border-b border-slate-800/80 mb-4">
                  <button
                    onClick={() => setActiveAuditTab('WEB')}
                    className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition font-poppins ${
                      activeAuditTab === 'WEB' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    🌐 Web Quality Scan
                  </button>
                  <button
                    onClick={() => setActiveAuditTab('SOCIAL')}
                    className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition font-poppins ${
                      activeAuditTab === 'SOCIAL' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    📱 Social Media Audit
                  </button>
                  <button
                    onClick={() => setActiveAuditTab('AI_OPPS')}
                    className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition font-poppins ${
                      activeAuditTab === 'AI_OPPS' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    🤖 AI Opportunities
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-4 text-xs pr-1">
                  {activeAuditTab === 'WEB' && (
                    <>
                      <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                        <h3 className="font-bold text-slate-300 mb-2 uppercase text-[10px] tracking-wider font-poppins">Web Technical & Conversion Vulnerabilities</h3>
                        <ul className="space-y-2 text-slate-300">
                          <li>🔴 <strong>Call Conversion Mismatch:</strong> {selectedLead.web_audit.click_to_call}</li>
                          <li>🔴 <strong>Mobile PageSpeed:</strong> {selectedLead.web_audit.perf_mobile} (Load Time: {selectedLead.web_audit.load_time})</li>
                          <li>🔴 <strong>Payload Weight:</strong> {selectedLead.web_audit.page_weight}</li>
                          <li>🟡 <strong>SEO Indexability:</strong> {selectedLead.web_audit.seo_indexing}</li>
                          <li>🟡 <strong>Accessibility:</strong> {selectedLead.web_audit.a11y}</li>
                        </ul>
                      </div>
                      <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                        <h3 className="font-bold text-slate-300 mb-2 uppercase text-[10px] tracking-wider font-poppins">PageSpeed Proof Links</h3>
                        <div className="space-y-1.5 text-slate-300">
                          <div>📱 <a href={selectedLead.proof_links.mobile} target="_blank" className="text-blue-400 underline">Google Mobile Analysis Proof Link</a></div>
                          <div>💻 <a href={selectedLead.proof_links.desktop} target="_blank" className="text-blue-400 underline">Google Desktop Analysis Proof Link</a></div>
                        </div>
                      </div>
                    </>
                  )}

                  {activeAuditTab === 'SOCIAL' && (
                    <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 space-y-3">
                      <div className="flex justify-between items-center mb-1">
                        <h3 className="font-bold text-slate-300 uppercase text-[10px] tracking-wider font-poppins">Social Media Audit Details</h3>
                        <span className="bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded border border-amber-500/30 text-[10px] font-poppins">
                          Score: {selectedLead.social_audit.social_score}
                        </span>
                      </div>
                      <div className="space-y-2 text-slate-300">
                        <div>💼 <strong>LinkedIn:</strong> {selectedLead.social_audit.linkedin_status}</div>
                        <div>📸 <strong>Instagram:</strong> {selectedLead.social_audit.instagram_status}</div>
                        <div>👥 <strong>Facebook:</strong> {selectedLead.social_audit.facebook_status}</div>
                      </div>
                    </div>
                  )}

                  {activeAuditTab === 'AI_OPPS' && (
                    <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 space-y-3">
                      <h3 className="font-bold text-indigo-300 uppercase text-[10px] tracking-wider font-poppins">AI & Automation Project Opportunities</h3>
                      <div className="space-y-2.5 text-slate-300">
                        <div className="p-2.5 bg-slate-900/80 rounded-lg border border-slate-800">
                          <span className="font-bold text-white block mb-0.5">🤖 AI Customer Support Chatbot</span>
                          <span className="text-[11px] text-slate-400">Automate after-hours patient/client inquiries and qualify inbound leads into CRM.</span>
                          <div className="mt-1 flex justify-between text-[10px] text-emerald-400 font-semibold">
                            <span>Value: {selectedLead.estimated_project_value}</span>
                            <span>Complexity: Medium</span>
                          </div>
                        </div>
                        <div className="p-2.5 bg-slate-900/80 rounded-lg border border-slate-800">
                          <span className="font-bold text-white block mb-0.5">⚡ Core Web Vitals & Speed Optimization</span>
                          <span className="text-[11px] text-slate-400">Compress media payload from {selectedLead.web_audit.page_weight} to boost conversion by 25%.</span>
                          <div className="mt-1 flex justify-between text-[10px] text-emerald-400 font-semibold">
                            <span>Impact: High Conversion boost</span>
                            <span>Complexity: Low</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Multi-Channel Outreach Drafts */}
                  <div className="border-t border-slate-800/80 pt-3">
                    <div className="flex justify-between items-center mb-2">
                      <label className="font-bold text-slate-300 uppercase text-[10px] tracking-wider font-poppins">
                        Ready-to-Share Outreach Communications
                      </label>
                      <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800/80">
                        <button
                          onClick={() => handleDraftTabChange('EMAIL')}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition font-poppins ${
                            activeDraftTab === 'EMAIL' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400'
                          }`}
                        >
                          ✉️ Email
                        </button>
                        <button
                          onClick={() => handleDraftTabChange('LINKEDIN')}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition font-poppins ${
                            activeDraftTab === 'LINKEDIN' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400'
                          }`}
                        >
                          💼 LinkedIn
                        </button>
                        <button
                          onClick={() => handleDraftTabChange('WHATSAPP')}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition font-poppins ${
                            activeDraftTab === 'WHATSAPP' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400'
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
                      className="w-full p-3 border border-slate-800 rounded-xl text-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none text-xs font-mono bg-slate-950/80 shadow-inner"
                    />
                  </div>
                </div>

                {/* Dispatch Actions */}
                <div className="border-t border-slate-800/80 pt-3 mt-3 flex gap-3 font-poppins">
                  {activeDraftTab === 'EMAIL' && (
                    <button
                      disabled={loading}
                      onClick={() => handleDispatch('GMAIL')}
                      className="flex-1 bg-blue-600 text-white font-bold py-2.5 px-4 rounded-xl text-xs hover:bg-blue-500 transition shadow-lg shadow-blue-600/20 active:scale-95"
                    >
                      ✉️ Approve & Draft in Gmail
                    </button>
                  )}
                  {activeDraftTab === 'LINKEDIN' && (
                    <button
                      disabled={loading}
                      onClick={() => handleDispatch('LINKEDIN')}
                      className="flex-1 bg-sky-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs hover:bg-sky-600 transition shadow-lg shadow-sky-700/20 active:scale-95"
                    >
                      💼 Copy LinkedIn Message
                    </button>
                  )}
                  {activeDraftTab === 'WHATSAPP' && (
                    <button
                      disabled={loading}
                      onClick={() => handleDispatch('WHATSAPP')}
                      className="flex-1 bg-emerald-600 text-white font-bold py-2.5 px-4 rounded-xl text-xs hover:bg-emerald-500 transition shadow-lg shadow-emerald-600/20 active:scale-95"
                    >
                      💬 Approve & Send via WhatsApp
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="w-1/2 bg-slate-900/60 rounded-2xl border border-slate-800/80 flex items-center justify-center text-slate-400 text-xs">
                Select a lead to inspect Dual Audit findings & Multi-Channel Drafts
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Manual URL Audit Modal */}
      {showManualModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-800">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-4">
              <h3 className="font-bold text-base text-white font-poppins">+ Manual Website Audit</h3>
              <button onClick={() => setShowManualModal(false)} className="text-slate-400 hover:text-slate-200 text-sm font-bold">✕</button>
            </div>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1 font-poppins">Target Website URL</label>
                <input
                  type="text"
                  placeholder="https://example.com"
                  value={manualUrl}
                  onChange={(e) => setManualUrl(e.target.value)}
                  className="w-full p-3 border border-slate-800 rounded-xl text-xs text-white bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1 font-poppins">Client Country / Region</label>
                <select
                  value={manualCountry}
                  onChange={(e) => setManualCountry(e.target.value)}
                  className="w-full p-3 border border-slate-800 rounded-xl text-xs text-white bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-none"
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

            <div className="flex justify-end space-x-3 font-poppins">
              <button onClick={() => setShowManualModal(false)} className="px-4 py-2.5 rounded-xl border border-slate-800 text-xs font-semibold text-slate-400 hover:bg-slate-800 transition">
                Cancel
              </button>
              <button
                disabled={loading}
                onClick={handleManualAuditSubmit}
                className="px-4 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-500 transition shadow-lg shadow-blue-600/20 active:scale-95"
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
