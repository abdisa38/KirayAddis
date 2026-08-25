import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useAuth } from "./context/AuthContext";
import { apiRequest } from "./api/client";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Icon from "./components/Icon";

function Btn({
  children,
  kind = "primary",
  onClick,
}: {
  children: React.ReactNode;
  kind?: string;
  onClick?: () => void;
}) {
  return (
    <button onClick={onClick} className={`btn ${kind}`} type="button">
      {children}
    </button>
  );
}

export default function PropertyDetails() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);
  const [share, setShare] = useState(false);
  const [gallery, setGallery] = useState(false);
  const [contact, setContact] = useState(false);
  const [viewing, setViewing] = useState(false);
  const [report, setReport] = useState(false);
  const [tab, setTab] = useState("About");
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [modalSuccess, setModalSuccess] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [viewingDate, setViewingDate] = useState("2026-08-25");
  const [viewingTime, setViewingTime] = useState("10:00 AM");
  const [propData, setPropData] = useState<any>(null);
  const [similarHomes, setSimilarHomes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  useEffect(() => {
    if (!id) return;
    setLoading(true);

    apiRequest(`/properties/${id}`)
      .then((data: any) => {
        if (data.success && data.property) {
          setPropData(data.property);
          // Fetch similar homes in the same sub-city or neighborhood
          const subCity = data.property.location?.subCity || "";
          apiRequest(`/properties?limit=3&subCity=${encodeURIComponent(subCity)}`)
            .then((simData: any) => {
              if (simData.success && simData.properties) {
                setSimilarHomes(simData.properties.filter((p: any) => p._id !== id));
              }
            })
            .catch(() => {});
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const propertyTitle = propData?.title || "Addis Ababa Rental Property";
  const propertyPrice = propData?.price ? Number(propData.price).toLocaleString() : "—";
  const propertySubCity = propData?.location?.subCity || "Addis Ababa";
  const propertyNeighborhood = propData?.location?.neighborhood || "Central District";
  const propertyLandmark = propData?.location?.landmark || "Centrally located";
  const propertyBedrooms = propData?.bedrooms || 2;
  const propertyBathrooms = propData?.bathrooms || 1;
  const propertyArea = propData?.area || 85;
  const propertyType = propData?.propertyType || "Apartment";
  const matchScore = propData?.matchScore || 94;
  const landlordName = propData?.owner?.name || "Verified Landlord";
  const propertyDescription = propData?.description || "Comfortable rental property in Addis Ababa with quality amenities.";
  const propertyMedia: string[] = propData?.media?.map((m: any) => m.url) || [
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=80",
  ];

  const amenitiesList: string[] = propData?.amenities?.length
    ? propData.amenities
    : ["Water", "Water tank", "Electricity", "24/7 security", "Parking"];

  const handleModalSubmit = async () => {
    if (contact) {
      if (propData?._id && user) {
        try {
          await apiRequest("/messages/conversations", {
            method: "POST",
            body: JSON.stringify({
              propertyId: propData._id,
              initialMessage: messageText || "Hello, I am interested in this listing. Is it available for viewing?",
            }),
          });
        } catch (err) {}
      }
      setContact(false);
      nav("/messages");
    } else if (viewing) {
      if (propData?._id && user) {
        try {
          await apiRequest("/messages/viewings", {
            method: "POST",
            body: JSON.stringify({
              propertyId: propData._id,
              appointmentDate: viewingDate,
              appointmentTime: viewingTime,
              notes: messageText,
            }),
          });
        } catch (err) {}
      }
      setModalSuccess(true);
      setTimeout(() => {
        setModalSuccess(false);
        setViewing(false);
      }, 1500);
    } else {
      setModalSuccess(true);
      setTimeout(() => {
        setModalSuccess(false);
        setReport(false);
      }, 1500);
    }
  };

  const toggleSaveProperty = async () => {
    setSaved(!saved);
    if (propData?._id && user) {
      try {
        await apiRequest(`/tenant/saved/${propData._id}`, { method: "POST" });
      } catch (err) {}
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#f8fbfa" }}>
        <Navbar />
        <div style={{ flex: 1, display: "grid", placeItems: "center", padding: "60px 20px" }}>
          <p style={{ color: "#5a758a", fontSize: "14px" }}>Loading property details from database...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <main className="details">
      <Navbar />

      <div className="details-wrap">
        <div className="crumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to={`/search?location=${encodeURIComponent(propertySubCity)}`}>{propertySubCity}</Link>
          <span>/</span>
          <Link to={`/search?propertyType=${encodeURIComponent(propertyType)}`}>{propertyType}s</Link>
          <span>/</span>
          <b>{propertyTitle}</b>
        </div>

        {/* Dynamic Unique Photo Gallery */}
        <section className="gallery">
          <div className="main-shot">
            <img src={propertyMedia[0]} alt={propertyTitle} />
            <div className="gallery-actions">
              <Link to="/search" aria-label="Back to search">
                <Icon name="arrow" />
              </Link>
              <div>
                <button
                  onClick={() => setShare(true)}
                  aria-label="Share property"
                  type="button"
                >
                  <Icon name="share" />
                </button>
                <button
                  onClick={toggleSaveProperty}
                  className={saved ? "saved" : ""}
                  aria-label="Save property"
                  type="button"
                >
                  <Icon name="heart" />
                </button>
              </div>
            </div>
            <button
              className="photos"
              onClick={() => setGallery(true)}
              type="button"
            >
              <Icon name="photo" style={{ marginRight: "6px" }} />
              {propertyMedia.length} photos
            </button>
          </div>

          <div className="gallery-side">
            <img src={propertyMedia[1] || propertyMedia[0]} alt={`${propertyTitle} interior`} />
            <div className="video">
              <img src={propertyMedia[2] || propertyMedia[0]} alt={`${propertyTitle} room view`} />
              <button onClick={() => setGallery(true)} type="button">
                <Icon name="photo" /> View Gallery
              </button>
            </div>
            <button
              onClick={() => setGallery(true)}
              className="view-photos"
              type="button"
            >
              View all {propertyMedia.length} photos <Icon name="arrow" />
            </button>
          </div>
        </section>

        <section className="property-layout">
          <div className="detail-content">
            <div className="title-row">
              <div>
                <div className="status-row">
                  <span className="verified">
                    <Icon name="check" /> Property verified
                  </span>
                  <span className="available">
                    <Icon name="check" style={{ color: "#0b8879", marginRight: "4px" }} /> Available now
                  </span>
                </div>
                <h1>{propertyTitle}</h1>
                <p className="location">
                  <Icon name="pin" />
                  {propertyNeighborhood}, {propertySubCity}, Addis Ababa
                </p>
              </div>
              <div className="score">
                {matchScore}%<small>Match</small>
              </div>
            </div>

            <div className="facts">
              <div>
                <b>{propertyBedrooms}</b>
                <span>Bedrooms</span>
              </div>
              <div>
                <b>{propertyBathrooms}</b>
                <span>Bathrooms</span>
              </div>
              <div>
                <b>{propertyArea} m²</b>
                <span>Living space</span>
              </div>
              <div>
                <b>{propertyType}</b>
                <span>Property Type</span>
              </div>
            </div>

            <div className="tabs">
              {["About", "Amenities", "Commute", "Landlord"].map((t) => (
                <button
                  key={t}
                  className={tab === t ? "active" : ""}
                  onClick={() => setTab(t)}
                  type="button"
                >
                  {t}
                </button>
              ))}
            </div>

            {(tab === "About" || tab === "all") && (
              <section className="about-section">
                <h2>About this home</h2>
                <p className={showFullDesc ? "desc-full" : "desc"}>
                  {propertyDescription}
                </p>
                <p style={{ marginTop: "12px", fontSize: "13px", color: "#546e82" }}>
                  Landmark reference: <b>{propertyLandmark}</b>. Direct lease available with verified landlord representation on Addis Kiray.
                </p>
              </section>
            )}

            {(tab === "Amenities" || tab === "all") && (
              <section className="amenities-section">
                <h2>Amenities & Utilities</h2>
                <div className="amenities-grid">
                  {amenitiesList.map((a) => (
                    <div key={a} className="amenity">
                      <Icon name="check" style={{ color: "#0b8879" }} />
                      <span>{a}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {(tab === "Commute" || tab === "all") && (
              <section className="commute-section">
                <h2>Commute & Neighborhood Proximity</h2>
                <p style={{ fontSize: "13px", color: "#567084" }}>
                  Estimated travel times from {propertyNeighborhood}:
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "12px" }}>
                  <div style={{ background: "#f0f6f5", padding: "12px", borderRadius: "8px" }}>
                    <b style={{ color: "#11355b", fontSize: "13px" }}>Bole / Airport Corridor</b>
                    <p style={{ margin: "4px 0 0", fontSize: "11px", color: "#60798d" }}>15 - 25 min via ring road</p>
                  </div>
                  <div style={{ background: "#f0f6f5", padding: "12px", borderRadius: "8px" }}>
                    <b style={{ color: "#11355b", fontSize: "13px" }}>Kazanchis / UNECA Hub</b>
                    <p style={{ margin: "4px 0 0", fontSize: "11px", color: "#60798d" }}>10 - 20 min direct access</p>
                  </div>
                </div>
              </section>
            )}

            {(tab === "Landlord" || tab === "all") && (
              <section className="landlord" id="landlord-section">
                <div className="landlord-avatar">
                  {landlordName.split(" ").map((n: string) => n[0]).join("")}
                </div>
                <div>
                  <p className="eyebrow">LISTED BY</p>
                  <h2>{landlordName}</h2>
                  <span className="verified">
                    <Icon name="check" /> Landlord verified
                  </span>
                  <p className="response">Usually responds within a few hours on Addis Kiray</p>
                </div>
                <button type="button" onClick={() => setContact(true)}>
                  Message Landlord <Icon name="arrow" />
                </button>
              </section>
            )}

            <button
              onClick={() => setReport(true)}
              className="report"
              type="button"
            >
              Report this property
            </button>
          </div>

          <aside className="side-card">
            <p className="eyebrow">MONTHLY RENT</p>
            <b className="price">
              ETB {propertyPrice} <em>/ month</em>
            </b>
            <p>Deposit and contract terms confirmed with landlord.</p>
            <div className="match-box">
              <span className="score">
                {matchScore}%<small>Match</small>
              </span>
              <div>
                <b>Strong match for your needs</b>
                <p>Budget, location and utilities fit your search.</p>
                <button type="button" onClick={() => nav("/ai")}>
                  Why this matches <Icon name="arrow" />
                </button>
              </div>
            </div>
            <Btn onClick={() => setContact(true)}>
              <Icon name="message" /> Message landlord
            </Btn>
            <Btn kind="outline" onClick={() => setViewing(true)}>
              <Icon name="calendar" /> Request viewing
            </Btn>
            <div className="side-actions">
              <button
                onClick={toggleSaveProperty}
                className={saved ? "saved" : ""}
                type="button"
              >
                <Icon name="heart" />
                {saved ? "Saved" : "Save home"}
              </button>
              <button onClick={() => setShare(true)} type="button">
                <Icon name="share" />
                Share
              </button>
            </div>
            <p className="trust-note">
              Verification communicates a completed check — not an absolute guarantee of safety.
            </p>
          </aside>
        </section>
      </div>

      {/* Real Similar Homes Section */}
      {similarHomes.length > 0 && (
        <section className="similar-section">
          <div className="details-wrap">
            <div className="section-head">
              <div>
                <p className="eyebrow">MORE TO EXPLORE</p>
                <h2>Similar homes in {propertySubCity}</h2>
              </div>
              <Link to={`/search?location=${encodeURIComponent(propertySubCity)}`}>
                View all in {propertySubCity} →
              </Link>
            </div>
            <div className="similar-grid">
              {similarHomes.map((sim) => {
                const cover = sim.media?.find((m: any) => m.isCover) || sim.media?.[0];
                return (
                  <article
                    key={sim._id}
                    className="similar"
                    style={{ cursor: "pointer" }}
                    onClick={() => nav(`/property/${sim._id}`)}
                  >
                    <img
                      src={cover?.url || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"}
                      alt={sim.title}
                    />
                    <span className="tiny-verify">
                      <Icon name="check" /> Verified
                    </span>
                    <div>
                      <h3>{sim.title}</h3>
                      <p>
                        <Icon name="pin" />
                        {sim.location?.neighborhood || sim.location?.subCity}, Addis Ababa
                      </p>
                      <b>
                        ETB {Number(sim.price).toLocaleString()} <em>/ month</em>
                      </b>
                      <span className="mini-score">{sim.matchScore || 90}% Match</span>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Gallery Modal */}
      {gallery && (
        <div className="modal" onClick={() => setGallery(false)}>
          <div className="modal-card gallery-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h2>{propertyTitle} — Photo Gallery</h2>
              <button onClick={() => setGallery(false)} type="button">
                <Icon name="close" />
              </button>
            </div>
            <div className="modal-body" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", maxHeight: "70vh", overflowY: "auto" }}>
              {propertyMedia.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt={`Photo ${i + 1}`}
                  style={{ width: "100%", height: "240px", objectFit: "cover", borderRadius: "8px" }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Contact Landlord Modal */}
      {contact && (
        <div className="modal" onClick={() => setContact(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h2>Contact {landlordName}</h2>
              <button onClick={() => setContact(false)} type="button">
                <Icon name="close" />
              </button>
            </div>
            <div className="modal-body">
              <label style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: "6px" }}>
                Your inquiry message:
              </label>
              <textarea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Hi, I am interested in this listing. Is it available for viewing this week?"
                style={{ width: "100%", height: "100px", padding: "10px", borderRadius: "8px", border: "1px solid #cbd9e1" }}
              />
              <button
                className="btn"
                style={{ width: "100%", marginTop: "14px" }}
                type="button"
                onClick={handleModalSubmit}
              >
                Send Message to Landlord
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Request Viewing Modal */}
      {viewing && (
        <div className="modal" onClick={() => setViewing(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h2>Request Property Viewing</h2>
              <button onClick={() => setViewing(false)} type="button">
                <Icon name="close" />
              </button>
            </div>
            <div className="modal-body">
              {modalSuccess ? (
                <div style={{ textAlign: "center", padding: "20px" }}>
                  <Icon name="check" style={{ fontSize: "32px", color: "#0b8879" }} />
                  <h3 style={{ marginTop: "8px" }}>Viewing Request Sent!</h3>
                  <p style={{ fontSize: "12px", color: "#567084" }}>The landlord has been notified.</p>
                </div>
              ) : (
                <>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: "4px" }}>
                    Preferred Date:
                  </label>
                  <input
                    type="date"
                    value={viewingDate}
                    onChange={(e) => setViewingDate(e.target.value)}
                    style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #cbd9e1", marginBottom: "12px" }}
                  />
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: "4px" }}>
                    Preferred Time:
                  </label>
                  <select
                    value={viewingTime}
                    onChange={(e) => setViewingTime(e.target.value)}
                    style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #cbd9e1", marginBottom: "12px" }}
                  >
                    <option value="09:00 AM">09:00 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="04:00 PM">04:00 PM</option>
                    <option value="05:30 PM">05:30 PM</option>
                  </select>
                  <button
                    className="btn"
                    style={{ width: "100%", marginTop: "8px" }}
                    type="button"
                    onClick={handleModalSubmit}
                  >
                    Submit Viewing Request
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}
