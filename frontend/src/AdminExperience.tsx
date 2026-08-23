import { useState } from "react";
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

const attention = [
  ["12", "Listings waiting for review", "Important"],
  ["7", "Verification requests", "Normal"],
  ["4", "Reported listings", "Urgent"],
  ["9", "Unresolved support cases", "Important"],
  ["3", "Suspicious activity alerts", "Urgent"],
];

const usersList = [
  { name: "Alem Mengistu", role: "Tenant", email: "alem@example.com", status: "Active", joined: "Today" },
  { name: "Kalkidan M.", role: "Landlord (Verified)", email: "kalkidan@example.com", status: "Active", joined: "2 days ago" },
  { name: "Henok Tesfaye", role: "Landlord", email: "henok@example.com", status: "Pending Verification", joined: "1 week ago" },
  { name: "Mekdes Alemu", role: "Tenant", email: "mekdes@example.com", status: "Active", joined: "2 weeks ago" },
];

const propertiesList = [
  { title: "Sunlit Two-Bedroom Apartment", landlord: "Kalkidan M.", area: "Bole", rent: "42,000 ETB", status: "Published" },
  { title: "Modern apartment near Atlas", landlord: "Henok T.", area: "Bole Atlas", rent: "36,000 ETB", status: "Published" },
  { title: "Family home with garden", landlord: "Mekdes A.", area: "Yeka", rent: "55,000 ETB", status: "Pending Review" },
  { title: "Studio near Meskel Square", landlord: "Henok T.", area: "Kazanchis", rent: "22,000 ETB", status: "Pending Verification" },
];

export default function AdminExperience() {
  const [active, setActive] = useState("Dashboard");
  const [toast, setToast] = useState("");
  const [selectedListing, setSelectedListing] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3500);
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
            {x === "Reports" && <b>4</b>}
            {x === "Verification" && <b>7</b>}
          </button>
        ))}
        <div className="admin-account">
          <span>AK</span>
          <div>
            <b>Admin K.</b>
            <small>Super Admin • Addis Kiray</small>
          </div>
          <Icon name="more" />
        </div>
      </aside>

      <section className="admin-main">
        <header className="admin-top">
          <div className="global-search">
            <Icon name="search" />
            <input placeholder="Search users, properties, reports..." />
          </div>
          <button type="button" onClick={() => showToast("3 high-priority notifications")}>
            <Icon name="bell" />
            <b>3</b>
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
                  ? "Operational overview and live queues for Addis Kiray."
                  : `Review and manage ${active.toLowerCase()} across Addis Ababa.`}
              </p>
            </div>
            <button className="date" type="button">
              Last 7 days ⌄
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
                  {attention.map(([num, text, type]) => (
                    <button
                      onClick={() => showToast(`Opening queue: ${text}`)}
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
                  <h2>Marketplace overview</h2>
                  <span>Demonstration data</span>
                </div>
                <div className="kpis">
                  {[
                    ["1,284", "Active properties", "+8% this week"],
                    ["922", "Available homes", "Updated today"],
                    ["4,621", "Registered tenants", "+12% this month"],
                    ["368", "Registered landlords", "+4 this week"],
                    ["12", "Pending listings", "Needs review"],
                    ["7", "Pending verification", "Needs review"],
                    ["4", "Open reports", "Needs review"],
                    ["18", "Upcoming viewings", "Next 7 days"],
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
                      <p>Listings, users, and inquiries over time</p>
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
                    "Property submitted for verification (Bole 2-bed)",
                    "Report received: incorrect pricing in Yeka",
                    "New landlord account verified (Kalkidan M.)",
                    "Listing marked rented in Kazanchis",
                  ].map((x, i) => (
                    <div key={x}>
                      <span className={`act a${i}`}>{i + 1}</span>
                      <p>
                        <b>{x}</b>
                        <small>
                          {[
                            "2 minutes ago",
                            "18 minutes ago",
                            "42 minutes ago",
                            "1 hour ago",
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
                  <button type="button" onClick={() => setActive("Verification")}>
                    Open moderation queue →
                  </button>
                </div>
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Property</th>
                        <th>Landlord</th>
                        <th>Location</th>
                        <th>Submitted</th>
                        <th>Verification</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        [
                          "Sunlit Two-Bedroom Apartment",
                          "Kalkidan M.",
                          "Bole",
                          "Today",
                          "Pending",
                        ],
                        [
                          "Family home with garden",
                          "Mekdes A.",
                          "Yeka",
                          "Today",
                          "Documents ready",
                        ],
                        [
                          "Studio near Meskel Square",
                          "Henok T.",
                          "Kazanchis",
                          "Yesterday",
                          "Pending",
                        ],
                      ].map((r) => (
                        <tr key={r[0]}>
                          {r.map((x, i) => (
                            <td key={i}>
                              {i === 4 ? (
                                <span className="pending">● {x}</span>
                              ) : (
                                x
                              )}
                            </td>
                          ))}
                          <td>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedListing(r[0]);
                                showToast(`Approved listing: ${r[0]}`);
                              }}
                            >
                              Approve
                            </button>
                          </td>
                        </tr>
                      ))}
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
                          <button type="button" onClick={() => showToast(`User ${u.name} managed`)}>
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
                <h2>All Listings ({propertiesList.length})</h2>
                <button type="button" onClick={() => showToast("Opening listing filter...")}>
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
                          <button type="button" onClick={() => showToast(`Viewing listing ${p.title}`)}>
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
                {active} Queue Active
              </h2>
              <p style={{ color: "#6e8496", fontSize: "12px", maxWidth: "420px", margin: "0 auto 20px" }}>
                Active records are synced with Addis Kiray marketplace services. Use the actions to resolve pending tasks.
              </p>
              <button
                className="btn"
                type="button"
                onClick={() => {
                  showToast(`${active} action processed successfully`);
                  setActive("Dashboard");
                }}
              >
                Process Queue & Return to Dashboard
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
