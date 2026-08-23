import { useState } from "react";
import { Link, useNavigate } from "react-router";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Icon from "./components/Icon";

const image =
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80";

const samplePrompts = [
  "I work in Bole, have a 35,000 ETB budget and need a quiet 2-bedroom home within 30 minutes.",
  "Looking for an affordable 1-bedroom apartment near Kazanchis under 25,000 ETB with water backup.",
  "Family moving to Addis: 3 bedrooms in CMC or Yeka with garden compound and parking.",
];

export default function AddisAI() {
  const [q, setQ] = useState(samplePrompts[0]);
  const [run, setRun] = useState(true);
  const nav = useNavigate();

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#f8fbfa" }}>
      <Navbar />

      <main className="ai-page" style={{ flex: 1 }}>
        <section className="ai-wrap">
          <div className="ai-intro">
            <p>ADDIS AI / NATURAL LANGUAGE MATCH ENGINE</p>
            <h1>
              Tell us what
              <br />
              <i>home means to you.</i>
            </h1>
            <span>
              Describe your needs naturally in English or Amharic. We’ll translate them into structured filters — then explain why each home fits.
            </span>
          </div>

          <div className="ai-query">
            <label>Describe what you need in your next home:</label>
            <textarea
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="e.g. I work around Bole Edna Mall, earn 45,000 ETB, need a 2-bedroom apartment with 24/7 security and a backup generator..."
            />

            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", margin: "10px 0" }}>
              <span style={{ fontSize: "9px", color: "#6a8194", alignSelf: "center" }}>Try sample:</span>
              {samplePrompts.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setQ(p);
                    setRun(true);
                  }}
                  style={{
                    background: "#f0f6f5",
                    border: "1px solid #d4e5e1",
                    borderRadius: "99px",
                    padding: "4px 8px",
                    fontSize: "9px",
                    color: "#254867",
                    cursor: "pointer",
                  }}
                >
                  Prompt {idx + 1}
                </button>
              ))}
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <small>Addis AI analyzes commute corridors, budget ranges, and required utilities.</small>
              <button
                type="button"
                onClick={() => setRun(true)}
                className="btn"
                style={{ padding: "10px 18px" }}
              >
                Find my match <Icon name="arrow" />
              </button>
            </div>
          </div>

          {run && (
            <>
              <section className="ai-flow">
                <article>
                  <b>1</b>
                  <span>User Need</span>
                  <small>Natural-language intent</small>
                </article>
                <i>→</i>
                <article className="active">
                  <b>2</b>
                  <span>Addis AI</span>
                  <small>Extracts criteria</small>
                </article>
                <i>→</i>
                <article className="active">
                  <b>3</b>
                  <span>Structured Filters</span>
                  <small>Visible & editable</small>
                </article>
                <i>→</i>
                <article>
                  <b>4</b>
                  <span>Addis Database</span>
                  <small>Real properties</small>
                </article>
                <i>→</i>
                <article>
                  <b>5</b>
                  <span>Ranked Match</span>
                  <small>Explanation included</small>
                </article>
              </section>

              <section className="ai-results">
                <div className="filters">
                  <div>
                    <p>AI EXTRACTED CRITERIA</p>
                    <h2>Your search, made clear.</h2>
                  </div>
                  {[
                    "Bole Sub-city",
                    "≤ 35,000 ETB",
                    "2+ Bedrooms",
                    "Quiet area",
                    "≤ 30 min commute",
                    "Water tank backup",
                  ].map((x) => (
                    <button key={x} type="button">
                      {x} ×
                    </button>
                  ))}
                  <Link to="/search">Edit in full search →</Link>
                </div>

                <div className="ai-property">
                  <img src={image} alt="Bright apartment interior" />
                  <div>
                    <span>94% Match</span>
                    <h2>Sunlit Two-Bedroom Apartment</h2>
                    <p>Bole, Addis Ababa · ETB 42,000 / month</p>
                    <div className="reasons">
                      <b>Why Addis AI recommended this home:</b>
                      <small>✓ Destination match: 24 min typical commute to Edna Mall area</small>
                      <small>✓ High utility reliability: 3,000L dedicated water reservoir & generator</small>
                      <small>✓ Verified landlord identity with response time under 3 hours</small>
                    </div>
                    <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
                      <Link
                        to="/property/sunlit-2bed"
                        className="btn"
                        style={{ padding: "8px 14px", textDecoration: "none", fontSize: "10px" }}
                      >
                        View property details →
                      </Link>
                      <Link
                        to="/messages"
                        className="btn outline"
                        style={{ padding: "8px 14px", textDecoration: "none", fontSize: "10px" }}
                      >
                        Inquire directly
                      </Link>
                    </div>
                  </div>
                </div>
              </section>
            </>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
