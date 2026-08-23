import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import Logo from "./components/Logo";
import Icon from "./components/Icon";

export default function EmailVerification() {
  const [seconds, setSeconds] = useState(45);
  const [state, setState] = useState<"pending" | "sent" | "verified" | "expired">("pending");
  const nav = useNavigate();

  useEffect(() => {
    if (seconds <= 0) return;
    const timer = setInterval(() => setSeconds((x) => x - 1), 1000);
    return () => clearInterval(timer);
  }, [seconds]);

  const resend = () => {
    setSeconds(45);
    setState("sent");
  };

  return (
    <main className="auth-page">
      <section className="auth-visual">
        <Logo to="/" />
        <div className="auth-map">
          <div className="auth-grid" />
          <span className="visual-pin one">⌂</span>
          <span className="visual-pin two">⌂</span>
          <span className="visual-label l1">Bole</span>
          <span className="visual-label l2">Kazanchis</span>
          <div className="visual-card">
            <Icon name="check" />
            <b>One more step</b>
            <span>
              Verify your email to begin saving homes, contacting landlords, and scheduling viewings.
            </span>
          </div>
        </div>
        <div className="auth-caption">
          <p>ADDIS KIRAY / ACCOUNT SETUP</p>
          <h1>
            A place for
            <br />
            <i>every next step.</i>
          </h1>
        </div>
      </section>

      <section className="auth-panel">
        <div className="auth-mobile-logo">
          <Logo to="/" />
        </div>
        <div className="auth-form">
          <Link to="/" className="back">
            <Icon name="arrow" /> Back to Addis Kiray
          </Link>
          {state === "verified" ? (
            <>
              <div className="auth-icon success">
                <Icon name="check" />
              </div>
              <p className="auth-kicker">EMAIL VERIFIED</p>
              <h2>You’re all set.</h2>
              <p className="auth-copy">
                Your account is verified. You can now access tenant features, save homes, and request viewings.
              </p>
              <button
                type="button"
                onClick={() => nav("/tenant")}
                className="auth-primary"
              >
                Continue to Tenant Home <span>→</span>
              </button>
            </>
          ) : state === "expired" ? (
            <>
              <div className="auth-icon warning">
                <Icon name="mail" />
              </div>
              <p className="auth-kicker">LINK EXPIRED</p>
              <h2>This verification link has expired.</h2>
              <p className="auth-copy">
                Verification links are time-limited to help protect your account. We can send a fresh one to your inbox.
              </p>
              <button className="auth-primary" onClick={resend} type="button">
                Send a new link <Icon name="refresh" />
              </button>
            </>
          ) : (
            <>
              <div className="auth-icon">
                <Icon name="mail" />
              </div>
              <p className="auth-kicker">VERIFY YOUR EMAIL</p>
              <h2>Check your inbox</h2>
              <p className="auth-copy">
                We’ve sent a verification link to your registered email address.
              </p>
              <div className="email-chip">
                <span>alem••••@gmail.com</span>
                <button
                  type="button"
                  onClick={() => navigator.clipboard?.writeText("alem.mengistu@gmail.com")}
                  aria-label="Copy email"
                >
                  <Icon name="copy" />
                </button>
              </div>
              <button
                className="auth-primary"
                onClick={() => setState("verified")}
                type="button"
              >
                Confirm Verification <span>↗</span>
              </button>
              <div className="auth-divider">
                <span>or</span>
              </div>
              {seconds > 0 ? (
                <p className="resend-wait">
                  Resend in <b>{seconds}s</b>
                </p>
              ) : (
                <button className="resend" onClick={resend} type="button">
                  <Icon name="refresh" /> Resend verification email
                </button>
              )}
              {state === "sent" && (
                <p className="sent">
                  <Icon name="check" /> A new verification email has been sent.
                </p>
              )}
              <Link to="/register" className="change-email" style={{ display: "block", textAlign: "center" }}>
                Change email address
              </Link>
              <div className="auth-test">
                <span>Demo shortcuts:</span>
                <button onClick={() => setState("verified")} type="button">
                  Simulate Verified
                </button>
                <button onClick={() => setState("expired")} type="button">
                  Simulate Expired
                </button>
              </div>
            </>
          )}
          <p className="auth-help">
            Didn’t receive it? Check your spam folder or{" "}
            <button onClick={resend} type="button">
              resend the email
            </button>
            .
          </p>
        </div>
        <div className="auth-footer">
          <span>© Addis Kiray</span>
          <span>English / አማርኛ</span>
          <Link to="/trust-safety">Privacy</Link>
          <Link to="/trust-safety">Help</Link>
        </div>
      </section>
    </main>
  );
}
