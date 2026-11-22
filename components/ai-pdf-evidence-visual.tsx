import { ArrowUpRight, FileCheck2, FileText, Info } from "lucide-react";

/**
 * An accessible, source-backed editorial diagram for the fictional notices.
 * Text stays selectable and readable at narrow widths. This is NOT an AI run.
 */
const notices = [
  {
    label: "SAMPLE A",
    status: "Original notice",
    issued: "1 October 2026",
    file: "/ai-tools/samples/library-hours-notice-v1.txt",
    effective: "1 December 2026",
    saturday: "10:00–16:00",
    sunday: "Closed",
  },
  {
    label: "SAMPLE B",
    status: "Revised notice · supersedes A",
    issued: "15 October 2026",
    file: "/ai-tools/samples/library-hours-notice-v2.txt",
    effective: "15 December 2026",
    saturday: "11:00–15:00",
    sunday: "12:00–15:00",
  },
] as const;

const findings = [
  { label: "Effective date", value: "14 days later", detail: "1 Dec → 15 Dec" },
  { label: "Saturday hours", value: "2 hours shorter", detail: "6 hours → 4 hours" },
  { label: "Sunday hours", value: "3 hours added", detail: "Closed → 12:00–15:00" },
] as const;

export default function AiPdfEvidenceVisual() {
  return (
    <figure className="ai-pdf-evidence-visual" aria-labelledby="ai-pdf-evidence-title">
      <div className="ai-pdf-evidence-heading">
        <div className="ai-pdf-evidence-kicker"><FileCheck2 size={17} aria-hidden="true" /> DOCUMENT EVIDENCE / VISUAL EXAMPLE</div>
        <h2 id="ai-pdf-evidence-title">Two source documents. Three checkable changes.</h2>
        <p>Compare the wording, not an AI-generated answer. These notices are fictional TXT files that readers can print to PDF for the exercise.</p>
      </div>

      <div className="ai-pdf-evidence-papers">
        {notices.map((notice, index) => (
          <section className="ai-pdf-evidence-paper" key={notice.label} aria-label={notice.label + " document summary"}>
            <div className="ai-pdf-evidence-paper-top">
              <span className="ai-pdf-evidence-paper-icon"><FileText size={22} aria-hidden="true" /></span>
              <div>
                <span className="ai-pdf-evidence-paper-tag">{notice.label} / FICTIONAL TXT</span>
                <h3>{notice.status}</h3>
              </div>
              <span className="ai-pdf-evidence-revision">{index === 0 ? "V1" : "V2"}</span>
            </div>
            <p className="ai-pdf-evidence-issued">Issued {notice.issued}</p>
            <dl className="ai-pdf-evidence-facts">
              <div><dt>Effective</dt><dd>{notice.effective}</dd></div>
              <div><dt>Saturday</dt><dd>{notice.saturday}</dd></div>
              <div><dt>Sunday</dt><dd>{notice.sunday}</dd></div>
            </dl>
            <a href={notice.file} download className="ai-pdf-evidence-source-link">
              Read {notice.label} source <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </section>
        ))}
      </div>

      <div className="ai-pdf-evidence-results" aria-label="Manually checked differences">
        {findings.map((finding) => (
          <div className="ai-pdf-evidence-result" key={finding.label}>
            <span>{finding.label}</span>
            <strong>{finding.value}</strong>
            <small>{finding.detail}</small>
          </div>
        ))}
      </div>

      <figcaption className="ai-pdf-evidence-note">
        <Info size={17} aria-hidden="true" />
        <span><strong>Important:</strong> Weekday hours and staffing are not stated in either source. Their absence must not be labeled “unchanged.” All findings were checked manually against the downloadable fictional notices; no AI model was benchmarked.</span>
      </figcaption>
    </figure>
  );
}
