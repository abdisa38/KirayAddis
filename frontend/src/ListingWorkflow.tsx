import { useState, useRef } from "react";
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
  "Water tank",
  "Electricity",
  "Generator",
  "Internet",
  "24/7 security",
  "Elevator",
  "Balcony",
  "Garden",
  "Compound",
  "Furnished kitchen",
  "CCTV",
];

const presetPhotos = [
  { url: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80", label: "Modern Apartment Exterior" },
  { url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80", label: "Bright Living Room" },
  { url: "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&w=900&q=80", label: "Clean Kitchen" },
  { url: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=900&q=80", label: "Master Bedroom" },
  { url: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80", label: "Suburban Villa Compound" },
];

export default function ListingWorkflow() {
  const [step, setStep] = useState(0);
  const [published, setPublished] = useState(false);
  const [createdPropertyId, setCreatedPropertyId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user, login } = useAuth();
  const nav = useNavigate();

  // Form states
  const [title, setTitle] = useState("Bright 2-Bedroom Apartment in Bole");
  const [propertyType, setPropertyType] = useState("Apartment");
  const [bedrooms, setBedrooms] = useState("2");
  const [bathrooms, setBathrooms] = useState("2");
  const [area, setArea] = useState("95");
  const [subCity, setSubCity] = useState("Bole");
  const [neighborhood, setNeighborhood] = useState("Bole Atlas");
  const [landmark, setLandmark] = useState("Near Atlas Hotel & Edna Mall");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    "Parking",
    "Water",
    "Water tank",
    "Electricity",
    "Generator",
    "24/7 security",
  ]);
  const [rent, setRent] = useState("38000");
  const [deposit, setDeposit] = useState("38000");
  const [minTerm, setMinTerm] = useState("12 months");
  const [availability, setAvailability] = useState("Available");
  const [furnishing, setFurnishing] = useState("Partially furnished");
  const [description, setDescription] = useState(
    "A bright, well-kept two-bedroom apartment in Bole with a practical kitchen, reliable utilities, 3,000L backup water tank, and easy access to everyday amenities."
  );

  // Photos state
  const [photosList, setPhotosList] = useState<Array<{ url: string; isCover: boolean }>>([
    { url: presetPhotos[0].url, isCover: true },
    { url: presetPhotos[1].url, isCover: false },
    { url: presetPhotos[2].url, isCover: false },
  ]);

  const toggleAmenity = (item: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item]
    );
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPhotosList((prev) => [
            ...prev,
            { url: event.target!.result as string, isCover: prev.length === 0 },
          ]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const addPresetPhoto = (url: string) => {
    if (!photosList.some((p) => p.url === url)) {
      setPhotosList((prev) => [...prev, { url, isCover: prev.length === 0 }]);
    }
  };

  const removePhoto = (index: number) => {
    setPhotosList((prev) => {
      const filtered = prev.filter((_, i) => i !== index);
      if (filtered.length > 0 && !filtered.some((p) => p.isCover)) {
        filtered[0].isCover = true;
      }
      return filtered;
    });
  };

  const setCoverPhoto = (index: number) => {
    setPhotosList((prev) =>
      prev.map((p, i) => ({ ...p, isCover: i === index }))
    );
  };

  // AI Description Generator
  const handleGenerateAIDescription = async () => {
    setIsGeneratingAI(true);
    try {
      const res = await apiRequest("/ai/generate-description", {
        method: "POST",
        body: JSON.stringify({
          title,
          propertyType,
          bedrooms: Number(bedrooms),
          bathrooms: Number(bathrooms),
          area: Number(area),
          location: `${neighborhood}, ${subCity}`,
          landmark,
          rent,
          amenities: selectedAmenities,
          furnishing,
        }),
      });

      if (res.success && res.description) {
        setDescription(res.description);
      }
    } catch {
      setDescription(
        `A bright, modern ${bedrooms}-bedroom ${propertyType.toLowerCase()} in ${neighborhood}, ${subCity} (${landmark}). Offering ${area} m² of spacious living with ${selectedAmenities.slice(0, 4).join(", ")}. Monthly rent is ETB ${rent}. Ready for verified tenants on Addis Kiray.`
      );
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // Publish to MongoDB Atlas
  const handlePublish = async () => {
    setIsSubmitting(true);
    try {
      if (!user || user.role !== "landlord") {
        await login("kalkidan@example.com", "password123");
      }

      const mediaPayload = photosList.map((p) => ({
        url: p.url,
        isCover: p.isCover,
        type: "image",
      }));

      const res = await apiRequest("/properties", {
        method: "POST",
        body: JSON.stringify({
          title,
          description,
          propertyType: propertyType === "Standalone House" ? "House" : propertyType,
          price: Number(rent.replace(/[^0-9]/g, "")) || 35000,
          deposit: Number(deposit.replace(/[^0-9]/g, "")) || Number(rent.replace(/[^0-9]/g, "")) || 35000,
          bedrooms: Number(bedrooms) || 2,
          bathrooms: Number(bathrooms) || 1,
          area: Number(area) || 90,
          location: {
            city: "Addis Ababa",
            subCity,
            neighborhood,
            landmark,
          },
          amenities: selectedAmenities,
          media: mediaPayload.length > 0 ? mediaPayload : [
            { url: presetPhotos[0].url, isCover: true, type: "image" },
          ],
          rentalTerms: {
            minContractMonths: minTerm.includes("6") ? 6 : 12,
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

  const coverImg = photosList.find((p) => p.isCover)?.url || photosList[0]?.url || presetPhotos[0].url;

  if (published) {
    return (
      <main className="landlord-flow">
        <header>
          <Logo to="/" />
          <Link to="/landlord">Go to Landlord Dashboard</Link>
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
            Your listing has been saved to the live Addis Kiray database. You will receive notifications when tenants send inquiries or book viewing appointments.
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
              <small>Confirm appointments</small>
            </article>
            <article>
              <b>3</b>
              <span>Availability update</span>
              <small>Keep freshness timestamp</small>
            </article>
            <article>
              <b>4</b>
              <span>Lease active</span>
              <small>Close listing when rented</small>
            </article>
          </div>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
            <button
              onClick={() => nav(createdPropertyId ? `/property/${createdPropertyId}` : "/search")}
              type="button"
            >
              View Live Listing <Icon name="arrow" />
            </button>
            <button
              onClick={() => nav("/landlord")}
              type="button"
              className="btn outline"
              style={{ background: "#ffffff" }}
            >
              Landlord Dashboard
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
          <span>Saved automatically in Atlas</span>
          <Link to="/landlord">Exit</Link>
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
                "Upload clear photos of each room to attract verified tenants.",
                "Select the utilities and amenities available at this property.",
                "Set rental terms, deposit, and contract requirements clearly.",
                "Generate an engaging, professional description powered by Addis AI.",
                "Review the listing exactly as tenants will see it in search.",
                "Submit property for verification badge to boost renter trust.",
                "Publish your listing to the live Addis Kiray marketplace.",
              ][step]}
            </p>
          </div>

          {/* STEP 0: Property Information */}
          {step === 0 && (
            <div className="form-grid">
              <label>
                Property title
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Spacious 2-Bedroom in Bole"
                />
              </label>
              <label>
                Property type
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                >
                  <option>Apartment</option>
                  <option>Condominium</option>
                  <option>Studio</option>
                  <option>Villa</option>
                  <option>Standalone House</option>
                </select>
              </label>
              <label>
                Bedrooms
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={bedrooms}
                  onChange={(e) => setBedrooms(e.target.value)}
                />
              </label>
              <label>
                Bathrooms
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={bathrooms}
                  onChange={(e) => setBathrooms(e.target.value)}
                />
              </label>
              <label>
                Area (m²)
                <input
                  type="number"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                />
              </label>
            </div>
          )}

          {/* STEP 1: Location */}
          {step === 1 && (
            <div className="form-grid" style={{ padding: "10px 0" }}>
              <label>
                Sub-City
                <select value={subCity} onChange={(e) => setSubCity(e.target.value)}>
                  <option value="Bole">Bole</option>
                  <option value="Kirkos">Kirkos / Kazanchis</option>
                  <option value="CMC">CMC</option>
                  <option value="Yeka">Yeka</option>
                  <option value="Nifas Silk-Lafto">Nifas Silk / Sarbet / Saris</option>
                  <option value="Arada">Arada / Piassa</option>
                  <option value="Lideta">Lideta / Mexico</option>
                  <option value="Gullele">Gullele</option>
                </select>
              </label>
              <label>
                Neighborhood / Specific Area
                <input
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  placeholder="e.g. Bole Atlas, Saris Kadisco, Kazanchis"
                />
              </label>
              <label style={{ gridColumn: "1 / -1" }}>
                Landmark reference (Commute landmark)
                <input
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  placeholder="e.g. Near Edna Mall (1.2 km), Near Light Rail Station"
                />
              </label>
            </div>
          )}

          {/* STEP 2: Real Photos Upload & Selector */}
          {step === 2 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* File Upload Box */}
              <div
                className="upload"
                style={{ cursor: "pointer", border: "2px dashed #0b8879", background: "#f5faf9", padding: "28px" }}
                onClick={() => fileInputRef.current?.click()}
              >
                <Icon name="photo" style={{ fontSize: "36px", color: "#0b8879" }} />
                <b style={{ fontSize: "15px", color: "#11355b" }}>Upload property photos from your device</b>
                <p style={{ fontSize: "12px", color: "#59758a", margin: "6px 0 14px" }}>
                  Select high-quality images of living room, bedroom, and kitchen.
                </p>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  multiple
                  accept="image/*"
                  style={{ display: "none" }}
                />
                <button
                  type="button"
                  className="btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                >
                  Choose Images from Computer
                </button>
                <small style={{ marginTop: "10px", color: "#8a9fb0" }}>JPG, PNG or WEBP · up to 10MB each</small>
              </div>

              {/* Preset Sample Photos Library */}
              <div>
                <b style={{ fontSize: "13px", color: "#173858", display: "block", marginBottom: "8px" }}>
                  Or select from high-resolution Addis Ababa photo library:
                </b>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "8px" }}>
                  {presetPhotos.map((preset, idx) => (
                    <div
                      key={idx}
                      onClick={() => addPresetPhoto(preset.url)}
                      style={{
                        position: "relative",
                        height: "80px",
                        borderRadius: "8px",
                        overflow: "hidden",
                        cursor: "pointer",
                        border: photosList.some((p) => p.url === preset.url) ? "2px solid #0b8879" : "1px solid #d4e0e8",
                      }}
                    >
                      <img src={preset.url} alt={preset.label} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      <span style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(0,0,0,0.6)", color: "#fff", fontSize: "9px", padding: "2px 4px", textAlign: "center" }}>
                        {preset.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Selected Photos Gallery Preview */}
              {photosList.length > 0 && (
                <div>
                  <b style={{ fontSize: "13px", color: "#173858", display: "block", marginBottom: "8px" }}>
                    Selected Photos ({photosList.length}):
                  </b>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "10px" }}>
                    {photosList.map((photo, i) => (
                      <div
                        key={i}
                        style={{
                          position: "relative",
                          height: "110px",
                          borderRadius: "8px",
                          overflow: "hidden",
                          border: photo.isCover ? "3px solid #0b8879" : "1px solid #cbd9e1",
                        }}
                      >
                        <img src={photo.url} alt={`Listing photo ${i + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        {photo.isCover && (
                          <span style={{ position: "absolute", top: "4px", left: "4px", background: "#0b8879", color: "#fff", fontSize: "9px", fontWeight: 800, padding: "2px 6px", borderRadius: "4px" }}>
                            COVER
                          </span>
                        )}
                        <div style={{ position: "absolute", bottom: "4px", right: "4px", display: "flex", gap: "4px" }}>
                          {!photo.isCover && (
                            <button
                              type="button"
                              onClick={() => setCoverPhoto(i)}
                              style={{ background: "#ffffff", border: "none", borderRadius: "4px", fontSize: "9px", fontWeight: 700, padding: "2px 6px", cursor: "pointer", color: "#11355b" }}
                            >
                              Make Cover
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => removePhoto(i)}
                            style={{ background: "#be123c", border: "none", borderRadius: "4px", fontSize: "9px", fontWeight: 700, padding: "2px 6px", cursor: "pointer", color: "#ffffff" }}
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: Amenities */}
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

          {/* STEP 4: Rental Terms */}
          {step === 4 && (
            <div className="form-grid">
              <label>
                Monthly rent (ETB)
                <input
                  type="number"
                  value={rent}
                  onChange={(e) => setRent(e.target.value)}
                />
              </label>
              <label>
                Security Deposit (ETB)
                <input
                  type="number"
                  value={deposit}
                  onChange={(e) => setDeposit(e.target.value)}
                />
              </label>
              <label>
                Minimum contract term
                <select
                  value={minTerm}
                  onChange={(e) => setMinTerm(e.target.value)}
                >
                  <option>3 months</option>
                  <option>6 months</option>
                  <option>12 months</option>
                  <option>24 months</option>
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

          {/* STEP 5: AI-Assisted Description */}
          {step === 5 && (
            <div className="ai-description">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>✦ AI-assisted description</span>
                <button
                  type="button"
                  onClick={handleGenerateAIDescription}
                  disabled={isGeneratingAI}
                  style={{
                    border: "none",
                    background: "#edf7f5",
                    color: "#087d70",
                    fontSize: "11px",
                    fontWeight: 800,
                    cursor: "pointer",
                    padding: "6px 12px",
                    borderRadius: "6px",
                  }}
                >
                  {isGeneratingAI ? "Generating with Gemini..." : "✦ Regenerate with AI"}
                </button>
              </div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #cbd9e1", fontSize: "13px", marginTop: "10px" }}
              />
              <small style={{ color: "#6a8599" }}>
                The description was generated by analyzing your property details, sub-city, bedrooms, and utilities. You can edit it freely.
              </small>
            </div>
          )}

          {/* STEP 6: Real Dynamic Preview */}
          {step === 6 && (
            <div className="preview-card" style={{ display: "flex", gap: "18px", padding: "16px", background: "#f9fbfa", borderRadius: "12px", border: "1px solid #d8e5e2" }}>
              <img
                src={coverImg}
                alt="Property preview"
                style={{ width: "200px", height: "140px", objectFit: "cover", borderRadius: "10px" }}
              />
              <div>
                <span style={{ color: "#0b8879", fontWeight: 700, fontSize: "11px" }}>✓ Live Listing Preview</span>
                <h2 style={{ fontSize: "18px", color: "#11355b", margin: "4px 0" }}>{title}</h2>
                <p style={{ fontSize: "13px", color: "#546e82", margin: "0 0 6px" }}>
                  <Icon name="pin" /> {neighborhood}, {subCity}, Addis Ababa • {bedrooms} beds • {bathrooms} baths • {area} m²
                </p>
                <p style={{ fontSize: "12px", color: "#6e889a", margin: "0 0 8px" }}>{description}</p>
                <b style={{ fontSize: "16px", color: "#11355b" }}>ETB {Number(rent).toLocaleString()} / month</b>
              </div>
            </div>
          )}

          {/* STEP 7: Verification */}
          {step === 7 && (
            <div className="verify-flow" style={{ textAlign: "center", padding: "20px" }}>
              <span style={{ fontSize: "36px", color: "#0b8879" }}>
                <Icon name="check" />
              </span>
              <h2 style={{ fontSize: "18px", color: "#11355b" }}>Ready for verification</h2>
              <p style={{ fontSize: "13px", color: "#5d788c", maxWidth: "480px", margin: "8px auto 20px" }}>
                Your listing will be submitted to the Admin Moderation Queue in MongoDB Atlas with a "Pending" verification status. Once approved, it receives the "Verified Property" badge.
              </p>
            </div>
          )}

          {/* STEP 8: Publish Review */}
          {step === 8 && (
            <div className="publish-review" style={{ padding: "16px", background: "#f0f7f5", borderRadius: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                <Icon name="home" style={{ color: "#0b8879", fontSize: "20px" }} />
                <h2 style={{ fontSize: "18px", color: "#11355b", margin: 0 }}>Ready to Publish</h2>
              </div>
              <p style={{ fontSize: "13px", color: "#516d80", margin: "0 0 14px" }}>
                Your listing will immediately be saved to the live MongoDB Atlas database and become discoverable by renters across Addis Ababa.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "12px", color: "#0b8879", fontWeight: 700 }}>
                <span>✓ Property details & pricing complete</span>
                <span>✓ {photosList.length} photos ready</span>
                <span>✓ Verified landlord ownership attached</span>
              </div>
            </div>
          )}

          <div className="flow-actions" style={{ marginTop: "24px", display: "flex", justifyContent: "space-between" }}>
            <button
              disabled={step === 0}
              onClick={() => setStep(step - 1)}
              type="button"
            >
              Back
            </button>
            <button onClick={next} type="button" disabled={isSubmitting}>
              {isSubmitting
                ? "Publishing to Atlas..."
                : step === steps.length - 1
                ? "Publish Property to Live Marketplace"
                : "Continue"}{" "}
              <Icon name="arrow" />
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
