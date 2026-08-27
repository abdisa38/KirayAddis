import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Icon from "./components/Icon";
import { apiRequest } from "./api/client";

const pics = [
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=900&q=80",
];

// Descriptions for known neighborhoods (used as fallback enrichment)
const neighborhoodMeta: Record<string, string> = {
  Bole: "Central, airport access & vibrant commercial hub",
  Kazanchis: "Walking distance to UNECA, hotels & offices",
  Kirkos: "Walking distance to UNECA, hotels & offices",
  CMC: "Modern residential compounds & quiet living",
  Yeka: "Green hills, embassies & panoramic views",
  "Nifas Silk-Lafto": "Expats, cafes, international schools & quiet streets",
  Sarbet: "Expats, cafes, international schools & quiet streets",
  Arada: "Historic heart, new corridor development",
  Piassa: "Historic heart, new corridor development",
};

// Display name mapping for sub-cities to user-friendly neighborhood names
const displayNames: Record<string, string> = {
  Kirkos: "Kazanchis",
  "Nifas Silk-Lafto": "Sarbet",
  Arada: "Piassa",
};

interface NeighborhoodData {
  name: string;
  desc: string;
  img: string;
  count: string;
}

interface HomeData {
  name: string;
  loc: string;
  price: string;
  match: string;
  commute: string;
  beds: number;
  baths: number;
  area: string;
  tag: string;
  to: string;
  img: string;
}

// Fallback data used only when backend is unreachable
const fallbackNeighborhoods: NeighborhoodData[] = [
  { name: "Bole", desc: "Central, airport access & vibrant commercial hub", img: pics[0], count: "0 homes" },
  { name: "Kazanchis", desc: "Walking distance to UNECA, hotels & offices", img: pics[1], count: "0 homes" },
  { name: "CMC", desc: "Modern residential compounds & quiet living", img: pics[2], count: "0 homes" },
  { name: "Yeka", desc: "Green hills, embassies & panoramic views", img: pics[3], count: "0 homes" },
  { name: "Sarbet", desc: "Expats, cafes, international schools & quiet streets", img: pics[1], count: "0 homes" },
  { name: "Piassa", desc: "Historic heart, new corridor development", img: pics[0], count: "0 homes" },
];

