import { useState } from "react";
import { Link } from "react-router";
import Logo from "./components/Logo";

const colors = [
  ["Primary 900", "#0D345B"],
  ["Primary 700", "#135985"],
  ["Primary 500", "#0B8879"],
  ["Primary 100", "#E2F4EF"],
  ["Neutral 900", "#203F59"],
  ["Neutral 500", "#71869A"],
  ["Neutral 100", "#E8EEF1"],
  ["Surface", "#FFFFFF"],
  ["Success", "#36804E"],
  ["Warning", "#AE741E"],
  ["Error", "#B44E4F"],
  ["Info", "#416E9F"],
];

export default function DesignSystem() {
  const [active, setActive] = useState<"All" | "Foundation" | "Components" | "Patterns" | "Accessibility">("All");

  return (
    <main className="ds">
      <aside>
        <Logo to="/" />
        <p>DESIGN SYSTEM / 01</p>
        {["All", "Foundation", "Components", "Patterns", "Accessibility"].map((x) => (
          <button
            key={x}
            onClick={() => setActive(x as any)}
            className={active === x ? "active" : ""}
            type="button"
          >
            {x}
          </button>
        ))}
        <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: "8px" }}>
          <Link to="/prototype" style={{ color: "#087d70", fontSize: "10px", fontWeight: 800, textDecoration: "none" }}>
            ← Prototype Hub (23 Flows)
          </Link>
          <small>v1.0 · Addis Kiray Reference</small>
        </div>
      </aside>

      <section>
        <header>
          <div>
            <p>{active.toUpperCase()}</p>
            <h1>
              A system for clear,
              <br />
              <i>trustworthy choices.</i>
            </h1>
          </div>
          <span>Navy + Mint/Teal Palette · Addis Kiray</span>
        </header>

        <article className="intro">
          <b>Design principles</b>
          <p>
            Clear by default. Local in its logic. Trust made visible. Every component supports a calm, informed rental decision for people in Addis Ababa.
          </p>
        </article>

        {(active === "All" || active === "Foundation") && (
          <>
            <div className="ds-section">
              <p>COLOR / SEMANTIC TOKENS</p>
              <h2>
                Color builds hierarchy,
                <br />
                not decoration.
              </h2>
              <div className="swatches">
                {colors.map(([x, c]) => (
                  <div
                    key={x}
                    style={{
                      background: c,
                      color: ["#FFFFFF", "#E2F4EF", "#E8EEF1"].includes(c)
                        ? "#183A5C"
                        : "#fff",
                      border: c === "#FFFFFF" ? "1px solid #dce6eb" : "none",
                    }}
                  >
                    <b>{x}</b>
                    <small>{c}</small>
                  </div>
                ))}
              </div>
            </div>

            <div className="ds-section two">
              <div>
                <p>TYPOGRAPHY</p>
                <h2>Manrope + Noto Sans Ethiopic</h2>
                <span className="display">
                  Finding a home
                  <br />
                  <i>should feel simple.</i>
                </span>
                <small>
                  Display / 56 · 800
                  <br />
                  Body / 14 · 400
                  <br />
                  Labels / 10 · 700 (DM Mono)
                </small>
              </div>
              <div>
                <p>SPACING & SHAPE</p>
                <div className="space-tokens">
                  {[4, 8, 12, 16, 24, 32, 48, 64].map((x) => (
                    <span key={x}>
                      <i style={{ width: x * 2 }} />
                      {x}px
                    </span>
                  ))}
                </div>
                <div className="radius">
                  <span>6px</span>
                  <span>10px</span>
                  <span>16px</span>
                  <span>Full</span>
                </div>
              </div>
            </div>
          </>
        )}

        {(active === "All" || active === "Components") && (
          <div className="ds-section">
            <p>COMPONENTS / CORE</p>
            <h2>Built for real rental decisions.</h2>
            <div className="component-showcase">
              <div>
                <b>Buttons</b>
                <section>
                  <button className="primary" type="button">Find a home</button>
                  <button className="secondary" type="button">Explore map</button>
                  <button className="text" type="button">Learn more →</button>
                </section>
              </div>
              <div>
                <b>Badges</b>
                <section>
                  <span className="verify">✓ Property verified</span>
                  <span className="available">● Available now</span>
                  <span className="pending">◷ Under review</span>
                </section>
              </div>
              <div>
                <b>Input & feedback</b>
                <section>
                  <label>
                    Where do you want to live?
                    <input defaultValue="Bole, Addis Ababa" readOnly />
                  </label>
                  <span className="alert">✓ Property saved to favorites.</span>
                </section>
              </div>
            </div>
          </div>
        )}

        {(active === "All" || active === "Patterns") && (
          <div className="ds-section">
            <p>PATTERNS / TRUST · AI · MESSAGING</p>
            <h2>
              Signals work best
              <br />
              when they’re specific.
            </h2>
            <div className="pattern-grid">
              <article>
                <span>✓</span>
                <b>Verification Tiers</b>
                <p>Shows a completed check on identity, phone, or premises — never a false safety guarantee.</p>
              </article>
              <article>
                <span>✦</span>
                <b>Addis AI Smart Search</b>
                <p>Translates natural language descriptions into visible, editable filters with match reasons.</p>
              </article>
              <article>
                <span>↗</span>
                <b>Contextual Messaging</b>
                <p>Keeps conversations directly bound to specific property listings and viewing schedules.</p>
              </article>
            </div>
          </div>
        )}

        {(active === "All" || active === "Accessibility") && (
          <div className="ds-section">
            <p>ACCESSIBILITY & LOCALIZATION</p>
            <h2>Designed for every resident of Addis Ababa.</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginTop: "20px" }}>
              <div style={{ background: "#fff", padding: "20px", borderRadius: "10px", border: "1px solid #dce6eb" }}>
                <b style={{ color: "#10345b", fontSize: "14px", display: "block", marginBottom: "8px" }}>Bilingual Readiness</b>
                <p style={{ margin: 0, color: "#60788c", fontSize: "12px", lineHeight: 1.6 }}>
                  Full typographical support for Amharic script (አማርኛ) via Noto Sans Ethiopic paired with English Manrope UI text.
                </p>
              </div>
              <div style={{ background: "#fff", padding: "20px", borderRadius: "10px", border: "1px solid #dce6eb" }}>
                <b style={{ color: "#10345b", fontSize: "14px", display: "block", marginBottom: "8px" }}>Mobile-First Touch Targets</b>
                <p style={{ margin: 0, color: "#60788c", fontSize: "12px", lineHeight: 1.6 }}>
                  Minimum 44px tap targets for mobile browsers across budget smartphones common in Ethiopia.
                </p>
              </div>
            </div>
          </div>
        )}

        <footer>
          Responsive by default · Keyboard-visible focus · 44px touch targets · English / አማርኛ ready
        </footer>
      </section>
    </main>
  );
}
