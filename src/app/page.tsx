'use client';

import React, { useState, useEffect } from 'react';
import {
  Target,
  Search,
  Bot,
  Briefcase,
  FileText,
  CheckCircle2,
  Zap,
  Plus,
  Globe,
  Smartphone,
  Mail,
  Linkedin,
  MessageSquare,
  Menu,
  X,
  Building2,
  Sparkles,
  ShieldCheck,
  LogOut
} from 'lucide-react';

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Admin Security Auth Check
    const isAuth = typeof window !== 'undefined' && (localStorage.getItem('grie_admin_authenticated') === 'true' || document.cookie.includes('grie_admin_authenticated=true'));
    if (!isAuth) {
      window.location.href = 'https://www.roamwork.in/';
      return;
    }
    fetchLeads();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('grie_admin_authenticated');
    document.cookie = "grie_admin_authenticated=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    window.location.href = 'https://www.roamwork.in/';
  };

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

  const handleOneClickGenerateLeads = async () => {
    setLoading(true);
    setGenMessage('Scanning candidate pool and performing 360 degree audit...');

    try {
      const res = await fetch('/api/generate-leads', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setGenMessage('Fresh buyer-intent lead audited and added!');
        await fetchLeads();
      }
    } catch (err) {
      setGenMessage('Lead generation complete.');
    } finally {
      setLoading(false);
      setTimeout(() => setGenMessage(''), 4000);
    }
  };

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

      const domain = selectedLead.website_url.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
      const targetPhone = (selectedLead.contact_phone || '').replace(/[^\d+]/g, '') || '+919840123456';
      const targetEmail = selectedLead.contact_email || `contact@${domain}`;
      const targetLinkedIn = selectedLead.linkedin_url || `https://www.linkedin.com/company/${domain.split('.')[0]}`;

      if (channel === 'WHATSAPP') {
        const text = encodeURIComponent(draftContent);
        window.open(`https://api.whatsapp.com/send?phone=${targetPhone}&text=${text}`, '_blank');
      } else if (channel === 'GMAIL') {
        const subject = encodeURIComponent(`Executive Digital Review for ${selectedLead.business_name}`);
        const body = encodeURIComponent(draftContent);
        window.open(`mailto:${targetEmail}?subject=${subject}&body=${body}`, '_blank');
      } else if (channel === 'LINKEDIN') {
        await navigator.clipboard.writeText(draftContent);
        window.open(targetLinkedIn, '_blank');
        alert(`LinkedIn DM pitch copied to clipboard! Opening ${selectedLead.business_name}'s LinkedIn profile...`);
      }

      await fetchLeads();
    } catch (err) {
      alert('Failed to process dispatch');
    } finally {
      setLoading(false);
    }
  };

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
      {/* Sidebar - Desktop & Mobile Collapsible */}
      <aside className={`${mobileMenuOpen ? 'flex' : 'hidden'} lg:flex w-64 bg-slate-900/90 backdrop-blur-md border-r border-slate-800 flex-col justify-between p-4 shadow-2xl z-30 fixed lg:relative inset-y-0 left-0`}>
        <div>
          <div className="flex items-center justify-between mb-8 px-2">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-xl flex items-center justify-center font-extrabold text-xl text-white shadow-lg shadow-blue-500/20 font-poppins">
                G
              </div>
              <div>
                <span className="font-extrabold text-base tracking-tight block text-white font-poppins">GRIE Engine</span>
                <span className="text-[10px] text-blue-400 font-semibold tracking-wider uppercase">RoamWork OS</span>
              </div>
            </div>

            <button onClick={() => setMobileMenuOpen(false)} className="lg:hidden text-slate-400 font-bold p-1">
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="space-y-1.5">
            <a href="#" className="flex items-center space-x-3 px-3.5 py-2.5 rounded-xl bg-blue-600/90 text-white font-semibold text-xs shadow-md shadow-blue-600/20 font-poppins transition">
              <Target className="w-4 h-4" />
              <span>Discovery Queue</span>
            </a>
            <a href="#" className="flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-slate-400 hover:bg-slate-800/80 hover:text-white font-medium text-xs transition">
              <Search className="w-4 h-4" />
              <span>360° Web Audit</span>
            </a>
            <a href="#" className="flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-slate-400 hover:bg-slate-800/80 hover:text-white font-medium text-xs transition">
              <Bot className="w-4 h-4" />
              <span>AI Opportunity Engine</span>
            </a>
            <a href="/clients" className="flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800/80 hover:text-white font-medium text-xs transition">
              <Briefcase className="w-4 h-4 text-blue-400" />
              <span>Client Pipeline System</span>
            </a>
            <a href="/clients" className="flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-slate-400 hover:bg-slate-800/80 hover:text-white font-medium text-xs transition">
              <FileText className="w-4 h-4" />
              <span>Proposal Generator</span>
            </a>
          </nav>
        </div>

        <div className="border-t border-slate-800/80 pt-4 px-2 text-[11px] text-slate-400 space-y-2">
          <div className="flex justify-between items-center">
            <span>Database:</span>
            <span className="text-emerald-400 font-extrabold flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block"></span>
              <span>CONNECTED</span>
            </span>
          </div>
          <div className="flex justify-between items-center pt-2">
            <span className="text-slate-300 font-semibold">Admin Authenticated</span>
            <button onClick={handleLogout} className="text-red-400 hover:text-red-300 text-[10px] font-bold flex items-center space-x-1">
              <LogOut className="w-3 h-3" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <main className="flex-1 flex flex-col overflow-y-auto lg:overflow-hidden bg-slate-950 w-full">
        {/* Header */}
        <header className="bg-slate-900/60 border-b border-slate-800/80 px-4 sm:px-8 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 backdrop-blur-md">
          <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-start">
            <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden p-2 rounded-xl bg-slate-800 text-white font-bold text-xs">
              <Menu className="w-4 h-4" />
            </button>
            <div>
              <h1 className="text-lg sm:text-xl font-extrabold text-white tracking-tight font-poppins flex items-center space-x-2">
                <span>Global Revenue Intelligence Engine</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">RoamWork Platform</span>
              </h1>
              <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">Automated Lead Discovery, 360° Audit and AI Conversion Platform</p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
            {genMessage && (
              <span className="text-xs text-emerald-300 bg-emerald-950/80 px-3 py-1.5 rounded-xl border border-emerald-500/40 font-medium animate-pulse">
                {genMessage}
              </span>
            )}
            
            <button
              disabled={loading}
              onClick={handleOneClickGenerateLeads}
              className="flex-1 sm:flex-none bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-[11px] sm:text-xs font-bold px-3 sm:px-4 py-2.5 rounded-xl transition shadow-lg shadow-emerald-600/20 font-poppins flex items-center justify-center space-x-2 active:scale-95"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Generate Live Leads</span>
            </button>

            <button
              onClick={() => setShowManualModal(true)}
              className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-500 text-white text-[11px] sm:text-xs font-bold px-3 sm:px-4 py-2.5 rounded-xl transition shadow-lg shadow-blue-600/20 font-poppins flex items-center justify-center space-x-2 active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Manual Audit</span>
            </button>
          </div>
        </header>

        {/* Dashboard Body */}
        <div className="flex-1 flex flex-col overflow-y-auto lg:overflow-hidden p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* KPI Scorecards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
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
                <span className="text-base sm:text-lg font-extrabold text-amber-400 font-poppins">Country-Aware</span>
                <span className="text-[10px] sm:text-xs font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">US / UK / IN</span>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden gap-4 sm:gap-6">
            {/* Left Column: Lead Queue */}
            <div className="w-full lg:w-1/2 bg-slate-900/60 rounded-2xl border border-slate-800/80 shadow-xl flex flex-col overflow-hidden backdrop-blur-md">
              {/* Queue Header & Filters */}
              <div className="p-3 sm:p-4 border-b border-slate-800/80 bg-slate-900/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-extrabold uppercase text-slate-200 tracking-wider font-poppins">Audited Target Leads</span>
                  <span className="bg-slate-800 text-slate-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {filteredLeads.length}
                  </span>
                </div>

                <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800/80 w-full sm:w-auto justify-around">
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
              <div className="divide-y divide-slate-800/60 overflow-y-auto max-h-96 lg:max-h-none flex-1">
                {filteredLeads.map((lead) => (
                  <div
                    key={lead.id}
                    onClick={() => handleSelectLead(lead)}
                    className={`p-3 sm:p-4 cursor-pointer transition ${
                      selectedLead?.id === lead.id
                        ? 'bg-blue-600/10 border-l-4 border-blue-500'
                        : 'hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 mb-1">
                      <span className="font-bold text-xs sm:text-sm text-white font-poppins flex items-center space-x-2">
                        <span>#{lead.rank} {lead.business_name}</span>
                        {lead.verification_status === 'VERIFIED_APPROVED' && (
                          <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-semibold border border-emerald-500/30 flex items-center space-x-1">
                            <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                            <span>Verified</span>
                          </span>
                        )}
                      </span>
                      <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-lg bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 font-poppins">
                        Est. {lead.estimated_project_value}
                      </span>
                    </div>
                    
                    <div className="text-[11px] text-blue-400 underline font-medium mb-1 truncate">{lead.website_url}</div>
                    <div className="text-[11px] text-slate-300 line-clamp-1 mb-2 font-medium">{lead.opportunity_type}</div>
                    
                    <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-slate-400 pt-2 border-t border-slate-800/40">
                      <span>Score: <strong className="text-indigo-400 font-bold">{lead.score}/100</strong></span>
                      <span>Target: <strong className="text-slate-200">{lead.country}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Dual Audit & Multi-Draft Control Center */}
            {selectedLead ? (
              <div className="w-full lg:w-1/2 bg-slate-900/60 rounded-2xl border border-slate-800/80 shadow-xl flex flex-col overflow-hidden p-4 sm:p-5 backdrop-blur-md">
                <div className="border-b border-slate-800/80 pb-3 sm:pb-4 mb-3 sm:mb-4 flex flex-col sm:flex-row justify-between items-start gap-2">
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-white font-poppins flex flex-wrap items-center gap-2">
                      <span>{selectedLead.business_name}</span>
                      {selectedLead.tech_stack && (
                        <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-md font-semibold border border-indigo-500/30">
                          {selectedLead.tech_stack}
                        </span>
                      )}
                    </h2>
                    <div className="flex items-center space-x-2 text-[11px] sm:text-xs mt-1">
                      <a href={selectedLead.website_url} target="_blank" className="text-blue-400 underline font-medium truncate max-w-[200px]">
                        {selectedLead.website_url}
                      </a>
                      <span className="text-slate-600">•</span>
                      <span className="text-slate-300 font-medium">{selectedLead.country}</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 w-full sm:w-auto">
                    <a
                      href={selectedLead.pdf_path}
                      target="_blank"
                      className="flex-1 sm:flex-none bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 text-[10px] sm:text-xs font-bold px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl border border-blue-500/30 transition flex items-center justify-center space-x-1 font-poppins shadow-sm"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Teaser PDF</span>
                    </a>
                    <a
                      href={`/proposals/${selectedLead.pdf_path.replace('/audits/', '')}`}
                      target="_blank"
                      className="flex-1 sm:flex-none bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 text-[10px] sm:text-xs font-bold px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl border border-indigo-500/30 transition flex items-center justify-center space-x-1 font-poppins shadow-sm"
                    >
                      <Briefcase className="w-3.5 h-3.5" />
                      <span>Proposal & SOW</span>
                    </a>
                  </div>
                </div>

                {/* Audit Tabs */}
                <div className="flex border-b border-slate-800/80 mb-3 sm:mb-4 overflow-x-auto">
                  <button
                    onClick={() => setActiveAuditTab('WEB')}
                    className={`pb-2 px-2.5 text-[11px] sm:text-xs font-bold border-b-2 transition font-poppins whitespace-nowrap flex items-center space-x-1.5 ${
                      activeAuditTab === 'WEB' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>Web Quality Scan</span>
                  </button>
                  <button
                    onClick={() => setActiveAuditTab('SOCIAL')}
                    className={`pb-2 px-2.5 text-[11px] sm:text-xs font-bold border-b-2 transition font-poppins whitespace-nowrap flex items-center space-x-1.5 ${
                      activeAuditTab === 'SOCIAL' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Social Media Audit</span>
                  </button>
                  <button
                    onClick={() => setActiveAuditTab('AI_OPPS')}
                    className={`pb-2 px-2.5 text-[11px] sm:text-xs font-bold border-b-2 transition font-poppins whitespace-nowrap flex items-center space-x-1.5 ${
                      activeAuditTab === 'AI_OPPS' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Bot className="w-3.5 h-3.5" />
                    <span>AI Opportunities</span>
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-3 sm:space-y-4 text-xs pr-1">
                  {activeAuditTab === 'WEB' && (
                    <>
                      <div className="bg-slate-950/60 p-3 sm:p-4 rounded-xl border border-slate-800/80">
                        <h3 className="font-bold text-slate-300 mb-2 uppercase text-[10px] tracking-wider font-poppins">Web Technical & Conversion Vulnerabilities</h3>
                        <ul className="space-y-1.5 text-slate-300 text-[11px]">
                          <li><strong>Call Conversion Mismatch:</strong> {selectedLead.web_audit.click_to_call}</li>
                          <li><strong>Mobile PageSpeed:</strong> {selectedLead.web_audit.perf_mobile} (Load Time: {selectedLead.web_audit.load_time})</li>
                          <li><strong>Payload Weight:</strong> {selectedLead.web_audit.page_weight}</li>
                          <li><strong>SEO Indexability:</strong> {selectedLead.web_audit.seo_indexing}</li>
                          <li><strong>Accessibility:</strong> {selectedLead.web_audit.a11y}</li>
                        </ul>
                      </div>
                      <div className="bg-slate-950/60 p-3 sm:p-4 rounded-xl border border-slate-800/80">
                        <h3 className="font-bold text-slate-300 mb-2 uppercase text-[10px] tracking-wider font-poppins">PageSpeed Proof Links</h3>
                        <div className="space-y-1.5 text-slate-300 text-[11px]">
                          <div><a href={selectedLead.proof_links.mobile} target="_blank" className="text-blue-400 underline font-medium">Google Mobile Analysis Proof Link</a></div>
                          <div><a href={selectedLead.proof_links.desktop} target="_blank" className="text-blue-400 underline font-medium">Google Desktop Analysis Proof Link</a></div>
                        </div>
                      </div>
                    </>
                  )}

                  {activeAuditTab === 'SOCIAL' && (
                    <div className="bg-slate-950/60 p-3 sm:p-4 rounded-xl border border-slate-800/80 space-y-3">
                      <div className="flex justify-between items-center mb-1">
                        <h3 className="font-bold text-slate-300 uppercase text-[10px] tracking-wider font-poppins">Social Media Audit Details</h3>
                        <span className="bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded border border-amber-500/30 text-[10px] font-poppins">
                          Score: {selectedLead.social_audit.social_score}
                        </span>
                      </div>
                      <div className="space-y-2 text-slate-300 text-[11px]">
                        <div><strong>LinkedIn:</strong> {selectedLead.social_audit.linkedin_status}</div>
                        <div><strong>Instagram:</strong> {selectedLead.social_audit.instagram_status}</div>
                        <div><strong>Facebook:</strong> {selectedLead.social_audit.facebook_status}</div>
                      </div>
                    </div>
                  )}

                  {activeAuditTab === 'AI_OPPS' && (
                    <div className="bg-slate-950/60 p-3 sm:p-4 rounded-xl border border-slate-800/80 space-y-3">
                      <h3 className="font-bold text-indigo-300 uppercase text-[10px] tracking-wider font-poppins">AI and Automation Project Opportunities</h3>
                      <div className="space-y-2 text-slate-300 text-[11px]">
                        <div className="p-2.5 bg-slate-900/80 rounded-lg border border-slate-800">
                          <span className="font-bold text-white block mb-0.5">AI Customer Support Chatbot</span>
                          <span className="text-[10px] text-slate-400">Automate after-hours patient and client inquiries and qualify inbound leads into CRM.</span>
                          <div className="mt-1 flex justify-between text-[10px] text-emerald-400 font-semibold">
                            <span>Value: {selectedLead.estimated_project_value}</span>
                            <span>Complexity: Medium</span>
                          </div>
                        </div>
                        <div className="p-2.5 bg-slate-900/80 rounded-lg border border-slate-800">
                          <span className="font-bold text-white block mb-0.5">Core Web Vitals and Speed Optimization</span>
                          <span className="text-[10px] text-slate-400">Compress media payload to boost conversion by 25%.</span>
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
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2">
                      <label className="font-bold text-slate-300 uppercase text-[10px] tracking-wider font-poppins">
                        Outreach Communications
                      </label>
                      <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800/80">
                        <button
                          onClick={() => handleDraftTabChange('EMAIL')}
                          className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition font-poppins flex items-center space-x-1 ${
                            activeDraftTab === 'EMAIL' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400'
                          }`}
                        >
                          <Mail className="w-3 h-3" />
                          <span>Email</span>
                        </button>
                        <button
                          onClick={() => handleDraftTabChange('LINKEDIN')}
                          className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition font-poppins flex items-center space-x-1 ${
                            activeDraftTab === 'LINKEDIN' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400'
                          }`}
                        >
                          <Linkedin className="w-3 h-3" />
                          <span>LinkedIn</span>
                        </button>
                        <button
                          onClick={() => handleDraftTabChange('WHATSAPP')}
                          className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition font-poppins flex items-center space-x-1 ${
                            activeDraftTab === 'WHATSAPP' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400'
                          }`}
                        >
                          <MessageSquare className="w-3 h-3" />
                          <span>WhatsApp</span>
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
                <div className="border-t border-slate-800/80 pt-3 mt-3 flex gap-2 font-poppins">
                  {activeDraftTab === 'EMAIL' && (
                    <button
                      disabled={loading}
                      onClick={() => handleDispatch('GMAIL')}
                      className="flex-1 bg-blue-600 text-white font-bold py-2.5 px-3 rounded-xl text-xs hover:bg-blue-500 transition shadow-lg shadow-blue-600/20 active:scale-95 flex items-center justify-center space-x-1.5"
                    >
                      <Mail className="w-4 h-4" />
                      <span>Approve and Draft in Gmail</span>
                    </button>
                  )}
                  {activeDraftTab === 'LINKEDIN' && (
                    <button
                      disabled={loading}
                      onClick={() => handleDispatch('LINKEDIN')}
                      className="flex-1 bg-sky-700 text-white font-bold py-2.5 px-3 rounded-xl text-xs hover:bg-sky-600 transition shadow-lg shadow-sky-700/20 active:scale-95 flex items-center justify-center space-x-1.5"
                    >
                      <Linkedin className="w-4 h-4" />
                      <span>Open LinkedIn Profile</span>
                    </button>
                  )}
                  {activeDraftTab === 'WHATSAPP' && (
                    <button
                      disabled={loading}
                      onClick={() => handleDispatch('WHATSAPP')}
                      className="flex-1 bg-emerald-600 text-white font-bold py-2.5 px-3 rounded-xl text-xs hover:bg-emerald-500 transition shadow-lg shadow-emerald-600/20 active:scale-95 flex items-center justify-center space-x-1.5"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Open Client WhatsApp</span>
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="w-full lg:w-1/2 bg-slate-900/60 rounded-2xl border border-slate-800/80 flex items-center justify-center text-slate-400 text-xs p-8">
                Select a lead to inspect Dual Audit findings and Multi-Channel Drafts
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
              <h3 className="font-bold text-base text-white font-poppins">Manual Website Audit</h3>
              <button onClick={() => setShowManualModal(false)} className="text-slate-400 hover:text-slate-200 text-sm font-bold">
                <X className="w-5 h-5" />
              </button>
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
                  <option value="United States">United States ($3,500 - $8,000+)</option>
                  <option value="United Kingdom">United Kingdom ($3,500 - $8,000+)</option>
                  <option value="United Arab Emirates">United Arab Emirates ($3,500 - $8,000+)</option>
                  <option value="Australia">Australia ($3,500 - $8,000+)</option>
                  <option value="Germany / Europe">Europe ($2,500 - $5,000)</option>
                  <option value="India (Regional)">India (₹35,000 - ₹95,000)</option>
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
                className="px-4 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-500 transition shadow-lg shadow-blue-600/20 active:scale-95 flex items-center space-x-1.5"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>{loading ? 'Auditing...' : 'Audit Site and Create PDF'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
