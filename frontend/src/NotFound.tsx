import { Link } from "react-router";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Icon from "./components/Icon";

export default function NotFound() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#f8faf9" }}>
      <Navbar />
      <main style={{ flex: 1, display: "grid", placeItems: "center", padding: "60px 20px" }}>
        <div
          style={{
            maxWidth: "480px",
            textAlign: "center",
            background: "#ffffff",
            padding: "48px 32px",
            borderRadius: "16px",
            border: "1px solid #dce6eb",
            boxShadow: "0 10px 30px rgba(15, 52, 80, 0.05)",
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              margin: "0 auto 20px",
              borderRadius: "50%",
              background: "#e1f4ef",
              color: "#0b8879",
              display: "grid",
              placeItems: "center",
            }}
          >
            <Icon name="search" style={{ width: "28px", height: "28px" }} />
          </div>
          <p style={{ margin: "0 0 8px", color: "#087d70", fontFamily: "DM Mono", fontSize: "11px", letterSpacing: "0.1em" }}>
            ERROR 404
          </p>
          <h1 style={{ margin: "0 0 12px", color: "#10345b", fontSize: "28px", letterSpacing: "-0.04em" }}>
            Page not found
          </h1>
          <p style={{ color: "#60788c", fontSize: "13px", lineHeight: 1.6, margin: "0 0 28px" }}>
            The screen or property you’re looking for might have moved, or the link may be incorrect.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "12px", flexWrap: "wrap" }}>
            <Link to="/" className="btn" style={{ textDecoration: "none" }}>
              Back to Home
            </Link>
            <Link to="/search" className="btn outline" style={{ textDecoration: "none" }}>
              Find a Home
            </Link>
            <Link to="/prototype" className="btn outline" style={{ textDecoration: "none" }}>
              View All 23 Screens
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
