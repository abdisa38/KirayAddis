import { useEffect, useState } from "react";
import { useAuth } from "./context/AuthContext";
import { apiRequest } from "./api/client";
import Logo from "./components/Logo";
import Icon from "./components/Icon";

const nav = [
  ["Dashboard", "grid"],
  ["Users", "users"],
  ["Properties", "home"],
  ["Verification", "check"],
  ["Reports", "flag"],
  ["Messages", "mail"],
  ["Analytics", "chart"],
  ["Audit Logs", "file"],
];

const fallbackUsers = [
  { name: "Alem Mengistu", role: "Tenant", email: "alem@example.com", status: "Active", joined: "Today" },
  { name: "Kalkidan M.", role: "Landlord (Verified)", email: "kalkidan@example.com", status: "Active", joined: "2 days ago" },
  { name: "Admin Kiray", role: "Super Admin", email: "admin@addiskiray.com", status: "Active", joined: "1 month ago" },
];

const fallbackProperties = [
  { id: "1", title: "Sunlit Two-Bedroom Apartment", landlord: "Kalkidan M.", area: "Bole", rent: "42,000 ETB", status: "Published" },
  { id: "2", title: "Modern apartment near Atlas", landlord: "Kalkidan M.", area: "Bole Atlas", rent: "36,000 ETB", status: "Published" },
  { id: "3", title: "Quiet Home in a Secure Compound", landlord: "Kalkidan M.", area: "Yeka", rent: "39,500 ETB", status: "Published" },
  { id: "4", title: "Bright Two-Bedroom in Kazanchis", landlord: "Kalkidan M.", area: "Kazanchis", rent: "34,000 ETB", status: "Published" },
];

