import { useState } from "react";
import { Link, useNavigate } from "react-router";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Icon from "./components/Icon";

const imgs = [
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=900&q=80",
];

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

function Similar({
  i,
  name,
  price,
  match,
}: {
  i: number;
  name: string;
  price: string;
  match: string;
}) {
  return (
    <article className="similar" style={{ cursor: "pointer" }}>
      <img src={imgs[i]} alt={name} />
      <span className="tiny-verify">
        <Icon name="check" />
        Verified
      </span>
      <div>
        <h3>{name}</h3>
        <p>
          <Icon name="pin" />
          Bole, Addis Ababa
        </p>
        <b>
          ETB {price} <em>/ month</em>
        </b>
        <span className="mini-score">{match}% Match</span>
      </div>
    </article>
  );
}

export default function PropertyDetails() {
  const [saved, setSaved] = useState(false);
  const [share, setShare] = useState(false);
  const [gallery, setGallery] = useState(false);
  const [contact, setContact] = useState(false);
  const [viewing, setViewing] = useState(false);
  const [report, setReport] = useState(false);
  const [tab, setTab] = useState("About");
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [modalSuccess, setModalSuccess] = useState(false);
  const nav = useNavigate();

  const handleModalSubmit = () => {
    if (contact) {
      setContact(false);
      nav("/messages");
    } else {
      setModalSuccess(true);
      setTimeout(() => {
        setModalSuccess(false);
        setViewing(false);
        setReport(false);
      }, 1500);
    }
  };

  return (
    <main className="details">
      <Navbar />

      <div className="details-wrap">
        <div className="crumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/search">Bole</Link>
          <span>/</span>
          <Link to="/search">Apartments</Link>
          <span>/</span>
          <b>Sunlit Two-Bedroom Apartment</b>
        </div>

        <section className="gallery">
          <div className="main-shot">
            <img
              src={imgs[0]}
              alt="Living room in Sunlit Two-Bedroom Apartment"
            />
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
                  onClick={() => setSaved(!saved)}
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
              ▣ 12 photos
            </button>
          </div>

          <div className="gallery-side">
            <img src={imgs[1]} alt="Apartment bedroom" />
            <div className="video">
              <img src={imgs[2]} alt="Apartment kitchen video preview" />
              <button onClick={() => setGallery(true)} type="button">
                <Icon name="play" /> Property video
              </button>
            </div>
            <button
              onClick={() => setGallery(true)}
              className="view-photos"
              type="button"
            >
              View all photos <span>→</span>
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
                  <span className="available">● Available now</span>
                </div>
                <h1>Sunlit Two-Bedroom Apartment</h1>
                <p className="location">
                  <Icon name="pin" />
                  Bole, Addis Ababa
                </p>
              </div>
              <div className="score">
                94%<small>Match</small>
              </div>
            </div>

            <div className="facts">
              <span>
                <Icon name="bed" />
                <b>2</b> Bedrooms
              </span>
              <span>
                <Icon name="bath" />
                <b>2</b> Bathrooms
              </span>
              <span>
                <Icon name="area" />
                <b>92 m²</b> Area
              </span>
              <span>
                <Icon name="spark" />
                <b>Apartment</b>
              </span>
            </div>

            <div className="mobile-price">
              <b>
                ETB 42,000 <em>/ month</em>
              </b>
              <span>Deposit and rental terms available from landlord</span>
            </div>

            <nav className="detail-tabs">
              {["About", "Amenities", "Location", "Landlord"].map((t) => (
                <button
                  className={tab === t ? "active" : ""}
                  onClick={() => setTab(t)}
                  key={t}
                  type="button"
                >
                  {t}
                </button>
              ))}
            </nav>

            {(tab === "About" || tab === "all") && (
              <section className="info-block" id="about-section">
                <p className="eyebrow">ABOUT THIS HOME</p>
                <h2>A calm, sun-filled place to come home to.</h2>
                <p>
                  Set on a quiet street in Bole, this bright two-bedroom apartment offers a generous living space, practical kitchen, and a balcony that catches the afternoon light. Close enough to the city’s everyday energy, with enough room to step away from it.
                </p>
                {showFullDesc && (
                  <p style={{ marginTop: "12px", borderTop: "1px dashed #dce6eb", paddingTop: "12px" }}>
                    The property includes dedicated compound parking, 24/7 security with CCTV monitoring, backup water tanks (3,000L), and high-speed fiber internet wiring. Located within 5 minutes walk to local supermarkets, cafes, and public minibus lines.
                  </p>
                )}
                <button
                  className="read-more"
                  type="button"
                  onClick={() => setShowFullDesc(!showFullDesc)}
                >
                  {showFullDesc ? "Show less ↑" : "Read full description ↓"}
                </button>
              </section>
            )}

            {(tab === "Amenities" || tab === "all") && (
              <section className="info-block" id="amenities-section">
                <div className="block-heading">
                  <div>
                    <p className="eyebrow">AMENITIES</p>
                    <h2>Everything you need, clearly listed.</h2>
                  </div>
                  <span>11 included</span>
                </div>
                <div className="amenities">
                  {[
                    "Parking",
                    "Water",
                    "Electricity",
                    "Internet",
                    "24/7 security",
                    "Elevator",
                    "Balcony",
                    "Furnished kitchen",
                    "Generator",
                    "CCTV",
                    "Compound",
                  ].map((x, i) => (
                    <span key={x}>
                      <i>{["P", "W", "E", "I", "S", "L"][i % 6]}</i>
                      {x}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {(tab === "About" || tab === "all") && (
              <section className="info-block terms">
                <p className="eyebrow">RENTAL TERMS & AVAILABILITY</p>
                <div className="term-grid">
                  <span>
                    <b>Monthly rent</b>
                    <strong>ETB 42,000</strong>
                  </span>
                  <span>
                    <b>Availability</b>
                    <strong className="green">Available now</strong>
                  </span>
                  <span>
                    <b>Minimum term</b>
                    <strong>12 months</strong>
                  </span>
                  <span>
                    <b>Furnishing</b>
                    <strong>Partially furnished</strong>
                  </span>
                </div>
                <p className="fresh">
                  ✓ Recently confirmed · The availability was updated today.
                </p>
              </section>
            )}

            {(tab === "Location" || tab === "all") && (
              <section className="location-block" id="location-section">
                <div>
                  <p className="eyebrow">LOCATION & COMMUTE</p>
                  <h2>Near the places that shape your day.</h2>
                  <p>
                    Located in Bole, with a straightforward commute to the Edna Mall area.
                  </p>
                  <div className="commute-card">
                    <Icon name="pin" />
                    <span>
                      <b>24 min</b> to Bole — Edna Mall area
                      <small>Typical commute by car · demonstration estimate</small>
                    </span>
                    <button type="button" onClick={() => nav("/search")}>
                      Change destination
                    </button>
                  </div>
                  <div className="nearby">
                    <span>✦ Edna Mall <b>1.3 km</b></span>
                    <span>✦ Bole Medhanealem <b>1.6 km</b></span>
                    <span>✦ Public transport <b>5 min walk</b></span>
                  </div>
                </div>
                <div className="mini-map">
                  <div className="roads" />
                  <span>Bole</span>
                  <i className="spot">⌂</i>
                  <b>Edna Mall</b>
                </div>
              </section>
            )}

            {(tab === "Landlord" || tab === "all") && (
              <section className="landlord" id="landlord-section">
                <div className="landlord-avatar">KM</div>
                <div>
                  <p className="eyebrow">LISTED BY</p>
                  <h2>Kalkidan M.</h2>
                  <span className="verified">
                    <Icon name="check" /> Landlord verified
                  </span>
                  <p className="response">Usually responds within a few hours</p>
                </div>
                <button type="button" onClick={() => nav("/messages")}>
                  Message Landlord →
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
              ETB 42,000 <em>/ month</em>
            </b>
            <p>Deposit and rental terms available from landlord.</p>
            <div className="match-box">
              <span className="score">
                94%<small>Match</small>
              </span>
              <div>
                <b>Strong match for your needs</b>
                <p>Budget, location and commute fit your search.</p>
                <button type="button" onClick={() => nav("/ai")}>
                  Why this matches →
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
                onClick={() => setSaved(!saved)}
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
              Verification communicates a completed check — not a guarantee of safety.
            </p>
          </aside>
        </section>
      </div>

      <section className="similar-section">
        <div className="details-wrap">
          <div className="section-head">
            <div>
              <p className="eyebrow">MORE TO EXPLORE</p>
              <h2>You might also like</h2>
            </div>
            <Link to="/search">View similar homes →</Link>
          </div>
          <div className="similar-grid">
            <Similar
              i={1}
              name="Modern apartment near Atlas"
              price="36,000"
              match="91"
            />
            <Similar
              i={2}
              name="Quiet home in a secure compound"
              price="39,500"
              match="88"
            />
            <Similar
              i={3}
              name="Bright two-bedroom with balcony"
              price="34,000"
              match="84"
            />
          </div>
          <div className="better">
            <div>
              <p className="eyebrow">EXPLORE A DIFFERENT FIT</p>
              <h2>Looking for something slightly different?</h2>
            </div>
            <div>
              {[
                "Under 35,000 ETB",
                "Closer to your destination",
                "More bedrooms",
                "Other homes in Bole",
              ].map((x) => (
                <Link to="/search" key={x}>
                  {x} <span>→</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <div className="mobile-actions">
        <Btn kind="outline" onClick={() => setContact(true)}>
          <Icon name="message" /> Message
        </Btn>
        <Btn onClick={() => setViewing(true)}>
          <Icon name="calendar" /> Request viewing
        </Btn>
      </div>

      {share && (
        <div className="modal-wrap">
          <div className="modal">
            <button
              className="close"
              onClick={() => setShare(false)}
              type="button"
            >
              <Icon name="close" />
            </button>
            <p className="eyebrow">SHARE HOME</p>
            <h2>Share this property</h2>
            {["Copy link", "WhatsApp", "Telegram", "Email"].map((x) => (
              <button
                key={x}
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href);
                  setShare(false);
                }}
              >
                {x}
                <span>→</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {gallery && (
        <div className="modal-wrap dark">
          <div className="gallery-modal">
            <button onClick={() => setGallery(false)} type="button">
              <Icon name="close" /> Close
            </button>
            <img src={imgs[0]} alt="Expanded property living room" />
            <span>1 of 12</span>
          </div>
        </div>
      )}

      {(contact || viewing || report) && (
        <div className="modal-wrap">
          <div className="modal">
            <button
              className="close"
              onClick={() => {
                setContact(false);
                setViewing(false);
                setReport(false);
              }}
              type="button"
            >
              <Icon name="close" />
            </button>
            <p className="eyebrow">
              {report
                ? "REPORT PROPERTY"
                : viewing
                ? "REQUEST VIEWING"
                : "CONTACT LANDLORD"}
            </p>
            <h2>
              {modalSuccess
                ? "Request Submitted!"
                : report
                ? "Help us review this listing"
                : viewing
                ? "Choose a time to view"
                : "Send an inquiry"}
            </h2>
            <p>
              {modalSuccess
                ? "Thank you. Your request has been recorded."
                : report
                ? "Tell us what seems incorrect. Your report is reviewed carefully."
                : viewing
                ? "Select a preferred appointment time. The landlord will confirm availability."
                : "Ask a question or introduce yourself. Your message goes directly to the landlord."}
            </p>
            {!modalSuccess && (
              <>
                <textarea
                  placeholder={
                    report
                      ? "Add a brief description of the issue (optional)"
                      : viewing
                      ? "I would like to request a viewing on Saturday morning at 10:00 AM."
                      : "Hi Kalkidan, I’m interested in this apartment. Is it still available?"
                  }
                />
                <Btn onClick={handleModalSubmit}>
                  {report
                    ? "Submit report"
                    : viewing
                    ? "Request viewing"
                    : "Send message & open chat"}
                </Btn>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
