import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import Navbar from "./components/Navbar";
import Icon from "./components/Icon";

const pics = [
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=900&q=80",
];

const homes = [
  {
    id: "sunlit-2bed",
    name: "Sunlit two-bedroom apartment",
    loc: "Bole, Addis Ababa",
    price: "42,000",
    match: "94",
    commute: "24 min to Edna Mall",
    tag: "Best match",
  },
  {
    id: "modern-atlas",
    name: "Modern apartment near Atlas",
    loc: "Bole Atlas, Addis Ababa",
    price: "36,000",
    match: "91",
    commute: "18 min to Edna Mall",
  },
  {
    id: "quiet-compound",
    name: "Quiet home in a secure compound",
    loc: "Bole Medhanealem",
    price: "39,500",
    match: "88",
    commute: "27 min to Edna Mall",
  },
  {
    id: "bright-balcony",
    name: "Bright two-bedroom with balcony",
    loc: "Kazanchis, Addis Ababa",
    price: "34,000",
    match: "84",
    commute: "31 min to Edna Mall",
  },
];

function Card({
  h,
  index,
  selected,
  onSelect,
  onOpen,
}: {
  h: (typeof homes)[0];
  index: number;
  selected: boolean;
  onSelect: () => void;
  onOpen: () => void;
}) {
  const [saved, setSaved] = useState(false);

  return (
    <article
      onClick={() => {
        onSelect();
      }}
      onDoubleClick={onOpen}
      className={`card ${selected ? "selected" : ""}`}
      style={{ cursor: "pointer" }}
    >
      <div className="photo">
        <img src={pics[index % 4]} alt={h.name} />
        {index < 3 && (
          <span className="verified">
            <Icon name="check" /> Verified property
          </span>
        )}
        {h.tag && <span className="best">{h.tag}</span>}
        <button
          className={saved ? "save saved" : "save"}
          onClick={(e) => {
            e.stopPropagation();
            setSaved(!saved);
          }}
          aria-label="Save home"
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
          <span>2 beds</span>
          <span>1 bath</span>
          <span>92 m²</span>
        </div>
        <div className="card-bottom">
          <b>
            ETB {h.price} <em>/ month</em>
          </b>
          <span className="commute">
            <Icon name="map" />
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
}: {
  close: () => void;
  onApply: () => void;
}) {
  const [active, setActive] = useState("Apartment");
  const opts = [
    "Apartment",
    "House",
    "Studio",
    "Condominium",
    "Villa",
    "Shared accommodation",
  ];

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
        <b>Price (ETB)</b>
        <div className="price-inputs">
          <span>
            Min <strong>0</strong>
          </span>
          <span>
            Max <strong>40,000</strong>
          </span>
        </div>
        <div className="range">
          <i />
          <b />
          <b />
        </div>
      </section>
      <section>
        <b>Property type</b>
        <div className="option-grid">
          {opts.map((x) => (
            <button
              key={x}
              type="button"
              onClick={() => setActive(x)}
              className={active === x ? "on" : ""}
            >
              {x}
            </button>
          ))}
        </div>
      </section>
      <section>
        <b>Bedrooms</b>
        <div className="option-grid short">
          {["Studio", "1+", "2+", "3+", "4+", "5+"].map((x) => (
            <button className={x === "2+" ? "on" : ""} key={x} type="button">
              {x}
            </button>
          ))}
        </div>
      </section>
      <section>
        <b>Verification & Freshness</b>
        <label>
          <input type="checkbox" defaultChecked /> Verified property
        </label>
        <label>
          <input type="checkbox" defaultChecked /> Verified landlord
        </label>
        <label>
          <input type="checkbox" defaultChecked /> Confirmed available recently
        </label>
      </section>
      <section>
        <b>Destination & Commute</b>
        <button className="field" type="button">
          Bole — Edna Mall area <span>⌄</span>
        </button>
        <div className="option-grid short">
          {["15 min", "30 min", "45 min", "60 min"].map((x) => (
            <button className={x === "30 min" ? "on" : ""} key={x} type="button">
              {x}
            </button>
          ))}
        </div>
      </section>
      <div className="drawer-foot">
        <button onClick={close} type="button">
          Clear
        </button>
        <button onClick={onApply} type="button">
          Show 128 homes
        </button>
      </div>
    </aside>
  );
}

