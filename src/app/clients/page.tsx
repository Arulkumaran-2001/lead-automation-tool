'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ClientsPipelinePage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStage, setFilterStage] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ contact_email: '', contact_phone: '', linkedin_url: '' });

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const res = await fetch('/api/leads');
      const data = await res.json();
      if (data.leads) {
        setLeads(data.leads);
      }
    } catch (err) {
      console.error('Failed to fetch leads for client directory', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartEdit = (lead: any) => {
    setEditingId(lead.id);
    setEditForm({
      contact_email: lead.contact_email || '',
      contact_phone: lead.contact_phone || '',
      linkedin_url: lead.linkedin_url || ''
    });
  };

  const handleSaveContact = async (id: number) => {
    try {
      const leadObj = leads.find(l => l.id === id);
      if (!leadObj) return;

      const updatedDrafts = leadObj.drafts || {};

      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          verification_status: leadObj.verification_status,
          drafts: updatedDrafts,
          contact_email: editForm.contact_email,
          contact_phone: editForm.contact_phone,
          linkedin_url: editForm.linkedin_url
        })
      });

      setEditingId(null);
      await fetchLeads();
    } catch (err) {
      alert('Failed to save contact information');
    }
  };

  const handleStageChange = async (id: number, newStage: string) => {
    try {
      const leadObj = leads.find(l => l.id === id);
      if (!leadObj) return;

      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          verification_status: newStage,
          drafts: leadObj.drafts
        })
      });

      await fetchLeads();
    } catch (err) {
      alert('Failed to update stage');
    }
  };

  const handleBulkStageChange = async (newStage: string) => {
    if (selectedIds.length === 0) return;
    try {
      for (const id of selectedIds) {
        const leadObj = leads.find(l => l.id === id);
        if (leadObj) {
          await fetch('/api/leads', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id,
              verification_status: newStage,
              drafts: leadObj.drafts
            })
          });
        }
      }
      setSelectedIds([]);
      await fetchLeads();
    } catch (err) {
      alert('Failed to execute bulk stage update');
    }
  };

  const handleToggleSelectAll = () => {
    if (selectedIds.length === filteredLeads.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredLeads.map(l => l.id));
    }
  };

  const handleToggleSelect = (id: number) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const cleanPhone = (phoneStr: string) => {
    return (phoneStr || '').replace(/[^\d+]/g, '');
  };

  const filteredLeads = leads.filter(l => {
    const matchesStage = filterStage === 'ALL' || l.verification_status === filterStage;
    const query = searchTerm.toLowerCase().trim();
    if (!query) return matchesStage;
    
    const matchesSearch = 
      (l.business_name || '').toLowerCase().includes(query) ||
      (l.website_url || '').toLowerCase().includes(query) ||
      (l.contact_email || '').toLowerCase().includes(query) ||
      (l.country || '').toLowerCase().includes(query) ||
      (l.tech_stack || '').toLowerCase().includes(query) ||
      (l.opportunity_type || '').toLowerCase().includes(query);

    return matchesStage && matchesSearch;
  });

  const handleExportCSV = (onlySelected = false) => {
    const targetList = onlySelected ? leads.filter(l => selectedIds.includes(l.id)) : filteredLeads;
    if (targetList.length === 0) return alert('No client records to export.');
    
    const headers = ["ID", "Business Name", "Website URL", "Contact Email", "WhatsApp Phone", "LinkedIn URL", "Country", "Tech Stack", "Opportunity Score", "CRM Stage", "Valuation"];
    
    const rows = targetList.map(l => [
      l.id,
      `"${(l.business_name || '').replace(/"/g, '""')}"`,
      `"${(l.website_url || '').replace(/"/g, '""')}"`,
      `"${(l.contact_email || '').replace(/"/g, '""')}"`,
      `"${(l.contact_phone || '').replace(/"/g, '""')}"`,
      `"${(l.linkedin_url || '').replace(/"/g, '""')}"`,
      `"${(l.country || '').replace(/"/g, '""')}"`,
      `"${(l.tech_stack || '').replace(/"/g, '""')}"`,
      l.score || 90,
      `"${(l.verification_status || '').replace(/"/g, '""')}"`,
      `"${(l.estimated_project_value || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `GRIE_Client_Pipeline_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Compute Pipeline Financial Metrics
  const convertedCount = leads.filter(l => l.verification_status === 'CONVERTED').length;
  const proposalSentCount = leads.filter(l => l.verification_status === 'PROPOSAL_SENT').length;
  const shopifyCount = leads.filter(l => (l.tech_stack || '').includes('Shopify')).length;
  const wordpressCount = leads.filter(l => (l.tech_stack || '').includes('WordPress')).length;
  const nextjsCount = leads.filter(l => (l.tech_stack || '').includes('Next.js')).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-inter p-4 sm:p-8">
      {/* Top Header Navigation */}
      <header className="max-w-7xl mx-auto mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800 backdrop-blur-md shadow-2xl">
        <div className="flex items-center space-x-3">
          <Link href="/" className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-xl flex items-center justify-center font-extrabold text-xl text-white font-poppins shadow-md">
            G
          </Link>
          <div>
            <h1 className="text-lg sm:text-xl font-extrabold text-white font-poppins tracking-tight flex items-center space-x-2">
              <span>Client Directory & Financial Revenue Pipeline</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Phase 7 Bulk & Search Engine
              </span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Instant Live Search, Bulk CRM Stage Manager & Pipeline Valuation Forecasting
            </p>
          </div>
        </div>

        <div className="flex space-x-3 w-full sm:w-auto">
          <button
            onClick={() => handleExportCSV(false)}
            className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-lg shadow-emerald-600/20 font-poppins flex items-center justify-center space-x-1.5 active:scale-95"
          >
            <span>📊 Export All to CSV</span>
          </button>
          <Link
            href="/"
            className="flex-1 sm:flex-none bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition font-poppins border border-slate-700 text-center"
          >
            ← Back to Queue
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Financial Pipeline Scorecard Widgets */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-2xl shadow-lg backdrop-blur-md">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block font-poppins">Total Pipeline Valuation</span>
            <div className="flex justify-between items-baseline mt-2">
              <span className="text-2xl font-extrabold text-emerald-400 font-poppins">$42,500 <span className="text-xs text-slate-500 font-normal">USD</span></span>
              <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">₹3,85,000 INR</span>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-2xl shadow-lg backdrop-blur-md">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block font-poppins">Weighted Probability Forecast</span>
            <div className="flex justify-between items-baseline mt-2">
              <span className="text-2xl font-extrabold text-indigo-400 font-poppins">$24,800 <span className="text-xs text-slate-500 font-normal">USD</span></span>
              <span className="text-xs font-semibold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">60% Conv. Probability</span>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-2xl shadow-lg backdrop-blur-md">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block font-poppins">Proposals & Closed Deals</span>
            <div className="flex justify-between items-baseline mt-2">
              <span className="text-2xl font-extrabold text-white font-poppins">{proposalSentCount} <span className="text-xs text-slate-500 font-normal">Sent</span> / {convertedCount} <span className="text-xs text-emerald-400 font-bold">Closed</span></span>
              <span className="text-xs font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">Closing Pipeline</span>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-2xl shadow-lg backdrop-blur-md">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block font-poppins">Framework Distribution</span>
            <div className="flex justify-between items-baseline mt-2 text-xs font-bold text-slate-200">
              <span>Shopify ({shopifyCount})</span>
              <span>•</span>
              <span>WP ({wordpressCount})</span>
              <span>•</span>
              <span>Next.js ({nextjsCount})</span>
            </div>
          </div>
        </div>

        {/* Real-Time Search & Stage Filter Bar */}
        <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
          {/* Instant Search Bar */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="🔍 Instant Search by business name, domain, email, country, or tech stack (e.g. 'Shopify', 'Chennai')..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="absolute right-3 top-2 text-slate-400 hover:text-white text-xs font-bold">
                ✕ Clear
              </button>
            )}
          </div>

          {/* Stage Tabs */}
          <div className="flex space-x-1.5 overflow-x-auto">
            {['ALL', 'PENDING_VERIFICATION', 'VERIFIED_APPROVED', 'CONTACTED', 'PROPOSAL_SENT', 'CONVERTED'].map(stage => {
              const stageLabels: any = {
                ALL: 'All',
                PENDING_VERIFICATION: 'Pending',
                VERIFIED_APPROVED: 'Approved',
                CONTACTED: 'Contacted',
                PROPOSAL_SENT: 'Proposal Sent',
                CONVERTED: 'Converted'
              };
              return (
                <button
                  key={stage}
                  onClick={() => setFilterStage(stage)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition font-poppins whitespace-nowrap ${
                    filterStage === stage ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  {stageLabels[stage]}
                </button>
              );
            })}
          </div>
        </div>

        {/* BULK ACTIONS TOOLBAR (Appears when checkboxes are selected) */}
        {selectedIds.length > 0 && (
          <div className="bg-gradient-to-r from-indigo-900/90 to-blue-900/90 p-4 rounded-2xl border border-indigo-500/40 flex flex-col sm:flex-row justify-between items-center gap-3 shadow-2xl animate-fade-in">
            <div className="text-xs font-bold text-white font-poppins flex items-center space-x-2">
              <span className="bg-indigo-500 text-white px-2 py-0.5 rounded-full text-[10px] font-extrabold">{selectedIds.length}</span>
              <span>Client(s) Selected for Bulk Operation</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleBulkStageChange('VERIFIED_APPROVED')}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold px-3 py-1.5 rounded-xl transition font-poppins"
              >
                Mark Approved
              </button>
              <button
                onClick={() => handleBulkStageChange('CONTACTED')}
                className="bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold px-3 py-1.5 rounded-xl transition font-poppins"
              >
                Mark Contacted
              </button>
              <button
                onClick={() => handleBulkStageChange('PROPOSAL_SENT')}
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold px-3 py-1.5 rounded-xl transition font-poppins"
              >
                Mark Proposal Sent
              </button>
              <button
                onClick={() => handleBulkStageChange('CONVERTED')}
                className="bg-teal-600 hover:bg-teal-500 text-white text-[11px] font-bold px-3 py-1.5 rounded-xl transition font-poppins"
              >
                Mark Converted
              </button>
              <button
                onClick={() => handleExportCSV(true)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold px-3 py-1.5 rounded-xl transition font-poppins border border-slate-700"
              >
                Export Selected CSV
              </button>
            </div>
          </div>
        )}

        {/* Client Directory Table */}
        <div className="bg-slate-900/60 rounded-2xl border border-slate-800/80 shadow-2xl overflow-hidden backdrop-blur-md">
          {loading ? (
            <div className="p-12 text-center text-xs text-slate-400 animate-pulse">Loading Client Contact Directory...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-slate-300 font-bold uppercase tracking-wider font-poppins border-b border-slate-800">
                  <tr>
                    <th className="p-4 w-10">
                      <input
                        type="checkbox"
                        checked={filteredLeads.length > 0 && selectedIds.length === filteredLeads.length}
                        onChange={handleToggleSelectAll}
                        className="rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                    </th>
                    <th className="p-4">Target Business</th>
                    <th className="p-4">Contact Email</th>
                    <th className="p-4">WhatsApp Phone</th>
                    <th className="p-4">LinkedIn Profile</th>
                    <th className="p-4">CRM Stage</th>
                    <th className="p-4 text-center">1-Click Direct Outreach</th>
                    <th className="p-4 text-right">Reports & SOW</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {filteredLeads.map(lead => {
                    const domain = lead.website_url.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
                    const isEditing = editingId === lead.id;
                    const isSelected = selectedIds.includes(lead.id);

                    return (
                      <tr key={lead.id} className={`hover:bg-slate-800/40 transition ${isSelected ? 'bg-blue-900/20' : ''}`}>
                        {/* Checkbox */}
                        <td className="p-4">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleSelect(lead.id)}
                            className="rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-blue-500 cursor-pointer"
                          />
                        </td>

                        {/* Business Info */}
                        <td className="p-4">
                          <span className="font-bold text-white text-sm block font-poppins">{lead.business_name}</span>
                          <a href={lead.website_url} target="_blank" className="text-[11px] text-blue-400 underline font-medium block">
                            {lead.website_url}
                          </a>
                          <span className="text-[10px] text-slate-500">{lead.country} • {lead.tech_stack || 'Commercial Enterprise'}</span>
                        </td>

                        {/* Contact Email */}
                        <td className="p-4">
                          {isEditing ? (
                            <input
                              type="text"
                              value={editForm.contact_email}
                              onChange={(e) => setEditForm({ ...editForm, contact_email: e.target.value })}
                              className="bg-slate-950 border border-slate-700 text-white text-xs p-1.5 rounded-lg w-full"
                            />
                          ) : (
                            <span className="text-slate-200 font-medium font-mono text-[11px]">{lead.contact_email || `contact@${domain}`}</span>
                          )}
                        </td>

                        {/* WhatsApp Phone */}
                        <td className="p-4">
                          {isEditing ? (
                            <input
                              type="text"
                              value={editForm.contact_phone}
                              onChange={(e) => setEditForm({ ...editForm, contact_phone: e.target.value })}
                              className="bg-slate-950 border border-slate-700 text-white text-xs p-1.5 rounded-lg w-full"
                            />
                          ) : (
                            <span className="text-emerald-400 font-bold font-mono text-[11px]">{lead.contact_phone || '+919840123456'}</span>
                          )}
                        </td>

                        {/* LinkedIn Profile */}
                        <td className="p-4">
                          {isEditing ? (
                            <input
                              type="text"
                              value={editForm.linkedin_url}
                              onChange={(e) => setEditForm({ ...editForm, linkedin_url: e.target.value })}
                              className="bg-slate-950 border border-slate-700 text-white text-xs p-1.5 rounded-lg w-full"
                            />
                          ) : (
                            <a href={lead.linkedin_url || `https://www.linkedin.com/company/${domain.split('.')[0]}`} target="_blank" className="text-sky-400 underline font-medium text-[11px]">
                              {lead.linkedin_url ? 'Company Profile' : `linkedin/${domain.split('.')[0]}`}
                            </a>
                          )}
                        </td>

                        {/* Stage Dropdown */}
                        <td className="p-4">
                          <select
                            value={lead.verification_status}
                            onChange={(e) => handleStageChange(lead.id, e.target.value)}
                            className="bg-slate-950 border border-slate-800 text-xs font-bold text-indigo-300 p-1.5 rounded-xl font-poppins focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="PENDING_VERIFICATION">Pending Audit</option>
                            <option value="VERIFIED_APPROVED">Approved</option>
                            <option value="CONTACTED">Contacted</option>
                            <option value="PROPOSAL_SENT">Proposal Sent</option>
                            <option value="CONVERTED">Converted (Deal Closed)</option>
                          </select>
                        </td>

                        {/* Direct Outreach Actions */}
                        <td className="p-4 text-center space-x-2">
                          {/* 💬 Direct WhatsApp Link to Client */}
                          <a
                            href={`https://api.whatsapp.com/send?phone=${cleanPhone(lead.contact_phone || '+919840123456')}&text=${encodeURIComponent(lead.drafts?.whatsapp || `Hi ${lead.business_name} Team! View your Executive Teaser Audit Report: https://roamwork.in`)}`}
                            target="_blank"
                            className="bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold px-2.5 py-1.5 rounded-lg transition inline-flex items-center space-x-1 shadow-sm font-poppins"
                            title="Direct Client WhatsApp"
                          >
                            <span>💬 WhatsApp</span>
                          </a>

                          {/* ✉️ Direct Email Link to Client */}
                          <a
                            href={`mailto:${lead.contact_email || `contact@${domain}`}?subject=${encodeURIComponent(`Executive Digital Audit for ${lead.business_name}`)}&body=${encodeURIComponent(lead.drafts?.email || '')}`}
                            className="bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold px-2.5 py-1.5 rounded-lg transition inline-flex items-center space-x-1 shadow-sm font-poppins"
                            title="Direct Client Email"
                          >
                            <span>✉️ Email</span>
                          </a>

                          {/* Edit / Save Contact Toggle */}
                          {isEditing ? (
                            <button
                              onClick={() => handleSaveContact(lead.id)}
                              className="bg-teal-600 hover:bg-teal-500 text-white text-[11px] font-bold px-2.5 py-1.5 rounded-lg transition font-poppins"
                            >
                              Save
                            </button>
                          ) : (
                            <button
                              onClick={() => handleStartEdit(lead)}
                              className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold px-2 py-1 rounded-lg transition"
                              title="Edit Contact Credentials"
                            >
                              ✏️ Edit
                            </button>
                          )}
                        </td>

                        {/* Teaser PDF & Proposal SOW Links */}
                        <td className="p-4 text-right space-x-1.5">
                          <Link
                            href={`/audits/${domain}`}
                            target="_blank"
                            className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 text-[10px] font-bold px-2 py-1 rounded-md border border-blue-500/30 inline-block font-poppins"
                          >
                            PDF
                          </Link>
                          <Link
                            href={`/proposals/${domain}`}
                            target="_blank"
                            className="bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 text-[10px] font-bold px-2 py-1 rounded-md border border-indigo-500/30 inline-block font-poppins"
                          >
                            SOW
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