export default function Homepage() {
  const [locationInput, setLocationInput] = useState("Bole, Addis Ababa");
  const [destinationInput, setDestinationInput] = useState("Edna Mall area");
  const [budget, setBudget] = useState("40000");
  const [propertyType, setPropertyType] = useState("All");
  const [aiQuery, setAiQuery] = useState("I work in Bole, earn 40k, need a 2-bedroom house under 30 min commute.");
  const [savedHomes, setSavedHomes] = useState<Record<number, boolean>>({});
  const [liveHomes, setLiveHomes] = useState<HomeData[]>([]);
  const [liveNeighborhoods, setLiveNeighborhoods] = useState<NeighborhoodData[]>(fallbackNeighborhoods);
  const [totalProperties, setTotalProperties] = useState(0);
  const [heroProperty, setHeroProperty] = useState<HomeData | null>(null);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  // Fetch neighborhoods from API
  useEffect(() => {
    apiRequest("/properties/neighborhoods")
      .then((data: any) => {
        if (data.success && data.areas?.length) {
          const mapped: NeighborhoodData[] = data.areas.map((area: any, i: number) => {
            const subCity = area.subCity;
            const friendlyName = displayNames[subCity] || subCity;
            // Pick the best image from the area's neighborhoods
            const img = area.neighborhoods?.[0]?.image || pics[i % pics.length];
            return {
              name: friendlyName,
              desc: neighborhoodMeta[friendlyName] || neighborhoodMeta[subCity] || "Addis Ababa neighborhood",
              img,
              count: `${area.count}+ homes`,
            };
          });
          setLiveNeighborhoods(mapped);
          setTotalProperties(data.totalProperties || 0);
        }
      })
      .catch(() => {
        // Keep fallback neighborhoods
      });
  }, []);

  // Fetch featured properties from API
  useEffect(() => {
    setLoading(true);
    apiRequest("/properties?limit=12")
      .then((data: any) => {
        if (data.success && data.properties?.length) {
          const mapped: HomeData[] = data.properties.map((p: any) => {
            const coverMedia = p.media?.find((m: any) => m.isCover) || p.media?.[0];
            return {
              name: p.title,
              loc: `${p.location?.neighborhood || p.location?.subCity}, Addis Ababa`,
              price: Number(p.price).toLocaleString(),
              match: `${p.matchScore || 90}`,
              commute: p.location?.landmark || "20-25 min commute",
              beds: p.bedrooms,
              baths: p.bathrooms,
              area: `${p.area} m²`,
              tag: p.verification?.status === "Approved" ? "Verified" : "New",
              to: `/property/${p._id}`,
              img: coverMedia?.url || pics[0],
            };
          });
          setLiveHomes(mapped);
          // Set the first property as the hero map preview property
          if (mapped.length > 0) {
            setHeroProperty(mapped[0]);
          }
          if (!totalProperties && data.total) {
            setTotalProperties(data.total);
          }
        }
      })
      .catch(() => {
        // No fallback needed - will show empty state
      })
      .finally(() => setLoading(false));
  }, []);

  const toggleSave = (index: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSavedHomes((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (locationInput.trim()) params.set("location", locationInput.trim());
    if (destinationInput.trim()) params.set("destination", destinationInput.trim());
    if (budget && budget !== "All") params.set("maxPrice", budget);
    if (propertyType && propertyType !== "All") params.set("propertyType", propertyType);
    nav(`/search?${params.toString()}`);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8faf9", color: "#173858" }}>
      <Navbar />

      {/* 1. HERO & INTELLIGENT SEARCH */}
      <section
        style={{
          background: "linear-gradient(180deg, #ffffff 0%, #f4f8f7 100%)",
          padding: "48px 30px 60px",
          borderBottom: "1px solid #e1e9ed",
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1.1fr 0.9fr",
            gap: "48px",
            alignItems: "center",
          }}
        >
          {/* Left Column: Heading & Value Prop */}
          <div>
            <p className="auth-kicker" style={{ margin: "0 0 12px" }}>
              HOUSING DISCOVERY • RELOCATION • MATCHING
            </p>
            <h1
              style={{
                margin: "0 0 16px",
                color: "#10345b",
                fontSize: "46px",
                letterSpacing: "-0.05em",
                lineHeight: 1.08,
                fontWeight: 800,
              }}
            >
              Find a home that
              <br />
              <i style={{ fontFamily: "Source Serif 4, serif", fontWeight: 500, color: "#0b8879" }}>
                fits your life
              </i>{" "}
              in Addis Ababa.
            </h1>
            <p
              style={{
                margin: "0 0 28px",
                color: "#5f758a",
                fontSize: "15px",
                lineHeight: 1.6,
                maxWidth: "540px",
              }}
            >
              Search by location, monthly budget, lifestyle and commute time to your workplace or university — not just by house.
            </p>

            {/* Structured Search Box */}
            <form
              onSubmit={handleSearch}
              style={{
                background: "#ffffff",
                border: "1px solid #cbd9e1",
                borderRadius: "12px",
                padding: "8px",
                boxShadow: "0 12px 32px rgba(15, 52, 80, 0.08)",
                display: "grid",
                gap: "8px",
              }}
            >
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                <div className="search-input" style={{ border: "1px solid #e1e9ed", borderRadius: "8px", padding: "10px 12px" }}>
                  <Icon name="search" />
                  <div>
                    <b>Where do you want to live?</b>
                    <input
                      type="text"
                      value={locationInput}
                      onChange={(e) => setLocationInput(e.target.value)}
                      placeholder="Bole, Kazanchis, CMC..."
                      style={{ border: "none", outline: "none", fontSize: "12px", color: "#254867", width: "100%" }}
                    />
                  </div>
                </div>

                <div className="search-input destination" style={{ border: "1px solid #e1e9ed", borderRadius: "8px", padding: "10px 12px" }}>
                  <Icon name="pin" />
                  <div>
                    <b>Your Workplace / Destination</b>
                    <input
                      type="text"
                      value={destinationInput}
                      onChange={(e) => setDestinationInput(e.target.value)}
                      placeholder="e.g. Bole Medhanealem"
                      style={{ border: "none", outline: "none", fontSize: "12px", color: "#254867", width: "100%" }}
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                <div style={{ flex: 1, display: "flex", gap: "8px" }}>
                  <select
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    style={{
                      flex: 1,
                      padding: "10px",
                      border: "1px solid #d4e0e6",
                      borderRadius: "6px",
                      fontSize: "11px",
                      color: "#345873",
                      background: "#fff",
                      cursor: "pointer",
                    }}
                  >
                    <option value="All">Any Budget</option>
                    <option value="20000">Up to 20,000 ETB</option>
                    <option value="35000">Up to 35,000 ETB</option>
                    <option value="50000">Up to 50,000 ETB</option>
                    <option value="75000">Up to 75,000 ETB</option>
                    <option value="120000">Up to 120,000+ ETB</option>
                  </select>

                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    style={{
                      flex: 1,
                      padding: "10px",
                      border: "1px solid #d4e0e6",
                      borderRadius: "6px",
                      fontSize: "11px",
                      color: "#345873",
                      background: "#fff",
                      cursor: "pointer",
                    }}
                  >
                    <option value="All">All Property Types</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Studio">Studio</option>
                    <option value="Condominium">Condominium</option>
                    <option value="Villa">Villa</option>
                    <option value="House">House</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="go"
                  style={{
                    padding: "11px 24px",
                    fontSize: "12px",
                    margin: 0,
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <Icon name="search" /> Find My Home
                </button>
              </div>
            </form>

            <div className="suggestions" style={{ marginTop: "12px", display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
              <span style={{ fontSize: "11px", color: "#647c90" }}>Popular:</span>
              {["Bole", "Kazanchis", "CMC", "Yeka", "Sarbet", "Piassa", "Mexico", "Gullele"].map((loc) => (
                <button
                  key={loc}
                  type="button"
                  onClick={() => {
                    setLocationInput(loc);
                    nav(`/search?location=${encodeURIComponent(loc)}`);
                  }}
                  style={{
                    background: "#f0f5f7",
                    border: "1px solid #d0e0e8",
                    borderRadius: "4px",
                    padding: "3px 8px",
                    fontSize: "10px",
                    color: "#087d70",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  {loc}
                </button>
              ))}
              <Link to="/ai" style={{ marginLeft: "auto", color: "#087d70", fontSize: "10px", fontWeight: 800, textDecoration: "none" }}>
                Ask Addis AI Assistant →
              </Link>
            </div>
          </div>

          {/* Right Column: Interactive Map & Selected Property Preview */}
          <div
            style={{
              position: "relative",
              height: "440px",
              borderRadius: "16px",
              overflow: "hidden",
              border: "1px solid #c8ded9",
              background: "#b7dad4",
              boxShadow: "0 16px 36px rgba(13, 52, 91, 0.12)",
            }}
          >
            <div className="map-roads" />
            <div className="commute-line" />
            <span className="area a1">Piassa</span>
            <span className="area a2">Kazanchis</span>
            <span className="area a3">Bole</span>
            <span className="area a4">CMC</span>

            <div className="marker one" style={{ position: "absolute", top: "25%", left: "28%" }}>
              {heroProperty ? `ETB ${(Number(heroProperty.price.replace(/,/g, "")) / 1000).toFixed(0)}k` : "ETB 36k"}
            </div>
            <div className="marker two" style={{ position: "absolute", top: "45%", right: "20%" }}>
              {liveHomes[2] ? `ETB ${(Number(liveHomes[2].price.replace(/,/g, "")) / 1000).toFixed(1)}k` : "ETB 39.5k"}
            </div>
            <div className="marker main" style={{ position: "absolute", top: "36%", left: "48%" }}>
              <Icon name="map" /> {heroProperty ? `ETB ${(Number(heroProperty.price.replace(/,/g, "")) / 1000).toFixed(0)}k • ${heroProperty.match}% Match` : "ETB 42k • 94% Match"}
            </div>

            {/* Floating Top Badge */}
            <div
              style={{
                position: "absolute",
                top: "16px",
                left: "16px",
                background: "rgba(255, 255, 255, 0.95)",
                padding: "8px 12px",
                borderRadius: "8px",
                fontSize: "10px",
                fontWeight: 700,
                color: "#10345b",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
              }}
            >
              <Icon name="pin" style={{ color: "#0b8879", width: "12px" }} />
              <span>Live Commute Analysis: 24 min to work</span>
            </div>

            {/* Floating Property Card on Map */}
            <div
              className="map-preview"
              style={{
                position: "absolute",
                bottom: "16px",
                left: "16px",
                right: "16px",
                width: "auto",
                background: "#ffffff",
                boxShadow: "0 8px 24px rgba(10, 40, 70, 0.18)",
              }}
            >
              <img src={heroProperty?.img || pics[0]} alt="Selected property" />
              <div>
                <span className="verified">
                  <Icon name="check" /> Verified property
                </span>
                <h3>{heroProperty?.name || "Sunlit two-bedroom apartment"}</h3>
                <p>{heroProperty?.loc || "Bole, Addis Ababa"} • {heroProperty?.commute || "24 min to work"}</p>
                <b>ETB {heroProperty?.price || "42,000"} <em>/ month</em></b>
              </div>
              <button onClick={() => nav(heroProperty?.to || "/search")}>
                View Property Details <Icon name="arrow" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TRUST INDICATORS BANNER */}
      <section style={{ background: "#ffffff", borderBottom: "1px solid #e2eaed", padding: "28px 30px" }}>
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "24px",
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#e1f4ef", color: "#087d70", display: "grid", placeItems: "center", flexShrink: 0 }}>
              <Icon name="pin" />
            </div>
            <div>
              <b style={{ color: "#12385e", fontSize: "12px", display: "block" }}>Location & Commute Matching</b>
              <span style={{ color: "#6e8496", fontSize: "10px", lineHeight: 1.5, display: "block", marginTop: "2px" }}>
                Filter homes by realistic commute times to your workplace or university.
              </span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#e1f4ef", color: "#087d70", display: "grid", placeItems: "center", flexShrink: 0 }}>
              <Icon name="shield" />
            </div>
            <div>
              <b style={{ color: "#12385e", fontSize: "12px", display: "block" }}>Verified Listings & Freshness</b>
              <span style={{ color: "#6e8496", fontSize: "10px", lineHeight: 1.5, display: "block", marginTop: "2px" }}>
                Active confirmations on availability, utility reliability, and landlord identity.
              </span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#e1f4ef", color: "#087d70", display: "grid", placeItems: "center", flexShrink: 0 }}>
              <Icon name="spark" />
            </div>
            <div>
              <b style={{ color: "#12385e", fontSize: "12px", display: "block" }}>Rental Match Score</b>
              <span style={{ color: "#6e8496", fontSize: "10px", lineHeight: 1.5, display: "block", marginTop: "2px" }}>
                Personalized percentages explaining exactly why a property fits your needs.
              </span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#e1f4ef", color: "#087d70", display: "grid", placeItems: "center", flexShrink: 0 }}>
              <Icon name="home" />
            </div>
            <div>
              <b style={{ color: "#12385e", fontSize: "12px", display: "block" }}>Built for Addis Ababa</b>
              <span style={{ color: "#6e8496", fontSize: "10px", lineHeight: 1.5, display: "block", marginTop: "2px" }}>
                Designed specifically around Addis sub-cities, woredas, and transportation corridors.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. EXPLORE NEIGHBORHOODS */}
      <section style={{ padding: "64px 30px", maxWidth: "1240px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "28px" }}>
          <div>
            <p className="eyebrow">EXPLORE ADDIS ABABA</p>
            <h2 style={{ margin: "0 0 6px", color: "#12385e", fontSize: "28px", letterSpacing: "-0.05em" }}>
              Start with a neighborhood that fits your routine.
            </h2>
            <p style={{ margin: 0, color: "#6c8295", fontSize: "12px" }}>
              From lively commercial districts to serene residential compounds.
            </p>
          </div>
          <Link to="/search" style={{ color: "#087d70", fontSize: "11px", fontWeight: 800, textDecoration: "none" }}>
            Explore on Map <Icon name="map" />
          </Link>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "18px" }}>
          {liveNeighborhoods.map((n) => (
            <article
              key={n.name}
              onClick={() => nav(`/search?location=${encodeURIComponent(n.name)}`)}
              style={{
                position: "relative",
                height: "200px",
                borderRadius: "12px",
                overflow: "hidden",
                cursor: "pointer",
                boxShadow: "0 6px 18px rgba(15, 52, 80, 0.08)",
                transition: "transform 0.2s",
              }}
            >
              <img
                src={n.img}
                alt={n.name}
                style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.72)" }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: "0",
                  background: "linear-gradient(0deg, rgba(13, 52, 91, 0.85) 0%, transparent 60%)",
                  padding: "16px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  color: "#ffffff",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <h3 style={{ margin: "0 0 4px", fontSize: "18px", fontWeight: 800 }}>{n.name}</h3>
                  <span style={{ fontSize: "9px", color: "#8bd9ca", fontWeight: 700 }}>{n.count}</span>
                </div>
                <p style={{ margin: 0, fontSize: "10px", color: "#dbe5ea", lineHeight: 1.4 }}>{n.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 4. RECOMMENDED PROPERTIES */}
      <section style={{ background: "#ffffff", padding: "64px 30px", borderTop: "1px solid #e1e9ed", borderBottom: "1px solid #e1e9ed" }}>
        <div style={{ maxWidth: "1240px", margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "28px" }}>
            <div>
              <p className="eyebrow">HOMES WORTH SEEING</p>
              <h2 style={{ margin: "0 0 6px", color: "#12385e", fontSize: "28px", letterSpacing: "-0.05em" }}>
                Homes selected around price, location and lifestyle
              </h2>
              <p style={{ margin: 0, color: "#6c8295", fontSize: "12px" }}>
                High match scores calculated from realistic Addis commute times and verified utilities.
              </p>
            </div>
            <Link to="/search" style={{ color: "#087d70", fontSize: "11px", fontWeight: 800, textDecoration: "none" }}>
              View all {totalProperties || "—"} homes →
            </Link>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
            {liveHomes.map((h, i) => (
              <article
                key={h.name}
                onClick={() => nav(h.to)}
                className="card"
                style={{ cursor: "pointer", display: "flex", flexDirection: "column", border: "1px solid #e0e9ee", borderRadius: "12px", overflow: "hidden", background: "#fff" }}
              >
                <div className="photo" style={{ height: "190px" }}>
                  <img src={h.img} alt={h.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <span className="verified">
                    <Icon name="check" /> Verified property
                  </span>
                  <span className="best">{h.tag}</span>
                  <button
                    className={`save ${savedHomes[i] ? "saved" : ""}`}
                    onClick={(e) => toggleSave(i, e)}
                    aria-label="Save property"
                  >
                    <Icon name="heart" />
                  </button>
                </div>
                <div className="card-body" style={{ padding: "16px", flex: 1, display: "flex", flexDirection: "column" }}>
                  <div className="card-top">
                    <div>
                      <h3 style={{ fontSize: "15px", margin: "0 0 4px", color: "#13385e" }}>{h.name}</h3>
                      <p style={{ display: "flex", alignItems: "center", gap: "4px", margin: 0, color: "#71869a", fontSize: "10px" }}>
                        <Icon name="pin" /> {h.loc}
                      </p>
                    </div>
                    <span className="score">
                      {h.match}%<small>Match</small>
                    </span>
                  </div>

                  <div className="meta" style={{ marginTop: "14px", paddingTop: "10px" }}>
                    <span>{h.beds} beds</span>
                    <span>{h.baths} baths</span>
                    <span>{h.area}</span>
                  </div>

                  <div className="card-bottom" style={{ marginTop: "auto", paddingTop: "12px" }}>
                    <b>ETB {h.price} <em>/ month</em></b>
                    <span className="commute">
                      <Icon name="map" /> {h.commute}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 5. HOW ADDIS KIRAY WORKS */}
      <section style={{ padding: "64px 30px", maxWidth: "1100px", margin: "0 auto", textAlign: "center" }}>
        <p className="eyebrow">A CLEAR PROCESS</p>
        <h2 style={{ margin: "0 0 12px", color: "#12385e", fontSize: "32px", letterSpacing: "-0.05em" }}>
          Finding your next home should be simple.
        </h2>
        <p style={{ maxWidth: "540px", margin: "0 auto 48px", color: "#667e91", fontSize: "13px", lineHeight: 1.6 }}>
          We remove the broker uncertainty, outdated listings, and endless phone calls with a straightforward 3-step pathway.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px", textAlign: "left" }}>
          <div style={{ background: "#ffffff", padding: "28px 24px", borderRadius: "12px", border: "1px solid #dce5ea" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#0b8879", color: "#fff", display: "grid", placeItems: "center", fontWeight: 800, marginBottom: "16px" }}>
              1
            </div>
            <h3 style={{ margin: "0 0 8px", color: "#12385e", fontSize: "16px" }}>Tell us what you need</h3>
            <p style={{ margin: 0, color: "#6a8194", fontSize: "11px", lineHeight: 1.6 }}>
              Set your monthly budget, work or university location, preferred commute time, and required utilities like water tanks and generators.
            </p>
          </div>

          <div style={{ background: "#ffffff", padding: "28px 24px", borderRadius: "12px", border: "1px solid #dce5ea" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#0b8879", color: "#fff", display: "grid", placeItems: "center", fontWeight: 800, marginBottom: "16px" }}>
              2
            </div>
            <h3 style={{ margin: "0 0 8px", color: "#12385e", fontSize: "16px" }}>Discover your matches</h3>
            <p style={{ margin: 0, color: "#6a8194", fontSize: "11px", lineHeight: 1.6 }}>
              Explore properties with transparent Match Scores, verified landlord identities, realistic commute estimates, and fresh availability badges.
            </p>
          </div>

          <div style={{ background: "#ffffff", padding: "28px 24px", borderRadius: "12px", border: "1px solid #dce5ea" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#0b8879", color: "#fff", display: "grid", placeItems: "center", fontWeight: 800, marginBottom: "16px" }}>
              3
            </div>
            <h3 style={{ margin: "0 0 8px", color: "#12385e", fontSize: "16px" }}>Connect & schedule viewing</h3>
            <p style={{ margin: 0, color: "#6a8194", fontSize: "11px", lineHeight: 1.6 }}>
              Message the landlord directly on-platform, request an in-person viewing appointment, and transition smoothly to your new home.
            </p>
          </div>
        </div>
      </section>

      {/* 6. AI HOUSING ASSISTANT SECTION */}
      <section
        style={{
          background: "linear-gradient(135deg, #0d345b 0%, #08233f 100%)",
          color: "#ffffff",
          padding: "64px 30px",
        }}
      >
        <div
          style={{
            maxWidth: "1140px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1fr 1.1fr",
            gap: "50px",
            alignItems: "center",
          }}
        >
          <div>
            <p style={{ color: "#8bd9ca", fontFamily: "DM Mono", fontSize: "10px", letterSpacing: "0.14em", margin: "0 0 10px" }}>
              ✦ ADDIS AI • NATURAL LANGUAGE ASSISTANT
            </p>
            <h2 style={{ margin: "0 0 16px", fontSize: "36px", letterSpacing: "-0.05em", lineHeight: 1.1 }}>
              Tell Addis AI what you need in plain words.
            </h2>
            <p style={{ color: "#c1d5e3", fontSize: "13px", lineHeight: 1.7, margin: "0 0 24px" }}>
              Skip complex multi-field filters. Describe your lifestyle, workplace, and budget in English or Amharic — our AI translates it into structured filters and ranks matching homes.
            </p>
            <Link
              to="/ai"
              className="btn"
              style={{
                background: "#0b8879",
                color: "#ffffff",
                padding: "12px 20px",
                fontSize: "11px",
                textDecoration: "none",
              }}
            >
              Try Addis AI Assistant <Icon name="arrow" />
            </Link>
          </div>

          <div
            style={{
              background: "rgba(255, 255, 255, 0.07)",
              border: "1px solid rgba(139, 217, 202, 0.3)",
              borderRadius: "16px",
              padding: "24px",
              backdropFilter: "blur(8px)",
            }}
          >
            <div style={{ marginBottom: "14px" }}>
              <label style={{ fontSize: "10px", color: "#8bd9ca", fontWeight: 700 }}>YOUR SEARCH PROMPT</label>
              <textarea
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                style={{
                  width: "100%",
                  minHeight: "75px",
                  background: "rgba(255, 255, 255, 0.95)",
                  border: "none",
                  borderRadius: "8px",
                  padding: "10px 12px",
                  fontSize: "12px",
                  color: "#12385e",
                  marginTop: "6px",
                  fontFamily: "inherit",
                }}
              />
            </div>

            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "16px" }}>
              <span style={{ background: "rgba(11, 136, 121, 0.3)", color: "#8bd9ca", padding: "4px 8px", borderRadius: "99px", fontSize: "9px" }}>
                ✓ Bole sub-city
              </span>
              <span style={{ background: "rgba(11, 136, 121, 0.3)", color: "#8bd9ca", padding: "4px 8px", borderRadius: "99px", fontSize: "9px" }}>
                ✓ ≤ 40,000 ETB
              </span>
              <span style={{ background: "rgba(11, 136, 121, 0.3)", color: "#8bd9ca", padding: "4px 8px", borderRadius: "99px", fontSize: "9px" }}>
                ✓ 2+ Bedrooms
              </span>
              <span style={{ background: "rgba(11, 136, 121, 0.3)", color: "#8bd9ca", padding: "4px 8px", borderRadius: "99px", fontSize: "9px" }}>
                ✓ ≤ 30 min commute
              </span>
            </div>

            <div
              style={{
                background: "#ffffff",
                borderRadius: "10px",
                padding: "12px",
                color: "#12385e",
                display: "grid",
                gridTemplateColumns: "90px 1fr",
                gap: "12px",
                alignItems: "center",
              }}
            >
              <img src={liveHomes[1]?.img || pics[1]} alt="Preview" style={{ width: "90px", height: "70px", borderRadius: "6px", objectFit: "cover" }} />
              <div>
                <span style={{ background: "#e1f4ef", color: "#087d70", padding: "2px 6px", borderRadius: "99px", fontSize: "8px", fontWeight: 800 }}>
                  {liveHomes[1]?.match || "94"}% Match
                </span>
                <b style={{ display: "block", fontSize: "12px", marginTop: "3px" }}>{liveHomes[1]?.name || "Modern apartment near Atlas"}</b>
                <span style={{ fontSize: "10px", color: "#6a8194" }}>{liveHomes[1]?.price || "36,000"} ETB / mo • {liveHomes[1]?.commute || "18 min commute"}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. NEW TO ADDIS & RELOCATION */}
      <section style={{ padding: "64px 30px", maxWidth: "1140px", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
          {/* New to Addis Card */}
          <div style={{ background: "#e8f3f1", padding: "36px 30px", borderRadius: "14px", border: "1px solid #c9e2dd" }}>
            <p className="eyebrow">NEW TO ADDIS ABABA?</p>
            <h3 style={{ margin: "0 0 10px", color: "#10345b", fontSize: "24px", letterSpacing: "-0.04em" }}>
              Start your relocation plan with confidence.
            </h3>
            <p style={{ color: "#506f7e", fontSize: "12px", lineHeight: 1.6, margin: "0 0 20px" }}>
              Moving to Addis for a new job or studies? We analyze your office destination, budget, and transportation habits to recommend the ideal neighborhoods.
            </p>
            <Link to="/tenant" className="btn" style={{ textDecoration: "none" }}>
              Get Addis Housing Plan →
            </Link>
          </div>

          {/* Changing Homes Card */}
          <div style={{ background: "#ffffff", padding: "36px 30px", borderRadius: "14px", border: "1px solid #dce6ea" }}>
            <p className="eyebrow">CHANGING HOMES?</p>
            <h3 style={{ margin: "0 0 10px", color: "#10345b", fontSize: "24px", letterSpacing: "-0.04em" }}>
              Moving Mode: upgrade or relocate closer to work.
            </h3>
            <p style={{ color: "#506f7e", fontSize: "12px", lineHeight: 1.6, margin: "0 0 20px" }}>
              Tell us where you currently live and what needs to change — shorter commute, bigger compound, or lower rent. We’ll show you the best transitions.
            </p>
            <Link to="/search" className="btn outline" style={{ textDecoration: "none" }}>
              Explore Moving Mode →
            </Link>
          </div>
        </div>
      </section>

      {/* 8. FOR LANDLORDS CTA */}
      <section
        style={{
          background: "#ffffff",
          borderTop: "1px solid #e1e9ed",
          borderBottom: "1px solid #e1e9ed",
          padding: "60px 30px",
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1.1fr 0.9fr",
            gap: "40px",
            alignItems: "center",
          }}
        >
          <div>
            <p className="eyebrow">FOR PROPERTY OWNERS & LANDLORDS</p>
            <h2 style={{ margin: "0 0 14px", color: "#12385e", fontSize: "32px", letterSpacing: "-0.05em" }}>
              Have a property to rent in Addis Ababa?
            </h2>
            <p style={{ color: "#60788c", fontSize: "13px", lineHeight: 1.6, margin: "0 0 24px" }}>
              Connect with serious, verified tenants actively searching in your neighborhood. Manage inquiries, confirm viewing appointments, and update availability in real-time.
            </p>
            <div style={{ display: "flex", gap: "12px" }}>
              <Link to="/landlord/listing" className="btn" style={{ textDecoration: "none" }}>
                List Your Property (9-Step Wizard) →
              </Link>
              <Link to="/trust-safety" className="btn outline" style={{ textDecoration: "none" }}>
                Landlord Verification
              </Link>
            </div>
          </div>

          <div
            style={{
              background: "#f4f8f7",
              border: "1px solid #dce6eb",
              borderRadius: "12px",
              padding: "24px",
            }}
          >
            <b style={{ color: "#12385e", fontSize: "13px", display: "block", marginBottom: "12px" }}>
              Why list on Addis Kiray?
            </b>
            <div style={{ display: "grid", gap: "10px" }}>
              <div style={{ display: "flex", gap: "8px", fontSize: "11px", color: "#456278" }}>
                <span style={{ color: "#087d70", fontWeight: 800 }}>✓</span>
                <span>AI-assisted professional listing description generation</span>
              </div>
              <div style={{ display: "flex", gap: "8px", fontSize: "11px", color: "#456278" }}>
                <span style={{ color: "#087d70", fontWeight: 800 }}>✓</span>
                <span>Direct on-platform tenant inquiries with zero broker fees</span>
              </div>
              <div style={{ display: "flex", gap: "8px", fontSize: "11px", color: "#456278" }}>
                <span style={{ color: "#087d70", fontWeight: 800 }}>✓</span>
                <span>Automated viewing appointment scheduling & calendar</span>
              </div>
              <div style={{ display: "flex", gap: "8px", fontSize: "11px", color: "#456278" }}>
                <span style={{ color: "#087d70", fontWeight: 800 }}>✓</span>
                <span>Verified badge status for higher tenant trust and fast occupancy</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. FINAL CTA BANNER */}
      <section
        style={{
          background: "#0d345b",
          color: "#ffffff",
          textAlign: "center",
          padding: "70px 30px",
        }}
      >
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <p style={{ color: "#8bd9ca", fontFamily: "DM Mono", fontSize: "10px", letterSpacing: "0.14em", margin: "0 0 10px" }}>
            START YOUR DISCOVERY
          </p>
          <h2 style={{ margin: "0 0 14px", fontSize: "38px", letterSpacing: "-0.06em", fontWeight: 800 }}>
            Your next home is closer than you think.
          </h2>
          <p style={{ color: "#c1d5e3", fontSize: "14px", lineHeight: 1.6, margin: "0 0 28px" }}>
            Search smarter, compare confidently, and find a place that fits your life in Addis Ababa.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "12px", flexWrap: "wrap" }}>
            <Link to="/search" className="btn" style={{ textDecoration: "none", padding: "12px 24px", fontSize: "11px" }}>
              Find My Home <Icon name="search" />
            </Link>
            <Link to="/register?role=landlord" className="btn outline" style={{ textDecoration: "none", padding: "12px 24px", fontSize: "11px" }}>
              List Your Property as Landlord →
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