function Map({
  selected,
  setSelected,
  onOpenDetails,
}: {
  selected: number;
  setSelected: (n: number) => void;
  onOpenDetails: () => void;
}) {
  return (
    <aside className="map">
      <div className="map-roads" />
      <div className="commute-line" />
      <span className="area a1">Piassa</span>
      <span className="area a2">Kazanchis</span>
      <span className="area a3">Bole</span>
      <span className="area a4">CMC</span>
      <button className="marker one" onClick={() => setSelected(1)}>
        ETB 36k
      </button>
      <button className="marker two" onClick={() => setSelected(2)}>
        ETB 39.5k
      </button>
      <button className="marker three" onClick={() => setSelected(3)}>
        ETB 34k
      </button>
      <button
        className="marker main"
        onClick={() => setSelected(0)}
        aria-label="Selected property: Sunlit two-bedroom, 42,000 ETB"
      >
        <Icon name="map" /> ETB 42k
      </button>
      <div className="map-controls">
        <button aria-label="Zoom in">+</button>
        <button aria-label="Zoom out">−</button>
        <button aria-label="Use my location">
          <Icon name="pin" />
        </button>
      </div>
      <div className="map-legend">
        <span>
          <i /> Selected home
        </span>
        <span>
          <b /> 30 min commute
        </span>
      </div>
      <div className="map-preview">
        <img src={pics[selected]} alt="Selected property" />
        <div>
          <span className="verified">
            <Icon name="check" /> Verified
          </span>
          <h3>{homes[selected].name}</h3>
          <p>{homes[selected].loc}</p>
          <b>
            ETB {homes[selected].price} <em>/ month</em>
          </b>
        </div>
        <button type="button" onClick={onOpenDetails}>
          View property <Icon name="arrow" />
        </button>
      </div>
    </aside>
  );
}

