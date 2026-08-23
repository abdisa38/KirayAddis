import { useState } from "react";
import { Link, useNavigate } from "react-router";
import Logo from "./components/Logo";
import Icon from "./components/Icon";

export default function Register() {
  const [pw, setPw] = useState(false);
  const [role, setRole] = useState<"tenant" | "landlord">("tenant");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate user registration & redirect to email verification
    nav("/auth/verify-email");
  };

  return (
    <main className="login-page">
      <div className="login-panel">
        <Logo />
        <form onSubmit={handleSubmit}>
          <p className="auth-kicker">GET STARTED</p>
          <h1>Create your account</h1>
          <p>Join Addis Kiray to find, save, and rent homes across Addis Ababa.</p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", margin: "12px 0 16px" }}>
            <button
              type="button"
              onClick={() => setRole("tenant")}
              className={`filter ${role === "tenant" ? "active" : ""}`}
              style={{ justifyContent: "center", padding: "10px", width: "100%" }}
            >
              I'm a Tenant
            </button>
            <button
              type="button"
              onClick={() => setRole("landlord")}
              className={`filter ${role === "landlord" ? "active" : ""}`}
              style={{ justifyContent: "center", padding: "10px", width: "100%" }}
            >
              I'm a Landlord
            </button>
          </div>

          <label>
            Full name
            <input
              type="text"
              placeholder="e.g. Alem Mengistu"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>

          <label>
            Email or phone number
            <input
              type="text"
              placeholder="you@example.com or +251 9..."
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              required
            />
          </label>

          <label>
            Password
            <div className="password-field">
              <input
                type={pw ? "text" : "password"}
                placeholder="Create a strong password (min 8 chars)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setPw(!pw)}
                aria-label="Show password"
              >
                <Icon name="eye" />
              </button>
            </div>
          </label>

          <div style={{ margin: "14px 0", fontSize: "10px", color: "#5d7388" }}>
            <label style={{ display: "flex", alignItems: "flex-start", gap: "8px", fontWeight: 400 }}>
              <input type="checkbox" required style={{ marginTop: "2px", accentColor: "#0b8879" }} />
              <span>
                I agree to the Addis Kiray <Link to="/trust-safety" style={{ color: "#087d70" }}>Terms of Service</Link> and{" "}
                <Link to="/trust-safety" style={{ color: "#087d70" }}>Privacy Policy</Link>.
              </span>
            </label>
          </div>

          <button className="auth-primary" type="submit">
            Create Account
          </button>

          <div className="auth-divider">
            <span>or</span>
          </div>

          <button className="google" type="button" onClick={() => nav("/tenant")}>
            G <span>Continue with Google</span>
          </button>

          <p className="login-bottom">
            Already have an account? <Link to="/login">Sign In</Link>
          </p>
        </form>
      </div>

      <aside className="login-aside">
        <div className="login-map" />
        <div>
          <p className="auth-kicker">HOME STARTS HERE</p>
          <h2>
            Find a place
            <br />
            <i>that fits your life.</i>
          </h2>
          <span>
            {role === "tenant"
              ? "Discover verified homes matched to your work location, budget, and lifestyle in Addis Ababa."
              : "List your property to reach verified tenants, manage viewing requests, and fill vacancies faster."}
          </span>
        </div>
      </aside>
    </main>
  );
}