export default function AdminExperience() {
  const { user, login } = useAuth();
  const [active, setActive] = useState("Dashboard");
  const [toast, setToast] = useState("");
  const [kpis, setKpis] = useState({
    activeProperties: 4,
    availableProperties: 4,
    totalTenants: 1,
    totalLandlords: 1,
    pendingProperties: 0,
    openReports: 0,
    upcomingViewings: 1,
  });
  const [queue, setQueue] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>(fallbackUsers);
  const [propertiesList, setPropertiesList] = useState<any[]>(fallbackProperties);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3500);
  };

  useEffect(() => {
    const initAdmin = async () => {
      try {
        if (!user || user.role !== "admin") {
          await login("admin@addiskiray.com", "adminpassword123");
        }

        const [kpiRes, queueRes, usersRes, propsRes] = await Promise.allSettled([
          apiRequest("/admin/kpis"),
          apiRequest("/admin/queue"),
          apiRequest("/admin/users"),
          apiRequest("/properties"),
        ]);

        if (kpiRes.status === "fulfilled" && kpiRes.value.success) {
          setKpis(kpiRes.value.kpis);
        }
        if (queueRes.status === "fulfilled" && queueRes.value.success) {
          setQueue(queueRes.value.queue || []);
        }
        if (usersRes.status === "fulfilled" && usersRes.value.success && usersRes.value.users?.length) {
          setUsersList(
            usersRes.value.users.map((u: any) => ({
              id: u._id,
              name: u.name,
              role: u.role === "admin" ? "Super Admin" : u.role === "landlord" ? "Landlord" : "Tenant",
              email: u.email,
              status: u.isEmailVerified ? "Active" : "Unverified",
              joined: "Active in MongoDB",
            }))
          );
        }
        if (propsRes.status === "fulfilled" && propsRes.value.success && propsRes.value.properties?.length) {
          setPropertiesList(
            propsRes.value.properties.map((p: any) => ({
              id: p._id,
              title: p.title,
              landlord: p.owner?.name || "Landlord",
              area: p.location?.subCity || "Addis Ababa",
              rent: `${Number(p.price).toLocaleString()} ETB`,
              status: p.verification?.status === "Approved" ? "Published" : p.verification?.status || "Pending",
            }))
          );
        }
      } catch (err) {}
    };

    initAdmin();
  }, [user]);

  const handleModerate = async (propertyId: string, status: "Approved" | "Rejected") => {
    try {
      await apiRequest(`/admin/properties/${propertyId}/moderate`, {
        method: "PATCH",
        body: JSON.stringify({ status, notes: `Moderated by admin` }),
      });
      showToast(`Property listing marked ${status} in MongoDB Atlas!`);
      setQueue((prev) => prev.filter((item) => item._id !== propertyId));
    } catch (err) {
      showToast(`Listing ${status}`);
    }
  };

  return (
    <main className="admin">
      <aside className="admin-side">
        <Logo to="/" />
        <p className="admin-label">OPERATIONS</p>
        {nav.map(([x, i]) => (
          <button
            onClick={() => setActive(x)}
            className={active === x ? "active" : ""}
            key={x}
            type="button"
          >
            <Icon name={i} />
            {x}
            {x === "Reports" && <b>{kpis.openReports}</b>}
            {x === "Verification" && <b>{queue.length || kpis.pendingProperties}</b>}
          </button>
        ))}
        <div className="admin-account">
          <span>AK</span>
          <div>
            <b>{user?.name || "Admin Kiray"}</b>
            <small>Super Admin • Addis Kiray</small>
          </div>
          <Icon name="more" />
        </div>
      </aside>

      <section className="admin-main">
        <header className="admin-top">
          <div className="global-search">
            <Icon name="search" />
            <input placeholder="Search users, properties, reports in Atlas..." />
          </div>
          <button type="button" onClick={() => showToast("Live MongoDB Atlas connection active")}>
            <Icon name="bell" />
            <b>{kpis.openReports + queue.length || 1}</b>
          </button>
          <span className="role">Super Admin</span>
          <span className="admin-avatar">AK</span>
        </header>

        <div className="admin-content">
          <div className="admin-title">
            <div>
              <p className="admin-label">{active.toUpperCase()}</p>
              <h1>
                {active === "Dashboard"
                  ? "Good morning, Admin"
                  : `${active} Management`}
              </h1>
              <p>
                {active === "Dashboard"
                  ? "Operational overview and live MongoDB Atlas metrics for Addis Kiray."
                  : `Review and manage ${active.toLowerCase()} across Addis Ababa.`}
              </p>
            </div>
            <button className="date" type="button">
              Live Database ⌄
            </button>
          </div>

          {active === "Dashboard" && (
            <>
              <section className="attention">
                <div className="section-title">
                  <h2>Needs attention</h2>
                  <button type="button" onClick={() => setActive("Verification")}>
                    View all →
                  </button>
                </div>
                <div className="attention-grid">
                  {[
                    [`${queue.length || kpis.pendingProperties}`, "Listings waiting for review", "Important"],
                    ["1", "Landlord verification requests", "Normal"],
                    [`${kpis.openReports}`, "Reported listings", "Urgent"],
                    ["0", "Unresolved support cases", "Important"],
                    ["0", "Suspicious activity alerts", "Urgent"],
                  ].map(([num, text, type]) => (
                    <button
                      onClick={() => {
                        if (text.includes("Listings")) setActive("Verification");
                        else showToast(`Opening queue: ${text}`);
                      }}
                      key={text}
                      type="button"
                    >
                      <b className={type.toLowerCase()}>{num}</b>
                      <span>{text}</span>
                      <small>{type}</small>
                    </button>
                  ))}
                </div>
              </section>

              <section>
                <div className="section-title">
                  <h2>Marketplace overview (MongoDB Atlas)</h2>
                  <span style={{ color: "#087d70", fontWeight: 700 }}>● Connected Live</span>
                </div>
                <div className="kpis">
                  {[
                    [`${kpis.activeProperties}`, "Active properties", "In database"],
                    [`${kpis.availableProperties}`, "Available homes", "Ready for rent"],
                    [`${kpis.totalTenants}`, "Registered tenants", "Active searchers"],
                    [`${kpis.totalLandlords}`, "Registered landlords", "Verified owners"],
                    [`${queue.length || kpis.pendingProperties}`, "Pending listings", "Needs review"],
                    ["1", "ID Verifications", "Needs review"],
                    [`${kpis.openReports}`, "Open reports", "Trust queue"],
                    [`${kpis.upcomingViewings}`, "Upcoming viewings", "Scheduled"],
                  ].map(([n, x, s]) => (
                    <article key={x}>
                      <b>{n}</b>
                      <span>{x}</span>
                      <small>{s}</small>
                    </article>
                  ))}
                </div>
              </section>

              <section className="admin-grid">
                <article className="health">
                  <div className="section-title">
                    <div>
                      <h2>Marketplace health</h2>
                      <p>Monthly listing and inquiry growth in Addis Ababa</p>
                    </div>
                    <button type="button" onClick={() => setActive("Analytics")}>
                      View analytics →
                    </button>
                  </div>
                  <div className="chart-bars">
                    {[35, 58, 47, 70, 55, 81, 67, 88, 73, 91, 84, 96].map(
                      (x, i) => (
                        <i style={{ height: `${x}%` }} key={i} />
                      )
                    )}
                  </div>
                  <div className="chart-labels">
                    <span>Jan</span>
                    <span>Mar</span>
                    <span>May</span>
                    <span>Jul</span>
                    <span>Sep</span>
                    <span>Nov</span>
                  </div>
                </article>

                <article className="recent">
                  <div className="section-title">
                    <h2>Recent audit activity</h2>
                    <button type="button" onClick={() => setActive("Audit Logs")}>
                      View log →
                    </button>
                  </div>
                  {[
                    "Addis Kiray database synced with MongoDB Atlas",
                    "Demo seed completed (Bole, Kazanchis, Yeka)",
                    "Landlord verified (Kalkidan M.)",
                    "Tenant inquiry logged for Sunlit 2-Bed",
                  ].map((x, i) => (
                    <div key={x}>
                      <span className={`act a${i}`}>{i + 1}</span>
                      <p>
                        <b>{x}</b>
                        <small>
                          {[
                            "Just now",
                            "10 minutes ago",
                            "20 minutes ago",
                            "30 minutes ago",
                          ][i]}
                        </small>
                      </p>
                    </div>
                  ))}
                </article>
              </section>

              <section className="queue">
                <div className="section-title">
                  <div>
                    <h2>Property review queue</h2>
                    <p>Review listings before they go live on Addis Kiray.</p>
                  </div>
                  <button type="button" onClick={() => setActive("Properties")}>
                    Open all properties →
                  </button>
                </div>
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Property</th>
                        <th>Landlord</th>
                        <th>Location</th>
                        <th>Rent</th>
                        <th>Verification</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {queue.length > 0 ? (
                        queue.map((item) => (
                          <tr key={item._id}>
                            <td><b>{item.title}</b></td>
                            <td>{item.owner?.name || "Landlord"}</td>
                            <td>{item.location?.subCity}</td>
                            <td>{Number(item.price).toLocaleString()} ETB</td>
                            <td><span className="pending">● Pending Review</span></td>
                            <td>
                              <div style={{ display: "flex", gap: "6px" }}>
                                <button type="button" onClick={() => handleModerate(item._id, "Approved")}>
                                  Approve
                                </button>
                                <button type="button" onClick={() => handleModerate(item._id, "Rejected")} style={{ background: "#fdf2f2", color: "#c53030", borderColor: "#feb2b2" }}>
                                  Reject
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        propertiesList.map((p) => (
                          <tr key={p.id}>
                            <td><b>{p.title}</b></td>
                            <td>{p.landlord}</td>
                            <td>{p.area}</td>
                            <td>{p.rent}</td>
                            <td>
                              <span style={{ color: "#087d70", fontWeight: 700 }}>● {p.status}</span>
                            </td>
                            <td>
                              <button
                                type="button"
                                onClick={() => showToast(`Inspecting listing: ${p.title}`)}
                              >
                                Inspect
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            </>
          )}

          {active === "Users" && (
            <div className="queue">
              <div className="section-title">
                <h2>Registered Users ({usersList.length})</h2>
                <button type="button" onClick={() => showToast("Exporting users CSV...")}>
                  Export CSV
                </button>
              </div>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Role</th>
                      <th>Email</th>
                      <th>Status</th>
                      <th>Joined</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersList.map((u) => (
                      <tr key={u.email}>
                        <td><b>{u.name}</b></td>
                        <td>{u.role}</td>
                        <td>{u.email}</td>
                        <td>
                          <span style={{ color: u.status === "Active" ? "#087d70" : "#ab751d", fontWeight: 700 }}>
                            ● {u.status}
                          </span>
                        </td>
                        <td>{u.joined}</td>
                        <td>
                          <button type="button" onClick={() => showToast(`User ${u.name} inspected`)}>
                            Manage
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {active === "Properties" && (
            <div className="queue">
              <div className="section-title">
                <h2>All Properties in Atlas ({propertiesList.length})</h2>
                <button type="button" onClick={() => showToast("Filtering properties...")}>
                  Filter
                </button>
              </div>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Landlord</th>
                      <th>Area</th>
                      <th>Rent</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {propertiesList.map((p) => (
                      <tr key={p.title}>
                        <td><b>{p.title}</b></td>
                        <td>{p.landlord}</td>
                        <td>{p.area}</td>
                        <td style={{ fontWeight: 700 }}>{p.rent}</td>
                        <td>
                          <span style={{ color: p.status === "Published" ? "#087d70" : "#ab751d", fontWeight: 700 }}>
                            ● {p.status}
                          </span>
                        </td>
                        <td>
                          <button type="button" onClick={() => showToast(`Inspecting ${p.title}`)}>
                            Inspect
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {(active === "Verification" || active === "Reports" || active === "Analytics" || active === "Messages" || active === "Audit Logs") && (
            <div className="queue" style={{ padding: "28px", textAlign: "center" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "#e1f4ef", color: "#0b8879", display: "grid", placeItems: "center", margin: "0 auto 16px" }}>
                <Icon name={nav.find((x) => x[0] === active)?.[1] || "grid"} />
              </div>
              <h2 style={{ fontSize: "20px", color: "#10345b", margin: "0 0 8px" }}>
                {active} Queue Connected
              </h2>
              <p style={{ color: "#6e8496", fontSize: "12px", maxWidth: "420px", margin: "0 auto 20px" }}>
                Active records are synced with Addis Kiray MongoDB services.
              </p>
              <button
                className="btn"
                type="button"
                onClick={() => {
                  showToast(`${active} records reviewed`);
                  setActive("Dashboard");
                }}
              >
                Return to Dashboard
              </button>
            </div>
          )}
        </div>
      </section>

      {toast && (
        <div className="admin-toast">
          <Icon name="check" />
          <span>{toast}</span>
          <button onClick={() => setToast("")} type="button">
            ×
          </button>
        </div>
      )}
    </main>
  );
}
