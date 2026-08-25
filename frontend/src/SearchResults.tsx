import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import Navbar from "./components/Navbar";
import Icon from "./components/Icon";
import { apiRequest } from "./api/client";

interface PropertyItem {
  id: string;
  name: string;
  loc: string;
  price: string;
  rawPrice: number;
  match: string;
  commute: string;
  beds: number;
  baths: number;
  area: string;
  propertyType: string;
  tag?: string;
  img: string;
}

function Card({
  h,
  selected,
  onSelect,
  onOpen,
}: {
  h: PropertyItem;
  selected: boolean;
  onSelect: () => void;
  onOpen: () => void;
}) {
  const [saved, setSaved] = useState(false);

  const toggleSave = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await apiRequest(`/tenant/saved/${h.id}`, { method: "POST" });
      setSaved(!saved);
    } catch {
      setSaved(!saved);
    }
  };

  return (
    <article
      onClick={onSelect}
      onDoubleClick={onOpen}
      className={`card ${selected ? "selected" : ""}`}
      style={{ cursor: "pointer" }}
    >
      <div className="photo">
        <img src={h.img} alt={h.name} />
        {h.tag && (
          <span className="verified">
            <Icon name="check" /> {h.tag}
          </span>
        )}
        <button
          className={saved ? "save saved" : "save"}
          onClick={toggleSave}
          aria-label="Save home"
          type="button"
        >
          <Icon name="heart" />
        </button>
      </div>
      <div className="card-body">
        <div className="card-top">
          <div>
            <h3 onClick={onOpen} style={{ cursor: "pointer" }}>
              {h.name}
            </h3>
            <p>
              <Icon name="pin" />
              {h.loc}
            </p>
          </div>
          <span className="score">
            {h.match}%<small>Match</small>
          </span>
        </div>
        <div className="meta">
          <span>{h.beds} beds</span>
          <span>{h.baths} bath{h.baths > 1 ? "s" : ""}</span>
          <span>{h.area}</span>
          <span>{h.propertyType}</span>
        </div>
        <div className="card-bottom">
          <b>
            ETB {h.price} <em>/ month</em>
          </b>
          <span className="commute">
            <Icon name="car" />
            {h.commute}
          </span>
        </div>
      </div>
    </article>
  );
}

