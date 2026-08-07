import { NextResponse } from 'next/server';
import { leadsStore, fetchLeadsFromStore, updateLeadsStore, updateLeadInDatabase, ingestManualAuditLead } from './store';

export async function GET() {
  const leads = await fetchLeadsFromStore();
  return NextResponse.json({ success: true, leads });
}

export async function POST(request: Request) {
  const body = await request.json();
  
  // MANUAL URL AUDIT / INGESTION WITH DEDUPLICATION & COUNTRY PRICING
  if (body.action === 'MANUAL_AUDIT' || body.action === 'BATCH_INGEST') {
    const result = await ingestManualAuditLead(body);
    return NextResponse.json(result);
  }

  const { id, verification_status, drafts } = body;
  const updatedLeads = leadsStore.map(lead => {
    if (lead.id === id) {
      return {
        ...lead,
        verification_status: verification_status || lead.verification_status,
        drafts: drafts || lead.drafts
      };
    }
    return lead;
  });
  updateLeadsStore(updatedLeads);
  
  if (id && verification_status) {
    await updateLeadInDatabase(id, verification_status, drafts);
  }

  return NextResponse.json({ success: true, message: "Lead updated successfully", leads: leadsStore });
}
