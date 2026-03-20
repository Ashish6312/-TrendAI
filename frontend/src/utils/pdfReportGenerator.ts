import { jsPDF } from 'jspdf';

interface AnalysisResult {
  analysis: any;
  recommendations: any[];
  location_data?: any;
}

interface UserInfo {
  name?: string;
  email?: string;
}

// Global text height helper
const getTextHeight = (doc: jsPDF, text: string | string[], fontSize: number, maxWidth: number) => {
  doc.setFontSize(fontSize);
  const lines = typeof text === 'string' ? doc.splitTextToSize(text, maxWidth) : text;
  return lines.length * (fontSize * 0.45); // Approximate height in mm
};

export const generateProfessionalPDF = async (area: string, result: AnalysisResult, user?: UserInfo) => {
  const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;

  // --- PAGE 1: COVER PAGE ---
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');
  
  doc.setFillColor(16, 185, 129);
  doc.setGState(new (doc as any).GState({ opacity: 0.15 }));
  doc.circle(pageWidth, 0, 100, 'F');
  doc.setGState(new (doc as any).GState({ opacity: 1 }));

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('Trend', margin, 40);
  doc.setTextColor(16, 185, 129);
  doc.text('AI', margin + 25, 40);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(44);
  doc.text('MARKET', margin, 100);
  doc.text('INTELLIGENCE', margin, 120);
  
  doc.setFontSize(24);
  doc.setTextColor(148, 163, 184);
  doc.text('STRATEGIC REPORT', margin, 135);

  if (user?.name) {
    doc.setFillColor(30, 41, 59);
    doc.roundedRect(margin, 200, contentWidth, 30, 4, 4, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.text(user.name.toUpperCase(), margin + 10, 215);
    doc.setFontSize(10);
    doc.setTextColor(16, 185, 129);
    doc.text(user.email || '', margin + 10, 222);
  }

  // --- PAGE 2: EXECUTIVE SUMMARY ---
  doc.addPage();
  doc.setFillColor(252, 252, 253);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, pageWidth, 35, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.text('EXECUTIVE SUMMARY', margin, 22);

  let currentY = 55;
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Market Context', margin, currentY);
  currentY += 10;

  doc.setTextColor(71, 85, 105);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  const summaryText = typeof result.analysis === 'object' ? (result.analysis.executive_summary || result.analysis.market_summary) : result.analysis;
  const wrappedSummary = doc.splitTextToSize(summaryText || 'Compiling analysis...', contentWidth);
  doc.text(wrappedSummary, margin, currentY);
  currentY += (wrappedSummary.length * 6) + 20;

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Key Strategic Metrics', margin, currentY);
  currentY += 12;

  const metrics = [
    { l: 'Success Probability', v: result.analysis?.confidence_score || '85%' },
    { l: 'Market Gap', v: result.analysis?.market_gap_intensity || 'High' },
    { l: 'Competition', v: result.analysis?.competition_level || 'Med' },
    { l: 'Readiness', v: 'Excellent' }
  ];

  metrics.forEach((m, idx) => {
    const x = margin + (idx % 2) * (contentWidth / 2 + 5);
    const y = currentY + Math.floor(idx / 2) * 30;
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(241, 245, 249);
    doc.roundedRect(x, y, (contentWidth / 2) - 5, 25, 3, 3, 'FD');
    doc.setTextColor(100, 116, 139);
    doc.setFontSize(9);
    doc.text(m.l.toUpperCase(), x + 8, y + 10);
    doc.setTextColor(16, 185, 129);
    doc.setFontSize(14);
    doc.text(m.v.toString(), x + 8, y + 19);
  });

  // --- PAGE 3+: OPPORTUNITIES ---
  doc.addPage();
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, pageWidth, 35, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.text('INVESTMENT OPPORTUNITIES', margin, 22);

  currentY = 50;
  result.recommendations.forEach((rec, idx) => {
    const title = rec.title.toUpperCase();
    const desc = rec.description || '';
    const wrappedDesc = doc.splitTextToSize(desc, contentWidth - 20);
    const boxHeight = (wrappedDesc.length * 5) + 55;

    if (currentY + boxHeight > pageHeight - margin) {
      doc.addPage();
      currentY = 30;
    }

    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(241, 245, 249);
    doc.roundedRect(margin, currentY, contentWidth, boxHeight, 5, 5, 'FD');
    doc.setFillColor(16, 185, 129);
    doc.rect(margin, currentY, 3, boxHeight, 'F');

    doc.setTextColor(100, 116, 139);
    doc.setFontSize(9);
    doc.text(`STRATEGY #${idx + 1}`, margin + 10, currentY + 12);
    
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(title, margin + 10, currentY + 22);
    
    doc.setTextColor(71, 85, 105);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(wrappedDesc, margin + 10, currentY + 32);

    // Financial Row
    const rowY = currentY + (wrappedDesc.length * 5) + 38;
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(margin + 8, rowY, contentWidth - 16, 12, 2, 2, 'F');
    doc.setFontSize(9);
    doc.text(`INV: ${rec.funding_required || '-'}`, margin + 15, rowY + 8);
    doc.text(`REV: ${rec.estimated_revenue || '-'}`, margin + 60, rowY + 8);
    doc.setTextColor(16, 185, 129);
    doc.text(`PROFIT: ${rec.estimated_profit || '-'}`, margin + 110, rowY + 8);

    currentY += boxHeight + 10;
  });

  doc.save(`TrendAI_Report_${area.replace(/\s+/g, '_')}.pdf`);
};

export const generateBusinessPlanPDF = async (planData: any, user?: UserInfo) => {
  const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;

  // Cover
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(40);
  doc.text('BUSINESS PLAN', margin, 100);
  doc.setTextColor(16, 185, 129);
  doc.setFontSize(20);
  doc.text(planData.business?.title || 'NEW VENTURE', margin, 115);

  // Content
  doc.addPage();
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, pageWidth, 35, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.text('OPERATIONAL ROADMAP', margin, 22);

  let currentY = 50;
  const sections = [
    { t: 'Strategic Overview', c: planData.plan?.business_overview },
    { t: 'Marketing Strategy', c: planData.plan?.marketing_strategy },
    { t: 'Operations Plan', c: planData.plan?.operational_plan }
  ];

  sections.forEach(s => {
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(s.t, margin, currentY);
    currentY += 10;
    doc.setTextColor(71, 85, 105);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    const split = doc.splitTextToSize(s.c || 'Ready to execute...', contentWidth);
    doc.text(split, margin, currentY);
    currentY += (split.length * 6) + 15;
    
    if (currentY > pageHeight - 40) {
      doc.addPage();
      currentY = 30;
    }
  });

  doc.save(`TrendAI_Plan_${planData.business?.title?.replace(/\s+/g, '_')}.pdf`);
};

export const generateRoadmapPDF = async (area: string, title: string, steps: any[], user?: UserInfo) => {
  const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;

  // Cover
  doc.setFillColor(15, 23, 42); 
  doc.rect(0, 0, pageWidth, pageHeight, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(40);
  doc.setFont('helvetica', 'bold');
  doc.text('STRATEGIC', margin, 100);
  doc.text('ROADMAP', margin, 118);
  doc.setTextColor(16, 185, 129);
  doc.setFontSize(18);
  doc.text(title.toUpperCase(), margin, 135);

  // Phases
  doc.addPage();
  doc.setFillColor(252, 252, 253);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, pageWidth, 35, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.text('IMPLEMENTATION PHASES', margin, 22);

  let currentY = 55;
  steps.forEach((step, idx) => {
    const stepTitle = (step.step_title || `Phase ${idx+1}`).toUpperCase();
    const stepDesc = step.step_description || '';
    
    // Calculate dynamic box height
    // Margin inside box: left 15, right 15
    const innerWidth = contentWidth - 30;
    const wrappedTitle = doc.splitTextToSize(stepTitle, innerWidth);
    const wrappedDesc = doc.splitTextToSize(stepDesc, innerWidth);
    
    const titleHeight = wrappedTitle.length * 6;
    const descHeight = wrappedDesc.length * 5;
    const boxHeight = titleHeight + descHeight + 25; // Padding built in

    if (currentY + boxHeight > pageHeight - margin) {
      doc.addPage();
      currentY = 40;
    }

    // Draw card
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(16, 185, 129);
    doc.setGState(new (doc as any).GState({ opacity: 0.1 }));
    doc.roundedRect(margin, currentY, contentWidth, boxHeight, 4, 4, 'F');
    doc.setGState(new (doc as any).GState({ opacity: 1 }));
    doc.roundedRect(margin, currentY, contentWidth, boxHeight, 4, 4, 'D');

    // Circle Number
    doc.setFillColor(16, 185, 129);
    doc.circle(margin + 12, currentY + 12, 6, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`${idx + 1}`, margin + 10.5, currentY + 13.5);

    // Title
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(13);
    doc.text(wrappedTitle, margin + 22, currentY + 13);

    // Description
    doc.setTextColor(71, 85, 105);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(wrappedDesc, margin + 22, currentY + 13 + titleHeight + 3);

    currentY += boxHeight + 10;
  });

  doc.save(`TrendAI_Roadmap_${title.replace(/\s+/g, '_')}.pdf`);
};
