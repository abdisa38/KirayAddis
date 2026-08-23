import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import Logo from "./Logo";
import Icon from "./Icon";

export default function Navbar({
  actionButton = "list",
}: {
  showAvatar?: boolean;
  actionButton?: "list" | "search" | "tenant";
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [lang, setLang] = useState<"EN" | "AM">("EN");
  const location = useLocation();
  const { user, logout } = useAuth();
  const nav = useNavigate();

  const navLinks = [
    { label: "Find a Home", to: "/search" },
    { label: "Addis AI", to: "/ai" },
    { label: "For Landlords", to: "/landlord/listing" },
    { label: "Trust & Safety", to: "/trust-safety" },
    { label: "Prototypes", to: "/prototype" },
  ];

  const getInitials = (name?: string) => {
    if (!name) return "AK";
    const parts = name.split(" ");
    return parts.length >= 2 ? `${parts[0][0]}${parts[1][0]}` : name.slice(0, 2).toUpperCase();
  };

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

        {user ? (
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Link
              to={user.role === "admin" ? "/admin" : user.role === "landlord" ? "/landlord/listing" : "/tenant"}
              className="avatar"
              title={`${user.name} (${user.role})`}
              style={{ textDecoration: "none" }}
            >
              {getInitials(user.name)}
            </Link>
            <button
              type="button"
              onClick={() => {
                logout();
                nav("/login");
              }}
              style={{ border: "none", background: "transparent", color: "#8798a5", fontSize: "10px", cursor: "pointer" }}
            >
              Sign out
            </button>
          </div>
        ) : (
          <>
            <Link
              to="/login"
              style={{ textDecoration: "none", color: "#5c738a", fontSize: "11px", fontWeight: 700 }}
            >
              Sign In
            </Link>
            <Link
              to="/register"
              style={{ textDecoration: "none", color: "#087d70", fontSize: "11px", fontWeight: 800 }}
            >
              Sign Up
            </Link>
          </>
        )}

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
            {user ? (
              <button
                type="button"
                onClick={() => {
                  logout();
                  setMobileOpen(false);
                }}
                className="btn outline"
              >
                Sign Out ({user.name})
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="btn outline"
                  style={{ textAlign: "center", textDecoration: "none" }}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className="btn"
                  style={{ textAlign: "center", textDecoration: "none" }}
                >
                  Create Account
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
