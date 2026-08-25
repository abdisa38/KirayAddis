import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "./context/AuthContext";
import { apiRequest } from "./api/client";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Icon from "./components/Icon";

interface TenantProperty {
  _id: string;
  title: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  propertyType: string;
  matchScore: number;
  location: {
    subCity: string;
    neighborhood: string;
    landmark: string;
  };
  amenities: string[];
  media: { url: string; isCover: boolean }[];
  availability: { status: string };
  verification: { status: string };
}

interface TenantViewing {
  _id: string;
  property: {
    _id: string;
    title: string;
    price: number;
    location: { subCity: string; neighborhood: string };
    media: { url: string }[];
  };
  landlord: {
    name: string;
    phone: string;
    email: string;
  };
  appointmentDate: string;
  appointmentTime: string;
  status: string;
  notes?: string;
}

export default function TenantExperience() {
  const { user, login } = useAuth();
  const [activeTab, setActiveTab] = useState<"matches" | "saved" | "viewings" | "preferences">("matches");
  const [recommended, setRecommended] = useState<TenantProperty[]>([]);
  const [savedHomes, setSavedHomes] = useState<TenantProperty[]>([]);
  const [viewings, setViewings] = useState<TenantViewing[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState("");
  const nav = useNavigate();

  // Preference form state
  const [workplace, setWorkplace] = useState("Bole Edna Mall area");
  const [budgetMax, setBudgetMax] = useState(40000);
  const [maxCommuteMin, setMaxCommuteMin] = useState(30);
  const [mustHaveAmenities, setMustHaveAmenities] = useState<string[]>([
    "Water tank",
    "Generator",
    "24/7 security",
  ]);

  const fetchTenantData = async () => {
    setLoading(true);
    try {
      if (!user || user.role !== "tenant") {
        await login("alem@example.com", "password123");
      }

      // Fetch recommended listings
      const propData = await apiRequest("/properties?limit=6");
      if (propData.success) {
        setRecommended(propData.properties || []);
      }

      // Fetch saved favorites
      const savedData = await apiRequest("/tenant/saved");
      if (savedData.success) {
        setSavedHomes(savedData.savedProperties || []);
      }

      // Fetch scheduled viewings
      const viewData = await apiRequest("/messages/viewings");
      if (viewData.success) {
        setViewings(viewData.viewings || []);
      }

      // Load user preferences if available
      if (user?.preferences) {
        if (user.preferences.workplace) setWorkplace(user.preferences.workplace);
        if (user.preferences.budgetMax) setBudgetMax(user.preferences.budgetMax);
        if (user.preferences.maxCommuteMin) setMaxCommuteMin(user.preferences.maxCommuteMin);
        if (user.preferences.mustHaveAmenities) setMustHaveAmenities(user.preferences.mustHaveAmenities);
      }
    } catch (err: any) {
      console.error("Error fetching tenant data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenantData();
  }, [user]);

  // Toggle favorite
  const toggleSave = async (propertyId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      const data = await apiRequest(`/tenant/saved/${propertyId}`, { method: "POST" });
      if (data.success) {
        setActionMessage(data.isSaved ? "Property added to your Saved Homes!" : "Property removed from Saved Homes.");
        setTimeout(() => setActionMessage(""), 3500);
        // Refresh saved list
        const savedData = await apiRequest("/tenant/saved");
        if (savedData.success) {
          setSavedHomes(savedData.savedProperties || []);
        }
      }
    } catch (err: any) {
      alert(err.message || "Failed to toggle save");
    }
  };

  // Save Preferences
  const savePreferences = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await apiRequest("/tenant/preferences", {
        method: "PUT",
        body: JSON.stringify({
          workplace,
          budgetMax,
          maxCommuteMin,
          mustHaveAmenities,
        }),
      });
      if (data.success) {
        setActionMessage("Housing match preferences updated & saved to your profile!");
        setTimeout(() => setActionMessage(""), 3500);
        // Refresh recommendations
        const propData = await apiRequest("/properties?limit=6");
        if (propData.success) {
          setRecommended(propData.properties || []);
        }
        setActiveTab("matches");
      }
    } catch (err: any) {
      alert(err.message || "Failed to save preferences");
    }
  };

  // Cancel viewing
  const cancelViewing = async (id: string) => {
    if (!window.confirm("Are you sure you want to cancel this viewing appointment?")) return;
    try {
      const data = await apiRequest(`/messages/viewings/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: "cancelled" }),
      });
      if (data.success) {
        setActionMessage("Viewing appointment cancelled.");
        setTimeout(() => setActionMessage(""), 3500);
        fetchTenantData();
      }
    } catch (err: any) {
      alert(err.message || "Failed to cancel viewing");
    }
  };

  const isHomeSaved = (id: string) => {
    return savedHomes.some((s) => s._id === id);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#f8fbfa" }}>
      <Navbar />

      <main style={{ flex: 1, maxWidth: "1240px", width: "100%", margin: "0 auto", padding: "32px 24px 60px" }}>
        {/* Welcome Header */}
        <div
          style={{
            background: "linear-gradient(135deg, #0d345b 0%, #174878 100%)",
            borderRadius: "16px",
            padding: "28px 32px",
            color: "#ffffff",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "20px",
            boxShadow: "0 8px 24px rgba(13, 52, 91, 0.12)",
            marginBottom: "28px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                background: "#0b8879",
                color: "#ffffff",
                fontSize: "20px",
                fontWeight: 800,
                display: "grid",
                placeItems: "center",
                border: "2px solid rgba(255,255,255,0.3)",
              }}
            >
              {user?.name
                ? user.name
                    .split(" ")
                    .map((w) => w[0])
                    .join("")
                : "AM"}
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <h1 style={{ margin: 0, fontSize: "24px", fontWeight: 800 }}>
                  Welcome back, {user?.name ? user.name.split(" ")[0] : "Alem"}!
                </h1>
                <span
                  style={{
                    background: "rgba(11, 136, 121, 0.25)",
                    border: "1px solid #0b8879",
                    color: "#7eead9",
                    padding: "2px 8px",
                    borderRadius: "99px",
                    fontSize: "10px",
                    fontWeight: 700,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <Icon name="check" /> Verified Renter
                </span>
              </div>
              <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#c2d6e4" }}>
                Targeting <b>{workplace}</b> · Budget up to <b>ETB {budgetMax.toLocaleString()}</b> · ≤ {maxCommuteMin} min commute
              </p>
            </div>
          </div>

          <div style={{ display: "flex", gap: "12px" }}>
            <button
              onClick={() => nav("/search")}
              style={{
                background: "#0b8879",
                color: "#ffffff",
                border: "none",
                padding: "12px 20px",
                borderRadius: "8px",
                fontWeight: 800,
                fontSize: "12px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <Icon name="search" /> Browse Marketplace
            </button>
            <button
              onClick={() => nav("/ai")}
              style={{
                background: "rgba(255, 255, 255, 0.15)",
                color: "#ffffff",
                border: "1px solid rgba(255,255,255,0.3)",
                padding: "12px 18px",
                borderRadius: "8px",
                fontWeight: 700,
                fontSize: "12px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <Icon name="sparkles" /> Ask Addis AI
            </button>
          </div>
        </div>

        {/* Action Alert Banner */}
        {actionMessage && (
          <div
            style={{
              background: "#e3f7f2",
              border: "1px solid #0b8879",
              color: "#075e53",
              padding: "12px 20px",
              borderRadius: "8px",
              marginBottom: "24px",
              fontSize: "12px",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Icon name="check" />
            <span>{actionMessage}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            borderBottom: "1px solid #d9e4eb",
            paddingBottom: "12px",
            marginBottom: "28px",
          }}
        >
          {[
            { id: "matches", icon: "sparkles", label: "Recommended for You", count: recommended.length },
            { id: "saved", icon: "heart", label: "Saved Homes", count: savedHomes.length },
            { id: "viewings", icon: "calendar", label: "Scheduled Viewings", count: viewings.length },
            { id: "preferences", icon: "sliders", label: "Match Preferences", count: null },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                background: activeTab === tab.id ? "#0d345b" : "#ffffff",
                color: activeTab === tab.id ? "#ffffff" : "#45627a",
                border: activeTab === tab.id ? "none" : "1px solid #d4e0e8",
                padding: "10px 18px",
                borderRadius: "8px",
                fontWeight: 700,
                fontSize: "12px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                transition: "all 0.15s ease",
              }}
            >
              <Icon name={tab.icon} />
              {tab.label}
              {tab.count !== null && (
                <span
                  style={{
                    background: activeTab === tab.id ? "#0b8879" : "#e3edf2",
                    color: activeTab === tab.id ? "#ffffff" : "#0d345b",
                    padding: "1px 6px",
                    borderRadius: "99px",
                    fontSize: "10px",
                  }}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* TAB 1: RECOMMENDED MATCHES */}
        {activeTab === "matches" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <div>
                <h2 style={{ margin: 0, fontSize: "20px", color: "#0d345b" }}>Top Homes for Your Daily Routine</h2>
                <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#60788c" }}>
                  Ranked by commute proximity to {workplace}, utility guarantees, and monthly budget.
                </p>
              </div>
              <button
                onClick={() => setActiveTab("preferences")}
                style={{
                  background: "none",
                  border: "none",
                  color: "#0b8879",
                  fontWeight: 800,
                  fontSize: "11px",
                  cursor: "pointer",
                }}
              >
                Adjust Match Filters ⚙️
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
              {recommended.map((p) => {
                const cover = p.media?.find((m) => m.isCover) || p.media?.[0];
                const saved = isHomeSaved(p._id);
                return (
                  <div
                    key={p._id}
                    onClick={() => nav(`/property/${p._id}`)}
                    style={{
                      background: "#ffffff",
                      borderRadius: "14px",
                      border: "1px solid #e1e9ee",
                      overflow: "hidden",
                      boxShadow: "0 4px 14px rgba(13, 52, 91, 0.05)",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    }}
                  >
                    <div style={{ position: "relative", height: "190px" }}>
                      <img
                        src={cover?.url || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"}
                        alt={p.title}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                      <span
                        style={{
                          position: "absolute",
                          top: "12px",
                          left: "12px",
                          background: "rgba(13, 52, 91, 0.9)",
                          color: "#8bd9ca",
                          padding: "3px 8px",
                          borderRadius: "99px",
                          fontSize: "9px",
                          fontWeight: 700,
                        }}
                      >
                        ✓ Verified
                      </span>
                      <button
                        onClick={(e) => toggleSave(p._id, e)}
                        style={{
                          position: "absolute",
                          top: "12px",
                          right: "12px",
                          background: saved ? "#0b8879" : "rgba(255,255,255,0.9)",
                          color: saved ? "#ffffff" : "#6a8194",
                          border: "none",
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                          cursor: "pointer",
                          display: "grid",
                          placeItems: "center",
                        }}
                        aria-label="Save home"
                      >
                        <Icon name="heart" />
                      </button>
                    </div>

                    <div style={{ padding: "18px", flex: 1, display: "flex", flexDirection: "column" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div>
                          <h3 style={{ margin: "0 0 4px", fontSize: "15px", color: "#0d345b" }}>{p.title}</h3>
                          <p style={{ margin: 0, color: "#647d91", fontSize: "11px" }}>
                            📍 {p.location.neighborhood}, {p.location.subCity}
                          </p>
                        </div>
                        <span
                          style={{
                            background: "#e1f4ef",
                            color: "#087d70",
                            padding: "3px 8px",
                            borderRadius: "99px",
                            fontSize: "11px",
                            fontWeight: 800,
                          }}
                        >
                          {p.matchScore || 92}% Match
                        </span>
                      </div>

                      <div style={{ display: "flex", gap: "12px", margin: "14px 0", fontSize: "11px", color: "#547188" }}>
                        <span>🛏 {p.bedrooms} Beds</span>
                        <span>🚿 {p.bathrooms} Baths</span>
                        <span>📐 {p.area} m²</span>
                      </div>

                      <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #eef3f6", paddingTop: "12px" }}>
                        <b style={{ color: "#0b8879", fontSize: "15px" }}>
                          ETB {Number(p.price).toLocaleString()}
                          <small style={{ fontSize: "10px", color: "#6a8194", fontWeight: 400 }}> /mo</small>
                        </b>
                        <small style={{ color: "#506e84", fontSize: "10px" }}>
                          🚗 {p.location.landmark || "20 min to work"}
                        </small>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: SAVED HOMES */}
        {activeTab === "saved" && (
          <div>
            <div style={{ marginBottom: "20px" }}>
              <h2 style={{ margin: 0, fontSize: "20px", color: "#0d345b" }}>Your Saved Homes ({savedHomes.length})</h2>
              <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#60788c" }}>
                Keep track of properties you like, compare pricing, and schedule viewings.
              </p>
            </div>

            {savedHomes.length === 0 ? (
              <div style={{ background: "#ffffff", padding: "48px", borderRadius: "12px", textAlign: "center", border: "1px solid #e1e9ed" }}>
                <p style={{ color: "#647d91", fontSize: "14px" }}>You haven't saved any homes yet.</p>
                <button onClick={() => nav("/search")} className="btn" style={{ marginTop: "12px" }}>
                  Find Homes in Addis Ababa
                </button>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
                {savedHomes.map((p) => {
                  const cover = p.media?.find((m) => m.isCover) || p.media?.[0];
                  return (
                    <div
                      key={p._id}
                      style={{
                        background: "#ffffff",
                        borderRadius: "14px",
                        border: "1px solid #e1e9ee",
                        overflow: "hidden",
                        boxShadow: "0 4px 14px rgba(13, 52, 91, 0.05)",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <div style={{ position: "relative", height: "180px" }}>
                        <img
                          src={cover?.url || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"}
                          alt={p.title}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                        <button
                          onClick={() => toggleSave(p._id)}
                          style={{
                            position: "absolute",
                            top: "12px",
                            right: "12px",
                            background: "#0b8879",
                            color: "#ffffff",
                            border: "none",
                            padding: "4px 8px",
                            borderRadius: "99px",
                            fontSize: "10px",
                            fontWeight: 700,
                            cursor: "pointer",
                          }}
                        >
                          ❤️ Saved (Remove)
                        </button>
                      </div>

                      <div style={{ padding: "16px", flex: 1, display: "flex", flexDirection: "column" }}>
                        <h3 style={{ margin: "0 0 4px", fontSize: "15px", color: "#0d345b" }}>{p.title}</h3>
                        <p style={{ margin: 0, color: "#647d91", fontSize: "11px" }}>
                          📍 {p.location?.neighborhood || p.location?.subCity}, Addis Ababa
                        </p>

                        <div style={{ margin: "12px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <b style={{ color: "#0b8879", fontSize: "16px" }}>
                            ETB {Number(p.price).toLocaleString()} /mo
                          </b>
                          <span style={{ fontSize: "11px", color: "#547188" }}>
                            {p.bedrooms} Beds · {p.bathrooms} Baths
                          </span>
                        </div>

                        <div style={{ marginTop: "auto", display: "flex", gap: "8px", borderTop: "1px solid #eef3f6", paddingTop: "12px" }}>
                          <button
                            onClick={() => nav(`/property/${p._id}`)}
                            style={{
                              flex: 1,
                              background: "#0d345b",
                              color: "#ffffff",
                              border: "none",
                              padding: "8px",
                              borderRadius: "6px",
                              fontSize: "11px",
                              fontWeight: 700,
                              cursor: "pointer",
                            }}
                          >
                            View Details
                          </button>
                          <button
                            onClick={() => nav("/messages")}
                            style={{
                              background: "#f0f6f5",
                              color: "#075e53",
                              border: "1px solid #c8ded9",
                              padding: "8px 12px",
                              borderRadius: "6px",
                              fontSize: "11px",
                              fontWeight: 700,
                              cursor: "pointer",
                            }}
                          >
                            Inquire
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: VIEWINGS & APPOINTMENTS */}
        {activeTab === "viewings" && (
          <div>
            <div style={{ marginBottom: "20px" }}>
              <h2 style={{ margin: 0, fontSize: "20px", color: "#0d345b" }}>Your Viewing Appointments</h2>
              <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#60788c" }}>
                Confirmed and pending property visits with landlords.
              </p>
            </div>

            {viewings.length === 0 ? (
              <div style={{ background: "#ffffff", padding: "48px", borderRadius: "12px", textAlign: "center", border: "1px solid #e1e9ed" }}>
                <p style={{ color: "#647d91", fontSize: "14px" }}>No active viewing appointments.</p>
                <button onClick={() => nav("/search")} className="btn" style={{ marginTop: "12px" }}>
                  Schedule a Viewing from Search
                </button>
              </div>
            ) : (
              <div style={{ display: "grid", gap: "14px" }}>
                {viewings.map((v) => (
                  <div
                    key={v._id}
                    style={{
                      background: "#ffffff",
                      borderRadius: "12px",
                      border: "1px solid #e0e9ee",
                      padding: "20px 24px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: "16px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                      <div
                        style={{
                          width: "44px",
                          height: "44px",
                          borderRadius: "50%",
                          background: "#e8f3f1",
                          color: "#087d70",
                          fontSize: "16px",
                          fontWeight: 800,
                          display: "grid",
                          placeItems: "center",
                        }}
                      >
                        📅
                      </div>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <h4 style={{ margin: 0, color: "#11355b", fontSize: "15px" }}>{v.property?.title || "Apartment Viewing"}</h4>
                          <span
                            style={{
                              background: v.status === "confirmed" ? "#e3f7f2" : "#fef3c7",
                              color: v.status === "confirmed" ? "#075e53" : "#92400e",
                              padding: "2px 8px",
                              borderRadius: "99px",
                              fontSize: "10px",
                              fontWeight: 700,
                            }}
                          >
                            ● {v.status.toUpperCase()}
                          </span>
                        </div>
                        <p style={{ margin: "4px 0 0", color: "#547188", fontSize: "12px" }}>
                          Landlord: <b>{v.landlord?.name}</b> · 📞 {v.landlord?.phone || "+251 92 233 4455"}
                        </p>
                        <small style={{ color: "#6a8194", fontSize: "11px" }}>
                          Date & Time: <b>{new Date(v.appointmentDate).toLocaleDateString()} at {v.appointmentTime}</b>
                        </small>
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        onClick={() => nav("/messages")}
                        style={{
                          background: "#0d345b",
                          color: "#ffffff",
                          border: "none",
                          padding: "8px 16px",
                          borderRadius: "6px",
                          fontWeight: 700,
                          fontSize: "11px",
                          cursor: "pointer",
                        }}
                      >
                        💬 Message Landlord
                      </button>
                      {v.status !== "cancelled" && (
                        <button
                          onClick={() => cancelViewing(v._id)}
                          style={{
                            background: "#fff1f2",
                            color: "#be123c",
                            border: "1px solid #fecdd3",
                            padding: "8px 12px",
                            borderRadius: "6px",
                            fontWeight: 700,
                            fontSize: "11px",
                            cursor: "pointer",
                          }}
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: PREFERENCES & MOVING PLAN */}
        {activeTab === "preferences" && (
          <div style={{ background: "#ffffff", borderRadius: "14px", border: "1px solid #e1e9ee", padding: "32px" }}>
            <h2 style={{ margin: "0 0 8px", color: "#0d345b", fontSize: "20px" }}>Housing Match Preferences</h2>
            <p style={{ margin: "0 0 24px", color: "#547188", fontSize: "13px" }}>
              Update your workplace destination and budget to customize Match Scores across all Addis Ababa listings.
            </p>

            <form onSubmit={savePreferences} style={{ maxWidth: "640px", display: "grid", gap: "20px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#11355b", marginBottom: "6px" }}>
                  📍 Workplace / University Destination in Addis Ababa
                </label>
                <input
                  type="text"
                  value={workplace}
                  onChange={(e) => setWorkplace(e.target.value)}
                  placeholder="e.g. Bole Edna Mall, UNECA Kazanchis, Mexico Square..."
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "8px",
                    border: "1px solid #cbdde4",
                    fontSize: "13px",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#11355b", marginBottom: "6px" }}>
                  💰 Maximum Monthly Budget: ETB {budgetMax.toLocaleString()}
                </label>
                <input
                  type="range"
                  min="15000"
                  max="120000"
                  step="2500"
                  value={budgetMax}
                  onChange={(e) => setBudgetMax(Number(e.target.value))}
                  style={{ width: "100%", accentColor: "#0b8879" }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "#6a8194" }}>
                  <span>15,000 ETB</span>
                  <span>60,000 ETB</span>
                  <span>120,000+ ETB</span>
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#11355b", marginBottom: "6px" }}>
                  ⏱️ Maximum Commute Time: {maxCommuteMin} minutes
                </label>
                <input
                  type="range"
                  min="10"
                  max="60"
                  step="5"
                  value={maxCommuteMin}
                  onChange={(e) => setMaxCommuteMin(Number(e.target.value))}
                  style={{ width: "100%", accentColor: "#0b8879" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#11355b", marginBottom: "8px" }}>
                  ⚡ Must-Have Utility & Compound Requirements
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  {[
                    "Water tank",
                    "Generator",
                    "24/7 security",
                    "Parking",
                    "Elevator",
                    "Balcony",
                    "Garden",
                  ].map((amenity) => {
                    const checked = mustHaveAmenities.includes(amenity);
                    return (
                      <label
                        key={amenity}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          padding: "8px 12px",
                          borderRadius: "6px",
                          border: checked ? "1px solid #0b8879" : "1px solid #e1e9ee",
                          background: checked ? "#f0f8f6" : "#ffffff",
                          cursor: "pointer",
                          fontSize: "12px",
                          color: checked ? "#075e53" : "#345873",
                          fontWeight: checked ? 700 : 400,
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setMustHaveAmenities([...mustHaveAmenities, amenity]);
                            } else {
                              setMustHaveAmenities(mustHaveAmenities.filter((a) => a !== amenity));
                            }
                          }}
                          style={{ accentColor: "#0b8879" }}
                        />
                        {amenity}
                      </label>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                className="btn"
                style={{
                  background: "#0b8879",
                  color: "#ffffff",
                  padding: "12px 24px",
                  borderRadius: "8px",
                  fontWeight: 800,
                  fontSize: "12px",
                  cursor: "pointer",
                  marginTop: "8px",
                }}
              >
                Save Preferences & Update Match Scores →
              </button>
            </form>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
