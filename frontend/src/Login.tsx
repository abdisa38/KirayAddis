import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "./context/AuthContext";
import Logo from "./components/Logo";
import Icon from "./components/Icon";

const GOOGLE_CLIENT_ID =
  import.meta.env.VITE_GOOGLE_CLIENT_ID ||
  "642526920712-7di88noo4nn5pmjr9599la28cg50qjgd.apps.googleusercontent.com";

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
  const googleBtnRef = useRef<HTMLDivElement>(null);
  const { login, googleLogin } = useAuth();
  const nav = useNavigate();

  // Initialize Google Identity Services
  useEffect(() => {
    const initGoogleGIS = () => {
      if (window.google?.accounts?.id && googleBtnRef.current) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleCredentialResponse,
        });

        window.google.accounts.id.renderButton(googleBtnRef.current, {
          theme: "outline",
          size: "large",
          width: 340,
          text: "continue_with",
          shape: "rectangular",
          logo_alignment: "center",
        });
      }
    };

    if (window.google?.accounts?.id) {
      initGoogleGIS();
    } else {
      const timer = setInterval(() => {
        if (window.google?.accounts?.id) {
          initGoogleGIS();
          clearInterval(timer);
        }
      }, 300);
      return () => clearInterval(timer);
    }
  }, []);

  const handleGoogleCredentialResponse = async (response: any) => {
    if (!response.credential) return;
    setError("");
    setLoading(true);

    try {
      const loggedUser = await googleLogin({
        credential: response.credential,
      });

      if (loggedUser.role === "landlord") {
        nav("/landlord");
      } else if (loggedUser.role === "admin") {
        nav("/admin");
      } else {
        nav("/tenant");
      }
    } catch (err: any) {
      setError(err.message || "Google sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
            <span style={{ background: "#ffffff", padding: "0 12px", color: "#8a9fb0", fontSize: "12px" }}>or sign in with</span>
          </div>

          {/* Official Google Sign-In Button Container */}
          <div
            ref={googleBtnRef}
            style={{ width: "100%", minHeight: "44px", display: "flex", justifyContent: "center" }}
          />

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
