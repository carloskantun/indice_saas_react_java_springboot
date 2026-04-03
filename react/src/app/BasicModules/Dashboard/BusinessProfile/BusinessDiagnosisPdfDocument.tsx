import { createRoot } from 'react-dom/client';

import type { BusinessProfileSectionKey } from '../../../api/HomePanel/BusinessProfile/businessProfile';
import type {
  BusinessDiagnosisScoreReport,
  DiagnosisPillarScore,
  DiagnosisQuestionScore,
} from './businessDiagnosisScoring';

type BusinessDiagnosisPdfDocumentProps = {
  report: BusinessDiagnosisScoreReport;
  title: string;
  subtitle: string;
  generatedAt: Date;
  reportId: string;
  companyName?: string | null;
};

const REPORT_STYLES = `
  @page {
    size: A4;
    margin: 12mm;
  }

  * {
    box-sizing: border-box;
  }

  html, body {
    margin: 0;
    padding: 0;
    background: #eef2f7;
    color: #172033;
    font-family: "Segoe UI", system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
  }

  body {
    padding: 16px;
  }

  .report-shell {
    margin: 0 auto;
    max-width: 820px;
  }

  .report-page {
    background: #ffffff;
    border: 1px solid #d7dfeb;
    border-radius: 20px;
    box-shadow: 0 20px 44px rgba(15, 23, 42, 0.08);
    margin: 0 auto 18px;
    overflow: hidden;
  }

  .report-page.break-before {
    break-before: page;
    page-break-before: always;
  }

  .page-content {
    padding: 26px 28px 28px;
  }

  .report-hero {
    background:
      radial-gradient(circle at top right, rgba(56, 189, 248, 0.24), transparent 38%),
      radial-gradient(circle at bottom left, rgba(16, 185, 129, 0.18), transparent 34%),
      linear-gradient(135deg, #10233f 0%, #17345d 55%, #1d4f72 100%);
    color: #ffffff;
    padding: 28px 28px 24px;
  }

  .hero-topline {
    align-items: center;
    display: flex;
    gap: 12px;
    justify-content: space-between;
    margin-bottom: 18px;
  }

  .brand-badge {
    background: rgba(255, 255, 255, 0.14);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 999px;
    display: inline-flex;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.1em;
    padding: 7px 12px;
    text-transform: uppercase;
  }

  .report-id {
    color: rgba(255, 255, 255, 0.82);
    font-size: 12px;
    font-weight: 600;
  }

  .hero-title {
    font-size: 28px;
    font-weight: 700;
    letter-spacing: -0.03em;
    line-height: 1.1;
    margin: 0 0 8px;
  }

  .hero-subtitle {
    color: rgba(255, 255, 255, 0.86);
    font-size: 14px;
    line-height: 1.6;
    margin: 0;
    max-width: 92%;
  }

  .hero-meta {
    display: grid;
    gap: 10px;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    margin-top: 20px;
  }

  .meta-card {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.16);
    border-radius: 16px;
    min-height: 76px;
    padding: 12px 14px;
  }

  .meta-label {
    color: rgba(255, 255, 255, 0.74);
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.08em;
    margin: 0 0 6px;
    text-transform: uppercase;
  }

  .meta-value {
    font-size: 16px;
    font-weight: 700;
    line-height: 1.3;
    margin: 0;
  }

  .section {
    margin-top: 22px;
  }

  .section:first-child {
    margin-top: 0;
  }

  .section-heading {
    align-items: flex-end;
    display: flex;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 12px;
  }

  .section-title {
    color: #13294b;
    font-size: 17px;
    font-weight: 700;
    margin: 0;
  }

  .section-caption {
    color: #64748b;
    font-size: 12px;
    font-weight: 600;
    margin: 0;
  }

  .summary-grid {
    display: grid;
    gap: 12px;
    grid-template-columns: 1.25fr 0.95fr;
  }

  .summary-card,
  .panel-card {
    background: #f8fafc;
    border: 1px solid #d7dfeb;
    border-radius: 18px;
    padding: 16px 18px;
  }

  .lead {
    color: #243349;
    font-size: 14px;
    line-height: 1.7;
    margin: 0;
  }

  .highlight-grid {
    display: grid;
    gap: 12px;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    margin-top: 16px;
  }

  .highlight-card {
    background: linear-gradient(180deg, #f8fafc 0%, #eef4fb 100%);
    border: 1px solid #d7dfeb;
    border-radius: 18px;
    min-height: 116px;
    padding: 16px;
  }

  .highlight-card.accent {
    background: linear-gradient(180deg, #eff6ff 0%, #dbeafe 100%);
    border-color: #bfdbfe;
  }

  .highlight-label {
    color: #64748b;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.08em;
    margin: 0 0 10px;
    text-transform: uppercase;
  }

  .highlight-value {
    color: #13294b;
    font-size: 28px;
    font-weight: 700;
    line-height: 1;
    margin: 0 0 8px;
  }

  .highlight-text {
    color: #475569;
    font-size: 12px;
    line-height: 1.5;
    margin: 0;
  }

  .pillars-grid {
    display: grid;
    gap: 12px;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .pillar-card {
    background: #ffffff;
    border: 1px solid #d7dfeb;
    border-radius: 18px;
    padding: 16px 18px;
  }

  .pillar-header {
    align-items: flex-start;
    display: flex;
    gap: 12px;
    justify-content: space-between;
  }

  .pillar-title {
    color: #13294b;
    font-size: 16px;
    font-weight: 700;
    margin: 0;
  }

  .pillar-subtitle {
    color: #64748b;
    font-size: 12px;
    margin: 4px 0 0;
  }

  .score-chip {
    border-radius: 999px;
    color: #0f172a;
    display: inline-flex;
    font-size: 12px;
    font-weight: 700;
    padding: 7px 10px;
    white-space: nowrap;
  }

  .score-chip.level-1 {
    background: #fee2e2;
    color: #991b1b;
  }

  .score-chip.level-2 {
    background: #ffedd5;
    color: #9a3412;
  }

  .score-chip.level-3 {
    background: #fef3c7;
    color: #92400e;
  }

  .score-chip.level-4 {
    background: #dcfce7;
    color: #166534;
  }

  .score-chip.level-5 {
    background: #dbeafe;
    color: #1d4ed8;
  }

  .pillar-score-row {
    align-items: flex-end;
    display: flex;
    gap: 12px;
    justify-content: space-between;
    margin-top: 14px;
  }

  .pillar-score {
    color: #13294b;
    font-size: 30px;
    font-weight: 700;
    line-height: 1;
    margin: 0;
  }

  .pillar-score span {
    color: #64748b;
    font-size: 14px;
    font-weight: 600;
    margin-left: 4px;
  }

  .progress-bar {
    background: #e2e8f0;
    border-radius: 999px;
    height: 8px;
    margin-top: 14px;
    overflow: hidden;
  }

  .progress-value {
    border-radius: 999px;
    height: 100%;
  }

  .progress-value.people {
    background: linear-gradient(90deg, #2563eb 0%, #1d4ed8 100%);
  }

  .progress-value.processes {
    background: linear-gradient(90deg, #d97706 0%, #f59e0b 100%);
  }

  .progress-value.products {
    background: linear-gradient(90deg, #ea580c 0%, #f97316 100%);
  }

  .progress-value.finance {
    background: linear-gradient(90deg, #059669 0%, #10b981 100%);
  }

  .info-list {
    list-style: none;
    margin: 12px 0 0;
    padding: 0;
  }

  .info-list li {
    color: #334155;
    display: flex;
    gap: 8px;
    font-size: 13px;
    line-height: 1.55;
    margin-top: 8px;
  }

  .info-list li:first-child {
    margin-top: 0;
  }

  .bullet {
    color: #2563eb;
    font-weight: 700;
  }

  .analysis-grid {
    display: grid;
    gap: 12px;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .analysis-card {
    border: 1px solid #d7dfeb;
    border-radius: 18px;
    overflow: hidden;
  }

  .analysis-card .card-head {
    align-items: center;
    background: #f8fafc;
    border-bottom: 1px solid #d7dfeb;
    display: flex;
    gap: 10px;
    justify-content: space-between;
    padding: 14px 16px;
  }

  .analysis-card .card-body {
    padding: 16px;
  }

  .analysis-card .card-title {
    color: #13294b;
    font-size: 15px;
    font-weight: 700;
    margin: 0;
  }

  .analysis-card p {
    color: #334155;
    font-size: 13px;
    line-height: 1.65;
    margin: 0;
  }

  .recommendation-grid {
    display: grid;
    gap: 12px;
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .recommendation-card {
    background: #ffffff;
    border: 1px solid #d7dfeb;
    border-radius: 18px;
    min-height: 190px;
    padding: 16px;
  }

  .recommendation-rank {
    align-items: center;
    background: #eff6ff;
    border: 1px solid #bfdbfe;
    border-radius: 999px;
    color: #1d4ed8;
    display: inline-flex;
    font-size: 11px;
    font-weight: 700;
    margin-bottom: 12px;
    padding: 6px 10px;
    text-transform: uppercase;
  }

  .recommendation-title {
    color: #13294b;
    font-size: 15px;
    font-weight: 700;
    margin: 0 0 8px;
  }

  .recommendation-body,
  .recommendation-module {
    color: #475569;
    font-size: 13px;
    line-height: 1.6;
    margin: 0;
  }

  .recommendation-module {
    margin-top: 12px;
  }

  .plan-grid {
    display: grid;
    gap: 12px;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .plan-card {
    background: #f8fafc;
    border: 1px solid #d7dfeb;
    border-radius: 18px;
    min-height: 180px;
    padding: 16px 18px;
  }

  .plan-card h4 {
    color: #13294b;
    font-size: 15px;
    font-weight: 700;
    margin: 0 0 10px;
  }

  .plan-card ul {
    margin: 0;
    padding-left: 18px;
  }

  .plan-card li {
    color: #334155;
    font-size: 13px;
    line-height: 1.6;
    margin-top: 8px;
  }

  .plan-card li:first-child {
    margin-top: 0;
  }

  .table-card {
    background: #ffffff;
    border: 1px solid #d7dfeb;
    border-radius: 18px;
    overflow: hidden;
  }

  .table-title {
    background: #f8fafc;
    border-bottom: 1px solid #d7dfeb;
    color: #13294b;
    font-size: 15px;
    font-weight: 700;
    margin: 0;
    padding: 14px 16px;
  }

  table {
    border-collapse: collapse;
    width: 100%;
  }

  th, td {
    border-bottom: 1px solid #e2e8f0;
    padding: 10px 12px;
    text-align: left;
    vertical-align: top;
  }

  th {
    color: #475569;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  td {
    color: #1f2937;
    font-size: 12px;
    line-height: 1.55;
  }

  tbody tr:nth-child(even) {
    background: #f8fafc;
  }

  .question-number {
    color: #64748b;
    font-weight: 700;
    white-space: nowrap;
  }

  .muted {
    color: #64748b;
  }

  .footer-note {
    border-top: 1px solid #d7dfeb;
    color: #64748b;
    display: flex;
    font-size: 11px;
    justify-content: space-between;
    margin-top: 20px;
    padding-top: 12px;
  }

  @media print {
    body {
      background: #ffffff;
      padding: 0;
    }

    .report-shell {
      max-width: none;
    }

    .report-page {
      border: none;
      border-radius: 0;
      box-shadow: none;
      margin: 0;
    }
  }
`;

