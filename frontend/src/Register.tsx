import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "./context/AuthContext";
import Logo from "./components/Logo";
import Icon from "./components/Icon";

export default function Register() {
  const searchParams = new URLSearchParams(window.location.search);
  const initialRole = searchParams.get("role") === "landlord" ? "landlord" : "tenant";
  const [role, setRole] = useState<"tenant" | "landlord">(initialRole);
  const [pw, setPw] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register, googleLogin } = useAuth();
  const nav = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const newUser = await register(name, email, password, role, phone);
      if (newUser.role === "landlord") {
        nav("/landlord");
      } else {
        nav("/tenant");
      }
    } catch (err: any) {
      setError(err.message || "Registration failed. Please check your information.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setError("");
    setLoading(true);
    try {
      const googleEmail = prompt("Enter your Google Account email to create account:") || "";
      if (googleEmail) {
        const user = await googleLogin({
          email: googleEmail,
          name: googleEmail.split("@")[0],
          role,
        });
        if (user.role === "landlord") nav("/landlord");
        else nav("/tenant");
      }
    } catch (err: any) {
      setError(err.message || "Google sign-up failed.");
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
          <p style={{ color: "#5f758a", fontSize: "14px", margin: "0 0 20px" }}>
            Join Addis Kiray to find, save, and rent homes across Addis Ababa.
          </p>

          {/* Role Selector Tabs */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "18px" }}>
            <button
              type="button"
              onClick={() => setRole("tenant")}
              style={{
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid",
                borderColor: role === "tenant" ? "#0b8879" : "#cbd9e1",
                background: role === "tenant" ? "#0b8879" : "#ffffff",
                color: role === "tenant" ? "#ffffff" : "#173858",
                fontWeight: 700,
                fontSize: "13px",
                cursor: "pointer",
              }}
            >
              I am a Tenant
            </button>
            <button
              type="button"
              onClick={() => setRole("landlord")}
              style={{
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid",
                borderColor: role === "landlord" ? "#0b8879" : "#cbd9e1",
                background: role === "landlord" ? "#0b8879" : "#ffffff",
                color: role === "landlord" ? "#ffffff" : "#173858",
                fontWeight: 700,
                fontSize: "13px",
                cursor: "pointer",
              }}
            >
              I am a Landlord
            </button>
          </div>

          <div style={{ marginBottom: "14px" }}>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#173858", marginBottom: "6px" }}>
              Full name
            </label>
            <input
              type="text"
              placeholder="e.g. Alem Mengistu"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "11px 14px",
                border: "1px solid #cbd9e1",
                borderRadius: "8px",
                fontSize: "14px",
                color: "#173858",
                boxSizing: "border-box",
                background: "#ffffff",
              }}
            />
          </div>

          <div style={{ marginBottom: "14px" }}>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#173858", marginBottom: "6px" }}>
              Email address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "11px 14px",
                border: "1px solid #cbd9e1",
                borderRadius: "8px",
                fontSize: "14px",
                color: "#173858",
                boxSizing: "border-box",
                background: "#ffffff",
              }}
            />
          </div>

          <div style={{ marginBottom: "14px" }}>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#173858", marginBottom: "6px" }}>
              Phone number (optional)
            </label>
            <input
              type="tel"
              placeholder="+251 9..."
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={{
                width: "100%",
                padding: "11px 14px",
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
                placeholder="Create a password (min 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "11px 40px 11px 14px",
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

          <div style={{ margin: "14px 0 20px", fontSize: "12px", color: "#5d7388" }}>
            <label style={{ display: "flex", alignItems: "flex-start", gap: "8px", cursor: "pointer" }}>
              <input type="checkbox" required style={{ marginTop: "3px", accentColor: "#0b8879" }} />
              <span>
                I agree to the Addis Kiray <Link to="/trust-safety" style={{ color: "#0b8879", fontWeight: 700, textDecoration: "none" }}>Terms of Service</Link> and{" "}
                <Link to="/trust-safety" style={{ color: "#0b8879", fontWeight: 700, textDecoration: "none" }}>Privacy Policy</Link>.
              </span>
            </label>
          </div>

          <button className="auth-primary" type="submit" disabled={loading} style={{ width: "100%", padding: "12px", fontSize: "14px" }}>
            {loading ? "Creating Account..." : "Create Account"}
          </button>

          <div className="auth-divider" style={{ margin: "20px 0", textAlign: "center" }}>
            <span style={{ background: "#ffffff", padding: "0 12px", color: "#8a9fb0", fontSize: "12px" }}>or sign up with</span>
          </div>

          <button
            className="google"
            type="button"
            onClick={handleGoogleSignUp}
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
            <span>Sign Up with Google</span>
          </button>

          <p className="login-bottom" style={{ textAlign: "center", marginTop: "24px", fontSize: "13px", color: "#5f758a" }}>
            Already have an account? <Link to="/login" style={{ color: "#0b8879", fontWeight: 700, textDecoration: "none" }}>Sign In</Link>
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
