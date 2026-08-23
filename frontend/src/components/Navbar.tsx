import { useState } from "react";
import { Link, useLocation } from "react-router";
import Logo from "./Logo";
import Icon from "./Icon";

export default function Navbar({
  showAvatar = true,
  actionButton = "list",
}: {
  showAvatar?: boolean;
  actionButton?: "list" | "search" | "tenant";
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [lang, setLang] = useState<"EN" | "AM">("EN");
  const location = useLocation();

  const navLinks = [
    { label: "Find a Home", to: "/search" },
    { label: "Addis AI", to: "/ai" },
    { label: "For Landlords", to: "/landlord/listing" },
    { label: "Trust & Safety", to: "/trust-safety" },
    { label: "Prototypes", to: "/prototype" },
  ];

  return (
    <header className="nav">
      <Logo to="/" />
      <nav className="navlinks">
        {navLinks.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            style={{
              textDecoration: "none",
              color: location.pathname === item.to ? "#087d70" : "#5c738a",
              fontWeight: location.pathname === item.to ? 800 : 500,
            }}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="navright">
        <button
          type="button"
          onClick={() => setLang(lang === "EN" ? "AM" : "EN")}
          title="Toggle Language"
        >
          {lang === "EN" ? "EN / አማርኛ" : "አማ / English"}
        </button>
        <Link
          to="/login"
          style={{ textDecoration: "none", color: "#5c738a", fontSize: "11px" }}
        >
          Sign In
        </Link>
        {actionButton === "list" && (
          <Link
            to="/landlord/listing"
            className="btn"
            style={{
              padding: "7px 12px",
              fontSize: "10px",
              textDecoration: "none",
            }}
          >
            List Property
          </Link>
        )}
        {showAvatar && (
          <Link
            to="/tenant"
            className="avatar"
            title="Tenant Account"
            style={{ textDecoration: "none" }}
          >
            AM
          </Link>
        )}
      </div>

      <button
        className="mobile-menu"
        type="button"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle menu"
      >
        <Icon name={mobileOpen ? "close" : "menu"} />
      </button>

      {mobileOpen && (
        <div
          style={{
            position: "fixed",
            top: 68,
            left: 0,
            right: 0,
            bottom: 0,
            background: "#ffffff",
            zIndex: 99,
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
          }}
        >
          {navLinks.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              style={{
                textDecoration: "none",
                fontSize: "15px",
                fontWeight: 700,
                color: "#10345b",
                padding: "8px 0",
                borderBottom: "1px solid #eef2f5",
              }}
            >
              {item.label}
            </Link>
          ))}
          <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: "10px" }}>
            <Link
              to="/login"
              onClick={() => setMobileOpen(false)}
              className="btn outline"
              style={{ textAlign: "center", textDecoration: "none" }}
            >
              Sign In
            </Link>
            <Link
              to="/landlord/listing"
              onClick={() => setMobileOpen(false)}
              className="btn"
              style={{ textAlign: "center", textDecoration: "none" }}
            >
              List Your Property
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