const PILLAR_MODULES: Record<BusinessProfileSectionKey, string> = {
  people: 'Human Resources',
  processes: 'Processes and tasks',
  products: 'CRM / Point of Sale',
  finance: 'Expenses and KPIs',
};

const PILLAR_PRIORITY_ACTIONS: Record<BusinessProfileSectionKey, string[]> = {
  people: [
    'Clarify responsibilities, delegation rules, and weekly accountability.',
    'Reduce founder dependency with documented ownership and follow-up.',
  ],
  processes: [
    'Document the most repeated workflows and assign a clear owner to each flow.',
    'Track execution visibly so tasks stop depending on memory and manual chasing.',
  ],
  products: [
    'Sharpen the offer, pricing logic, and the way channel performance is reviewed.',
    'Give the team a clearer commercial story so sales and delivery stay aligned.',
  ],
  finance: [
    'Increase visibility on cash, margins, and recurring financial review routines.',
    'Move decisions from intuition toward structured numbers and forward-looking control.',
  ],
};

const PILLAR_COLOR_CLASS: Record<BusinessProfileSectionKey, string> = {
  people: 'people',
  processes: 'processes',
  products: 'products',
  finance: 'finance',
};

const formatReportDate = (value: Date) => new Intl.DateTimeFormat(undefined, {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
}).format(value);

