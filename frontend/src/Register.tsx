import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "./context/AuthContext";
import Logo from "./components/Logo";
import Icon from "./components/Icon";

export default function Register() {
  const [pw, setPw] = useState(false);
  const [role, setRole] = useState<"tenant" | "landlord">("tenant");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const nav = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await register(name, email, password, role, phone);
      nav("/auth/verify-email");
    } catch (err: any) {
      setError(err.message || "Registration failed. Please check your information.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <div className="login-panel">
        <Logo to="/" />
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
            Email address
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label>
            Phone number (optional)
            <input
              type="tel"
              placeholder="+251 9..."
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </label>

          <label>
            Password
            <div className="password-field">
              <input
                type={pw ? "text" : "password"}
                placeholder="Create a strong password (min 6 chars)"
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

          {error && (
            <p className="login-error">
              <Icon name="lock" />
              {error}
            </p>
          )}

          <div style={{ margin: "14px 0", fontSize: "10px", color: "#5d7388" }}>
            <label style={{ display: "flex", alignItems: "flex-start", gap: "8px", fontWeight: 400 }}>
              <input type="checkbox" required style={{ marginTop: "2px", accentColor: "#0b8879" }} />
              <span>
                I agree to the Addis Kiray <Link to="/trust-safety" style={{ color: "#087d70" }}>Terms of Service</Link> and{" "}
                <Link to="/trust-safety" style={{ color: "#087d70" }}>Privacy Policy</Link>.
              </span>
            </label>
          </div>

          <button className="auth-primary" type="submit" disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
          </button>

          <div className="auth-divider">
            <span>or</span>
          </div>

          <button
            className="google"
            type="button"
            onClick={async () => {
              await register("Demo Google User", `user_${Date.now()}@example.com`, "password123", role);
              nav("/tenant");
            }}
          >
            G <span>Sign Up with Google</span>
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
