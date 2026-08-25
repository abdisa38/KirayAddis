import { useState } from "react";
import { Link, useNavigate } from "react-router";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Icon from "./components/Icon";
import { apiRequest } from "./api/client";

const samplePrompts = [
  "I work in Bole around Edna Mall, have a 40,000 ETB budget and need a quiet 2-bedroom apartment with water backup.",
  "Looking for an affordable 1-bedroom studio near Kazanchis UNECA under 25,000 ETB with backup generator.",
  "Family moving to Addis: 3 bedrooms in CMC or Yeka with private compound and dedicated parking.",
  "Diplomatic housing in Sarbet or Bisrate Gabriel: 4-bedroom villa with garden and 24/7 security.",
];

interface AICriteria {
  subCity?: string;
  neighborhood?: string;
  maxPrice?: number;
  minBedrooms?: number;
  propertyType?: string;
  mustHaveAmenities?: string[];
  keywords?: string[];
  summary?: string;
}

interface AIProperty {
  _id: string;
  title: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  matchScore: number;
  propertyType: string;
  location: {
    subCity: string;
    neighborhood: string;
    landmark: string;
  };
  amenities: string[];
  media: { url: string; isCover: boolean }[];
  owner?: { name: string; verificationTier: string };
}

interface AIExplanation {
  title: string;
  reasons: string[];
}