const getCompanyLabel = (companyName?: string | null) => (
  companyName && companyName.trim().length > 0 ? companyName.trim() : 'Current business'
);

const sortPillarsByScore = (report: BusinessDiagnosisScoreReport) => (
  [...report.pillars].sort((left, right) => {
    if (left.averageScore === right.averageScore) {
      return left.title.localeCompare(right.title);
    }

    return right.averageScore - left.averageScore;
  })
);

const getLowestQuestion = (pillar: DiagnosisPillarScore): DiagnosisQuestionScore | null => {
  const answeredQuestions = pillar.questions.filter((question) => question.selectedOptionValue !== null);
  if (answeredQuestions.length === 0) {
    return null;
  }

  return answeredQuestions.reduce((lowestQuestion, question) => (
    question.points < lowestQuestion.points ? question : lowestQuestion
  ));
};

const getExecutiveSummary = (report: BusinessDiagnosisScoreReport) => {
  const sortedPillars = sortPillarsByScore(report);
  const strongestPillar = sortedPillars[0];
  const weakestPillar = sortedPillars[sortedPillars.length - 1];
  const maturityName = report.overall.maturity.name;

  return `This business currently sits at ${maturityName} with a Business Maturity Index of ${report.overall.averageScore}/100. ` +
    `${strongestPillar.title} is the strongest pillar today, while ${weakestPillar.title} needs the earliest intervention. ` +
    'The next move is to turn current effort into repeatable routines, clearer ownership, and better decision visibility.';
};

