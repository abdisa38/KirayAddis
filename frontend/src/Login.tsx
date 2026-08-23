import { useState } from "react";
import { Link, useNavigate } from "react-router";
import Logo from "./components/Logo";
import Icon from "./components/Icon";

export default function Login() {
  const [pw, setPw] = useState(false);
  const [error, setError] = useState(false);
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    nav("/tenant");
  };

  return (
    <main className="login-page">
      <div className="login-panel">
        <Logo />
        <form onSubmit={handleLogin}>
          <p className="auth-kicker">WELCOME BACK</p>
          <h1>Sign in to Addis Kiray</h1>
          <p>Continue your home-search journey in Addis Ababa.</p>

          <label>
            Email or phone
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
              The email, phone number or password is incorrect.
            </p>
          )}

          <div className="login-options">
            <label>
              <input type="checkbox" defaultChecked /> Remember me
            </label>
            <button type="button" onClick={() => alert("Password reset link will be sent to your email.")}>
              Forgot password?
            </button>
          </div>

          <button className="auth-primary" type="submit">
            Sign In
          </button>

          <div className="auth-divider">
            <span>or</span>
          </div>

          <button className="google" type="button" onClick={() => nav("/tenant")}>
            G <span>Continue with Google</span>
          </button>

          <p className="login-bottom">
            Don’t have an account? <Link to="/register">Create one</Link>
          </p>

          <button
            className="demo-error"
            type="button"
            onClick={() => setError(!error)}
          >
            {error ? "Hide demo error" : "Toggle demo error state"}
          </button>
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