export default function AddisAI() {
  const [q, setQ] = useState(samplePrompts[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [criteria, setCriteria] = useState<AICriteria | null>(null);
  const [properties, setProperties] = useState<AIProperty[]>([]);
  const [explanations, setExplanations] = useState<AIExplanation[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const nav = useNavigate();

  const runSearch = async () => {
    if (!q.trim()) return;
    setLoading(true);
    setError("");
    setHasSearched(true);

    try {
      const data = await apiRequest("/ai/match", {
        method: "POST",
        body: JSON.stringify({ prompt: q }),
      });

      if (data.success) {
        setCriteria(data.criteria || null);
        setProperties(data.properties || []);
        setExplanations(data.explanations || []);
      }
    } catch (err: any) {
      setError(err.message || "AI matching failed. Please try again.");
      setCriteria(null);
      setProperties([]);
      setExplanations([]);
    } finally {
      setLoading(false);
    }
  };

  const getCoverImage = (p: AIProperty) => {
    const cover = p.media?.find((m) => m.isCover) || p.media?.[0];
    return cover?.url || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80";
  };

  const getExplanation = (title: string) => {
    return explanations.find((e) => e.title === title);
  };

  // Build filter chips from extracted criteria
  const filterChips: string[] = [];
  if (criteria) {
    if (criteria.subCity) filterChips.push(`${criteria.subCity} Sub-city`);
    if (criteria.neighborhood) filterChips.push(criteria.neighborhood);
    if (criteria.maxPrice) filterChips.push(`Budget ≤ ${Number(criteria.maxPrice).toLocaleString()} ETB`);
    if (criteria.minBedrooms) filterChips.push(`${criteria.minBedrooms}+ Bedrooms`);
    if (criteria.propertyType) filterChips.push(criteria.propertyType);
    if (criteria.mustHaveAmenities?.length) {
      criteria.mustHaveAmenities.forEach((a) => filterChips.push(a));
    }
  }

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
              Describe your needs naturally in English or Amharic. We will translate them into structured filters against live Addis Ababa properties and explain why each home fits.
            </span>
          </div>

          <div className="ai-query">
            <label>Describe what you need in your next home:</label>
            <textarea
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="e.g. I work around Bole Edna Mall, earn 45,000 ETB, need a 2-bedroom apartment with 24/7 security and a backup generator..."
            />

            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", margin: "12px 0" }}>
              <span style={{ fontSize: "11px", color: "#6a8194", alignSelf: "center" }}>Quick Prompts:</span>
              {samplePrompts.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setQ(p)}
                  style={{
                    background: "#f0f6f5",
                    border: "1px solid #d4e5e1",
                    borderRadius: "99px",
                    padding: "4px 10px",
                    fontSize: "11px",
                    color: "#254867",
                    cursor: "pointer",
                  }}
                >
                  Prompt {idx + 1}
                </button>
              ))}
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
              <small style={{ color: "#647d91", fontSize: "11px" }}>
                Addis AI analyzes commute corridors, price limits, utility backups, and neighborhood livability.
              </small>
              <button
                type="button"
                onClick={runSearch}
                className="btn"
                style={{ padding: "10px 22px" }}
                disabled={loading}
              >
                {loading ? "Analyzing..." : "Find My Match"} <Icon name="arrow" />
              </button>
            </div>
          </div>

          {/* Loading Pipeline State */}
          {loading && (
            <section className="ai-flow">
              <article className="active">
                <b>1</b>
                <span>User Intent</span>
                <small>Received</small>
              </article>
              <i>→</i>
              <article className="active" style={{ animation: "pulse 1.5s infinite" }}>
                <Icon name="sparkles" />
                <span>AI Parsing</span>
                <small>Extracting filters...</small>
              </article>
              <i>→</i>
              <article>
                <b>3</b>
                <span>Database Query</span>
                <small>Matching...</small>
              </article>
              <i>→</i>
              <article>
                <b>4</b>
                <span>Score & Rank</span>
                <small>Calculating...</small>
              </article>
            </section>
          )}

          {/* Error Banner */}
          {error && (
            <div style={{ background: "#fff0f0", border: "1px solid #f5c6cb", borderRadius: "10px", padding: "16px 20px", margin: "20px 0", color: "#721c24", fontSize: "12px" }}>
              <b>Note:</b> {error}
            </div>
          )}

          {/* Results */}
          {!loading && hasSearched && properties.length > 0 && (
            <>
              <section className="ai-flow">
                <article className="active">
                  <b>1</b>
                  <span>User Need</span>
                  <small>Natural-language intent</small>
                </article>
                <i>→</i>
                <article className="active">
                  <Icon name="sparkles" />
                  <span>AI Engine</span>
                  <small>Criteria extracted</small>
                </article>
                <i>→</i>
                <article className="active">
                  <b>3</b>
                  <span>Structured Filters</span>
                  <small>{filterChips.length} active filters</small>
                </article>
                <i>→</i>
                <article className="active">
                  <b>4</b>
                  <span>Addis Database</span>
                  <small>{properties.length} homes found</small>
                </article>
                <i>→</i>
                <article className="active">
                  <b>5</b>
                  <span>Ranked Match</span>
                  <small>Detailed justifications</small>
                </article>
              </section>

              <section className="ai-results">
                <div className="filters">
                  <div>
                    <p>AI EXTRACTED CRITERIA</p>
                    <h2>Your search, made clear.</h2>
                    {criteria?.summary && (
                      <small style={{ display: "block", color: "#5f758a", marginTop: "4px", fontSize: "12px" }}>
                        {criteria.summary}
                      </small>
                    )}
                  </div>
                  {filterChips.map((x) => (
                    <button key={x} type="button">
                      <Icon name="check" /> {x}
                    </button>
                  ))}
                  <Link to={`/search?location=${encodeURIComponent(criteria?.subCity || "")}`}>
                    Edit in full search →
                  </Link>
                </div>

                {/* Real Property Results */}
                {properties.map((p) => {
                  const exp = getExplanation(p.title);
                  return (
                    <div className="ai-property" key={p._id}>
                      <img src={getCoverImage(p)} alt={p.title} />
                      <div>
                        <span>{p.matchScore}% Match</span>
                        <h2>{p.title}</h2>
                        <p>
                          {p.location.neighborhood}, {p.location.subCity} · ETB{" "}
                          {Number(p.price).toLocaleString()} / month · {p.bedrooms} bed · {p.bathrooms} bath · {p.area} m²
                        </p>
                        <div className="reasons">
                          <b>Why Addis AI recommended this home:</b>
                          {exp?.reasons?.map((r, ri) => (
                            <small key={ri}>
                              <Icon name="check" style={{ color: "#087d70", marginRight: "4px" }} />
                              {r}
                            </small>
                          ))}
                          {!exp && (
                            <>
                              <small>
                                <Icon name="check" style={{ color: "#087d70", marginRight: "4px" }} />
                                Located in {p.location.neighborhood}, {p.location.subCity}
                              </small>
                              <small>
                                <Icon name="check" style={{ color: "#087d70", marginRight: "4px" }} />
                                ETB {Number(p.price).toLocaleString()} / month · {p.location.landmark}
                              </small>
                              <small>
                                <Icon name="check" style={{ color: "#087d70", marginRight: "4px" }} />
                                Amenities: {p.amenities.slice(0, 4).join(", ")}
                              </small>
                            </>
                          )}
                        </div>
                        <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
                          <Link
                            to={`/property/${p._id}`}
                            className="btn"
                            style={{ padding: "8px 16px", textDecoration: "none", fontSize: "11px" }}
                          >
                            View Property Details →
                          </Link>
                          <Link
                            to="/messages"
                            className="btn outline"
                            style={{ padding: "8px 16px", textDecoration: "none", fontSize: "11px" }}
                          >
                            Message Landlord
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </section>
            </>
          )}

          {/* No results state */}
          {!loading && hasSearched && properties.length === 0 && !error && (
            <div style={{ textAlign: "center", padding: "40px 20px" }}>
              <h3 style={{ color: "#12385e", margin: "0 0 8px" }}>No exact matches found</h3>
              <p style={{ color: "#6a8194", fontSize: "12px" }}>
                Try broadening your search or adjusting your budget.
              </p>
              <Link to="/search" className="btn" style={{ textDecoration: "none", marginTop: "12px", display: "inline-block" }}>
                Browse All Properties →
              </Link>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