const getOverallInterpretation = (report: BusinessDiagnosisScoreReport) => {
  const score = report.overall.averageScore;

  if (score <= 40) {
    return 'The operating model is still highly reactive. There is significant exposure to founder dependency, low process visibility, and weak decision discipline.';
  }

  if (score <= 60) {
    return 'The company has a working base, but still relies on manual follow-up and reactive control. Formal structure is present in parts, not across the whole business.';
  }

  if (score <= 75) {
    return 'The business is becoming organized and more predictable, but a few weak spots can still slow scale or reduce visibility if they are not tightened now.';
  }

  if (score <= 90) {
    return 'The business is operating with strong structure and is close to being fully scalable. The focus now is on consistency, monitoring, and leverage across teams.';
  }

  return 'The business shows a highly mature operating model with strong structure, visibility, and discipline. The priority is sustaining standards while scaling further.';
};

const getPillarInterpretation = (pillar: DiagnosisPillarScore) => {
  if (pillar.averageScore <= 40) {
    return `${pillar.title} is operating in a reactive mode. The section still depends too much on improvisation, which creates friction and weak repeatability.`;
  }

  if (pillar.averageScore <= 60) {
    return `${pillar.title} has basic structure in place, but it still leans on manual follow-up and inconsistent discipline. The operation works, but not smoothly enough yet.`;
  }

  if (pillar.averageScore <= 75) {
    return `${pillar.title} shows a healthy level of organization. The next step is to make that structure more consistent and measurable so it scales with less effort.`;
  }

  if (pillar.averageScore <= 90) {
    return `${pillar.title} is strong and close to scalable maturity. The focus should be on keeping visibility high and making execution more systematic.`;
  }

  return `${pillar.title} performs at a very mature level. The opportunity is no longer basic control, but sustaining excellence while the business grows.`;
};

const getOpportunityNarrative = (pillar: DiagnosisPillarScore) => {
  const lowestQuestion = getLowestQuestion(pillar);

  if (!lowestQuestion) {
    return 'This pillar still needs a completed answer set before a more precise opportunity statement can be generated.';
  }

  return `The most immediate opportunity is "${lowestQuestion.question}". The selected answer was "${lowestQuestion.selectedOptionLabel ?? 'Pending'}", which shows where operational discipline can improve first.`;
};

const getPriorityPillars = (report: BusinessDiagnosisScoreReport) => (
  [...report.pillars]
    .sort((left, right) => left.averageScore - right.averageScore)
    .slice(0, 3)
);

const getActionPlan = (report: BusinessDiagnosisScoreReport) => {
  const priorityPillars = getPriorityPillars(report);

  return {
    immediate: [
      `Review the three weakest pillars: ${priorityPillars.map((pillar) => pillar.title).join(', ')}.`,
      'Confirm owners for each improvement area and start a weekly execution review.',
      'Save the diagnosis as a baseline and compare progress after the next operating cycle.',
    ],
    thirtyDays: priorityPillars.flatMap((pillar) => PILLAR_PRIORITY_ACTIONS[pillar.key].slice(0, 1)),
    sixtyDays: priorityPillars.flatMap((pillar) => PILLAR_PRIORITY_ACTIONS[pillar.key].slice(1, 2)),
  };
};

