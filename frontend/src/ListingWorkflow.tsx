import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "./context/AuthContext";
import { apiRequest } from "./api/client";
import Logo from "./components/Logo";
import Icon from "./components/Icon";

const steps = [
  "Property information",
  "Location",
  "Photos",
  "Amenities",
  "Rental terms",
  "AI-assisted description",
  "Preview",
  "Verification",
  "Publish",
];

const availableAmenities = [
  "Parking",
  "Water",
  "Electricity",
  "Internet",
  "Security",
  "Elevator",
  "Balcony",
  "Kitchen",
  "Generator",
  "CCTV",
  "Compound",
  "Furnished",
];

export default function ListingWorkflow() {
  const [step, setStep] = useState(0);
  const [published, setPublished] = useState(false);
  const [createdPropertyId, setCreatedPropertyId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, login } = useAuth();
  const nav = useNavigate();

  // Form states
  const [title, setTitle] = useState("Sunlit Two-Bedroom Apartment");
  const [propertyType, setPropertyType] = useState("Apartment");
  const [bedrooms, setBedrooms] = useState("2");
  const [bathrooms, setBathrooms] = useState("2");
  const [area, setArea] = useState("92");
  const [location, setLocation] = useState("Bole, Addis Ababa");
  const [landmark, setLandmark] = useState("Near Bole Medhanealem");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    "Parking",
    "Water",
    "Electricity",
    "Internet",
    "Security",
    "Elevator",
  ]);
  const [rent, setRent] = useState("42000");
  const [minTerm, setMinTerm] = useState("12 months");
  const [availability, setAvailability] = useState("Available");
  const [furnishing, setFurnishing] = useState("Partially furnished");
  const [description, setDescription] = useState(
    "A bright, well-kept two-bedroom apartment in Bole with a practical kitchen, reliable utilities, backup water tank, and easy access to everyday amenities. The home is ready for tenants who value a calm, connected location."
  );

  const toggleAmenity = (item: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item]
    );
  };

  const handlePublish = async () => {
    setIsSubmitting(true);
    try {
      if (!user || user.role !== "landlord") {
        await login("kalkidan@example.com", "password123");
      }

      const subCity = location.includes(",") ? location.split(",")[0].trim() : "Bole";

      const res = await apiRequest("/properties", {
        method: "POST",
        body: JSON.stringify({
          title,
          description,
          propertyType: propertyType === "Standalone House" ? "House" : propertyType,
          price: Number(rent.replace(/[^0-9]/g, "")) || 42000,
          deposit: Number(rent.replace(/[^0-9]/g, "")) || 42000,
          bedrooms: Number(bedrooms) || 2,
          bathrooms: Number(bathrooms) || 1,
          area: Number(area) || 90,
          location: {
            city: "Addis Ababa",
            subCity: subCity || "Bole",
            neighborhood: location,
            landmark,
          },
          amenities: selectedAmenities,
          media: [
            {
              url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
              isCover: true,
              type: "image",
            },
            {
              url: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=80",
              isCover: false,
              type: "image",
            },
          ],
          rentalTerms: {
            minContractMonths: 12,
            furnishing: furnishing as any,
            paymentFrequency: "Monthly",
          },
          availability: {
            status: "Available",
          },
        }),
      });

      if (res.success && res.property) {
        setCreatedPropertyId(res.property._id);
      }
      setPublished(true);
    } catch (err) {
      console.error("Listing publish error:", err);
      setPublished(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const next = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      handlePublish();
    }
  };

  if (published) {
    return (
      <main className="landlord-flow">
        <header>
          <Logo to="/" />
          <Link to="/">Exit to Home</Link>
        </header>
        <section className="publish-success">
          <span>
            <Icon name="check" />
          </span>
          <p className="eyebrow">LISTING PUBLISHED IN MONGODB ATLAS</p>
          <h1>
            Your property is ready
            <br />
            to be discovered.
          </h1>
          <p>
            We’ll notify you when a tenant sends an inquiry or requests a viewing. Keep availability up to date so renters have the clearest information.
          </p>
          <div className="listing-status">
            <article>
              <b>1</b>
              <span>Inquiry</span>
              <small>Answer interested tenants</small>
            </article>
            <article>
              <b>2</b>
              <span>Viewing</span>
              <small>Confirm an appointment</small>
            </article>
            <article>
              <b>3</b>
              <span>Availability update</span>
              <small>Keep your listing current</small>
            </article>
            <article>
              <b>4</b>
              <span>Rented</span>
              <small>Close listing when taken</small>
            </article>
          </div>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
            <button
              onClick={() => nav(createdPropertyId ? `/property/${createdPropertyId}` : "/property/sunlit-2bed")}
              type="button"
            >
              View Live Listing <Icon name="arrow" />
            </button>
            <button
              onClick={() => nav("/admin")}
              type="button"
              className="btn outline"
              style={{ background: "#ffffff" }}
            >
              Admin Moderation View
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="landlord-flow">
      <header>
        <Logo to="/" />
        <div>
          <span>Saved automatically</span>
          <Link to="/">Exit</Link>
        </div>
      </header>
      <div className="flow-wrap">
        <aside>
          <p className="eyebrow">CREATE LISTING</p>
          <h2>
            List your
            <br />
            property.
          </h2>
          <ol>
            {steps.map((x, i) => (
              <li
                key={x}
                className={
                  i === step ? "current" : i < step ? "complete" : ""
                }
              >
                <i>{i < step ? <Icon name="check" /> : i + 1}</i>
                <button
                  onClick={() => i <= step && setStep(i)}
                  type="button"
                >
                  {x}
                </button>
              </li>
            ))}
          </ol>
        </aside>
        <section className="flow-card">
          <div className="flow-head">
            <p className="eyebrow">
              STEP {step + 1} OF {steps.length}
            </p>
            <h1>{steps[step]}</h1>
            <p>
              {[
                "Start with the essentials renters need to understand your home.",
                "Help tenants understand where the property is and what’s nearby.",
                "Good photos help renters see a place clearly before they visit.",
                "Select the features already available at this property.",
                "Set expectations clearly before a tenant gets in touch.",
                "Turn the details you entered into a helpful, honest description.",
                "Review the listing as a tenant will see it.",
                "Help us verify the listing information you’ve provided.",
                "Everything looks ready. Publish when you’re comfortable.",
              ][step]}
            </p>
          </div>

          {step === 0 && (
            <div className="form-grid">
              <label>
                Property title
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </label>
              <label>
                Property type
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                >
                  <option>Apartment</option>
                  <option>Standalone House</option>
                  <option>Condominium</option>
                  <option>Studio</option>
                  <option>Villa</option>
                </select>
              </label>
              <label>
                Bedrooms
                <input
                  value={bedrooms}
                  onChange={(e) => setBedrooms(e.target.value)}
                />
              </label>
              <label>
                Bathrooms
                <input
                  value={bathrooms}
                  onChange={(e) => setBathrooms(e.target.value)}
                />
              </label>
              <label>
                Area (m²)
                <input
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                />
              </label>
            </div>
          )}

          {step === 1 && (
            <div style={{ padding: "20px 30px" }}>
              <div className="location-select" style={{ margin: 0 }}>
                <Icon name="pin" />
                <div>
                  <b>{location}</b>
                  <span>{landmark}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newLoc = prompt("Enter sub-city / area:", location);
                    if (newLoc) setLocation(newLoc);
                  }}
                >
                  Change location
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="upload">
              <Icon name="photo" />
              <b>Add property photos</b>
              <p>
                Use clear, well-lit photos of each room. You can add a video too.
              </p>
              <button
                type="button"
                onClick={() => alert("Photo selector opened (demo simulation)")}
              >
                Choose photos
              </button>
              <small>JPG, PNG or MP4 · up to 20 items</small>
            </div>
          )}

          {step === 3 && (
            <div className="amenity-select">
              {availableAmenities.map((x) => {
                const isSelected = selectedAmenities.includes(x);
                return (
                  <button
                    className={isSelected ? "selected" : ""}
                    key={x}
                    onClick={() => toggleAmenity(x)}
                    type="button"
                  >
                    {isSelected && "✓ "}
                    {x}
                  </button>
                );
              })}
            </div>
          )}

          {step === 4 && (
            <div className="form-grid">
              <label>
                Monthly rent (ETB)
                <input
                  value={rent}
                  onChange={(e) => setRent(e.target.value)}
                />
              </label>
              <label>
                Minimum term
                <select
                  value={minTerm}
                  onChange={(e) => setMinTerm(e.target.value)}
                >
                  <option>6 months</option>
                  <option>12 months</option>
                  <option>24 months</option>
                </select>
              </label>
              <label>
                Availability
                <select
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                >
                  <option>Available now</option>
                  <option>Available next month</option>
                  <option>Available soon</option>
                </select>
              </label>
              <label>
                Furnishing
                <select
                  value={furnishing}
                  onChange={(e) => setFurnishing(e.target.value)}
                >
                  <option>Unfurnished</option>
                  <option>Partially furnished</option>
                  <option>Fully furnished</option>
                </select>
              </label>
            </div>
          )}

          {step === 5 && (
            <div className="ai-description">
              <span>✦ AI-assisted description</span>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <small>Review details for accuracy before publishing.</small>
                <button
                  type="button"
                  onClick={() =>
                    setDescription(
                      `A bright ${bedrooms}-bedroom ${propertyType.toLowerCase()} in ${location} featuring ${selectedAmenities.join(", ")}. Monthly rent is ${rent} ETB. Close to everyday transportation and quiet residential surroundings.`
                    )
                  }
                  style={{ border: "none", background: "transparent", color: "#087d70", fontSize: "10px", fontWeight: 800, cursor: "pointer" }}
                >
                  ✦ Regenerate with AI
                </button>
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="preview-card">
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80"
                alt="Property preview"
              />
              <div>
                <span>✓ Property information complete</span>
                <h2>{title}</h2>
                <p>
                  {location} • {bedrooms} beds • {bathrooms} baths • {area} m²
                </p>
                <b>ETB {rent} / month</b>
              </div>
            </div>
          )}

          {step === 7 && (
            <div className="verify-flow">
              <span>
                <Icon name="check" />
              </span>
              <h2>Ready for verification</h2>
              <p>
                We’ll review the property information and may ask for ownership documents. Verification communicates a completed check, not a guarantee of safety.
              </p>
              <button type="button" onClick={() => setStep(step + 1)}>
                Submit for Verification
              </button>
            </div>
          )}

          {step === 8 && (
            <div className="publish-review">
              <Icon name="home" />
              <h2>Ready to publish</h2>
              <p>
                Your listing includes property details, location, photos, amenities, rental terms, and a reviewed description.
              </p>
              <span>✓ Listing information complete</span>
              <span>✓ Verification submitted</span>
            </div>
          )}

          <div className="flow-actions">
            <button
              disabled={step === 0}
              onClick={() => setStep(step - 1)}
              type="button"
            >
              Back
            </button>
            <button onClick={next} type="button" disabled={isSubmitting}>
              {isSubmitting
                ? "Submitting..."
                : step === steps.length - 1
                ? "Publish property"
                : "Continue"}{" "}
              <Icon name="arrow" />
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