function FilterDrawer({
  close,
  onApply,
  selectedType,
  setSelectedType,
  maxBudget,
  setMaxBudget,
  selectedBeds,
  setSelectedBeds,
}: {
  close: () => void;
  onApply: () => void;
  selectedType: string;
  setSelectedType: (t: string) => void;
  maxBudget: number;
  setMaxBudget: (n: number) => void;
  selectedBeds: string;
  setSelectedBeds: (b: string) => void;
}) {
  const propertyTypes = ["All", "Apartment", "House", "Studio", "Condominium", "Villa"];
  const bedOptions = ["All", "1+", "2+", "3+", "4+"];

  return (
    <aside className="drawer">
      <div className="drawer-head">
        <div>
          <p>FILTERS</p>
          <h2>Refine your search</h2>
        </div>
        <button onClick={close} type="button">
          <Icon name="close" />
        </button>
      </div>
      <section>
        <b>Max Price: ETB {maxBudget.toLocaleString()} / mo</b>
        <input
          type="range"
          min="10000"
          max="120000"
          step="5000"
          value={maxBudget}
          onChange={(e) => setMaxBudget(Number(e.target.value))}
          style={{ width: "100%", accentColor: "#0b8879", margin: "12px 0 6px" }}
        />
        <div className="price-inputs">
          <span>Min <strong>10,000</strong></span>
          <span>Max <strong>{maxBudget.toLocaleString()}</strong></span>
        </div>
      </section>
      <section>
        <b>Property type</b>
        <div className="option-grid">
          {propertyTypes.map((x) => (
            <button
              key={x}
              type="button"
              onClick={() => setSelectedType(x)}
              className={selectedType === x ? "on" : ""}
            >
              {x}
            </button>
          ))}
        </div>
      </section>
      <section>
        <b>Bedrooms</b>
        <div className="option-grid short">
          {bedOptions.map((x) => (
            <button
              key={x}
              type="button"
              onClick={() => setSelectedBeds(x)}
              className={selectedBeds === x ? "on" : ""}
            >
              {x}
            </button>
          ))}
        </div>
      </section>
      <section>
        <b>Verification & Utilities</b>
        <label>
          <input type="checkbox" defaultChecked /> Verified property
        </label>
        <label>
          <input type="checkbox" defaultChecked /> Water tank backup
        </label>
        <label>
          <input type="checkbox" defaultChecked /> Generator backup
        </label>
      </section>
      <div className="drawer-foot">
        <button
          onClick={() => {
            setSelectedType("All");
            setMaxBudget(120000);
            setSelectedBeds("All");
          }}
          type="button"
        >
          Reset
        </button>
        <button onClick={onApply} type="button">
          Apply Filters
        </button>
      </div>
    </aside>
  );
}

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialLoc = searchParams.get("location") || "All";
  const initialMaxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : 120000;
  const initialType = searchParams.get("propertyType") || "All";

  const [drawer, setDrawer] = useState(false);
  const [selected, setSelected] = useState(0);
  const [loading, setLoading] = useState(true);
  const [locationQuery, setLocationQuery] = useState(initialLoc === "All" ? "" : initialLoc);
  const [destinationQuery, setDestinationQuery] = useState(searchParams.get("destination") || "");
  const [propertyType, setPropertyType] = useState(initialType);
  const [maxBudget, setMaxBudget] = useState(initialMaxPrice);
  const [selectedBeds, setSelectedBeds] = useState("All");
  const [homesList, setHomesList] = useState<PropertyItem[]>([]);
  const nav = useNavigate();

  const fetchFilteredProperties = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (locationQuery && locationQuery !== "All") {
        params.set("subCity", locationQuery.split(",")[0].trim());
      }
      if (propertyType && propertyType !== "All") {
        params.set("propertyType", propertyType);
      }
      if (maxBudget && maxBudget < 120000) {
        params.set("maxPrice", maxBudget.toString());
      }
      if (selectedBeds && selectedBeds !== "All") {
        params.set("bedrooms", selectedBeds.replace("+", ""));
      }

      const data = await apiRequest(`/properties?${params.toString()}`);
      if (data.success && data.properties) {
        const mapped: PropertyItem[] = data.properties.map((p: any) => {
          const cover = p.media?.find((m: any) => m.isCover) || p.media?.[0];
          return {
            id: p._id,
            name: p.title,
            loc: `${p.location?.neighborhood || p.location?.subCity}, Addis Ababa`,
            price: Number(p.price).toLocaleString(),
            rawPrice: p.price,
            match: `${p.matchScore || 92}`,
            commute: p.location?.landmark || "20 min to center",
            beds: p.bedrooms,
            baths: p.bathrooms,
            area: `${p.area} m²`,
            propertyType: p.propertyType,
            tag: p.verification?.status === "Approved" ? "Verified" : undefined,
            img: cover?.url || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80",
          };
        });
        setHomesList(mapped);
      } else {
        setHomesList([]);
      }
    } catch {
      setHomesList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilteredProperties();
  }, [locationQuery, propertyType, maxBudget, selectedBeds]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchFilteredProperties();
  };

  const openSelectedProperty = (id?: string) => {
    const targetId = id || homesList[selected]?.id || (homesList[0] ? homesList[0].id : "");
    if (targetId) {
      nav(`/property/${targetId}`);
    }
  };

  const currentSelected = homesList[selected] || homesList[0];

  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#f8faf9" }}>
      <Navbar />

      {/* Structured Search Bar */}
      <section className="search-head">
        <form onSubmit={handleSearchSubmit} className="search-row">
          <div className="search-input">
            <Icon name="search" />
            <div>
              <b>Where do you want to live?</b>
              <input
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                placeholder="Bole, Kazanchis, CMC, Yeka, Sarbet..."
                style={{ border: "none", outline: "none", color: "#254867", fontSize: "12px", background: "transparent", width: "100%" }}
              />
            </div>
          </div>
          <div className="search-input destination">
            <Icon name="pin" />
            <div>
              <b>Workplace / Destination</b>
              <input
                value={destinationQuery}
                onChange={(e) => setDestinationQuery(e.target.value)}
                placeholder="e.g. Edna Mall, UNECA..."
                style={{ border: "none", outline: "none", color: "#254867", fontSize: "12px", background: "transparent", width: "100%" }}
              />
            </div>
          </div>
          <button className="go" type="submit">
            <Icon name="search" /> Search
          </button>
        </form>

        <div className="suggestions">
          <span>Suggestions:</span>
          {["All", "Bole", "Kazanchis", "CMC", "Yeka", "Sarbet", "Piassa", "Mexico", "Gullele"].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setLocationQuery(s === "All" ? "" : s)}
              style={{
                background: locationQuery === s || (s === "All" && !locationQuery) ? "#0d345b" : "#f0f5f7",
                color: locationQuery === s || (s === "All" && !locationQuery) ? "#ffffff" : "#254867",
              }}
            >
              {s}
            </button>
          ))}
          <button className="locate" type="button" onClick={() => setLocationQuery("Bole")}>
            <Icon name="pin" /> Use Bole
          </button>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="filters">
        <div className="filter-scroll">
          <button className="filter active" type="button" onClick={() => setDrawer(true)}>
            Budget: ≤ {maxBudget.toLocaleString()} ETB <b>⌄</b>
          </button>
          <button className="filter active" type="button" onClick={() => setDrawer(true)}>
            Type: {propertyType} <b>⌄</b>
          </button>
          <button className="filter active" type="button" onClick={() => setDrawer(true)}>
            Beds: {selectedBeds} <b>⌄</b>
          </button>
          <button className="filter" type="button" onClick={() => setDrawer(true)}>
            <Icon name="sliders" /> All Filters
          </button>
          <button
            className="clear"
            type="button"
            onClick={() => {
              setLocationQuery("");
              setPropertyType("All");
              setMaxBudget(120000);
              setSelectedBeds("All");
            }}
          >
            Clear filters
          </button>
        </div>
        <button className="ask-ai" type="button" onClick={() => nav("/ai")}>
          <Icon name="sparkles" /> Ask Addis AI
        </button>
      </section>

      {/* Main Content Workspace */}
      <section className="workspace" style={{ flex: 1 }}>
        <div className="results">
          <div className="result-head">
            <div>
              <p className="crumb">
                <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>HOME</Link> / SEARCH / {locationQuery ? locationQuery.toUpperCase() : "ALL ADDIS ABABA"}
              </p>
              <h1>
                {loading ? "Searching properties..." : `${homesList.length} Homes Found in ${locationQuery || "Addis Ababa"}`}
              </h1>
              <span>
                {propertyType !== "All" ? `${propertyType} listings` : "All property types"} · Direct landlord connections
              </span>
            </div>
            <div className="sort">
              <label>Sort by:</label>
              <select
                onChange={(e) => {
                  const val = e.target.value;
                  const sorted = [...homesList];
                  if (val === "price_asc") sorted.sort((a, b) => a.rawPrice - b.rawPrice);
                  if (val === "price_desc") sorted.sort((a, b) => b.rawPrice - a.rawPrice);
                  if (val === "match") sorted.sort((a, b) => Number(b.match) - Number(a.match));
                  setHomesList(sorted);
                }}
              >
                <option value="match">Addis Match Score</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Property Cards List */}
          {loading ? (
            <div style={{ padding: "40px", textAlign: "center", color: "#647d91" }}>
              <p>Loading active properties from MongoDB Atlas...</p>
            </div>
          ) : homesList.length === 0 ? (
            <div style={{ background: "#ffffff", padding: "48px", borderRadius: "12px", textAlign: "center", border: "1px solid #e1e9ed" }}>
              <h3>No properties matched your exact filter criteria</h3>
              <p style={{ color: "#6a8194", fontSize: "12px", margin: "8px 0 16px" }}>
                Try adjusting your budget or selecting "All Property Types" to see more homes in Addis Ababa.
              </p>
              <button
                onClick={() => {
                  setLocationQuery("");
                  setPropertyType("All");
                  setMaxBudget(120000);
                }}
                className="btn"
              >
                View All Available Properties
              </button>
            </div>
          ) : (
            <div className="list">
              {homesList.map((h, i) => (
                <Card
                  key={h.id}
                  h={h}
                  selected={selected === i}
                  onSelect={() => setSelected(i)}
                  onOpen={() => openSelectedProperty(h.id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Map Column */}
        {currentSelected && (
          <aside className="map">
            <div className="map-roads" />
            <div className="commute-line" />
            <span className="area a1">Piassa</span>
            <span className="area a2">Kazanchis</span>
            <span className="area a3">Bole</span>
            <span className="area a4">CMC</span>

            <div className="map-preview">
              <img src={currentSelected.img} alt={currentSelected.name} />
              <div>
                <span className="verified">
                  <Icon name="check" /> {currentSelected.tag || "Verified Listing"}
                </span>
                <h3>{currentSelected.name}</h3>
                <p>{currentSelected.loc}</p>
                <b>
                  ETB {currentSelected.price} <em>/ month</em>
                </b>
              </div>
              <button type="button" onClick={() => openSelectedProperty(currentSelected.id)}>
                View Property <Icon name="arrow" />
              </button>
            </div>
          </aside>
        )}
      </section>

      {drawer && (
        <FilterDrawer
          close={() => setDrawer(false)}
          onApply={() => setDrawer(false)}
          selectedType={propertyType}
          setSelectedType={setPropertyType}
          maxBudget={maxBudget}
          setMaxBudget={setMaxBudget}
          selectedBeds={selectedBeds}
          setSelectedBeds={setSelectedBeds}
        />
      )}
    </main>
  );
}
