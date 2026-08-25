import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "./context/AuthContext";
import Logo from "./components/Logo";
import Icon from "./components/Icon";

declare global {
  interface Window {
    google?: any;
  }
}

export default function Login() {
  const [pw, setPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const { login, googleLogin } = useAuth();
  const nav = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const loggedInUser = await login(contact, password);
      if (loggedInUser.role === "landlord") {
        nav("/landlord");
      } else if (loggedInUser.role === "admin") {
        nav("/admin");
      } else {
        nav("/tenant");
      }
    } catch (err: any) {
      setError(err.message || "Invalid email address or password.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setLoading(true);
    try {
      // If Google Identity GIS is loaded
      if (window.google?.accounts?.id) {
        window.google.accounts.id.prompt(async (notification: any) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            // Fallback prompt
            const email = prompt("Enter your Google Account email to continue:") || "";
            if (email) {
              const user = await googleLogin({ email, name: email.split("@")[0] });
              if (user.role === "landlord") nav("/landlord");
              else nav("/tenant");
            }
          }
        });
      } else {
        // Direct Google OAuth prompt
        const email = prompt("Enter your Google Account email:") || "";
        if (email) {
          const user = await googleLogin({ email, name: email.split("@")[0] });
          if (user.role === "landlord") nav("/landlord");
          else nav("/tenant");
        }
      }
    } catch (err: any) {
      setError(err.message || "Google authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <div className="login-panel">
        <Logo to="/" />
        <form onSubmit={handleLogin}>
          <p className="auth-kicker">WELCOME BACK</p>
          <h1>Sign in to Addis Kiray</h1>
          <p style={{ color: "#5f758a", fontSize: "14px", margin: "0 0 24px" }}>
            Continue your home-search journey in Addis Ababa.
          </p>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#173858", marginBottom: "6px" }}>
              Email address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "12px 14px",
                border: "1px solid #cbd9e1",
                borderRadius: "8px",
                fontSize: "14px",
                color: "#173858",
                boxSizing: "border-box",
                background: "#ffffff",
              }}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#173858", marginBottom: "6px" }}>
              Password
            </label>
            <div className="password-field" style={{ position: "relative" }}>
              <input
                type={pw ? "text" : "password"}
                placeholder="Enter your account password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "12px 40px 12px 14px",
                  border: "1px solid #cbd9e1",
                  borderRadius: "8px",
                  fontSize: "14px",
                  color: "#173858",
                  boxSizing: "border-box",
                  background: "#ffffff",
                }}
              />
              <button
                type="button"
                onClick={() => setPw(!pw)}
                aria-label="Show password"
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#5f758a",
                }}
              >
                <Icon name="eye" />
              </button>
            </div>
          </div>

          {error && (
            <div style={{ background: "#fff2f2", border: "1px solid #f5c6cb", borderRadius: "8px", padding: "10px 14px", marginBottom: "16px", color: "#721c24", fontSize: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
              <Icon name="lock" />
              <span>{error}</span>
            </div>
          )}

          <div className="login-options" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#4f657a", cursor: "pointer" }}>
              <input type="checkbox" defaultChecked /> Remember me
            </label>
            <button
              type="button"
              onClick={() => alert("Password reset instructions will be sent to your email address.")}
              style={{ background: "none", border: "none", color: "#0b8879", fontSize: "12px", fontWeight: 700, cursor: "pointer" }}
            >
              Forgot password?
            </button>
          </div>

          <button className="auth-primary" type="submit" disabled={loading} style={{ width: "100%", padding: "12px", fontSize: "14px" }}>
            {loading ? "Signing In..." : "Sign In"}
          </button>

          <div className="auth-divider" style={{ margin: "20px 0", textAlign: "center" }}>
            <span style={{ background: "#ffffff", padding: "0 12px", color: "#8a9fb0", fontSize: "12px" }}>or continue with</span>
          </div>

          <button
            className="google"
            type="button"
            onClick={handleGoogleSignIn}
            style={{
              width: "100%",
              padding: "11px",
              border: "1px solid #cbd9e1",
              borderRadius: "8px",
              background: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              fontSize: "13px",
              fontWeight: 700,
              color: "#173858",
              cursor: "pointer",
            }}
          >
            <Icon name="google" style={{ fontSize: "16px", color: "#ea4335" }} />
            <span>Continue with Google</span>
          </button>

          <p className="login-bottom" style={{ textAlign: "center", marginTop: "24px", fontSize: "13px", color: "#5f758a" }}>
            Don't have an account? <Link to="/register" style={{ color: "#0b8879", fontWeight: 700, textDecoration: "none" }}>Create an account</Link>
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
            Trusted search, clearer choices, and direct landlord connections in Addis Ababa.
          </span>
        </div>
      </aside>
    </main>
  );
}
