"use client";

import { useMemo, useState } from "react";
import styles from "./page.module.css";

type LoanStatus = "Under Review" | "Approved" | "Disbursed" | "At Risk";
type Risk = "Low" | "Medium" | "High";

type Loan = {
  id: string;
  borrower: string;
  sector: string;
  facility: number;
  yield: number;
  status: LoanStatus;
  risk: Risk;
  nextAction: string;
  analyst: string;
  dscr: number;
  repaymentDue: string;
};

const loans: Loan[] = [
  {
    id: "aarunya",
    borrower: "Aarunya Renewables",
    sector: "Clean Energy",
    facility: 64,
    yield: 13.8,
    status: "Disbursed",
    risk: "Low",
    nextAction: "Quarterly monitoring",
    analyst: "Nisha",
    dscr: 1.82,
    repaymentDue: "12 Jul 2026",
  },
  {
    id: "northline",
    borrower: "Northline Logistics",
    sector: "Supply Chain",
    facility: 42,
    yield: 15.1,
    status: "At Risk",
    risk: "High",
    nextAction: "DSCR review call",
    analyst: "Arjun",
    dscr: 1.08,
    repaymentDue: "Today",
  },
  {
    id: "mitra",
    borrower: "Mitra Foods",
    sector: "FMCG",
    facility: 28,
    yield: 14.3,
    status: "Approved",
    risk: "Medium",
    nextAction: "Finalize documents",
    analyst: "Meera",
    dscr: 1.31,
    repaymentDue: "04 Aug 2026",
  },
  {
    id: "cobalt",
    borrower: "Cobalt Health",
    sector: "Healthcare",
    facility: 36,
    yield: 12.9,
    status: "Under Review",
    risk: "Medium",
    nextAction: "Credit memo update",
    analyst: "Kabir",
    dscr: 1.46,
    repaymentDue: "18 Aug 2026",
  },
];

const alerts = [
  ["DSCR below 1.20x threshold", "Northline Logistics", "High", "Today"],
  ["FY financial statement pending", "Mitra Foods", "Medium", "2 days"],
  ["Insurance document expires soon", "Aarunya Renewables", "Low", "6 days"],
] as const;

const initialDocuments = [
  { name: "Loan agreement", checked: true },
  { name: "KYC verification", checked: true },
  { name: "Board resolution", checked: false },
  { name: "Repayment schedule", checked: true },
  { name: "Security documents", checked: false },
];

const statusClass: Record<LoanStatus, string> = {
  "Under Review": styles.statusReview,
  Approved: styles.statusApproved,
  Disbursed: styles.statusDisbursed,
  "At Risk": styles.statusRisk,
};

const riskClass: Record<Risk, string> = {
  Low: styles.riskLow,
  Medium: styles.riskMedium,
  High: styles.riskHigh,
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
    style: "currency",
    currency: "INR",
  }).format(value);

