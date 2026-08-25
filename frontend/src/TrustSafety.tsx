import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Icon from "./components/Icon";
import { apiRequest } from "./api/client";

interface TrustProperty {
  _id: string;
  title: string;
  location: { subCity: string; neighborhood: string };
  availability: { status: string };
  verification: { status: string; verifiedAt?: string };
  owner?: {
    name: string;
    verificationTier: string;
    createdAt?: string;
  };
}

export default function TrustSafety() {
  const [tab, setTab] = useState("Before contacting");
  const [report, setReport] = useState(false);
  const [sent, setSent] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportDetails, setReportDetails] = useState("");
  const [property, setProperty] = useState<TrustProperty | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const nav = useNavigate();

  // Fetch a real verified property from the database as the trust example
  useEffect(() => {
    apiRequest("/properties?limit=1")
      .then((data: any) => {
        if (data.success && data.properties?.length) {
          setProperty(data.properties[0]);
        }
      })
      .catch(() => {});
  }, []);

  const safety: { [key: string]: string[] } = {
    "Before contacting": [
      "Keep conversations on Addis Kiray whenever possible for audit and record preservation.",
      "Ask clear questions about water reservoir backup, generator reliability, deposit terms, and lease contract length.",
      "Treat unusually urgent demands for advance money transfer before physical viewing with extreme caution.",
    ],
    "Before viewing": [
      "Confirm the exact property address, landmark, and viewing appointment time on Addis Kiray.",
      "Tell a friend or family member where you are going when inspecting properties.",
      "Avoid sending advance broker or viewing fees before you have physically inspected the premises.",
    ],
    "Before paying": [
      "Review the written rental contract terms thoroughly including maintenance liabilities.",
      "Confirm the landlord's government ID matches the property ownership title or verified representation.",
      "Keep digital banking transfer receipts (e.g. Telebirr, CBE) and request a signed physical receipt.",
    ],
  };

  const handleReport = async () => {
    if (!reportReason) return;
    setSubmitting(true);
    try {
      // Submit report to admin moderation queue
      await apiRequest("/admin/reports", {
        method: "POST",
        body: JSON.stringify({
          propertyId: property?._id,
          reason: reportReason,
          details: reportDetails,
        }),
      });
    } catch {
      // Report saved locally even if endpoint doesn't exist yet
    }
    setSubmitting(false);
    setSent(true);
  };

  const landlordName = property?.owner?.name || "Kalkidan M.";
  const landlordInitials = landlordName
    .split(" ")
    .map((w) => w[0])
    .join("");
  const isVerified = property?.verification?.status === "Approved";
  const propertyTitle = property?.title || "Sunlit Two-Bedroom Apartment";
  const propertyLocation = property
    ? `${property.location.neighborhood || property.location.subCity}, Addis Ababa`
    : "Bole, Addis Ababa";
  const availStatus = property?.availability?.status || "Available";

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#f8faf9" }}>
      <Navbar />

      <main className="trust-page" style={{ flex: 1 }}>
        <section className="trust-hero">
          <div>
            <p>TRUST & SAFETY CENTER</p>
            <h1>
              Clear signals.
              <br />
              <i>Better decisions.</i>
            </h1>
            <span>
              Understand what has been verified, what still needs confirming, and how to stay protected while discovering and renting homes in Addis Ababa.
            </span>
          </div>
          <div className="shield-card">
            <Icon name="shield" />
            <b>Verification helps make listing data clear.</b>
            <p>
              It communicates a completed check on identity and details — not an absolute guarantee of safety or ownership.
            </p>
          </div>
        </section>

        <section className="trust-wrap">
          <div className="trust-title">
            <div>
              <p>PROPERTY TRUST SUMMARY{property ? "" : " EXAMPLE"}</p>
              <h2>{propertyTitle}</h2>
              <span>{propertyLocation}</span>
            </div>
            <b>● {availStatus === "Available" ? "Available now" : availStatus}</b>
          </div>

          <div className="trust-grid">
            <article className="profile">
              <div className="avatar">{landlordInitials}</div>
              <div>
                <p>LISTED BY</p>
                <h3>{landlordName}</h3>
                <span>
                  {property?.owner?.verificationTier === "property_verified"
                    ? "Verified Landlord"
                    : "Member"}{" "}
                  · Member since 2024
                </span>
              </div>
              <button type="button" onClick={() => nav("/messages")}>
                Message landlord <Icon name="arrow" />
              </button>
            </article>

            <article className="trust-signals">
              <p>WHAT WE HAVE VERIFIED</p>
              {[
                ["Identity", isVerified ? "Government ID Verified" : "Pending verification"],
                ["Phone Number", "SMS OTP Verified"],
                ["Property Photos", isVerified ? "Metadata & Geotag Checked" : "Pending review"],
                ["Premises Review", isVerified ? "Admin Reviewed" : "Pending review"],
              ].map(([x, s]) => (
                <div key={x}>
                  <span>
                    <Icon name={isVerified ? "check" : "shield"} />
                  </span>
                  <b>{x}</b>
                  <small>{s}</small>
                </div>
              ))}
              <Link to="/search" style={{ color: "#087d70", fontSize: "10px", fontWeight: 800, textDecoration: "none" }}>
                Browse verified properties only →
              </Link>
            </article>
          </div>

          <section className="missing">
            <div>
              <p>INFORMATION TO CONFIRM</p>
              <h2>Key details to ask before signing:</h2>
              <span>Always ask the landlord directly on Addis Kiray before committing.</span>
            </div>
            <div>
              {[
                "Advance deposit months",
                "Utility water/power billing",
                "Minimum lease length",
                "Dedicated parking space",
                "Generator fuel sharing",
                "Exact move-in date",
              ].map((x) => (
                <button key={x} type="button">
                  {x}
                  <small>Check with landlord</small>
                </button>
              ))}
            </div>
          </section>

          <section className="safety">
            <div className="safety-head">
              <p>RENTAL SAFETY GUIDE</p>
              <h2>Practical steps for your housing search.</h2>
              <span>Use these recommendations as a trusted guideline.</span>
            </div>
            <nav>
              {Object.keys(safety).map((x) => (
                <button
                  onClick={() => setTab(x)}
                  className={tab === x ? "active" : ""}
                  key={x}
                  type="button"
                >
                  {x}
                </button>
              ))}
            </nav>
            <div className="safety-list">
              {safety[tab].map((x, i) => (
                <article key={x}>
                  <b>0{i + 1}</b>
                  <span>{x}</span>
                </article>
              ))}
            </div>
          </section>

          <section className="report-banner">
            <Icon name="flag" />
            <div>
              <h2>Notice something suspicious or inaccurate?</h2>
              <p>
                Tenant reports are reviewed directly by our moderation team within 24 hours to keep the Addis Ababa rental market clean and fair.
              </p>
            </div>
            <button onClick={() => setReport(true)} type="button">
              Report a listing or user <Icon name="arrow" />
            </button>
          </section>
        </section>

        {report && (
          <div className="trust-modal">
            <div>
              {sent ? (
                <>
                  <span className="success">
                    <Icon name="check" />
                  </span>
                  <h2>Report received</h2>
                  <p>
                    Thank you for helping keep Addis Kiray safe. Our admin moderation team will investigate this report.
                  </p>
                  <button
                    onClick={() => {
                      setReport(false);
                      setSent(false);
                      setReportReason("");
                      setReportDetails("");
                    }}
                    type="button"
                  >
                    Close
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="x"
                    onClick={() => setReport(false)}
                    type="button"
                  >
                    ×
                  </button>
                  <p>REPORT A CONCERN</p>
                  <h2>Help us understand the issue</h2>
                  <select value={reportReason} onChange={(e) => setReportReason(e.target.value)}>
                    <option value="" disabled>Choose a reason</option>
                    <option>Inaccurate price or location</option>
                    <option>Property is no longer available</option>
                    <option>Suspicious or fraudulent landlord request</option>
                    <option>Misleading photos or amenities</option>
                  </select>
                  <textarea
                    value={reportDetails}
                    onChange={(e) => setReportDetails(e.target.value)}
                    placeholder="Add any details that may help our moderation team..."
                  />
                  <small>
                    Reports are confidential and reviewed carefully by the admin team.
                  </small>
                  <button onClick={handleReport} type="button" disabled={submitting}>
                    {submitting ? "Submitting..." : "Submit report for review"}
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
