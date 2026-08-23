import { useState } from "react";
import { Link, useNavigate } from "react-router";
import Logo from "./components/Logo";
import Icon from "./components/Icon";

const pics = [
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=80",
];

const homes = [
  {
    id: "sunlit-2bed",
    name: "Sunlit Two-Bedroom Apartment",
    area: "Bole, Addis Ababa",
    price: "42,000",
    score: "94",
    time: "24 min commute",
    beds: 2,
    baths: 2,
    size: "92 m²",
  },
  {
    id: "modern-atlas",
    name: "Modern apartment near Atlas",
    area: "Bole Atlas, Addis Ababa",
    price: "36,000",
    score: "89",
    time: "18 min commute",
    beds: 2,
    baths: 1,
    size: "85 m²",
  },
  {
    id: "bright-yeka",
    name: "Bright home with a city view",
    area: "Yeka, Addis Ababa",
    price: "29,500",
    score: "86",
    time: "28 min commute",
    beds: 3,
    baths: 2,
    size: "110 m²",
  },
];

function Card({
  h,
  i,
  onOpen,
}: {
  h: (typeof homes)[0];
  i: number;
  onOpen: () => void;
}) {
  const [saved, setSaved] = useState(i === 0);

  return (
    <article
      className="t-card"
      onClick={onOpen}
      style={{ cursor: "pointer" }}
    >
      <div className="t-photo">
        <img src={pics[i]} alt={h.name} />
        <span className="t-verified">
          <Icon name="check" /> Verified
        </span>
        {i === 1 && <span className="new">New</span>}
        <button
          className={saved ? "saved" : ""}
          onClick={(e) => {
            e.stopPropagation();
            setSaved(!saved);
          }}
          aria-label="Save home"
          type="button"
        >
          <Icon name="heart" />
        </button>
      </div>
      <div>
        <div className="t-card-head">
          <h3>{h.name}</h3>
          <span className="t-score">
            {h.score}%<small>Match</small>
          </span>
        </div>
        <p>
          <Icon name="pin" />
          {h.area}
        </p>
        <div className="t-facts">
          <span>{h.beds} beds</span>
          <span>{h.baths} baths</span>
          <span>{h.size}</span>
        </div>
        <b>
          ETB {h.price} <em>/ month</em>
        </b>
        <small className="commute">
          <Icon name="map" />
          {h.time}
        </small>
      </div>
    </article>
  );
}