export default function SearchResults() {
  const [drawer, setDrawer] = useState(false);
  const [selected, setSelected] = useState(0);
  const [mode, setMode] = useState<"default" | "empty" | "loading" | "error">(
    "default"
  );
  const [ai, setAi] = useState(false);
  const [saved, setSaved] = useState(false);
  const [locationQuery, setLocationQuery] = useState("Bole, Addis Ababa");
  const nav = useNavigate();

  const visible = useMemo(() => (mode === "default" ? homes : []), [mode]);

  const openSelectedProperty = () => {
    nav(`/property/${homes[selected].id}`);
  };

  return (
    <main>
      <Navbar />

      <section className="search-head">
        <div className="search-row">
          <div className="search-input">
            <Icon name="search" />
            <div>
              <b>Where do you want to live?</b>
              <input
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                style={{ border: "none", outline: "none", color: "#6d8397", fontSize: "12px", background: "transparent" }}
              />
            </div>
          </div>
          <div className="search-input destination">
            <Icon name="pin" />
            <div>
              <b>Destination</b>
              <span>Bole — Edna Mall area</span>
            </div>
          </div>
          <button className="commute" type="button">
            30 min <b>⌄</b>
          </button>
          <button className="go" type="button" onClick={() => setMode("loading")}>
            <Icon name="search" /> Search
          </button>
        </div>
        <div className="suggestions">
          <span>Suggestions:</span>
          {["Bole", "Bole Atlas", "Bole Medhanealem", "Kazanchis", "CMC"].map((s) => (
            <button key={s} type="button" onClick={() => setLocationQuery(s)}>
              {s}
            </button>
          ))}
          <button className="locate" type="button">
            <Icon name="pin" /> Use my location
          </button>
        </div>
      </section>

      <section className="filters">
        <div className="filter-scroll">
          <button className="filter active" type="button">
            Up to 40,000 ETB <b>⌄</b>
          </button>
          <button className="filter active" type="button">
            Apartment <b>⌄</b>
          </button>
          <button className="filter active" type="button">
            2+ bedrooms <b>⌄</b>
          </button>
          <button className="filter" type="button">
            Bathrooms <b>⌄</b>
          </button>
          <button className="filter" type="button" onClick={() => setDrawer(true)}>
            <Icon name="sliders" /> More filters
          </button>
          <button className="clear" type="button" onClick={() => setMode("default")}>
            Clear filters
          </button>
        </div>
        <button className="ask-ai" type="button" onClick={() => setAi(!ai)}>
          <Icon name="spark" /> Ask Addis AI
        </button>
      </section>

      {ai && (
        <section className="ai-bar">
          <Icon name="spark" />
          <p>“Find a quiet 2-bedroom near Bole under 35,000 ETB.”</p>
          <span>
            <b>AI understood</b> · Bole · ≤35,000 ETB · 2+ beds · Quiet
          </span>
          <button type="button" onClick={() => nav("/ai")}>
            Open in Addis AI <Icon name="arrow" />
          </button>
        </section>
      )}

      <section className="workspace">
        <div className="results">
          <div className="result-head">
            <div>
              <p className="crumb">
                <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>HOME</Link> / SEARCH / BOLE
              </p>
              <h1>Homes in Bole, Addis Ababa</h1>
              <span>
                128 homes match your search <i>•</i> Demonstration results
              </span>
            </div>
            <div className="head-actions">
              <button
                type="button"
                onClick={() => setSaved(!saved)}
                className={saved ? "saved-search on" : "saved-search"}
              >
                {saved ? "✓ Saved search" : "Save search"}
              </button>
              <select aria-label="Sort results" defaultValue="Recommended">
                <option>Recommended</option>
                <option>Newest first</option>
                <option>Lowest price</option>
                <option>Highest match score</option>
              </select>
              <button
                className="state-trigger"
                type="button"
                onClick={() => setMode(mode === "default" ? "empty" : "default")}
              >
                States
              </button>
            </div>
          </div>

          {mode === "default" && (
            <div className="chips">
              {["Bole", "≤40,000 ETB", "2+ beds", "Apartment"].map((c) => (
                <button key={c} type="button">
                  {c} ×
                </button>
              ))}
              <button type="button" onClick={() => setMode("default")}>
                Clear all
              </button>
            </div>
          )}

          {mode === "loading" && (
            <div className="skeletons">
              {[1, 2, 3].map((x) => (
                <div className="skeleton" key={x} />
              ))}
            </div>
          )}

          {mode === "empty" && (
            <div className="state">
              <Icon name="search" />
              <h2>No homes match your current filters.</h2>
              <p>
                Try increasing your budget, expanding the search area, or reducing
                bedroom requirements.
              </p>
              <button type="button" onClick={() => setDrawer(true)}>
                Adjust filters
              </button>
              <button type="button" onClick={() => setMode("default")}>
                Explore nearby areas
              </button>
            </div>
          )}

          {mode === "error" && (
            <div className="state">
              <Icon name="close" />
              <h2>We couldn’t load these homes.</h2>
              <p>Check your connection and try again.</p>
              <button type="button" onClick={() => setMode("default")}>
                Try again
              </button>
            </div>
          )}

          {mode === "default" && (
            <div className="cards">
              {visible.map((h, i) => (
                <Card
                  key={h.name}
                  h={h}
                  index={i}
                  selected={selected === i}
                  onSelect={() => setSelected(i)}
                  onOpen={() => nav(`/property/${h.id}`)}
                />
              ))}
            </div>
          )}

          <div className="state-pills">
            <button type="button" onClick={() => setMode("default")}>
              Default
            </button>
            <button type="button" onClick={() => setMode("loading")}>
              Loading
            </button>
            <button type="button" onClick={() => setMode("empty")}>
              No results
            </button>
            <button type="button" onClick={() => setMode("error")}>
              Error
            </button>
          </div>
        </div>

        <Map
          selected={selected}
          setSelected={setSelected}
          onOpenDetails={openSelectedProperty}
        />
      </section>

      {drawer && (
        <>
          <div className="scrim" onClick={() => setDrawer(false)} />
          <FilterDrawer
            close={() => setDrawer(false)}
            onApply={() => setDrawer(false)}
          />
        </>
      )}
    </main>
  );
}
