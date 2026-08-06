import os
import sys
import json
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable, KeepTogether
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors

def generate_executive_teaser_pdf(audit_data, output_filename):
    doc = SimpleDocTemplate(
        output_filename,
        pagesize=letter,
        leftMargin=36,
        rightMargin=36,
        topMargin=36,
        bottomMargin=36
    )
    
    styles = getSampleStyleSheet()
    
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=colors.HexColor('#0F172A'),
        spaceAfter=4
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=11,
        leading=15,
        textColor=colors.HexColor('#475569'),
        spaceAfter=12
    )

    agency_brand_style = ParagraphStyle(
        'AgencyBrand',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=14,
        textColor=colors.HexColor('#2563EB'),
        alignment=2
    )
    
    section_heading = ParagraphStyle(
        'SectionHeading',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=colors.HexColor('#1E293B'),
        spaceBefore=10,
        spaceAfter=6
    )
    
    body_style = ParagraphStyle(
        'BodyTextCustom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor('#334155')
    )

    bold_label = ParagraphStyle(
        'BoldLabel',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor('#0F172A')
    )

    small_caption = ParagraphStyle(
        'SmallCaption',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=8,
        leading=11,
        textColor=colors.HexColor('#64748B')
    )

    story = []
    
    # 1. Header Banner & Agency Branding
    header_table_data = [
        [
            Paragraph("<b>EXECUTIVE TEASER AUDIT</b>", ParagraphStyle('SubHeader', fontName='Helvetica-Bold', fontSize=10, textColor=colors.HexColor('#2563EB'), spaceAfter=4)),
            Paragraph("<b>RoamWork</b>", agency_brand_style)
        ],
        [
            Paragraph(f"<b>{audit_data.get('business_name', 'Client Business')}</b>", title_style),
            Paragraph("RoamWork Digital", ParagraphStyle('AgencySub', fontName='Helvetica', fontSize=9, textColor=colors.HexColor('#64748B'), alignment=2))
        ],
        [
            Paragraph(f"Digital Presence Review - {audit_data.get('domain', 'website.com')}", subtitle_style),
            Paragraph("roamwork.techs@gmail.com", ParagraphStyle('AgencyEmail', fontName='Helvetica', fontSize=8, textColor=colors.HexColor('#64748B'), alignment=2))
        ]
    ]
    t_header = Table(header_table_data, colWidths=[360, 180])
    t_header.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('PADDING', (0,0), (-1,-1), 0)
    ]))
    story.append(t_header)
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#2563EB'), spaceAfter=12))
    
    # 2. Key Metric Cards Bar (4 Metric Badges matching 1.pdf)
    metric_cards_data = [
        [
            Paragraph(f"<font size=16 color='#DC2626'><b>{audit_data.get('perf_mobile', '34')}/100</b></font><br/><font size=7 color='#64748B'>Mobile performance<br/>score (Google)</font>", body_style),
            Paragraph(f"<font size=16 color='#DC2626'><b>{audit_data.get('load_time_mobile', '5.4s')}</b></font><br/><font size=7 color='#64748B'>Mobile load time<br/>to show content</font>", body_style),
            Paragraph(f"<font size=16 color='#D97706'><b>{audit_data.get('a11y_score', '62')}/100</b></font><br/><font size=7 color='#64748B'>Accessibility<br/>score (Google)</font>", body_style),
            Paragraph(f"<font size=16 color='#DC2626'><b>{audit_data.get('page_weight', '~11 MB')}</b></font><br/><font size=7 color='#64748B'>Homepage<br/>total page weight</font>", body_style)
        ]
    ]
    t_cards = Table(metric_cards_data, colWidths=[135, 135, 135, 135])
    t_cards.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F8FAFC')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#E2E8F0')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#CBD5E1')),
        ('PADDING', (0,0), (-1,-1), 8),
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE')
    ]))
    story.append(t_cards)
    story.append(Spacer(1, 10))
    
    # 3. Executive Summary Block
    story.append(Paragraph("EXECUTIVE SUMMARY", section_heading))
    perf = audit_data.get('perf_mobile', '34')
    load = audit_data.get('load_time_mobile', '5.4s')
    weight = audit_data.get('page_weight', '11 MB')
    bname = audit_data.get('business_name', 'Business')
    summary_text = f"{bname} has durable real-world strengths, but the website behind that reputation is quietly working against it. Google's PageSpeed Insights tool scores the site {perf}/100 for mobile performance, with main content taking {load} to appear. The homepage alone transfers roughly {weight} of data—about 10x heavier than recommended."
    story.append(Paragraph(summary_text, body_style))
    story.append(Spacer(1, 6))
    
    # Risks & Opportunities Lists
    story.append(Paragraph("<b>Top Business Risks:</b>", bold_label))
    risks = audit_data.get('top_risks', [
        "Mobile visitors likely abandoning before loading finishes",
        "Broken click-to-call link, losing phone leads",
        "Accessibility gaps (missing alt text, low text contrast)"
    ])
    for risk in risks:
        story.append(Paragraph(f"• {risk}", body_style))
    story.append(Spacer(1, 6))

    story.append(Paragraph("<b>Top Growth Opportunities:</b>", bold_label))
    opps = audit_data.get('top_opps', [
        "Image compression & script cleanup to bring mobile score from 34 into 80s+",
        "Fixing alt text and contrast improves accessibility, SEO, and AI answer engine reading",
        "Leverage existing brand reputation with technical website repair"
    ])
    for opp in opps:
        story.append(Paragraph(f"• {opp}", body_style))
    story.append(Spacer(1, 12))

    # 4. Digital Scorecard Table
    story.append(Paragraph("DIGITAL SCORECARD", section_heading))
    story.append(Paragraph("Scored using Google's Lighthouse / PageSpeed Insights tool plus direct site inspection.", small_caption))
    story.append(Spacer(1, 4))
    
    scorecard_rows = [
        [Paragraph("<b>Metric</b>", bold_label), Paragraph("<b>Mobile</b>", bold_label), Paragraph("<b>Desktop</b>", bold_label), Paragraph("<b>Signal</b>", bold_label)],
        [Paragraph("Performance (Google Lighthouse)", body_style), Paragraph(f"{audit_data.get('perf_mobile', '34')}/100", body_style), Paragraph(f"{audit_data.get('perf_desktop', '52')}/100", body_style), Paragraph("<font color='#DC2626'><b>🔴 RED</b></font>", body_style)],
        [Paragraph("Accessibility (Google Lighthouse)", body_style), Paragraph(f"{audit_data.get('a11y_mobile', '62')}/100", body_style), Paragraph(f"{audit_data.get('a11y_desktop', '62')}/100", body_style), Paragraph("<font color='#D97706'><b>🟡 AMBER</b></font>", body_style)],
        [Paragraph("Best Practices (Google Lighthouse)", body_style), Paragraph(f"{audit_data.get('bp_mobile', '88')}/100", body_style), Paragraph(f"{audit_data.get('bp_desktop', '92')}/100", body_style), Paragraph("<font color='#16A34A'><b>🟢 GREEN</b></font>", body_style)],
        [Paragraph("SEO (Google Lighthouse)", body_style), Paragraph(f"{audit_data.get('seo_mobile', '91')}/100", body_style), Paragraph(f"{audit_data.get('seo_desktop', '91')}/100", body_style), Paragraph("<font color='#16A34A'><b>🟢 GREEN</b></font>", body_style)],
        [Paragraph("Agentic Browsing Readiness (AI / LLM)", body_style), Paragraph("0/2", body_style), Paragraph("0/2", body_style), Paragraph("<font color='#DC2626'><b>🔴 RED</b></font>", body_style)],
        [Paragraph("Lead Generation (Click-to-Call, Forms)", body_style), Paragraph("Issues", body_style), Paragraph("Issues", body_style), Paragraph("<font color='#DC2626'><b>🔴 RED</b></font>", body_style)],
        [Paragraph("Brand Trust (Reviews & Testimonials)", body_style), Paragraph("Strong", body_style), Paragraph("Strong", body_style), Paragraph("<font color='#D97706'><b>🟡 AMBER</b></font>", body_style)]
    ]
    t_scorecard = Table(scorecard_rows, colWidths=[240, 100, 100, 100])
    t_scorecard.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#F1F5F9')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#CBD5E1')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#E2E8F0')),
        ('PADDING', (0,0), (-1,-1), 5),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE')
    ]))
    story.append(t_scorecard)
    story.append(Spacer(1, 4))
    story.append(Paragraph("<i>Core Web Vitals (mobile): First Contentful Paint 3.5s | Largest Contentful Paint 5.4s | Total Blocking Time 650ms | Cumulative Layout Shift 0.342</i>", small_caption))
    story.append(Spacer(1, 12))

    # 5. Top High-Impact Findings
    story.append(Paragraph("TOP HIGH-IMPACT FINDINGS", section_heading))
    findings = audit_data.get('findings', [
        {"title": "Mobile Performance Score: 34/100", "priority": "High", "desc": "Google Lighthouse rates mobile performance 34/100 in the 'poor' range. Main content visible (LCP) takes 5.4s vs recommended under 2.5s.", "impact": "Most mobile visitors leave before the page finishes loading."},
        {"title": "Homepage Transfer Weight ~11 MB", "priority": "High", "desc": "Total transfer size exceeds 10 MB. Unoptimized images alone account for 2.7 MB of avoidable weight.", "impact": "Directly responsible for slow loading on mobile connections."},
        {"title": "Click-To-Call Phone Link Mismatch", "priority": "High", "desc": "Homepage displays one appointment number but the tappable tel link dials a different number.", "impact": "Silent loss of direct patient/customer phone leads."},
        {"title": "Accessibility Score 62/100", "priority": "Medium", "desc": "Missing image alt text sitewide, buttons without accessible names, and low contrast ratios.", "impact": "Affects users with screen readers and reduces SEO score."}
    ])
    
    for f in findings:
        badge_color = "#DC2626" if f['priority'] == 'High' else ("#D97706" if f['priority'] == 'Medium' else "#2563EB")
        story.append(Paragraph(f"<b><font color='{badge_color}'>[{f['priority'].upper()}]</font> {f['title']}</b>", bold_label))
        story.append(Paragraph(f"<i>Finding:</i> {f['desc']}", body_style))
        story.append(Paragraph(f"<b>Business Impact:</b> {f['impact']}", body_style))
        story.append(Spacer(1, 5))

    story.append(Spacer(1, 10))

    # 6. Quick Wins Table
    story.append(Paragraph("QUICK WINS", section_heading))
    qw_data = [
        [Paragraph("<b>Improvement</b>", bold_label), Paragraph("<b>Expected Benefit</b>", bold_label), Paragraph("<b>Effort</b>", bold_label), Paragraph("<b>Priority</b>", bold_label)],
        [Paragraph("Fix click-to-call mismatch", body_style), Paragraph("Recover lost phone leads immediately", body_style), Paragraph("< 1 hour", body_style), Paragraph("High", body_style)],
        [Paragraph("Rewrite title & meta descriptions", body_style), Paragraph("Improves branded & local search CTR", body_style), Paragraph("1 hour", body_style), Paragraph("Medium", body_style)],
        [Paragraph("Compress & resize homepage images", body_style), Paragraph("Cuts 2.7 MB page weight & boosts speed", body_style), Paragraph("Half day", body_style), Paragraph("High", body_style)],
        [Paragraph("Add alt text & contrast fixes", body_style), Paragraph("Improves accessibility & AI search visibility", body_style), Paragraph("1 day", body_style), Paragraph("Medium", body_style)]
    ]
    t_qw = Table(qw_data, colWidths=[160, 200, 90, 90])
    t_qw.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#F1F5F9')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#CBD5E1')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#E2E8F0')),
        ('PADDING', (0,0), (-1,-1), 5),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE')
    ]))
    story.append(t_qw)
    story.append(Spacer(1, 12))

    # 7. Roadmap Table
    story.append(Paragraph("IMPROVEMENT ROADMAP", section_heading))
    map_data = [
        [Paragraph("<b>Phase 1 — Critical Fixes</b>", bold_label), Paragraph("<b>Phase 2 — Growth Improvements</b>", bold_label), Paragraph("<b>Phase 3 — Ongoing Optimization</b>", bold_label)],
        [
            Paragraph("• Click-to-call link repair<br/>• Title & meta tag rewrite<br/>• Image compression pass<br/>• Core Web Vitals acceleration", body_style),
            Paragraph("• Sitewide alt text & contrast<br/>• Unused JS cleanup<br/>• JSON-LD Schema markup<br/>• AI Search (AEO/GEO) FAQ content", body_style),
            Paragraph("• Content refresh cycle<br/>• Local SEO map pack optimization<br/>• Deeper service page content<br/>• Ongoing speed monitoring", body_style)
        ]
    ]
    t_map = Table(map_data, colWidths=[180, 180, 180])
    t_map.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#E2E8F0')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#CBD5E1')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#CBD5E1')),
        ('PADDING', (0,0), (-1,-1), 6),
        ('VALIGN', (0,0), (-1,-1), 'TOP')
    ]))
    story.append(t_map)
    story.append(Spacer(1, 15))

    # 8. Meeting Invitation & PageSpeed Proof Links
    proof_m = audit_data.get('proof_mobile', 'https://pagespeed.web.dev')
    proof_d = audit_data.get('proof_desktop', 'https://pagespeed.web.dev')
    invite_text = f"<b>MEETING INVITATION & VERIFIED AUDIT PROOFS</b><br/><font color='#334155'>This report covers highest-impact findings sourced directly from Google's PageSpeed Insights / Lighthouse tool. A short 10-15 minute consultation call will walk through the exact technical fix plan and timeline.</font><br/><br/><b>Agency Contact (RoamWork):</b><br/>• Website: <a href='https://www.roamwork.in/'><u>https://www.roamwork.in/</u></a><br/>• Email: roamwork.techs@gmail.com | WhatsApp: +91 96557 98100<br/><br/><b>Direct PageSpeed Proof Links:</b><br/>• Mobile Audit Report: <a href='{proof_m}'><u>Google PageSpeed Mobile Analysis</u></a><br/>• Desktop Audit Report: <a href='{proof_d}'><u>Google PageSpeed Desktop Analysis</u></a>"
    
    t_invite = Table([[Paragraph(invite_text, body_style)]], colWidths=[540])
    t_invite.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#EFF6FF')),
        ('BOX', (0,0), (-1,-1), 1.5, colors.HexColor('#2563EB')),
        ('PADDING', (0,0), (-1,-1), 10),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE')
    ]))
    story.append(t_invite)

    doc.build(story)
    print(f"Generated Executive Teaser PDF matching 1.pdf template at: {output_filename}")

if __name__ == "__main__":
    sample_data = {
        "business_name": "RR Dental Hospital",
        "domain": "rrdentalhospital.com",
        "perf_mobile": "34",
        "perf_desktop": "52",
        "load_time_mobile": "5.4s",
        "a11y_score": "62",
        "a11y_mobile": "62",
        "a11y_desktop": "62",
        "bp_mobile": "88",
        "bp_desktop": "92",
        "seo_mobile": "91",
        "seo_desktop": "91",
        "page_weight": "~11 MB",
        "proof_mobile": "https://pagespeed.web.dev/analysis/https-rrdentalhospital-com/frwn6p4niq?form_factor=mobile",
        "proof_desktop": "https://pagespeed.web.dev/analysis/https-rrdentalhospital-com/frwn6p4niq?form_factor=desktop"
    }
    out_pdf = "/working_dir/c_5d3b4823f0c10f58/roamwork-os-app/public/audits/RR_Dental_Hospital_Teaser_Audit.pdf"
    os.makedirs(os.path.dirname(out_pdf), exist_ok=True)
    generate_executive_teaser_pdf(sample_data, out_pdf)
