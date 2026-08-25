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
  const [userDropdown, setUserDropdown] = useState(false);
  const [lang, setLang] = useState<"EN" | "AM">("EN");
  const location = useLocation();
  const { user, logout } = useAuth();
  const nav = useNavigate();

  // Dynamic Navigation Links based on authentication and role
  const getNavLinks = () => {
    if (!user) {
      return [
        { label: "Find a Home", to: "/search" },
        { label: "Addis AI", to: "/ai" },
        { label: "For Landlords", to: "/register?role=landlord" },
        { label: "Trust & Safety", to: "/trust-safety" },
      ];
    }

    if (user.role === "landlord") {
      return [
        { label: "Landlord Dashboard", to: "/landlord" },
        { label: "+ Post Listing", to: "/landlord/listing" },
        { label: "Marketplace Search", to: "/search" },
        { label: "Tenant Messages", to: "/messages" },
      ];
    }

    if (user.role === "admin") {
      return [
        { label: "Admin Console", to: "/admin" },
        { label: "Marketplace Search", to: "/search" },
        { label: "Trust & Safety", to: "/trust-safety" },
        { label: "Messages", to: "/messages" },
      ];
    }

    // Default Tenant role
    return [
      { label: "Find a Home", to: "/search" },
      { label: "Addis AI", to: "/ai" },
      { label: "Tenant Dashboard", to: "/tenant" },
      { label: "Messages", to: "/messages" },
    ];
  };

  const navLinks = getNavLinks();

  const getInitials = (name?: string) => {
    if (!name) return "AK";
    const parts = name.split(" ");
    return parts.length >= 2 ? `${parts[0][0]}${parts[1][0]}` : name.slice(0, 2).toUpperCase();
  };

  const getUserDashboardPath = () => {
    if (!user) return "/login";
    if (user.role === "landlord") return "/landlord";
    if (user.role === "admin") return "/admin";
    return "/tenant";
  };

  return (
    <header className="nav" style={{ position: "relative" }}>
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
          style={{ cursor: "pointer" }}
        >
          {lang === "EN" ? "EN / አማርኛ" : "አማ / English"}
        </button>

        {user ? (
          <div style={{ position: "relative" }}>
            <button
              type="button"
              onClick={() => setUserDropdown(!userDropdown)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "2px",
              }}
            >
              <div
                className="avatar"
                style={{
                  width: "34px",
                  height: "34px",
                  borderRadius: "50%",
                  background: user.role === "admin" ? "#d97706" : user.role === "landlord" ? "#0d345b" : "#0b8879",
                  color: "#ffffff",
                  fontSize: "12px",
                  fontWeight: 800,
                  display: "grid",
                  placeItems: "center",
                }}
              >
                {getInitials(user.name)}
              </div>
              <span style={{ fontSize: "11px", fontWeight: 700, color: "#173858" }}>
                {user.name.split(" ")[0]}
              </span>
            </button>

            {userDropdown && (
              <div
                style={{
                  position: "absolute",
                  top: "42px",
                  right: 0,
                  width: "210px",
                  background: "#ffffff",
                  borderRadius: "10px",
                  border: "1px solid #d4e0e8",
                  boxShadow: "0 10px 25px rgba(13, 52, 91, 0.15)",
                  zIndex: 100,
                  overflow: "hidden",
                  padding: "6px 0",
                }}
              >
                <div style={{ padding: "10px 14px", borderBottom: "1px solid #f0f4f7" }}>
                  <b style={{ display: "block", fontSize: "12px", color: "#11355b" }}>{user.name}</b>
                  <span style={{ fontSize: "10px", color: "#6a8194" }}>{user.email}</span>
                  <span
                    style={{
                      display: "inline-block",
                      marginTop: "4px",
                      background: "#eef5f4",
                      color: "#087d70",
                      padding: "1px 6px",
                      borderRadius: "99px",
                      fontSize: "9px",
                      fontWeight: 800,
                      textTransform: "uppercase",
                    }}
                  >
                    {user.role}
                  </span>
                </div>

                <Link
                  to={getUserDashboardPath()}
                  onClick={() => setUserDropdown(false)}
                  style={{
                    display: "block",
                    padding: "8px 14px",
                    color: "#173858",
                    fontSize: "12px",
                    textDecoration: "none",
                    fontWeight: 600,
                  }}
                >
                  📊 My {user.role === "landlord" ? "Landlord" : user.role === "admin" ? "Admin" : "Tenant"} Dashboard
                </Link>

                <Link
                  to="/messages"
                  onClick={() => setUserDropdown(false)}
                  style={{
                    display: "block",
                    padding: "8px 14px",
                    color: "#173858",
                    fontSize: "12px",
                    textDecoration: "none",
                    fontWeight: 600,
                  }}
                >
                  💬 Messages & Inquiries
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setUserDropdown(false);
                    logout();
                    nav("/login");
                  }}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    padding: "8px 14px",
                    background: "none",
                    border: "none",
                    borderTop: "1px solid #f0f4f7",
                    color: "#be123c",
                    fontSize: "12px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
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
          </div>
        )}

        {/* Dynamic CTA button */}
        {!user && (
          <Link
            to="/register?role=landlord"
            className="btn"
            style={{
              padding: "7px 14px",
              fontSize: "10px",
              textDecoration: "none",
            }}
          >
            List Property
          </Link>
        )}
        {user?.role === "landlord" && (
          <Link
            to="/landlord/listing"
            className="btn"
            style={{
              padding: "7px 14px",
              fontSize: "10px",
              textDecoration: "none",
            }}
          >
            + Add Listing
          </Link>
        )}
        {user?.role === "tenant" && (
          <Link
            to="/tenant"
            className="btn outline"
            style={{
              padding: "7px 14px",
              fontSize: "10px",
              textDecoration: "none",
            }}
          >
            My Preferences
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
                  nav("/login");
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
