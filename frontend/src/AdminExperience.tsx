import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "./context/AuthContext";
import { apiRequest } from "./api/client";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Icon from "./components/Icon";

export default function AdminExperience() {
  const { user, login } = useAuth();
  const [activeTab, setActiveTab] = useState<"dashboard" | "queue" | "users" | "reports" | "properties">("dashboard");
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState({
    activeProperties: 13,
    availableProperties: 13,
    totalTenants: 1,
    totalLandlords: 1,
    pendingProperties: 0,
    openReports: 0,
    upcomingViewings: 1,
  });
  const [queue, setQueue] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [propertiesList, setPropertiesList] = useState<any[]>([]);
  const [reportsList, setReportsList] = useState<any[]>([]);
  const [userSearch, setUserSearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("all");
  const nav = useNavigate();

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3500);
  };

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      if (!user || user.role !== "admin") {
        await login("admin@addiskiray.com", "adminpassword123");
      }

      const [kpiRes, queueRes, usersRes, propsRes, reportsRes] = await Promise.allSettled([
        apiRequest("/admin/kpis"),
        apiRequest("/admin/queue"),
        apiRequest("/admin/users"),
        apiRequest("/properties?limit=50"),
        apiRequest("/admin/reports"),
      ]);

      if (kpiRes.status === "fulfilled" && kpiRes.value.success) {
        setKpis(kpiRes.value.kpis);
      }
      if (queueRes.status === "fulfilled" && queueRes.value.success) {
        setQueue(queueRes.value.queue || []);
      }
      if (usersRes.status === "fulfilled" && usersRes.value.success) {
        setUsersList(usersRes.value.users || []);
      }
      if (propsRes.status === "fulfilled" && propsRes.value.success) {
        setPropertiesList(propsRes.value.properties || []);
      }
      if (reportsRes.status === "fulfilled" && reportsRes.value.success) {
        setReportsList(reportsRes.value.reports || []);
      }
    } catch (err: any) {
      console.error("Error fetching admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [user]);

  // Moderate listing
  const moderate = async (id: string, status: "Approved" | "Rejected") => {
    try {
      const data = await apiRequest(`/admin/properties/${id}/moderate`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      if (data.success) {
        showToast(`Listing ${status === "Approved" ? "Approved & Published" : "Rejected"}.`);
        fetchAdminData();
      }
    } catch (err: any) {
      alert(err.message || "Failed to moderate property");
    }
  };

  // Toggle user verification
  const toggleUserVerification = async (id: string) => {
    try {
      const data = await apiRequest(`/admin/users/${id}/status`, { method: "PATCH" });
      if (data.success) {
        showToast(data.message);
        fetchAdminData();
      }
    } catch (err: any) {
      alert(err.message || "Failed to update user status");
    }
  };

  // Update report status
  const updateReport = async (id: string, status: "investigating" | "resolved" | "dismissed") => {
    try {
      const data = await apiRequest(`/admin/reports/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      if (data.success) {
        showToast(`Report marked as ${status}.`);
        fetchAdminData();
      }
    } catch (err: any) {
      alert(err.message || "Failed to update report status");
    }
  };

  // Delete property
  const deleteProp = async (id: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this listing?")) return;
    try {
      const data = await apiRequest(`/properties/${id}`, { method: "DELETE" });
      if (data.success) {
        showToast("Listing deleted from platform.");
        fetchAdminData();
      }
    } catch (err: any) {
      alert(err.message || "Failed to delete listing");
    }
  };

  // Filtered Users
  const filteredUsers = usersList.filter((u) => {
    const matchesSearch =
      u.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email?.toLowerCase().includes(userSearch.toLowerCase());
    const matchesRole = userRoleFilter === "all" || u.role === userRoleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#f8fbfa" }}>
      <Navbar />

      <main style={{ flex: 1, maxWidth: "1240px", width: "100%", margin: "0 auto", padding: "32px 24px 60px" }}>
        {/* Admin Header Bar */}
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
                fontSize: "22px",
                fontWeight: 800,
                display: "grid",
                placeItems: "center",
                border: "2px solid rgba(255,255,255,0.3)",
              }}
            >
              <Icon name="crown" />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <h1 style={{ margin: 0, fontSize: "24px", fontWeight: 800 }}>Admin Operations Console</h1>
                <span
                  style={{
                    background: "rgba(11, 136, 121, 0.25)",
                    border: "1px solid #0b8879",
                    color: "#7eead9",
                    padding: "2px 8px",
                    borderRadius: "99px",
                    fontSize: "10px",
                    fontWeight: 700,
                  }}
                >
                  Super Admin
                </span>
              </div>
              <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#c2d6e4" }}>
                System Status: <b>Online</b> · Database: <b>MongoDB Atlas</b> · Addis Ababa Marketplace Active
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
                padding: "12px 18px",
                borderRadius: "8px",
                fontWeight: 800,
                fontSize: "12px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              Public Marketplace <Icon name="arrow" />
            </button>
          </div>
        </div>

        {/* Toast Alert */}
        {toast && (
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
            <span>{toast}</span>
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
            { id: "dashboard", icon: "chart", label: "KPI Analytics", count: null },
            { id: "queue", icon: "shield", label: "Moderation Queue", count: queue.length > 0 ? queue.length : null },
            { id: "users", icon: "users", label: "User Management", count: usersList.length },
            { id: "properties", icon: "home", label: "All Listings", count: propertiesList.length },
            { id: "reports", icon: "flag", label: "Trust Reports", count: reportsList.length > 0 ? reportsList.length : null },
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

        {/* TAB 1: KPI ANALYTICS */}
        {activeTab === "dashboard" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "18px", marginBottom: "32px" }}>
              <div style={{ background: "#ffffff", padding: "20px", borderRadius: "12px", border: "1px solid #e1e9ed" }}>
                <span style={{ color: "#6a8194", fontSize: "11px", fontWeight: 700, textTransform: "uppercase" }}>
                  Total Listings
                </span>
                <h2 style={{ fontSize: "28px", color: "#0d345b", margin: "6px 0 2px" }}>{propertiesList.length}</h2>
                <small style={{ color: "#0b8879", fontSize: "10px", fontWeight: 700 }}>
                  ● {kpis.availableProperties} Active in Atlas
                </small>
              </div>

              <div style={{ background: "#ffffff", padding: "20px", borderRadius: "12px", border: "1px solid #e1e9ed" }}>
                <span style={{ color: "#6a8194", fontSize: "11px", fontWeight: 700, textTransform: "uppercase" }}>
                  Registered Users
                </span>
                <h2 style={{ fontSize: "28px", color: "#0d345b", margin: "6px 0 2px" }}>{usersList.length}</h2>
                <small style={{ color: "#547188", fontSize: "10px" }}>
                  {kpis.totalTenants} Tenants · {kpis.totalLandlords} Landlords
                </small>
              </div>

              <div style={{ background: "#ffffff", padding: "20px", borderRadius: "12px", border: "1px solid #e1e9ed" }}>
                <span style={{ color: "#6a8194", fontSize: "11px", fontWeight: 700, textTransform: "uppercase" }}>
                  Pending Moderation
                </span>
                <h2 style={{ fontSize: "28px", color: queue.length > 0 ? "#d97706" : "#0b8879", margin: "6px 0 2px" }}>
                  {queue.length}
                </h2>
                <small style={{ color: "#547188", fontSize: "10px" }}>Awaiting review</small>
              </div>

              <div style={{ background: "#ffffff", padding: "20px", borderRadius: "12px", border: "1px solid #e1e9ed" }}>
                <span style={{ color: "#6a8194", fontSize: "11px", fontWeight: 700, textTransform: "uppercase" }}>
                  Fraud & Quality Reports
                </span>
                <h2 style={{ fontSize: "28px", color: reportsList.length > 0 ? "#be123c" : "#0b8879", margin: "6px 0 2px" }}>
                  {reportsList.length}
                </h2>
                <small style={{ color: "#547188", fontSize: "10px" }}>Tenant feedback</small>
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div style={{ background: "#ffffff", borderRadius: "12px", border: "1px solid #e1e9ed", padding: "24px" }}>
              <h3 style={{ margin: "0 0 16px", color: "#0d345b", fontSize: "16px" }}>Platform Operations Summary</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
                <div style={{ background: "#f0f8f6", padding: "16px", borderRadius: "8px", border: "1px solid #c8ded9" }}>
                  <b style={{ color: "#075e53", fontSize: "13px" }}>Listing Freshness Index</b>
                  <p style={{ margin: "6px 0 0", color: "#456278", fontSize: "11px" }}>
                    100% of active properties have verified freshness timestamps in Bole, Kazanchis, and CMC.
                  </p>
                </div>
                <div style={{ background: "#f0f8f6", padding: "16px", borderRadius: "8px", border: "1px solid #c8ded9" }}>
                  <b style={{ color: "#075e53", fontSize: "13px" }}>Addis AI Natural Language Engine</b>
                  <p style={{ margin: "6px 0 0", color: "#456278", fontSize: "11px" }}>
                    Gemini 2.0 Flash active for Amharic and English conversational rental matching.
                  </p>
                </div>
                <div style={{ background: "#f0f8f6", padding: "16px", borderRadius: "8px", border: "1px solid #c8ded9" }}>
                  <b style={{ color: "#075e53", fontSize: "13px" }}>Verified Landlord ID Tier</b>
                  <p style={{ margin: "6px 0 0", color: "#456278", fontSize: "11px" }}>
                    All demo landlords verified with SMS OTP and Kebele ID representation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MODERATION QUEUE */}
        {activeTab === "queue" && (
          <div>
            <div style={{ marginBottom: "20px" }}>
              <h2 style={{ margin: 0, fontSize: "20px", color: "#0d345b" }}>Pending Property Review Queue</h2>
              <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#60788c" }}>
                Inspect newly submitted landlord properties for accuracy, photos, and fair rental terms.
              </p>
            </div>

            {queue.length === 0 ? (
              <div style={{ background: "#ffffff", padding: "48px", borderRadius: "12px", textAlign: "center", border: "1px solid #e1e9ed" }}>
                <p style={{ color: "#0b8879", fontSize: "16px", fontWeight: 700 }}>✓ Moderation Queue is Clean!</p>
                <p style={{ color: "#647d91", fontSize: "12px" }}>All landlord listings are currently approved and published on search.</p>
              </div>
            ) : (
              <div style={{ display: "grid", gap: "16px" }}>
                {queue.map((item) => (
                  <div
                    key={item._id}
                    style={{
                      background: "#ffffff",
                      borderRadius: "12px",
                      border: "1px solid #e1e9ee",
                      padding: "20px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "20px",
                    }}
                  >
                    <div>
                      <h3 style={{ margin: "0 0 4px", fontSize: "16px", color: "#0d345b" }}>{item.title}</h3>
                      <p style={{ margin: 0, color: "#547188", fontSize: "12px" }}>
                        📍 {item.location?.neighborhood}, {item.location?.subCity} · ETB {Number(item.price).toLocaleString()} /mo
                      </p>
                      <small style={{ color: "#6a8194", fontSize: "11px" }}>
                        Submitted by: <b>{item.owner?.name}</b> ({item.owner?.email})
                      </small>
                    </div>

                    <div style={{ display: "flex", gap: "10px" }}>
                      <button
                        onClick={() => nav(`/property/${item._id}`)}
                        style={{
                          background: "#f0f5f7",
                          color: "#173858",
                          border: "1px solid #c8d9e2",
                          padding: "8px 14px",
                          borderRadius: "6px",
                          fontSize: "11px",
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        Inspect Listing
                      </button>
                      <button
                        onClick={() => moderate(item._id, "Approved")}
                        style={{
                          background: "#0b8879",
                          color: "#ffffff",
                          border: "none",
                          padding: "8px 16px",
                          borderRadius: "6px",
                          fontSize: "11px",
                          fontWeight: 800,
                          cursor: "pointer",
                        }}
                      >
                        ✓ Approve & Publish
                      </button>
                      <button
                        onClick={() => moderate(item._id, "Rejected")}
                        style={{
                          background: "#fff1f2",
                          color: "#be123c",
                          border: "1px solid #fecdd3",
                          padding: "8px 14px",
                          borderRadius: "6px",
                          fontSize: "11px",
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: USER MANAGEMENT */}
        {activeTab === "users" && (
          <div style={{ background: "#ffffff", borderRadius: "14px", border: "1px solid #e1e9ee", padding: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
              <div>
                <h2 style={{ margin: 0, fontSize: "18px", color: "#0d345b" }}>User Directory ({usersList.length})</h2>
                <p style={{ margin: "2px 0 0", color: "#647d91", fontSize: "11px" }}>Manage tenants, landlords, and admin credentials.</p>
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <input
                  type="text"
                  placeholder="Search user by name or email..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  style={{
                    padding: "8px 14px",
                    borderRadius: "6px",
                    border: "1px solid #cbdde4",
                    fontSize: "12px",
                    width: "240px",
                  }}
                />
                <select
                  value={userRoleFilter}
                  onChange={(e) => setUserRoleFilter(e.target.value)}
                  style={{
                    padding: "8px 12px",
                    borderRadius: "6px",
                    border: "1px solid #cbdde4",
                    fontSize: "12px",
                    background: "#fff",
                  }}
                >
                  <option value="all">All Roles</option>
                  <option value="tenant">Tenants</option>
                  <option value="landlord">Landlords</option>
                  <option value="admin">Admins</option>
                </select>
              </div>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "12px" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #e5edf0", color: "#647c90" }}>
                    <th style={{ padding: "10px" }}>User</th>
                    <th style={{ padding: "10px" }}>Role</th>
                    <th style={{ padding: "10px" }}>Email</th>
                    <th style={{ padding: "10px" }}>Phone</th>
                    <th style={{ padding: "10px" }}>Verification Tier</th>
                    <th style={{ padding: "10px", textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => (
                    <tr key={u._id} style={{ borderBottom: "1px solid #f0f4f7" }}>
                      <td style={{ padding: "12px 10px", fontWeight: 700, color: "#11355b" }}>{u.name}</td>
                      <td style={{ padding: "12px 10px" }}>
                        <span
                          style={{
                            background: u.role === "admin" ? "#fef3c7" : u.role === "landlord" ? "#e0f2fe" : "#f0fdf4",
                            color: u.role === "admin" ? "#92400e" : u.role === "landlord" ? "#0369a1" : "#166534",
                            padding: "2px 8px",
                            borderRadius: "99px",
                            fontSize: "10px",
                            fontWeight: 700,
                          }}
                        >
                          {u.role.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: "12px 10px", color: "#547188" }}>{u.email}</td>
                      <td style={{ padding: "12px 10px", color: "#547188" }}>{u.phone || "—"}</td>
                      <td style={{ padding: "12px 10px" }}>
                        <span
                          style={{
                            background: u.verificationTier?.includes("verified") ? "#e3f7f2" : "#f3f4f6",
                            color: u.verificationTier?.includes("verified") ? "#075e53" : "#4b5563",
                            padding: "2px 8px",
                            borderRadius: "99px",
                            fontSize: "10px",
                            fontWeight: 700,
                          }}
                        >
                          ✓ {u.verificationTier || "unverified"}
                        </span>
                      </td>
                      <td style={{ padding: "12px 10px", textAlign: "right" }}>
                        <button
                          onClick={() => toggleUserVerification(u._id)}
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
                          Toggle Verification
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: ALL PROPERTIES */}
        {activeTab === "properties" && (
          <div style={{ background: "#ffffff", borderRadius: "14px", border: "1px solid #e1e9ee", padding: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <div>
                <h2 style={{ margin: 0, fontSize: "18px", color: "#0d345b" }}>All Platform Listings ({propertiesList.length})</h2>
                <p style={{ margin: "2px 0 0", color: "#647d91", fontSize: "11px" }}>Manage and review all Addis Ababa listings.</p>
              </div>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "12px" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #e5edf0", color: "#647c90" }}>
                    <th style={{ padding: "10px" }}>Property</th>
                    <th style={{ padding: "10px" }}>Sub-City</th>
                    <th style={{ padding: "10px" }}>Price / mo</th>
                    <th style={{ padding: "10px" }}>Type</th>
                    <th style={{ padding: "10px" }}>Status</th>
                    <th style={{ padding: "10px" }}>Verification</th>
                    <th style={{ padding: "10px", textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {propertiesList.map((p) => (
                    <tr key={p._id} style={{ borderBottom: "1px solid #f0f4f7" }}>
                      <td style={{ padding: "12px 10px", fontWeight: 700, color: "#11355b" }}>
                        <Link to={`/property/${p._id}`} style={{ color: "#11355b", textDecoration: "none" }}>
                          {p.title}
                        </Link>
                      </td>
                      <td style={{ padding: "12px 10px", color: "#547188" }}>{p.location?.subCity}</td>
                      <td style={{ padding: "12px 10px", fontWeight: 700, color: "#0b8879" }}>
                        ETB {Number(p.price).toLocaleString()}
                      </td>
                      <td style={{ padding: "12px 10px", color: "#547188" }}>{p.propertyType}</td>
                      <td style={{ padding: "12px 10px" }}>
                        <span
                          style={{
                            background: p.availability?.status === "Available" ? "#e3f7f2" : "#fef3c7",
                            color: p.availability?.status === "Available" ? "#075e53" : "#92400e",
                            padding: "2px 8px",
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
                            padding: "2px 8px",
                            borderRadius: "99px",
                            fontSize: "10px",
                            fontWeight: 700,
                          }}
                        >
                          ✓ {p.verification?.status}
                        </span>
                      </td>
                      <td style={{ padding: "12px 10px", textAlign: "right" }}>
                        <button
                          onClick={() => deleteProp(p._id)}
                          style={{
                            background: "#fff1f2",
                            color: "#be123c",
                            border: "1px solid #fecdd3",
                            padding: "4px 10px",
                            borderRadius: "6px",
                            fontSize: "10px",
                            fontWeight: 700,
                            cursor: "pointer",
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: TRUST REPORTS */}
        {activeTab === "reports" && (
          <div style={{ background: "#ffffff", borderRadius: "14px", border: "1px solid #e1e9ee", padding: "24px" }}>
            <div style={{ marginBottom: "20px" }}>
              <h2 style={{ margin: 0, fontSize: "18px", color: "#0d345b" }}>Trust & Safety Fraud Reports</h2>
              <p style={{ margin: "2px 0 0", color: "#647d91", fontSize: "11px" }}>
                Tenant reports on inaccurate pricing, fake landlord details, or unavailable properties.
              </p>
            </div>

            {reportsList.length === 0 ? (
              <div style={{ padding: "40px", textAlign: "center" }}>
                <p style={{ color: "#0b8879", fontWeight: 700 }}>✓ No open fraud or safety reports.</p>
              </div>
            ) : (
              <div style={{ display: "grid", gap: "14px" }}>
                {reportsList.map((r) => (
                  <div
                    key={r._id}
                    style={{
                      background: "#f8faf9",
                      padding: "16px 20px",
                      borderRadius: "8px",
                      border: "1px solid #e1e9ee",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <b style={{ color: "#11355b", fontSize: "13px" }}>Reason: {r.reason}</b>
                      <p style={{ margin: "4px 0 0", color: "#547188", fontSize: "11px" }}>{r.description || "No extra notes"}</p>
                      <small style={{ color: "#6a8194", fontSize: "10px" }}>
                        Reported by: {r.reporter?.name || "Tenant"} · Status: <b>{r.status}</b>
                      </small>
                    </div>

                    <div style={{ display: "flex", gap: "8px" }}>
                      {r.status !== "resolved" && (
                        <button
                          onClick={() => updateReport(r._id, "resolved")}
                          style={{
                            background: "#0b8879",
                            color: "#ffffff",
                            border: "none",
                            padding: "6px 12px",
                            borderRadius: "6px",
                            fontSize: "10px",
                            fontWeight: 700,
                            cursor: "pointer",
                          }}
                        >
                          ✓ Resolve
                        </button>
                      )}
                      {r.status !== "dismissed" && (
                        <button
                          onClick={() => updateReport(r._id, "dismissed")}
                          style={{
                            background: "#f0f4f7",
                            color: "#547188",
                            border: "1px solid #cbdde4",
                            padding: "6px 12px",
                            borderRadius: "6px",
                            fontSize: "10px",
                            fontWeight: 700,
                            cursor: "pointer",
                          }}
                        >
                          Dismiss
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
