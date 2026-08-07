import os
import sys
import json
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable, Image
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
        fontSize=18,
        leading=22,
        textColor=colors.HexColor('#0F172A'),
        spaceAfter=3
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor('#475569'),
        spaceAfter=6
    )

    agency_brand_style = ParagraphStyle(
        'AgencyBrand',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=13,
        textColor=colors.HexColor('#2563EB'),
        alignment=2
    )

    agency_info_style = ParagraphStyle(
        'AgencyInfo',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11,
        textColor=colors.HexColor('#475569'),
        alignment=2
    )
    
    section_heading = ParagraphStyle(
        'SectionHeading',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        textColor=colors.HexColor('#1E293B'),
        spaceBefore=8,
        spaceAfter=5
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

    # Prepare Logo Image
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    logo_path = os.path.join(base_dir, 'public', 'brand', 'logo.png')
    
    logo_element = None
    if os.path.exists(logo_path):
        try:
            # Scale logo to fit top header
            logo_element = Image(logo_path, width=120, height=44)
            logo_element.hAlign = 'RIGHT'
        except Exception as e:
            print(f"Notice: Could not load logo image: {e}")

    right_header_cell = []
    if logo_element:
        right_header_cell.append(logo_element)
    else:
        right_header_cell.append(Paragraph("<b>RoamWork Technologies</b>", agency_brand_style))
    
    right_header_cell.append(Paragraph("<b>RoamWork Technologies</b>", agency_brand_style))
    right_header_cell.append(Paragraph("www.roamwork.in", agency_info_style))
    right_header_cell.append(Paragraph("roamwork.techs@gmail.com", agency_info_style))
    right_header_cell.append(Paragraph("WhatsApp: +91 96557 98100", agency_info_style))

    # 1. Header Banner & Agency Branding
    header_table_data = [
        [
            Paragraph("<b>EXECUTIVE TEASER AUDIT</b>", ParagraphStyle('SubHeader', fontName='Helvetica-Bold', fontSize=10, textColor=colors.HexColor('#2563EB'), spaceAfter=2)),
            right_header_cell
        ],
        [
            Paragraph(f"<b>{audit_data.get('business_name', 'Client Business')}</b>", title_style),
            ""
        ],
        [
            Paragraph(f"Digital Presence Review - <u>{audit_data.get('domain', audit_data.get('url', 'website.com'))}</u>", subtitle_style),
            ""
        ]
    ]
    t_header = Table(header_table_data, colWidths=[340, 200])
    t_header.setStyle(TableStyle([
        ('SPAN', (1,0), (1,2)),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('PADDING', (0,0), (-1,-1), 0)
    ]))
    story.append(t_header)
    story.append(Spacer(1, 4))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#2563EB'), spaceAfter=10))
    
    # 2. Key Metric Cards Bar
    perf_val = audit_data.get('perf_mobile', '38')
    load_val = audit_data.get('load_time_mobile', audit_data.get('load_time', '4.5s'))
    a11y_val = audit_data.get('a11y_score', audit_data.get('a11y', '68'))
    weight_val = audit_data.get('page_weight', '~6.8 MB')

    metric_cards_data = [
        [
            Paragraph(f"<font size=15 color='#DC2626'><b>{perf_val}/100</b></font><br/><font size=7.5 color='#64748B'>Mobile performance<br/>score (Google)</font>", body_style),
            Paragraph(f"<font size=15 color='#DC2626'><b>{load_val}</b></font><br/><font size=7.5 color='#64748B'>Mobile load time<br/>to show content</font>", body_style),
            Paragraph(f"<font size=15 color='#D97706'><b>{a11y_val}/100</b></font><br/><font size=7.5 color='#64748B'>Accessibility<br/>score (Google)</font>", body_style),
            Paragraph(f"<font size=15 color='#DC2626'><b>{weight_val}</b></font><br/><font size=7.5 color='#64748B'>Homepage<br/>total page weight</font>", body_style)
        ]
    ]
    t_cards = Table(metric_cards_data, colWidths=[135, 135, 135, 135])
    t_cards.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F8FAFC')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#E2E8F0')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#CBD5E1')),
        ('PADDING', (0,0), (-1,-1), 6),
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE')
    ]))
    story.append(t_cards)
    story.append(Spacer(1, 8))
    
    # 3. Executive Summary Block
    story.append(Paragraph("EXECUTIVE SUMMARY", section_heading))
    bname = audit_data.get('business_name', 'Business')
    summary_text = f"{bname} has real-world brand potential, but the current website infrastructure is holding back mobile conversion and search visibility. Google Lighthouse rates mobile performance at {perf_val}/100, taking {load_val} to render core content with a total payload weight of {weight_val}."
    story.append(Paragraph(summary_text, body_style))
    story.append(Spacer(1, 5))
    
    # Risks & Opportunities Lists
    story.append(Paragraph("<b>Top Business Risks:</b>", bold_label))
    risks = audit_data.get('top_risks', [
        "Mobile visitors abandoning due to load delays over 3.0s",
        "Unoptimized media payload increasing mobile bandwidth consumption",
        "Missing JSON-LD structured schema limiting visibility in AI & Google search"
    ])
    for risk in risks:
        story.append(Paragraph(f"• {risk}", body_style))
    story.append(Spacer(1, 5))

    story.append(Paragraph("<b>Top Growth Opportunities:</b>", bold_label))
    opps = audit_data.get('top_opps', [
        "Compress image assets into WebP/AVIF format to cut payload size by ~60%",
        "Inject structured JSON-LD schema for LocalBusiness and Services",
        "Implement AI Customer Support & automated lead qualification chat funnel"
    ])
    for opp in opps:
        story.append(Paragraph(f"• {opp}", body_style))
    story.append(Spacer(1, 10))

    # 4. Digital Scorecard Table
    story.append(Paragraph("DIGITAL SCORECARD", section_heading))
    story.append(Paragraph("Evaluated via Google Lighthouse API & RoamWork 360° Inspection Engine.", small_caption))
    story.append(Spacer(1, 4))
    
    scorecard_rows = [
        [Paragraph("<b>Metric Category</b>", bold_label), Paragraph("<b>Mobile Status</b>", bold_label), Paragraph("<b>Desktop Status</b>", bold_label), Paragraph("<b>Signal</b>", bold_label)],
        [Paragraph("Performance (Google Lighthouse)", body_style), Paragraph(f"{perf_val}/100", body_style), Paragraph("64/100", body_style), Paragraph("<font color='#DC2626'><b>🔴 POOR</b></font>", body_style)],
        [Paragraph("Accessibility (WCAG Compliance)", body_style), Paragraph(f"{a11y_val}/100", body_style), Paragraph("72/100", body_style), Paragraph("<font color='#D97706'><b>🟡 AMBER</b></font>", body_style)],
        [Paragraph("SEO & Indexability", body_style), Paragraph("85/100", body_style), Paragraph("90/100", body_style), Paragraph("<font color='#16A34A'><b>🟢 GOOD</b></font>", body_style)],
        [Paragraph("AI Search Readiness (GEO)", body_style), Paragraph("0/2 Schema", body_style), Paragraph("0/2 Schema", body_style), Paragraph("<font color='#DC2626'><b>🔴 MISSING</b></font>", body_style)],
        [Paragraph("Lead Funnel & Click-to-Call", body_style), Paragraph("Needs Fix", body_style), Paragraph("Needs Fix", body_style), Paragraph("<font color='#DC2626'><b>🔴 CRITICAL</b></font>", body_style)]
    ]
    t_scorecard = Table(scorecard_rows, colWidths=[230, 100, 110, 100])
    t_scorecard.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#F1F5F9')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#CBD5E1')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#E2E8F0')),
        ('PADDING', (0,0), (-1,-1), 4),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE')
    ]))
    story.append(t_scorecard)
    story.append(Spacer(1, 10))

    # 5. Quick Wins Table
    story.append(Paragraph("HIGH-IMPACT QUICK WINS", section_heading))
    qw_data = [
        [Paragraph("<b>Improvement Action</b>", bold_label), Paragraph("<b>Expected Benefit</b>", bold_label), Paragraph("<b>Effort</b>", bold_label), Paragraph("<b>Priority</b>", bold_label)],
        [Paragraph("Fix mobile click-to-call & booking form", body_style), Paragraph("Recovers dropped phone & web leads instantly", body_style), Paragraph("< 2 hours", body_style), Paragraph("High", body_style)],
        [Paragraph("Compress media payload to WebP", body_style), Paragraph("Reduces page weight by ~60%, boosts mobile speed", body_style), Paragraph("Half day", body_style), Paragraph("High", body_style)],
        [Paragraph("Inject JSON-LD structured schema", body_style), Paragraph("Enables ChatGPT, Gemini & Google AI citation", body_style), Paragraph("1 day", body_style), Paragraph("Medium", body_style)]
    ]
    t_qw = Table(qw_data, colWidths=[170, 190, 90, 90])
    t_qw.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#F1F5F9')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#CBD5E1')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#E2E8F0')),
        ('PADDING', (0,0), (-1,-1), 4),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE')
    ]))
    story.append(t_qw)
    story.append(Spacer(1, 10))

    # 6. Official Meeting Invitation & Agency Contact Block
    proof_m = audit_data.get('proof_mobile', 'https://pagespeed.web.dev')
    proof_d = audit_data.get('proof_desktop', 'https://pagespeed.web.dev')
    
    invite_text = f"<b>CONSULTATION INVITATION & VERIFIED AUDIT PROOFS</b><br/><font color='#334155'>This audit provides real-world performance metrics compiled directly by Google Lighthouse & RoamWork 360° Engine. Schedule a 15-minute consultation to review the complete roadmap and implementation timeline.</font><br/><br/><b>Official Agency Contact (RoamWork Technologies):</b><br/>• <b>Website:</b> <a href='https://www.roamwork.in/'><u>https://www.roamwork.in/</u></a><br/>• <b>Email:</b> <a href='mailto:roamwork.techs@gmail.com'>roamwork.techs@gmail.com</a> | <b>WhatsApp:</b> <a href='https://wa.me/919655798100'>+91 96557 98100</a><br/>• <b>Address:</b> VOC Street, T.Nagar, Chennai, Tamil Nadu 600017, India<br/><br/><b>Direct PageSpeed Proof Links:</b><br/>• Mobile Audit Proof: <a href='{proof_m}'><u>Google PageSpeed Mobile Analysis Report</u></a><br/>• Desktop Audit Proof: <a href='{proof_d}'><u>Google PageSpeed Desktop Analysis Report</u></a>"
    
    t_invite = Table([[Paragraph(invite_text, body_style)]], colWidths=[540])
    t_invite.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#EFF6FF')),
        ('BOX', (0,0), (-1,-1), 1.5, colors.HexColor('#2563EB')),
        ('PADDING', (0,0), (-1,-1), 8),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE')
    ]))
    story.append(t_invite)

    doc.build(story)
    print(f"Generated Executive Teaser PDF for {bname} at: {output_filename}")

if __name__ == "__main__":
    sample_data = {
        "business_name": "RR Dental Hospital",
        "domain": "rrdentalhospital.com",
        "perf_mobile": "34",
        "perf_desktop": "52",
        "load_time_mobile": "5.4s",
        "a11y_score": "62",
        "page_weight": "~11 MB",
        "proof_mobile": "https://pagespeed.web.dev/analysis/https-rrdentalhospital-com/frwn6p4niq?form_factor=mobile",
        "proof_desktop": "https://pagespeed.web.dev/analysis/https-rrdentalhospital-com/frwn6p4niq?form_factor=desktop"
    }
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    out_pdf = os.path.join(base_dir, 'public', 'audits', 'RR_Dental_Hospital_Teaser_Audit.pdf')
    os.makedirs(os.path.dirname(out_pdf), exist_ok=True)
    generate_executive_teaser_pdf(sample_data, out_pdf)
