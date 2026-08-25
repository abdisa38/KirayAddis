import { Link } from "react-router";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer>
      <div>
        <Logo to="/" />
        <p style={{ marginTop: "14px", maxWidth: "240px" }}>
          A smarter, more trustworthy way to discover and rent homes in Addis Ababa.
        </p>
        <div style={{ marginTop: "16px", display: "flex", gap: "10px", fontSize: "11px", color: "#8aa3b5" }}>
          <span>© {new Date().getFullYear()} Addis Kiray</span>
          <span>•</span>
          <span>English / አማርኛ</span>
        </div>
      </div>

      <div>
        <b>Discover</b>
        <Link to="/search" style={{ textDecoration: "none" }}>Find a Home</Link>
        <Link to="/search" style={{ textDecoration: "none" }}>Explore Map</Link>
        <Link to="/ai" style={{ textDecoration: "none" }}>Addis AI Assistant</Link>
        <Link to="/tenant" style={{ textDecoration: "none" }}>Tenant Hub</Link>
      </div>

      <div>
        <b>For Landlords</b>
        <Link to="/landlord" style={{ textDecoration: "none" }}>Landlord Dashboard</Link>
        <Link to="/landlord/listing" style={{ textDecoration: "none" }}>List a Property</Link>
        <Link to="/trust-safety" style={{ textDecoration: "none" }}>Verification Process</Link>
        <Link to="/messages" style={{ textDecoration: "none" }}>Tenant Messages</Link>
      </div>

      <div>
        <b>Trust & Portals</b>
        <Link to="/trust-safety" style={{ textDecoration: "none" }}>Trust & Safety Center</Link>
        <Link to="/trust-safety" style={{ textDecoration: "none" }}>Report a Concern</Link>
        <Link to="/admin" style={{ textDecoration: "none" }}>Admin Console</Link>
        <Link to="/login" style={{ textDecoration: "none" }}>Sign In</Link>
      </div>
    </footer>
  );
}
