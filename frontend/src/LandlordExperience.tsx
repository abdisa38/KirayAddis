import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "./context/AuthContext";
import { apiRequest } from "./api/client";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Icon from "./components/Icon";

interface PropertyItem {
  _id: string;
  title: string;
  price: number;
  deposit: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  propertyType: string;
  location: {
    subCity: string;
    neighborhood: string;
    landmark: string;
  };
  availability: {
    status: string;
    lastConfirmedAt: string;
  };
  verification: {
    status: string;
  };
  statistics: {
    views: number;
    inquiries: number;
    saves: number;
  };
  media: { url: string; isCover: boolean }[];
  createdAt: string;
}

interface ViewingItem {
  _id: string;
  tenant: {
    name: string;
    email: string;
    phone: string;
    avatar?: string;
  };
  property: {
    _id: string;
    title: string;
    price: number;
    location: { subCity: string; neighborhood: string };
  };
  appointmentDate: string;
  appointmentTime: string;
  status: string;
  notes?: string;
  createdAt: string;
}

export default function LandlordExperience() {
  const { user, login } = useAuth();
  const [activeTab, setActiveTab] = useState<"overview" | "listings" | "viewings" | "verification">("overview");
  const [properties, setProperties] = useState<PropertyItem[]>([]);
  const [viewings, setViewings] = useState<ViewingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState("");
  const nav = useNavigate();

  // Quick auto-login for landlord demo if unauthenticated or tenant
  const fetchLandlordData = async () => {
    setLoading(true);
    try {
      if (!user || user.role !== "landlord") {
        await login("kalkidan@example.com", "password123");
      }

      // Fetch landlord properties
      const propData = await apiRequest("/properties/mine");
      if (propData.success) {
        setProperties(propData.properties || []);
      }

      // Fetch viewing requests
      const viewData = await apiRequest("/messages/viewings");
      if (viewData.success) {
        setViewings(viewData.viewings || []);
      }
    } catch (err: any) {
      console.error("Error fetching landlord data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLandlordData();
  }, [user]);

  // Actions
  const togglePropertyAvailability = async (id: string) => {
    try {
      const data = await apiRequest(`/properties/${id}/toggle-status`, { method: "PATCH" });
      if (data.success) {
        setActionMessage(data.message);
        setTimeout(() => setActionMessage(""), 3500);
        fetchLandlordData();
      }
    } catch (err: any) {
      alert(err.message || "Failed to update property status");
    }
  };

  const confirmFreshness = async (id: string) => {
    try {
      const data = await apiRequest(`/properties/${id}/confirm-availability`, { method: "PATCH" });
      if (data.success) {
        setActionMessage("Availability freshness confirmed today!");
        setTimeout(() => setActionMessage(""), 3500);
        fetchLandlordData();
      }
    } catch (err: any) {
      alert(err.message || "Failed to confirm freshness");
    }
  };

  const deleteListing = async (id: string) => {
    if (!window.confirm("Are you sure you want to remove this property listing?")) return;
    try {
      const data = await apiRequest(`/properties/${id}`, { method: "DELETE" });
      if (data.success) {
        setActionMessage("Property deleted successfully.");
        setTimeout(() => setActionMessage(""), 3500);
        fetchLandlordData();
      }
    } catch (err: any) {
      alert(err.message || "Failed to delete listing");
    }
  };

  const updateViewing = async (id: string, status: "confirmed" | "cancelled") => {
    try {
      const data = await apiRequest(`/messages/viewings/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      if (data.success) {
        setActionMessage(`Viewing appointment marked as ${status}!`);
        setTimeout(() => setActionMessage(""), 3500);
        fetchLandlordData();
      }
    } catch (err: any) {
      alert(err.message || "Failed to update viewing status");
    }
  };

  // Aggregated KPIs
  const totalViews = properties.reduce((acc, p) => acc + (p.statistics?.views || 0), 0);
  const totalInquiries = properties.reduce((acc, p) => acc + (p.statistics?.inquiries || 0), 0);
  const activeCount = properties.filter((p) => p.availability?.status === "Available").length;
  const pendingViewingsCount = viewings.filter((v) => v.status === "pending").length;
  const monthlyRevenue = properties
    .filter((p) => p.availability?.status === "Available" || p.availability?.status === "Rented")
    .reduce((acc, p) => acc + (p.price || 0), 0);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#f8fbfa" }}>
      <Navbar />

      <main style={{ flex: 1, maxWidth: "1240px", width: "100%", margin: "0 auto", padding: "32px 24px 60px" }}>
        {/* Header Profile Bar */}
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
                : "KM"}
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <h1 style={{ margin: 0, fontSize: "24px", fontWeight: 800 }}>
                  {user?.name || "Kalkidan Mengesha"}
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
                  <Icon name="check" /> Verified Landlord
                </span>
              </div>
              <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#c2d6e4" }}>
                Managing {properties.length} property listings in Addis Ababa · Bole, Kazanchis, Yeka
              </p>
            </div>
          </div>

          <div style={{ display: "flex", gap: "12px" }}>
            <button
              onClick={() => nav("/landlord/listing")}
              className="btn"
              style={{
                background: "#0b8879",
                color: "#ffffff",
                border: "none",
                padding: "12px 22px",
                borderRadius: "8px",
                fontWeight: 800,
                fontSize: "12px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <Icon name="plus" /> List New Property
            </button>
            <button
              onClick={() => nav("/messages")}
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
              <Icon name="message" /> Tenant Messages
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
            { id: "overview", icon: "chart", label: "Dashboard Overview", count: null },
            { id: "listings", icon: "home", label: "My Properties", count: properties.length },
            { id: "viewings", icon: "calendar", label: "Tenant Viewings", count: pendingViewingsCount > 0 ? pendingViewingsCount : null },
            { id: "verification", icon: "shield", label: "Verification & Trust", count: null },
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

        {/* TAB 1: DASHBOARD OVERVIEW */}
        {activeTab === "overview" && (
          <div>
            {/* KPI Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "18px", marginBottom: "32px" }}>
              <div style={{ background: "#ffffff", padding: "20px", borderRadius: "12px", border: "1px solid #e1e9ed" }}>
                <span style={{ color: "#6a8194", fontSize: "11px", fontWeight: 700, textTransform: "uppercase" }}>
                  Active Listings
                </span>
                <h2 style={{ fontSize: "28px", color: "#0d345b", margin: "6px 0 2px" }}>{activeCount}</h2>
                <small style={{ color: "#0b8879", fontSize: "10px", fontWeight: 700 }}>
                  ● {properties.length} Total on Platform
                </small>
              </div>

              <div style={{ background: "#ffffff", padding: "20px", borderRadius: "12px", border: "1px solid #e1e9ed" }}>
                <span style={{ color: "#6a8194", fontSize: "11px", fontWeight: 700, textTransform: "uppercase" }}>
                  Total Inquiries
                </span>
                <h2 style={{ fontSize: "28px", color: "#0d345b", margin: "6px 0 2px" }}>{totalInquiries}</h2>
                <small style={{ color: "#547188", fontSize: "10px" }}>Direct on-platform messages</small>
              </div>

              <div style={{ background: "#ffffff", padding: "20px", borderRadius: "12px", border: "1px solid #e1e9ed" }}>
                <span style={{ color: "#6a8194", fontSize: "11px", fontWeight: 700, textTransform: "uppercase" }}>
                  Pending Viewings
                </span>
                <h2 style={{ fontSize: "28px", color: pendingViewingsCount > 0 ? "#d97706" : "#0d345b", margin: "6px 0 2px" }}>
                  {pendingViewingsCount}
                </h2>
                <small style={{ color: "#547188", fontSize: "10px" }}>Awaiting confirmation</small>
              </div>

              <div style={{ background: "#ffffff", padding: "20px", borderRadius: "12px", border: "1px solid #e1e9ed" }}>
                <span style={{ color: "#6a8194", fontSize: "11px", fontWeight: 700, textTransform: "uppercase" }}>
                  Monthly Rent Value
                </span>
                <h2 style={{ fontSize: "24px", color: "#0b8879", margin: "6px 0 2px" }}>
                  ETB {monthlyRevenue.toLocaleString()}
                </h2>
                <small style={{ color: "#547188", fontSize: "10px" }}>From managed properties</small>
              </div>
            </div>

            {/* Quick Listing Management Table */}
            <div style={{ background: "#ffffff", borderRadius: "12px", border: "1px solid #e1e9ed", padding: "24px", marginBottom: "32px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
                <div>
                  <h3 style={{ margin: 0, color: "#0d345b", fontSize: "16px" }}>Recent Listing Performance</h3>
                  <p style={{ margin: "2px 0 0", color: "#6b8294", fontSize: "11px" }}>
                    Monitor tenant interest, view counts, and verification status.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab("listings")}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#0b8879",
                    fontWeight: 800,
                    fontSize: "11px",
                    cursor: "pointer",
                  }}
                >
                  View All {properties.length} Properties →
                </button>
              </div>

              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "12px" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid #e5edf0", color: "#647c90" }}>
                      <th style={{ padding: "10px" }}>Property</th>
                      <th style={{ padding: "10px" }}>Location</th>
                      <th style={{ padding: "10px" }}>Price / mo</th>
                      <th style={{ padding: "10px" }}>Status</th>
                      <th style={{ padding: "10px" }}>Verification</th>
                      <th style={{ padding: "10px" }}>Views</th>
                      <th style={{ padding: "10px", textAlign: "right" }}>Quick Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {properties.slice(0, 4).map((p) => (
                      <tr key={p._id} style={{ borderBottom: "1px solid #f0f4f7" }}>
                        <td style={{ padding: "12px 10px", fontWeight: 700, color: "#11355b" }}>
                          {p.title}
                        </td>
                        <td style={{ padding: "12px 10px", color: "#547188" }}>
                          {p.location.neighborhood}, {p.location.subCity}
                        </td>
                        <td style={{ padding: "12px 10px", fontWeight: 700, color: "#0b8879" }}>
                          ETB {Number(p.price).toLocaleString()}
                        </td>
                        <td style={{ padding: "12px 10px" }}>
                          <span
                            style={{
                              background: p.availability?.status === "Available" ? "#e3f7f2" : "#fef3c7",
                              color: p.availability?.status === "Available" ? "#075e53" : "#92400e",
                              padding: "3px 8px",
                              borderRadius: "99px",
                              fontSize: "10px",
                              fontWeight: 700,
                            }}
                          >
                            ● {p.availability?.status}
                          </span>
                        </td>
                        <td style={{ padding: "12px 10px" }}>
                          <span
                            style={{
                              background: p.verification?.status === "Approved" ? "#e0f2fe" : "#f3f4f6",
                              color: p.verification?.status === "Approved" ? "#0369a1" : "#4b5563",
                              padding: "3px 8px",
                              borderRadius: "99px",
                              fontSize: "10px",
                              fontWeight: 700,
                            }}
                          >
                            ✓ {p.verification?.status}
                          </span>
                        </td>
                        <td style={{ padding: "12px 10px", color: "#647c90" }}>
                          👁 {p.statistics?.views || 1}
                        </td>
                        <td style={{ padding: "12px 10px", textAlign: "right" }}>
                          <button
                            onClick={() => togglePropertyAvailability(p._id)}
                            style={{
                              background: "#f0f6f5",
                              border: "1px solid #cbdde3",
                              padding: "4px 10px",
                              borderRadius: "6px",
                              fontSize: "10px",
                              fontWeight: 700,
                              color: "#173858",
                              cursor: "pointer",
                            }}
                          >
                            Toggle Status
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MY PROPERTIES */}
        {activeTab === "listings" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <div>
                <h2 style={{ margin: 0, fontSize: "20px", color: "#0d345b" }}>Your Active Listings ({properties.length})</h2>
                <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#60788c" }}>
                  Manage availability, update freshness timestamps, and preview listings as tenants see them.
                </p>
              </div>
              <button
                onClick={() => nav("/landlord/listing")}
                className="btn"
                style={{
                  background: "#0b8879",
                  color: "#ffffff",
                  padding: "10px 18px",
                  fontSize: "11px",
                  fontWeight: 800,
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                + Add Listing
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "20px" }}>
              {properties.map((p) => {
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
                      <span
                        style={{
                          position: "absolute",
                          top: "12px",
                          left: "12px",
                          background: p.availability?.status === "Available" ? "rgba(11, 136, 121, 0.9)" : "rgba(217, 119, 6, 0.9)",
                          color: "#ffffff",
                          padding: "3px 8px",
                          borderRadius: "99px",
                          fontSize: "9px",
                          fontWeight: 800,
                        }}
                      >
                        ● {p.availability?.status}
                      </span>
                      <span
                        style={{
                          position: "absolute",
                          top: "12px",
                          right: "12px",
                          background: "rgba(13, 52, 91, 0.9)",
                          color: "#8bd9ca",
                          padding: "3px 8px",
                          borderRadius: "99px",
                          fontSize: "9px",
                          fontWeight: 700,
                        }}
                      >
                        ✓ {p.verification?.status}
                      </span>
                    </div>

                    <div style={{ padding: "18px", flex: 1, display: "flex", flexDirection: "column" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div>
                          <h3 style={{ margin: "0 0 4px", fontSize: "16px", color: "#0d345b" }}>{p.title}</h3>
                          <p style={{ margin: 0, color: "#647d91", fontSize: "11px" }}>
                            📍 {p.location.neighborhood}, {p.location.subCity} · {p.location.landmark}
                          </p>
                        </div>
                        <b style={{ color: "#0b8879", fontSize: "16px" }}>
                          ETB {Number(p.price).toLocaleString()}
                          <small style={{ fontSize: "10px", color: "#6a8194", fontWeight: 400 }}> /mo</small>
                        </b>
                      </div>

                      <div style={{ display: "flex", gap: "14px", margin: "14px 0", fontSize: "11px", color: "#547188" }}>
                        <span>🛏 {p.bedrooms} Beds</span>
                        <span>🚿 {p.bathrooms} Baths</span>
                        <span>📐 {p.area} m²</span>
                        <span>🏢 {p.propertyType}</span>
                      </div>

                      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "16px" }}>
                        <span style={{ background: "#f0f5f7", color: "#345873", padding: "2px 8px", borderRadius: "6px", fontSize: "10px" }}>
                          👁 {p.statistics?.views || 1} Views
                        </span>
                        <span style={{ background: "#f0f5f7", color: "#345873", padding: "2px 8px", borderRadius: "6px", fontSize: "10px" }}>
                          💬 {p.statistics?.inquiries || 0} Inquiries
                        </span>
                        <span style={{ background: "#f0f5f7", color: "#345873", padding: "2px 8px", borderRadius: "6px", fontSize: "10px" }}>
                          ❤️ {p.statistics?.saves || 0} Saves
                        </span>
                      </div>

                      <div style={{ marginTop: "auto", display: "flex", gap: "8px", borderTop: "1px solid #eef3f6", paddingTop: "14px" }}>
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
                          View Live Listing
                        </button>
                        <button
                          onClick={() => confirmFreshness(p._id)}
                          style={{
                            background: "#e6f5f3",
                            color: "#075e53",
                            border: "1px solid #94d3c9",
                            padding: "8px 12px",
                            borderRadius: "6px",
                            fontSize: "11px",
                            fontWeight: 700,
                            cursor: "pointer",
                          }}
                          title="Confirm property is currently available today"
                        >
                          Confirm Freshness
                        </button>
                        <button
                          onClick={() => togglePropertyAvailability(p._id)}
                          style={{
                            background: "#f4f7f9",
                            color: "#254867",
                            border: "1px solid #d0dfe6",
                            padding: "8px 12px",
                            borderRadius: "6px",
                            fontSize: "11px",
                            fontWeight: 700,
                            cursor: "pointer",
                          }}
                        >
                          {p.availability?.status === "Available" ? "Mark Rented" : "Mark Available"}
                        </button>
                        <button
                          onClick={() => deleteListing(p._id)}
                          style={{
                            background: "#fff1f2",
                            color: "#be123c",
                            border: "1px solid #fecdd3",
                            padding: "8px 12px",
                            borderRadius: "6px",
                            fontSize: "11px",
                            fontWeight: 700,
                            cursor: "pointer",
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: TENANT VIEWINGS & INQUIRIES */}
        {activeTab === "viewings" && (
          <div>
            <div style={{ marginBottom: "20px" }}>
              <h2 style={{ margin: 0, fontSize: "20px", color: "#0d345b" }}>Scheduled Viewing Appointments</h2>
              <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#60788c" }}>
                Tenants interested in your properties who have booked in-person inspection appointments.
              </p>
            </div>

            {viewings.length === 0 ? (
              <div style={{ background: "#ffffff", padding: "40px", borderRadius: "12px", textAlign: "center", border: "1px solid #e1e9ed" }}>
                <p style={{ color: "#647d91", fontSize: "14px" }}>No viewing appointments requested yet.</p>
                <button onClick={() => nav("/search")} className="btn" style={{ marginTop: "12px" }}>
                  Explore Marketplace Listings
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
                        {v.tenant?.name ? v.tenant.name[0] : "T"}
                      </div>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <h4 style={{ margin: 0, color: "#11355b", fontSize: "15px" }}>{v.tenant?.name || "Interested Tenant"}</h4>
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
                          Property: <b>{v.property?.title}</b> · 📞 {v.tenant?.phone || "+251 91 122 3344"}
                        </p>
                        <small style={{ color: "#6a8194", fontSize: "11px" }}>
                          Requested Time: <b>{new Date(v.appointmentDate).toLocaleDateString()} at {v.appointmentTime}</b>
                        </small>
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: "8px" }}>
                      {v.status === "pending" && (
                        <button
                          onClick={() => updateViewing(v._id, "confirmed")}
                          style={{
                            background: "#0b8879",
                            color: "#ffffff",
                            border: "none",
                            padding: "8px 16px",
                            borderRadius: "6px",
                            fontWeight: 700,
                            fontSize: "11px",
                            cursor: "pointer",
                          }}
                        >
                          ✓ Accept Appointment
                        </button>
                      )}
                      <button
                        onClick={() => nav("/messages")}
                        style={{
                          background: "#0d345b",
                          color: "#ffffff",
                          border: "none",
                          padding: "8px 14px",
                          borderRadius: "6px",
                          fontWeight: 700,
                          fontSize: "11px",
                          cursor: "pointer",
                        }}
                      >
                        💬 Chat
                      </button>
                      {v.status !== "cancelled" && (
                        <button
                          onClick={() => updateViewing(v._id, "cancelled")}
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

        {/* TAB 4: VERIFICATION & TRUST */}
        {activeTab === "verification" && (
          <div style={{ background: "#ffffff", borderRadius: "14px", border: "1px solid #e1e9ee", padding: "32px" }}>
            <h2 style={{ margin: "0 0 8px", color: "#0d345b", fontSize: "20px" }}>Landlord Trust & Verification Tier</h2>
            <p style={{ margin: "0 0 24px", color: "#547188", fontSize: "13px" }}>
              Addis Kiray rewards verified property owners with higher search rank, tenant trust badges, and fast tenant matching.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", marginBottom: "28px" }}>
              <div style={{ background: "#f0f8f6", padding: "20px", borderRadius: "10px", border: "1px solid #c7e5df" }}>
                <span style={{ color: "#087d70", fontWeight: 800, fontSize: "16px" }}>✓ Step 1</span>
                <h4 style={{ margin: "8px 0 4px", color: "#0d345b" }}>Government ID Verification</h4>
                <p style={{ margin: 0, fontSize: "11px", color: "#456278" }}>Kebele ID or Ethiopian Passport uploaded and verified.</p>
                <span style={{ display: "inline-block", marginTop: "10px", color: "#087d70", fontSize: "10px", fontWeight: 800 }}>
                  ● COMPLETED
                </span>
              </div>

              <div style={{ background: "#f0f8f6", padding: "20px", borderRadius: "10px", border: "1px solid #c7e5df" }}>
                <span style={{ color: "#087d70", fontWeight: 800, fontSize: "16px" }}>✓ Step 2</span>
                <h4 style={{ margin: "8px 0 4px", color: "#0d345b" }}>Phone & OTP Confirmation</h4>
                <p style={{ margin: 0, fontSize: "11px", color: "#456278" }}>Safaricom / Ethio Telecom SMS OTP confirmed.</p>
                <span style={{ display: "inline-block", marginTop: "10px", color: "#087d70", fontSize: "10px", fontWeight: 800 }}>
                  ● COMPLETED
                </span>
              </div>

              <div style={{ background: "#f0f8f6", padding: "20px", borderRadius: "10px", border: "1px solid #c7e5df" }}>
                <span style={{ color: "#087d70", fontWeight: 800, fontSize: "16px" }}>✓ Step 3</span>
                <h4 style={{ margin: "8px 0 4px", color: "#0d345b" }}>Property Title / Representation</h4>
                <p style={{ margin: 0, fontSize: "11px", color: "#456278" }}>Site photos metadata and title deed verified by admin team.</p>
                <span style={{ display: "inline-block", marginTop: "10px", color: "#087d70", fontSize: "10px", fontWeight: 800 }}>
                  ● VERIFIED LANDLORD
                </span>
              </div>
            </div>

            <div style={{ background: "#f8faf9", borderRadius: "8px", padding: "16px", border: "1px solid #e1e8ea" }}>
              <b style={{ color: "#11355b", fontSize: "12px" }}>Why keep listings fresh?</b>
              <p style={{ margin: "4px 0 0", color: "#617b8f", fontSize: "11px" }}>
                Addis Kiray displays a "Freshness Indicator" to renters. Confirm availability weekly to maintain top ranking in Bole, Kazanchis, and CMC searches.
              </p>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
