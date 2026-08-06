'use client';

import React, { useState, useEffect } from 'react';

export default function Dashboard() {
  const [leads, setLeads] = useState<any[]>([]);
  const [selectedLead, setSelectedLead] = useState<any | null>(null);
  const [customPitch, setCustomPitch] = useState('');
  const [loading, setLoading] = useState(false);

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
          setCustomPitch(data.leads[0].custom_pitch);
        }
      }
    } catch (err) {
      console.error('Failed to fetch leads', err);
    }
  };

  const handleSelectLead = (lead: any) => {
    setSelectedLead(lead);
    setCustomPitch(lead.custom_pitch);
  };

  const handleApproveAndDispatch = async (channel: 'WHATSAPP' | 'GMAIL') => {
    if (!selectedLead) return;
    setLoading(true);

    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedLead.id,
          verification_status: 'VERIFIED_APPROVED',
          custom_pitch: customPitch
        })
      });

      if (channel === 'WHATSAPP') {
        const text = encodeURIComponent(`${customPitch}\n\nRoamWork Executive Teaser Audit Report: https://www.roamwork.in/\nProof: ${selectedLead.proof_links.mobile}`);
        window.open(`https://wa.me/+919655798100?text=${text}`, '_blank');
      } else {
        const subject = encodeURIComponent(`Executive Teaser Audit for ${selectedLead.business_name} — RoamWork Digital`);
        const body = encodeURIComponent(`${customPitch}\n\nGoogle PageSpeed Mobile Proof: ${selectedLead.proof_links.mobile}\nGoogle PageSpeed Desktop Proof: ${selectedLead.proof_links.desktop}\n\nRoamWork Agency: https://www.roamwork.in/`);
        window.open(`mailto:roamwork.techs@gmail.com?subject=${subject}&body=${body}`, '_blank');
      }

      await fetchLeads();
    } catch (err) {
      alert('Failed to update lead');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col justify-between p-4 shadow-xl">
        <div>
          <div className="flex items-center space-x-2.5 mb-8 px-2">
            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center font-extrabold text-xl text-white shadow-md">R</div>
            <div>
              <span className="font-extrabold text-lg tracking-tight block leading-none">ROAMWORK OS</span>
              <span className="text-[10px] text-slate-400 font-medium">Digital Audit & BD System</span>
            </div>
          </div>

          <nav className="space-y-1.5">
            <a href="#" className="flex items-center space-x-3 px-3.5 py-2.5 rounded-lg bg-blue-600 text-white font-semibold text-xs shadow-sm">
              <span>🎯 5-Hour Ingestion Queue</span>
            </a>
            <a href="#" className="flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white font-medium text-xs transition">
              <span>🔍 360° Audits & Proofs</span>
            </a>
            <a href="#" className="flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white font-medium text-xs transition">
              <span>💬 Outreach Dispatch</span>
            </a>
            <a href="#" className="flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white font-medium text-xs transition">
              <span>📊 CRM & Budget Lock</span>
            </a>
          </nav>
        </div>

        <div className="border-t border-slate-800 pt-4 px-2 text-[11px] text-slate-400 space-y-1">
          <div className="flex justify-between items-center">
            <span>5-Hour Cron Status:</span>
            <span className="text-emerald-400 font-bold">ACTIVE</span>
          </div>
          <div className="text-[10px] text-slate-500">Cron: <code className="text-slate-300">0 */5 * * *</code></div>
          <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-800">Agency: <strong>RoamWork</strong> (roamwork.in)</div>
        </div>
      </aside>

      {/* Main Container */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-sm">
          <div>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">360° Ingestion & Human Verification Queue</h1>
            <p className="text-xs text-slate-500">Live 5-hour buyer-intent pulling, PageSpeed Insights auditing, and PDF teaser generation</p>
          </div>
          <div className="flex items-center space-x-3">
            <span className="bg-purple-100 text-purple-700 text-xs font-bold px-3 py-1.5 rounded-full border border-purple-200">
              18 Pending Verification
            </span>
            <button className="bg-blue-600 text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm">
              + Add Manual Prospect
            </button>
          </div>
        </header>

        {/* Dashboard Split View */}
        <div className="flex-1 flex overflow-hidden p-6 gap-6">
          {/* Left Column: Lead Queue */}
          <div className="w-1/2 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
            <div className="p-3.5 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <span className="text-xs font-bold uppercase text-slate-600 tracking-wider">Target Prospects (#1 - #100)</span>
              <span className="text-xs text-slate-400">Sorted by Opportunity Score</span>
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
                    <span className="font-bold text-sm text-slate-900">#{lead.rank} {lead.business_name}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      lead.verification_status === 'VERIFIED_APPROVED'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : 'bg-purple-100 text-purple-800 border border-purple-200'
                    }`}>
                      {lead.verification_status === 'VERIFIED_APPROVED' ? 'APPROVED' : 'PENDING REVIEW'}
                    </span>
                  </div>
                  <div className="text-xs text-blue-600 underline font-medium mb-1.5">{lead.website_url}</div>
                  <div className="text-xs text-slate-600 line-clamp-1 mb-2">{lead.primary_signal}</div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                    <span>Lead Score: <strong className="text-slate-800">{lead.score}/100</strong></span>
                    <span>Location: {lead.location}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Verification & Audit Inspector */}
          {selectedLead ? (
            <div className="w-1/2 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden p-5">
              <div className="border-b border-slate-100 pb-3.5 mb-4 flex justify-between items-start">
                <div>
                  <h2 className="text-base font-bold text-slate-900">{selectedLead.business_name}</h2>
                  <a href={selectedLead.website_url} target="_blank" className="text-xs text-blue-600 underline font-medium">
                    {selectedLead.website_url}
                  </a>
                </div>
                <a
                  href={selectedLead.pdf_path}
                  target="_blank"
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-300 transition flex items-center space-x-1"
                >
                  <span>📄 Preview Teaser PDF</span>
                </a>
              </div>

              <div className="flex-1 overflow-y-auto space-y-4 text-xs pr-1">
                {/* Scorecard Badges */}
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="bg-red-50 border border-red-200 p-2 rounded-lg">
                    <div className="text-red-700 font-bold text-sm">{selectedLead.audit_findings.perf_mobile}</div>
                    <div className="text-[9px] text-red-600 font-medium">Mobile Performance</div>
                  </div>
                  <div className="bg-red-50 border border-red-200 p-2 rounded-lg">
                    <div className="text-red-700 font-bold text-sm">{selectedLead.audit_findings.load_time}</div>
                    <div className="text-[9px] text-red-600 font-medium">Mobile Load Time</div>
                  </div>
                  <div className="bg-amber-50 border border-amber-200 p-2 rounded-lg">
                    <div className="text-amber-700 font-bold text-sm">{selectedLead.audit_findings.a11y}</div>
                    <div className="text-[9px] text-amber-600 font-medium">Accessibility</div>
                  </div>
                  <div className="bg-red-50 border border-red-200 p-2 rounded-lg">
                    <div className="text-red-700 font-bold text-sm">{selectedLead.audit_findings.page_weight}</div>
                    <div className="text-[9px] text-red-600 font-medium">Page Weight</div>
                  </div>
                </div>

                {/* 360 Audit Findings */}
                <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                  <h3 className="font-bold text-slate-800 mb-2 uppercase text-[10px] tracking-wider">360° Verified Audit Findings</h3>
                  <ul className="space-y-1.5 text-slate-700">
                    <li>🔴 <strong>Call Conversion:</strong> {selectedLead.audit_findings.click_to_call}</li>
                    <li>🔴 <strong>PageSpeed Score:</strong> {selectedLead.audit_findings.perf_mobile}</li>
                    <li>🔴 <strong>Content Load Delay:</strong> {selectedLead.audit_findings.load_time}</li>
                    <li>🟡 <strong>Accessibility:</strong> {selectedLead.audit_findings.a11y}</li>
                  </ul>
                </div>

                {/* Verified PageSpeed Insights Proof URLs */}
                <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                  <h3 className="font-bold text-slate-800 mb-1.5 uppercase text-[10px] tracking-wider">Google PageSpeed Insights Proofs</h3>
                  <div className="space-y-1 text-[11px]">
                    <div>📱 <a href={selectedLead.proof_links.mobile} target="_blank" className="text-blue-600 underline">Mobile Analysis Proof URL</a></div>
                    <div>💻 <a href={selectedLead.proof_links.desktop} target="_blank" className="text-blue-600 underline">Desktop Analysis Proof URL</a></div>
                  </div>
                </div>

                {/* Customize Outreach Pitch */}
                <div>
                  <label className="block font-bold text-slate-800 mb-1.5 uppercase text-[10px] tracking-wider">
                    Customize Outreach Pitch (RoamWork Agency Review)
                  </label>
                  <textarea
                    rows={4}
                    value={customPitch}
                    onChange={(e) => setCustomPitch(e.target.value)}
                    className="w-full p-3 border border-slate-200 rounded-lg text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none text-xs"
                  />
                </div>
              </div>

              {/* Dispatch Action Footer */}
              <div className="border-t border-slate-100 pt-3.5 mt-4 flex gap-3">
                <button
                  disabled={loading}
                  onClick={() => handleApproveAndDispatch('WHATSAPP')}
                  className="flex-1 bg-emerald-600 text-white font-semibold py-2.5 px-4 rounded-lg text-xs hover:bg-emerald-700 transition flex items-center justify-center space-x-1.5 shadow-sm"
                >
                  <span>💬 Approve & Send via WhatsApp</span>
                </button>
                <button
                  disabled={loading}
                  onClick={() => handleApproveAndDispatch('GMAIL')}
                  className="flex-1 bg-blue-600 text-white font-semibold py-2.5 px-4 rounded-lg text-xs hover:bg-blue-700 transition flex items-center justify-center space-x-1.5 shadow-sm"
                >
                  <span>✉️ Approve & Draft in Gmail</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="w-1/2 bg-white rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 text-xs">
              Select a lead from the queue to review 360° audit findings
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
