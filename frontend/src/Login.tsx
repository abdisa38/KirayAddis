import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "./context/AuthContext";
import Logo from "./components/Logo";
import Icon from "./components/Icon";

export default function Login() {
  const [pw, setPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [contact, setContact] = useState("alem@example.com");
  const [password, setPassword] = useState("password123");
  const { login } = useAuth();
  const nav = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(contact, password);
      nav("/tenant");
    } catch (err: any) {
      setError(err.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = (email: string, role: string) => {
    setContact(email);
    setPassword(role === "admin" ? "adminpassword123" : "password123");
  };

  return (
    <main className="login-page">
      <div className="login-panel">
        <Logo to="/" />
        <form onSubmit={handleLogin}>
          <p className="auth-kicker">WELCOME BACK</p>
          <h1>Sign in to Addis Kiray</h1>
          <p>Continue your home-search journey in Addis Ababa.</p>

          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", margin: "8px 0 14px" }}>
            <span style={{ fontSize: "9px", color: "#6a8194", alignSelf: "center" }}>Demo quick fill:</span>
            <button
              type="button"
              onClick={() => fillDemoAccount("alem@example.com", "tenant")}
              style={{ padding: "3px 7px", fontSize: "8px", background: "#eef5f4", border: "1px solid #cce2dc", borderRadius: "99px", color: "#087d70", cursor: "pointer" }}
            >
              Tenant
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount("kalkidan@example.com", "landlord")}
              style={{ padding: "3px 7px", fontSize: "8px", background: "#eef5f4", border: "1px solid #cce2dc", borderRadius: "99px", color: "#087d70", cursor: "pointer" }}
            >
              Landlord
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount("admin@addiskiray.com", "admin")}
              style={{ padding: "3px 7px", fontSize: "8px", background: "#eef5f4", border: "1px solid #cce2dc", borderRadius: "99px", color: "#087d70", cursor: "pointer" }}
            >
              Admin
            </button>
          </div>

          <label>
            Email address
            <input
              type="email"
              placeholder="you@example.com"
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
                placeholder="Enter your password"
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

          <div className="login-options">
            <label>
              <input type="checkbox" defaultChecked /> Remember me
            </label>
            <button
              type="button"
              onClick={() => alert("Password reset instructions will be sent to your email address.")}
            >
              Forgot password?
            </button>
          </div>

          <button className="auth-primary" type="submit" disabled={loading}>
            {loading ? "Signing In..." : "Sign In"}
          </button>

          <div className="auth-divider">
            <span>or</span>
          </div>

          <button
            className="google"
            type="button"
            onClick={async () => {
              await login("alem@example.com", "password123");
              nav("/tenant");
            }}
          >
            G <span>Continue with Google (Demo Auto-Login)</span>
          </button>

          <p className="login-bottom">
            Don’t have an account? <Link to="/register">Create one</Link>
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
            Trusted search, clearer choices, and a little more ease in the move.
          </span>
        </div>
      </aside>
    </main>
  );
}