export default function TenantExperience() {
  const [tab, setTab] = useState<
    "Home" | "Find a Home" | "Map" | "Saved" | "Compare" | "My Activity" | "Preferences"
  >("Home");
  const nav = useNavigate();

  const navItems = [
    { label: "Home", icon: "home" },
    { label: "Find a Home", icon: "search" },
    { label: "Map", icon: "map" },
    { label: "Saved", icon: "heart" },
    { label: "Compare", icon: "sliders" },
    { label: "My Activity", icon: "calendar" },
  ];

  const handleNavClick = (label: string) => {
    if (label === "Find a Home" || label === "Map") {
      nav("/search");
    } else {
      setTab(label as any);
    }
  };

  return (
    <main className="tenant">
      <header className="tenant-nav">
        <Logo to="/" />
        <nav>
          {navItems.map((item) => (
            <button
              className={tab === item.label ? "active" : ""}
              onClick={() => handleNavClick(item.label)}
              key={item.label}
              type="button"
            >
              {item.label}
            </button>
          ))}
        </nav>
        <div>
          <button className="notify" type="button" onClick={() => nav("/messages")}>
            <Icon name="bell" />
            <b>2</b>
          </button>
          <button className="tenant-avatar" type="button" onClick={() => setTab("Preferences")}>
            AM
          </button>
          <Link to="/search" className="find-home">
            Find a Home <Icon name="arrow" />
          </Link>
        </div>
      </header>

      <div className="tenant-shell">
        <aside className="tenant-side">
          <div className="side-user">
            <span>AM</span>
            <div>
              <b>Alem Mengistu</b>
              <small>Tenant • Bole search area</small>
            </div>
          </div>
          {navItems.map((item) => (
            <button
              className={tab === item.label ? "active" : ""}
              onClick={() => handleNavClick(item.label)}
              key={item.label}
              type="button"
            >
              <Icon name={item.icon} />
              {item.label}
            </button>
          ))}
          <div className="side-bottom">
            <button type="button" onClick={() => setTab("Preferences")}>
              <Icon name="spark" /> Preferences & Match
            </button>
            <Link to="/trust-safety" style={{ color: "#778b9a", textDecoration: "none", display: "flex", alignItems: "center", gap: "8px", padding: "8px", fontSize: "9px" }}>
              <Icon name="shield" /> Safety & Support
            </Link>
          </div>
        </aside>

        <section className="tenant-content">
          {tab === "Home" && (
            <>
              <div className="tenant-greeting">
                <div>
                  <p className="eyebrow">YOUR HOME SEARCH</p>
                  <h1>
                    Good morning, Alem <span>👋</span>
                  </h1>
                  <p>Let’s find a place that feels like home in Addis Ababa.</p>
                  <div>
                    <Link to="/search" className="t-primary">
                      Find a Home <Icon name="search" />
                    </Link>
                    <button className="t-outline" type="button" onClick={() => nav("/search")}>
                      Explore Map
                    </button>
                  </div>
                </div>
                <div className="search-shortcut" onClick={() => nav("/search")} style={{ cursor: "pointer" }}>
                  <span>
                    <Icon name="search" /> 2-bed near Bole under 40K ETB
                  </span>
                  <button type="button">
                    <Icon name="arrow" />
                  </button>
                </div>
              </div>

              <section className="match-summary">
                <div>
                  <p className="eyebrow">PERSONALIZED FOR YOU</p>
                  <h2>Homes picked for you</h2>
                  <p>
                    <b>18 homes</b> match your current preferences.
                  </p>
                  <Link to="/search">
                    View all matches <Icon name="arrow" />
                  </Link>
                </div>
                <div className="match-factors">
                  <span>
                    <b>Location</b>
                    <i style={{ width: "92%" }} />
                  </span>
                  <span>
                    <b>Budget</b>
                    <i style={{ width: "82%" }} />
                  </span>
                  <span>
                    <b>Bedrooms</b>
                    <i style={{ width: "100%" }} />
                  </span>
                  <span>
                    <b>Commute</b>
                    <i style={{ width: "75%" }} />
                  </span>
                  <small>Based on work around Edna Mall & 40K budget</small>
                </div>
              </section>

              <section className="t-section">
                <div className="t-head">
                  <div>
                    <p className="eyebrow">RECOMMENDED</p>
                    <h2>Recommended for you</h2>
                  </div>
                  <Link to="/search">
                    See all homes <Icon name="arrow" />
                  </Link>
                </div>
                <div className="t-cards">
                  {homes.map((h, i) => (
                    <Card
                      h={h}
                      i={i}
                      key={h.name}
                      onOpen={() => nav(`/property/${h.id}`)}
                    />
                  ))}
                </div>
              </section>

              <section className="t-grid">
                <div className="continue">
                  <p className="eyebrow">CONTINUE YOUR SEARCH</p>
                  <h2>2-bedroom apartments in Bole</h2>
                  <div>
                    <span>Bole, Addis Ababa</span>
                    <span>Up to 40,000 ETB</span>
                    <span>2+ bedrooms</span>
                    <span>Apartment</span>
                  </div>
                  <small>Last searched today</small>
                  <Link to="/search">
                    Continue search <Icon name="arrow" />
                  </Link>
                </div>

                <div className="updates">
                  <div className="t-head">
                    <div>
                      <p className="eyebrow">NEW FOR YOU</p>
                      <h2>Search updates</h2>
                    </div>
                    <button type="button">
                      <Icon name="more" />
                    </button>
                  </div>
                  <article onClick={() => nav("/property/sunlit-2bed")} style={{ cursor: "pointer" }}>
                    <i className="price-drop">↓</i>
                    <div>
                      <b>Price changed</b>
                      <p>
                        A home you saved is now <strong>3,000 ETB less</strong> per month.
                      </p>
                      <button type="button">View property</button>
                    </div>
                  </article>
                  <article onClick={() => nav("/property/sunlit-2bed")} style={{ cursor: "pointer" }}>
                    <i className="available-dot">●</i>
                    <div>
                      <b>Availability update</b>
                      <p>A saved home was recently marked available.</p>
                      <button type="button">View home</button>
                    </div>
                  </article>
                </div>
              </section>

              <section className="t-section commute-section">
                <div className="t-head">
                  <div>
                    <p className="eyebrow">COMMUTE-FRIENDLY</p>
                    <h2>Homes that fit your commute</h2>
                    <p>Within 30 minutes of Bole — Edna Mall area</p>
                  </div>
                  <Link to="/search">
                    Explore homes <Icon name="arrow" />
                  </Link>
                </div>
                <div className="commute-list">
                  {homes.slice(0, 2).map((h, i) => (
                    <div
                      key={h.name}
                      onClick={() => nav(`/property/${h.id}`)}
                      style={{ cursor: "pointer" }}
                    >
                      <span className="small-image">
                        <img src={pics[i]} alt="" />
                      </span>
                      <b>{h.name}</b>
                      <span>{h.area}</span>
                      <strong>Estimated {h.time}</strong>
                    </div>
                  ))}
                </div>
              </section>

              <section className="neighborhoods">
                <div className="t-head">
                  <div>
                    <p className="eyebrow">EXPLORE ADDIS</p>
                    <h2>Explore neighborhoods</h2>
                  </div>
                  <Link to="/search">
                    See map <Icon name="map" />
                  </Link>
                </div>
                <div className="hood-grid">
                  {["Bole", "Kazanchis", "CMC", "Yeka", "Sarbet", "Piassa"].map(
                    (x, i) => (
                      <article
                        key={x}
                        onClick={() => nav(`/search?location=${encodeURIComponent(x)}`)}
                        style={{ cursor: "pointer" }}
                      >
                        <img src={pics[i % 3]} alt={`${x}, Addis Ababa`} />
                        <div>
                          <b>{x}</b>
                          <span>Matching homes available</span>
                          <button type="button">
                            Explore <Icon name="arrow" />
                          </button>
                        </div>
                      </article>
                    )
                  )}
                </div>
              </section>

              <section className="move-panel">
                <div>
                  <p className="eyebrow">MY MOVE PLAN</p>
                  <h2>A few steps closer to your next home.</h2>
                  <p>
                    Keep your search, viewings, and move checklist organized in one place.
                  </p>
                  <Link to="/search">
                    Plan my move <Icon name="arrow" />
                  </Link>
                </div>
                <ol>
                  <li className="done">Preferences set</li>
                  <li className="done">Save homes you like (3 saved)</li>
                  <li>Request viewing appointment</li>
                  <li>Review lease terms and move in</li>
                </ol>
              </section>
            </>
          )}

          {tab === "Saved" && (
            <div>
              <div className="t-head">
                <div>
                  <p className="eyebrow">SAVED PROPERTIES</p>
                  <h1>Your Saved Homes ({homes.length})</h1>
                  <p>Properties you’ve favorited for comparison or viewing.</p>
                </div>
                <Link to="/search">
                  Browse more homes <Icon name="arrow" />
                </Link>
              </div>
              <div className="t-cards" style={{ marginTop: "24px" }}>
                {homes.map((h, i) => (
                  <Card
                    h={h}
                    i={i}
                    key={h.name}
                    onOpen={() => nav(`/property/${h.id}`)}
                  />
                ))}
              </div>
            </div>
          )}

          {tab === "Compare" && (
            <div>
              <div className="t-head">
                <div>
                  <p className="eyebrow">PROPERTY COMPARISON</p>
                  <h1>Compare Saved Homes</h1>
                  <p>Side-by-side comparison on rent, commute, and verified utilities.</p>
                </div>
                <button className="t-outline" type="button" onClick={() => setTab("Home")}>
                  Back to Overview
                </button>
              </div>
              <div style={{ background: "#fff", borderRadius: "12px", border: "1px solid #dce6ea", overflow: "hidden", marginTop: "24px" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "12px" }}>
                  <thead>
                    <tr style={{ background: "#f4f8f7", borderBottom: "1px solid #dce6ea" }}>
                      <th style={{ padding: "14px 16px", color: "#6e8496", fontSize: "11px" }}>Feature</th>
                      {homes.map((h) => (
                        <th key={h.name} style={{ padding: "14px 16px", color: "#10345b", fontWeight: 800 }}>
                          {h.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: "1px solid #eef2f5" }}>
                      <td style={{ padding: "12px 16px", color: "#6e8496" }}>Monthly Rent</td>
                      {homes.map((h) => (
                        <td key={h.name} style={{ padding: "12px 16px", fontWeight: 700, color: "#087d70" }}>
                          ETB {h.price}
                        </td>
                      ))}
                    </tr>
                    <tr style={{ borderBottom: "1px solid #eef2f5" }}>
                      <td style={{ padding: "12px 16px", color: "#6e8496" }}>Location</td>
                      {homes.map((h) => (
                        <td key={h.name} style={{ padding: "12px 16px" }}>{h.area}</td>
                      ))}
                    </tr>
                    <tr style={{ borderBottom: "1px solid #eef2f5" }}>
                      <td style={{ padding: "12px 16px", color: "#6e8496" }}>Commute to Edna Mall</td>
                      {homes.map((h) => (
                        <td key={h.name} style={{ padding: "12px 16px" }}>{h.time}</td>
                      ))}
                    </tr>
                    <tr style={{ borderBottom: "1px solid #eef2f5" }}>
                      <td style={{ padding: "12px 16px", color: "#6e8496" }}>Match Score</td>
                      {homes.map((h) => (
                        <td key={h.name} style={{ padding: "12px 16px", fontWeight: 800 }}>{h.score}%</td>
                      ))}
                    </tr>
                    <tr style={{ borderBottom: "1px solid #eef2f5" }}>
                      <td style={{ padding: "12px 16px", color: "#6e8496" }}>Layout</td>
                      {homes.map((h) => (
                        <td key={h.name} style={{ padding: "12px 16px" }}>{h.beds} beds • {h.baths} baths • {h.size}</td>
                      ))}
                    </tr>
                    <tr>
                      <td style={{ padding: "14px 16px", color: "#6e8496" }}>Action</td>
                      {homes.map((h) => (
                        <td key={h.name} style={{ padding: "14px 16px" }}>
                          <button
                            type="button"
                            onClick={() => nav(`/property/${h.id}`)}
                            className="btn"
                            style={{ padding: "6px 12px", fontSize: "10px" }}
                          >
                            View Details
                          </button>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === "My Activity" && (
            <div>
              <div className="t-head">
                <div>
                  <p className="eyebrow">INQUIRIES & VIEWINGS</p>
                  <h1>My Rental Activity</h1>
                  <p>Track your scheduled property viewings and direct landlord messages.</p>
                </div>
                <Link to="/messages" className="btn" style={{ textDecoration: "none" }}>
                  Open Messages →
                </Link>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginTop: "24px" }}>
                <div style={{ background: "#fff", padding: "24px", borderRadius: "12px", border: "1px solid #dce6ea" }}>
                  <b style={{ color: "#10345b", fontSize: "14px", display: "block", marginBottom: "16px" }}>
                    Upcoming Viewings (1)
                  </b>
                  <div style={{ display: "flex", gap: "12px", padding: "12px", borderRadius: "8px", background: "#f4f8f7", border: "1px solid #dce6ea" }}>
                    <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#0b8879", color: "#fff", display: "grid", placeItems: "center" }}>
                      <Icon name="calendar" />
                    </div>
                    <div>
                      <b style={{ fontSize: "12px", color: "#10345b", display: "block" }}>Sunlit Two-Bedroom Apartment</b>
                      <span style={{ fontSize: "11px", color: "#087d70", fontWeight: 700 }}>Saturday, 10:00 AM • Bole</span>
                      <small style={{ display: "block", color: "#74889a", marginTop: "2px" }}>Confirmed with landlord Kalkidan M.</small>
                    </div>
                  </div>
                </div>

                <div style={{ background: "#fff", padding: "24px", borderRadius: "12px", border: "1px solid #dce6ea" }}>
                  <b style={{ color: "#10345b", fontSize: "14px", display: "block", marginBottom: "16px" }}>
                    Recent Inquiries (3)
                  </b>
                  <div style={{ display: "grid", gap: "10px" }}>
                    <div onClick={() => nav("/messages")} style={{ padding: "10px", borderRadius: "6px", background: "#f8faf9", cursor: "pointer", border: "1px solid #e5ecef" }}>
                      <b style={{ fontSize: "11px", color: "#254867" }}>Modern 2 Bedroom Apartment</b>
                      <p style={{ margin: "2px 0 0", fontSize: "10px", color: "#6a8295" }}>"Yes, Saturday works for me..." • 10:42 AM</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {tab === "Preferences" && (
            <div>
              <div className="t-head">
                <div>
                  <p className="eyebrow">RENTAL MATCH ENGINE</p>
                  <h1>Housing Preferences</h1>
                  <p>Fine-tune the factors Addis Kiray uses to calculate your Match Score.</p>
                </div>
                <button className="btn" type="button" onClick={() => { alert("Preferences updated!"); setTab("Home"); }}>
                  Save Preferences
                </button>
              </div>

              <div style={{ background: "#fff", padding: "28px", borderRadius: "12px", border: "1px solid #dce6ea", marginTop: "24px", maxWidth: "680px" }}>
                <div style={{ display: "grid", gap: "18px" }}>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#254867" }}>
                    Workplace / Campus Destination
                    <input
                      defaultValue="Bole — Edna Mall area"
                      style={{ width: "100%", padding: "10px", marginTop: "6px", border: "1px solid #dce6eb", borderRadius: "6px", fontSize: "12px" }}
                    />
                  </label>

                  <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#254867" }}>
                    Monthly Housing Budget (ETB)
                    <input
                      defaultValue="40,000"
                      style={{ width: "100%", padding: "10px", marginTop: "6px", border: "1px solid #dce6eb", borderRadius: "6px", fontSize: "12px" }}
                    />
                  </label>

                  <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#254867" }}>
                    Maximum Commute Time
                    <select
                      defaultValue="30 min"
                      style={{ width: "100%", padding: "10px", marginTop: "6px", border: "1px solid #dce6eb", borderRadius: "6px", fontSize: "12px" }}
                    >
                      <option>15 minutes</option>
                      <option>30 minutes</option>
                      <option>45 minutes</option>
                      <option>60 minutes</option>
                    </select>
                  </label>

                  <div>
                    <b style={{ display: "block", fontSize: "11px", color: "#254867", marginBottom: "8px" }}>
                      Must-Have Utilities & Amenities
                    </b>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", fontSize: "11px", color: "#546e82" }}>
                      <label><input type="checkbox" defaultChecked /> Backup Water Tank</label>
                      <label><input type="checkbox" defaultChecked /> Generator</label>
                      <label><input type="checkbox" defaultChecked /> Dedicated Parking</label>
                      <label><input type="checkbox" defaultChecked /> 24/7 Security</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>

      <nav className="bottom-nav">
        {[
          ["Home", "home"],
          ["Search", "search"],
          ["Saved", "heart"],
          ["Activity", "calendar"],
          ["Profile", "more"],
        ].map(([x, i]) => (
          <button
            className={
              tab === x || (tab === "Find a Home" && x === "Search")
                ? "active"
                : ""
            }
            onClick={() => handleNavClick(x === "Search" ? "Find a Home" : x)}
            key={x}
            type="button"
          >
            <Icon name={i} />
            <span>{x}</span>
          </button>
        ))}
      </nav>
    </main>
  );
}