function BusinessDiagnosisPdfDocument({
  report,
  title,
  subtitle,
  generatedAt,
  reportId,
  companyName,
}: BusinessDiagnosisPdfDocumentProps) {
  const sortedPillars = sortPillarsByScore(report);
  const strongestPillar = sortedPillars[0];
  const priorityPillar = [...sortedPillars].reverse()[0];
  const actionPlan = getActionPlan(report);

  return (
    <div className="report-shell">
      <style>{REPORT_STYLES}</style>

      <section className="report-page">
        <div className="report-hero">
          <div className="hero-topline">
            <div className="brand-badge">Indice diagnosis report</div>
            <div className="report-id">{reportId}</div>
          </div>

          <h1 className="hero-title">{title}</h1>
          <p className="hero-subtitle">{subtitle}</p>

          <div className="hero-meta">
            <div className="meta-card">
              <p className="meta-label">Company</p>
              <p className="meta-value">{getCompanyLabel(companyName)}</p>
            </div>
            <div className="meta-card">
              <p className="meta-label">Generated</p>
              <p className="meta-value">{formatReportDate(generatedAt)}</p>
            </div>
            <div className="meta-card">
              <p className="meta-label">Answered</p>
              <p className="meta-value">{report.overall.answeredCount}/{report.overall.totalQuestions} questions</p>
            </div>
          </div>
        </div>

        <div className="page-content">
          <div className="section">
            <div className="section-heading">
              <h2 className="section-title">Executive summary</h2>
              <p className="section-caption">A compact view of current maturity and where to act first</p>
            </div>

            <div className="summary-grid">
              <div className="summary-card">
                <p className="lead">{getExecutiveSummary(report)}</p>
              </div>
              <div className="panel-card">
                <p className="lead">{getOverallInterpretation(report)}</p>
              </div>
            </div>

            <div className="highlight-grid">
              <div className="highlight-card accent">
                <p className="highlight-label">Business Maturity Index</p>
                <p className="highlight-value">{report.overall.averageScore}</p>
                <p className="highlight-text">out of 100</p>
              </div>
              <div className="highlight-card">
                <p className="highlight-label">Maturity level</p>
                <p className="highlight-value">L{report.overall.maturity.level}</p>
                <p className="highlight-text">{report.overall.maturity.name}</p>
              </div>
              <div className="highlight-card">
                <p className="highlight-label">Strongest pillar</p>
                <p className="highlight-value">{strongestPillar.averageScore}</p>
                <p className="highlight-text">{strongestPillar.title}</p>
              </div>
              <div className="highlight-card">
                <p className="highlight-label">Priority pillar</p>
                <p className="highlight-value">{priorityPillar.averageScore}</p>
                <p className="highlight-text">{priorityPillar.title}</p>
              </div>
            </div>
          </div>

          <div className="section">
            <div className="section-heading">
              <h2 className="section-title">Pillar overview</h2>
              <p className="section-caption">Score, maturity, completion, and next module to activate</p>
            </div>

            <div className="pillars-grid">
              {report.pillars.map((pillar) => (
                <article className="pillar-card" key={pillar.key}>
                  <div className="pillar-header">
                    <div>
                      <h3 className="pillar-title">{pillar.title}</h3>
                      <p className="pillar-subtitle">{pillar.answeredCount}/{pillar.totalQuestions} answered</p>
                    </div>
                    <span className={`score-chip level-${pillar.maturity.level}`}>
                      {pillar.maturity.name}
                    </span>
                  </div>

                  <div className="pillar-score-row">
                    <p className="pillar-score">
                      {pillar.averageScore}
                      <span>/100</span>
                    </p>
                    <p className="section-caption">{PILLAR_MODULES[pillar.key]}</p>
                  </div>

                  <div className="progress-bar">
                    <div
                      className={`progress-value ${PILLAR_COLOR_CLASS[pillar.key]}`}
                      style={{ width: `${pillar.averageScore}%` }}
                    />
                  </div>

                  <ul className="info-list">
                    <li>
                      <span className="bullet">•</span>
                      <span>{getPillarInterpretation(pillar)}</span>
                    </li>
                    <li>
                      <span className="bullet">•</span>
                      <span>{getOpportunityNarrative(pillar)}</span>
                    </li>
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="report-page break-before">
        <div className="page-content">
          <div className="section">
            <div className="section-heading">
              <h2 className="section-title">Detailed analysis</h2>
              <p className="section-caption">Where the business is performing well and where it should improve first</p>
            </div>

            <div className="analysis-grid">
              {report.pillars.map((pillar) => (
                <article className="analysis-card" key={pillar.key}>
                  <div className="card-head">
                    <h3 className="card-title">{pillar.title}</h3>
                    <span className={`score-chip level-${pillar.maturity.level}`}>
                      {pillar.averageScore}/100
                    </span>
                  </div>
                  <div className="card-body">
                    <p>{getPillarInterpretation(pillar)}</p>
                    <ul className="info-list">
                      {PILLAR_PRIORITY_ACTIONS[pillar.key].map((actionItem) => (
                        <li key={actionItem}>
                          <span className="bullet">•</span>
                          <span>{actionItem}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="section">
            <div className="section-heading">
              <h2 className="section-title">Strategic recommendations</h2>
              <p className="section-caption">Priority actions connected directly to the ERP modules that can help</p>
            </div>

            <div className="recommendation-grid">
              {getPriorityPillars(report).map((pillar, index) => (
                <article className="recommendation-card" key={pillar.key}>
                  <div className="recommendation-rank">Priority {index + 1}</div>
                  <h3 className="recommendation-title">{pillar.title}</h3>
                  <p className="recommendation-body">{getOpportunityNarrative(pillar)}</p>
                  <p className="recommendation-module">
                    Suggested module: <strong>{PILLAR_MODULES[pillar.key]}</strong>
                  </p>
                </article>
              ))}
            </div>
          </div>

          <div className="section">
            <div className="section-heading">
              <h2 className="section-title">Action plan</h2>
              <p className="section-caption">A practical 60-day sequence to move from diagnosis into execution</p>
            </div>

            <div className="plan-grid">
              <article className="plan-card">
                <h4>Immediate next steps</h4>
                <ul>
                  {actionPlan.immediate.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>

              <article className="plan-card">
                <h4>Next 30 days</h4>
                <ul>
                  {actionPlan.thirtyDays.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>

              <article className="plan-card">
                <h4>Days 30 to 60</h4>
                <ul>
                  {actionPlan.sixtyDays.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>

              <article className="plan-card">
                <h4>Conclusion</h4>
                <ul>
                  <li>The diagnosis already gives a measurable baseline for future operating reviews.</li>
                  <li>The biggest gains will come from lifting the weakest pillars without losing momentum in the strongest one.</li>
                  <li>Indice can turn this diagnosis into action when the recommended modules are activated with clear ownership.</li>
                </ul>
              </article>
            </div>
          </div>

          <div className="footer-note">
            <span>Indice · Business diagnosis report</span>
            <span>Generated automatically from Business Profile answers</span>
          </div>
        </div>
      </section>

      <section className="report-page break-before">
        <div className="page-content">
          <div className="section">
            <div className="section-heading">
              <h2 className="section-title">Response appendix</h2>
              <p className="section-caption">Detailed answer list with the selected response and converted points</p>
            </div>

            {report.pillars.map((pillar) => (
              <article className="table-card section" key={pillar.key}>
                <h3 className="table-title">{pillar.title}</h3>
                <table>
                  <thead>
                    <tr>
                      <th style={{ width: '7%' }}>#</th>
                      <th style={{ width: '43%' }}>Question</th>
                      <th style={{ width: '34%' }}>Selected answer</th>
                      <th style={{ width: '16%' }}>Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pillar.questions.map((question) => (
                      <tr key={`${pillar.key}-${question.index}`}>
                        <td className="question-number">{question.index}</td>
                        <td>{question.question}</td>
                        <td>{question.selectedOptionLabel ?? <span className="muted">Pending</span>}</td>
                        <td>{question.points}/100</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export function openBusinessDiagnosisPdfPreview(props: BusinessDiagnosisPdfDocumentProps) {
  const printWindow = window.open('', '_blank', 'width=1080,height=900');

  if (!printWindow) {
    return false;
  }

  printWindow.document.title = `${props.title} - ${props.reportId}`;
  printWindow.document.body.innerHTML = '<div id="business-diagnosis-pdf-root"></div>';

  const mountNode = printWindow.document.getElementById('business-diagnosis-pdf-root');
  if (!mountNode) {
    printWindow.close();
    return false;
  }

  const root = createRoot(mountNode);

  root.render(
    <BusinessDiagnosisPdfDocument {...props} />,
  );

  const triggerPrint = () => {
    printWindow.focus();
    printWindow.print();
  };

  const requestFrame = printWindow.requestAnimationFrame?.bind(printWindow)
    ?? window.requestAnimationFrame.bind(window);

  requestFrame(() => {
    requestFrame(() => {
      triggerPrint();
    });
  });

  printWindow.addEventListener('beforeunload', () => {
    root.unmount();
  }, { once: true });

  return true;
}
