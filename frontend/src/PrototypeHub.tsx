import { Link } from "react-router";
import Logo from "./components/Logo";

const flows = [
  [
    "01",
    "Public Landing & Search Journey",
    "Landing Page → Search Results → Interactive Map → Property Details → Save / Viewing",
    ["/", "/search", "/property/sunlit-2bed", "/messages"],
  ],
  [
    "02",
    "Addis AI Rental Discovery",
    "Natural Language Prompt → Extracted Filters → Ranked Matches → Direct Inquire",
    ["/ai", "/search", "/property/sunlit-2bed"],
  ],
  [
    "03",
    "Landlord Listing Journey (9 Steps)",
    "Property Info → Location → Photos → Amenities → Terms → AI Description → Verification → Publish",
    ["/landlord/listing", "/property/sunlit-2bed"],
  ],
  [
    "04",
    "Admin Moderation & Health Journey",
    "Admin Dashboard → Property Review Queue → Verification Requests → Analytics",
    ["/admin"],
  ],
  [
    "05",
    "Trust, Safety & Fraud Reporting",
    "Trust & Safety Hub → Safety Guide → Report Concern Modal → Confirmation",
    ["/trust-safety"],
  ],
  [
    "06",
    "Authentication & Onboarding",
    "Sign Up → Sign In → Email Verification → Tenant Dashboard",
    ["/register", "/login", "/auth/verify-email", "/tenant"],
  ],
  [
    "07",
    "Contextual Messaging & Viewing",
    "Property Context Strip → Landlord Chat → Viewing Appointment Request",
    ["/messages", "/property/sunlit-2bed"],
  ],
  [
    "08",
    "Tenant Dashboard & Match Engine",
    "Personalized Matches → Saved Homes → Side-by-Side Comparison → Move Plan",
    ["/tenant", "/search"],
  ],
];

export default function PrototypeHub() {
  return (
    <main className="prototype">
      <header>
        <Logo to="/" />
        <span>23 Interactive Product Flows • Addis Kiray</span>
        <div style={{ display: "flex", gap: "16px" }}>
          <Link to="/">Homepage →</Link>
          <Link to="/design-system">Design system →</Link>
        </div>
      </header>
      <section>
        <div className="proto-hero">
          <p>CONNECTED PRODUCT FLOWS</p>
          <h1>
            Walk through the
            <br />
            <i>real rental journey.</i>
          </h1>
          <span>
            Interactive pathways connecting all Addis Kiray screens — from tenant search and AI matching to landlord publishing and admin moderation.
          </span>
        </div>
        <div className="proto-grid">
          {flows.map(([n, title, desc, links]) => (
            <article key={n as string}>
              <b>{n}</b>
              <div>
                <h2>{title}</h2>
                <p>{desc}</p>
                <nav>
                  {(links as string[]).map((x, i) => (
                    <Link to={x} key={i}>
                      {["Start flow", "Next step", "View details", "Finish"][i] ||
                        "Open"}{" "}
                      →
                    </Link>
                  ))}
                </nav>
              </div>
            </article>
          ))}
        </div>
        <div className="proto-note">
          <b>Interactive Prototype Rules</b>
          <span>
            All buttons and links connect to real screens across Addis Kiray. UI states and filters update interactively in memory.
          </span>
        </div>
      </section>
    </main>
  );
}