export default function Home() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<LoanStatus | "All">("All");
  const [selectedLoanId, setSelectedLoanId] = useState(loans[1].id);
  const [principal, setPrincipal] = useState(5000000);
  const [rate, setRate] = useState(14);
  const [tenure, setTenure] = useState(36);
  const [documents, setDocuments] = useState(initialDocuments);
  const [toast, setToast] = useState("Live portfolio synced");
  const [contactStatus, setContactStatus] = useState("We usually respond within one business day.");
  const [reviewLoan, setReviewLoan] = useState<Loan | null>(null);

  const selectedLoan = loans.find((loan) => loan.id === selectedLoanId) ?? loans[0];
  const monthlyRate = rate / 12 / 100;
  const emi =
    (principal * monthlyRate * (1 + monthlyRate) ** tenure) /
    ((1 + monthlyRate) ** tenure - 1);
  const totalInterest = emi * tenure - principal;

  const filteredLoans = useMemo(() => {
    return loans.filter((loan) => {
      const matchesStatus = status === "All" || loan.status === status;
      const text = `${loan.borrower} ${loan.sector} ${loan.analyst}`.toLowerCase();
      return matchesStatus && text.includes(query.toLowerCase());
    });
  }, [query, status]);

  const completedDocs = documents.filter((document) => document.checked).length;
  const readiness = Math.round((completedDocs / documents.length) * 100);

  function handleAction(message: string) {
    setToast(message);
  }

  function handleEnquireNow() {
    setContactStatus("Share your details and our lending operations team will reach out.");
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <main className={styles.page}>
      <section className={styles.hero} id="home">
        <nav className={styles.navbar} aria-label="Primary navigation">
          <a className={styles.brand} href="#home">
            <span className={styles.brandMark}>₹</span>
            <strong>CreditOps Studio</strong>
          </a>
          <div className={styles.navLinks}>
            <a href="#home">Home</a>
            <a href="#about">About</a>
            <a href="#calculator">Calculator</a>
            <a href="#pipeline">Loan Pipeline</a>
            <a href="#covenants">Covenants</a>
            <a href="#documents">Documents</a>
            <a href="#contact">Contact</a>
          </div>
          <button className={styles.navButton} onClick={handleEnquireNow}>
            Enquire Now
          </button>
        </nav>

        <div className={styles.heroGrid}>
          <div className={styles.heroCopy} id="about">
            <p className={styles.eyebrow}>Private credit intelligence</p>
            <h1>Operate every loan with investor-grade clarity.</h1>
            <p>
              A responsive lender workspace for portfolio monitoring, covenant alerts, repayment planning,
              and document readiness.
            </p>
            <div className={styles.heroActions}>
              <a className={styles.primaryButton} href="#pipeline">View pipeline</a>
            </div>
          </div>

          <aside className={styles.growthCard} id="calculator">
            <p className={styles.eyebrow}>Loan return calculator</p>
            <h2>{formatCurrency(Math.round(emi))}</h2>
            <span>Estimated monthly repayment</span>

            <label>
              Facility amount
              <input
                type="range"
                min="1000000"
                max="10000000"
                step="250000"
                value={principal}
                onChange={(event) => setPrincipal(Number(event.target.value))}
              />
              <strong>{formatCurrency(principal)}</strong>
            </label>
            <label>
              Annual rate
              <input
                type="range"
                min="8"
                max="22"
                value={rate}
                onChange={(event) => setRate(Number(event.target.value))}
              />
              <strong>{rate}%</strong>
            </label>
            <label>
              Tenure
              <input
                type="range"
                min="12"
                max="60"
                step="6"
                value={tenure}
                onChange={(event) => setTenure(Number(event.target.value))}
              />
              <strong>{tenure} months</strong>
            </label>

            <div className={styles.calculatorResult}>
              <span>Total interest</span>
              <strong>{formatCurrency(Math.round(totalInterest))}</strong>
            </div>
          </aside>
        </div>

        <div className={styles.statStrip} aria-label="Portfolio summary">
          <span><strong>₹482 Cr</strong>Total book</span>
          <span><strong>38</strong>Borrowers</span>
          <span><strong>5</strong>Covenant alerts</span>
          <span><strong>86%</strong>Docs ready</span>
        </div>
      </section>

      <section className={styles.whiteSection} id="pipeline">
        <div className={styles.sectionHeader}>
          <div>
            <p className={styles.eyebrow}>Loan pipeline</p>
            <h2>Credit facilities that update like a product workflow.</h2>
          </div>
          <p>{toast}</p>
        </div>

        <div className={styles.controls}>
          <input
            aria-label="Search borrowers"
            placeholder="Search borrower, sector, analyst"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <select
            aria-label="Filter by status"
            value={status}
            onChange={(event) => setStatus(event.target.value as LoanStatus | "All")}
          >
            <option>All</option>
            <option>Under Review</option>
            <option>Approved</option>
            <option>Disbursed</option>
            <option>At Risk</option>
          </select>
        </div>

        <div className={styles.pipelineGrid}>
          <div className={styles.loanList}>
            {filteredLoans.map((loan) => (
              <button
                className={`${styles.loanCard} ${loan.id === selectedLoan.id ? styles.selectedLoan : ""}`}
                key={loan.id}
                onClick={() => setSelectedLoanId(loan.id)}
              >
                <span className={`${styles.pill} ${statusClass[loan.status]}`}>{loan.status}</span>
                <strong>{loan.borrower}</strong>
                <small>{loan.sector} • {loan.analyst}</small>
                <div>
                  <span>₹{loan.facility} Cr</span>
                  <span className={`${styles.riskBadge} ${riskClass[loan.risk]}`}>{loan.risk}</span>
                </div>
              </button>
            ))}
          </div>

          <aside className={styles.detailPanel}>
            <p className={styles.eyebrow}>Selected borrower</p>
            <h3>{selectedLoan.borrower}</h3>
            <div className={styles.detailGrid}>
              <span><strong>₹{selectedLoan.facility} Cr</strong>Facility</span>
              <span><strong>{selectedLoan.yield}%</strong>Yield</span>
              <span><strong>{selectedLoan.dscr}x</strong>DSCR</span>
              <span><strong>{selectedLoan.repaymentDue}</strong>Next due</span>
            </div>
            <div className={styles.nextAction}>
              <span>Next action</span>
              <strong>{selectedLoan.nextAction}</strong>
            </div>
            <button
              className={styles.primaryButton}
              onClick={() => {
                setReviewLoan(selectedLoan);
                handleAction(`${selectedLoan.borrower} review opened`);
              }}
            >
              Open review
            </button>
          </aside>
        </div>
      </section>

      <section className={styles.darkBand} id="covenants">
        <div className={styles.sectionHeader}>
          <div>
            <p className={styles.eyebrow}>Covenant monitoring</p>
            <h2>Spot repayment and compliance risk before it becomes noise.</h2>
          </div>
        </div>
        <div className={styles.alertGrid}>
          {alerts.map(([title, borrower, severity, due]) => (
            <article className={styles.alertCard} key={title}>
              <span className={`${styles.riskBadge} ${riskClass[severity]}`}>{severity}</span>
              <strong>{title}</strong>
              <p>{borrower}</p>
              <small>Due: {due}</small>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.whiteSection} id="documents">
        <div className={styles.sectionHeader}>
          <div>
            <p className={styles.eyebrow}>Closing checklist</p>
            <h2>Document readiness that hiring teams can click through.</h2>
          </div>
          <p>{readiness}% complete</p>
        </div>

        <div className={styles.documentGrid}>
          {documents.map((document) => (
            <label className={styles.documentItem} key={document.name}>
              <input
                type="checkbox"
                checked={document.checked}
                onChange={() =>
                  setDocuments((current) =>
                    current.map((item) =>
                      item.name === document.name ? { ...item, checked: !item.checked } : item
                    )
                  )
                }
              />
              <span>{document.name}</span>
              <strong>{document.checked ? "Verified" : "Pending"}</strong>
            </label>
          ))}
        </div>

        <div className={styles.progressTrack} aria-label={`Documents ${readiness}% complete`}>
          <span style={{ width: `${readiness}%` }} />
        </div>
      </section>

      <section className={styles.contactSection} id="contact">
        <div className={styles.contactShell}>
          <div className={styles.sectionHeader}>
            <div>
              <p className={styles.eyebrow}>Contact our lending team</p>
              <h2>Talk to us about private credit operations.</h2>
            </div>
            <p>Share your requirements and our team will help you plan a sharper lending workflow.</p>
          </div>

          <div className={styles.contactGrid}>
            <div className={styles.mapCard} aria-label="Fake map showing Bangalore location">
            <div className={styles.mapTopbar}>
                <span>Bangalore Urban</span>
                <strong>12.9716° N, 77.5946° E</strong>
              </div>
              <iframe
                className={styles.mapFrame}
                title="CreditOps Studio Bangalore location"
                src="https://www.google.com/maps?q=MG%20Road%2C%20Bangalore%2C%20Karnataka&output=embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className={styles.mapAddress}>
                <strong>CreditOps Studio, MG Road</strong>
                <span>Bangalore Urban, Karnataka 560001</span>
              </div>
            </div>

            <form
              className={styles.contactForm}
              onSubmit={(event) => {
                event.preventDefault();
                setContactStatus("Thanks. Your query has been received.");
              }}
            >
              <label>
                Name
                <input name="name" placeholder="Enter your name" required />
              </label>
              <label>
                Email ID
                <input name="email" type="email" placeholder="name@example.com" required />
              </label>
              <label>
                Query
                <textarea name="query" placeholder="Tell us what you want to discuss" rows={5} required />
              </label>
              <button className={styles.primaryButton} type="submit">Submit query</button>
              <p>{contactStatus}</p>
            </form>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <div>
          <a className={styles.brand} href="#home">
            <span className={styles.brandMark}>₹</span>
            <strong>CreditOps Studio</strong>
          </a>
          <p>Private-credit operations workspace for loan monitoring, covenant tracking, repayment planning, and document readiness.</p>
        </div>
        <div>
          <strong>Office</strong>
          <span>MG Road, Bangalore Urban</span>
          <span>Karnataka 560001</span>
        </div>
        <div>
          <strong>Contact</strong>
          <span>hello@creditops.studio</span>
          <span>+91 80 4567 2190</span>
        </div>
        <div>
          <strong>Product</strong>
          <span>Loan monitoring</span>
          <span>Covenant workflows</span>
        </div>
      </footer>

      {reviewLoan ? (
        <div className={styles.modalOverlay} role="dialog" aria-modal="true" aria-labelledby="review-title">
          <article className={styles.reviewModal}>
            <div className={styles.modalHeader}>
              <div>
                <p className={styles.eyebrow}>Credit review summary</p>
                <h2 id="review-title">{reviewLoan.borrower}</h2>
              </div>
              <button className={styles.closeIcon} onClick={() => setReviewLoan(null)} aria-label="Close review">
                X
              </button>
            </div>

            <div className={styles.reviewGrid}>
              <span><strong>₹{reviewLoan.facility} Cr</strong>Facility</span>
              <span><strong>{reviewLoan.yield}%</strong>Yield</span>
              <span><strong>{reviewLoan.dscr}x</strong>DSCR</span>
              <span><strong>{reviewLoan.repaymentDue}</strong>Next due</span>
              <span><strong>{reviewLoan.status}</strong>Status</span>
              <span><strong>{reviewLoan.risk}</strong>Risk level</span>
            </div>

            <div className={styles.reviewNotes}>
              <strong>Recommended next action</strong>
              <p>{reviewLoan.nextAction} assigned to {reviewLoan.analyst}. Review borrower covenant health, repayment readiness, and document closure before the next credit committee update.</p>
            </div>

            <div className={styles.modalActions}>
              <button className={styles.primaryButton} onClick={() => window.print()}>
                Print details / save PDF
              </button>
              <button className={styles.secondaryButton} onClick={() => setReviewLoan(null)}>
                Close
              </button>
            </div>
          </article>
        </div>
      ) : null}
    </main>
  );
}
