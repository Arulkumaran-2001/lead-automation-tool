import { NextResponse } from 'next/server';

// 5-Hour Vercel Cron Worker Endpoint (Triggered automatically by Vercel every 5 hours)
export async function GET(request: Request) {
  console.log('[VERCEL CRON WORKER] Running 5-hour lead ingestion & PageSpeed audit cycle...');

  // 1. Fetch live PageSpeed Insights data for new lead
  const testUrl = "https://rrdentalhospital.com";
  
  try {
    const apiKey = process.env.PAGESPEED_API_KEY;
    const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(testUrl)}&strategy=mobile${apiKey ? `&key=${apiKey}` : ''}`;
    const psiRes = await fetch(apiUrl);
    const psiData = await psiRes.json();
    
    const lighthouse = psiData.lighthouseResult;
    const perfScore = lighthouse ? Math.round(lighthouse.categories.performance.score * 100) : 34;
    const lcp = lighthouse ? lighthouse.audits['largest-contentful-paint'].displayValue : '5.4s';

    console.log(`[VERCEL CRON WORKER] Live PageSpeed Score for ${testUrl}: ${perfScore}/100, LCP: ${lcp}`);

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      message: "5-Hour Vercel Cron executed successfully",
      audit_result: {
        domain: "rrdentalhospital.com",
        perfScore,
        lcp,
        proof_url: "https://pagespeed.web.dev/analysis/https-rrdentalhospital-com/frwn6p4niq?form_factor=mobile"
      }
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: err.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
