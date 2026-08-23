import { useState } from "react";
import { Link, useNavigate } from "react-router";
import Logo from "./components/Logo";
import Icon from "./components/Icon";

const photo =
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80";

const conversations = [
  {
    name: "Abebe Tesfaye",
    property: "Modern 2 Bedroom Apartment",
    loc: "Bole, Addis Ababa",
    rent: "42,000",
    lastMsg: "Yes, Saturday works for me.",
    time: "10:42 AM",
    unread: "2",
    messages: [
      { me: false, text: "Hello! I’m interested in the Modern 2 Bedroom Apartment. Is it still available?", time: "10:31 AM" },
      { me: false, text: "Yes, it is still available. Would you like to schedule a viewing?", time: "10:33 AM" },
      { me: true, text: "Yes please. Is Saturday morning possible?", time: "10:36 AM" },
      { me: false, text: "Yes, Saturday works for me. I can show you the apartment at 10:00 AM.", time: "10:42 AM" },
    ],
  },
  {
    name: "Kalkidan M.",
    property: "Sunlit Two-Bedroom Apartment",
    loc: "Bole Medhanealem",
    rent: "42,000",
    lastMsg: "The property is still available.",
    time: "Yesterday",
    unread: "",
    messages: [
      { me: true, text: "Hi Kalkidan, is the water tank backup continuous during maintenance?", time: "Yesterday 2:15 PM" },
      { me: false, text: "The property is still available. Yes, we have a 3,000L dedicated water reservoir with pump.", time: "Yesterday 2:40 PM" },
    ],
  },
  {
    name: "Mekdes Alemu",
    property: "Quiet home in a secure compound",
    loc: "Yeka, Addis Ababa",
    rent: "39,500",
    lastMsg: "Viewing request confirmed",
    time: "Tue",
    unread: "",
    messages: [
      { me: true, text: "Hello Mekdes, could we view the compound garden area as well?", time: "Tue 9:00 AM" },
      { me: false, text: "Viewing request confirmed. Yes, the full compound is available for inspection on Thursday.", time: "Tue 9:15 AM" },
    ],
  },
  {
    name: "Henok T.",
    property: "Bright apartment near Atlas",
    loc: "Bole Atlas, Addis Ababa",
    rent: "36,000",
    lastMsg: "Thanks for your interest.",
    time: "Mon",
    unread: "",
    messages: [
      { me: true, text: "Is the security guard on 24/7 duty?", time: "Mon 4:10 PM" },
      { me: false, text: "Thanks for your interest. Yes, day and night security guards are stationed at the gate.", time: "Mon 4:30 PM" },
    ],
  },
];

export default function MessagingExperience() {
  const [selected, setSelected] = useState(0);
  const [tab, setTab] = useState("All");
  const [text, setText] = useState("");
  const [threads, setThreads] = useState(conversations);
  const nav = useNavigate();

  const currentConv = threads[selected];

  const send = () => {
    if (!text.trim()) return;
    const newMsg = { me: true, text: text.trim(), time: "Just now" };
    const updated = [...threads];
    updated[selected].messages = [...updated[selected].messages, newMsg];
    updated[selected].lastMsg = text.trim();
    setThreads(updated);
    setText("");

    // Simulate landlord quick auto-reply after 1.5s
    setTimeout(() => {
      const reply = {
        me: false,
        text: "Thank you for the message. I will check the details and reply shortly.",
        time: "Just now",
      };
      const afterReply = [...threads];
      afterReply[selected].messages = [...afterReply[selected].messages, reply];
      setThreads([...afterReply]);
    }, 1500);
  };

  return (
    <main className="messaging">
      <header>
        <Logo to="/" />
        <span>Contextual Inquiries & Messaging</span>
        <button type="button" onClick={() => nav("/tenant")}>
          Tenant Home →
        </button>
      </header>
      <div className="message-layout">
        <aside className="conversation-list">
          <div>
            <h1>Messages</h1>
            <button type="button" onClick={() => nav("/search")}>
              ＋ New inquiry
            </button>
          </div>
          <div className="conversation-search">
            <Icon name="search" />
            <input placeholder="Search conversations..." />
          </div>
          <nav>
            {["All", "Unread", "Viewing"].map((x) => (
              <button
                className={tab === x ? "active" : ""}
                onClick={() => setTab(x)}
                key={x}
                type="button"
              >
                {x}
                {x === "Unread" && <b>2</b>}
              </button>
            ))}
          </nav>
          <section>
            {threads.map((c, i) => (
              <button
                onClick={() => setSelected(i)}
                className={selected === i ? "selected" : ""}
                key={c.name}
                type="button"
              >
                <span className="person">
                  {c.name
                    .split(" ")
                    .map((x) => x[0])
                    .join("")}
                </span>
                <div>
                  <b>{c.name}</b>
                  <small>{c.property}</small>
                  <p>{c.lastMsg}</p>
                </div>
                <time>
                  {c.time}
                  {c.unread && <i>{c.unread}</i>}
                </time>
              </button>
            ))}
          </section>
        </aside>

        <section className="chat">
          <div className="chat-head">
            <span className="person">
              {currentConv.name
                .split(" ")
                .map((x) => x[0])
                .join("")}
            </span>
            <div>
              <b>{currentConv.name}</b>
              <small>Active recently · {currentConv.property}</small>
            </div>
            <button type="button" onClick={() => nav("/property/sunlit-2bed")}>
              View property
            </button>
          </div>

          <div className="property-strip">
            <img src={photo} alt={currentConv.property} />
            <div>
              <b>{currentConv.property}</b>
              <span>
                <Icon name="pin" />
                {currentConv.loc} · ETB {currentConv.rent} / month
              </span>
            </div>
            <button type="button" onClick={() => nav("/property/sunlit-2bed")}>
              View
            </button>
          </div>

          <div className="bubble-area">
            {currentConv.messages.map((m, i) => (
              <div className={m.me ? "bubble me" : "bubble"} key={i}>
                <p>{m.text}</p>
                <small>{m.time}{m.me && " · Delivered"}</small>
              </div>
            ))}
            <div className="viewing-card">
              <Icon name="calendar" />
              <div>
                <b>Viewing appointment</b>
                <span>Saturday, 10:00 AM · Confirmed with landlord</span>
              </div>
              <button type="button" onClick={() => alert("Viewing appointment details confirmed.")}>
                Details
              </button>
            </div>
          </div>

          <div className="quick-questions">
            {[
              "Is this still available?",
              "Can I schedule a viewing this weekend?",
              "Is backup water tank available?",
              "How much is the security deposit?",
            ].map((x) => (
              <button onClick={() => setText(x)} key={x} type="button">
                {x}
              </button>
            ))}
          </div>

          <div className="composer">
            <button type="button" onClick={() => alert("Attachment dialog opened (photos/documents).")}>
              <Icon name="attach" />
            </button>
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Ask the landlord about this property..."
            />
            <button
              className="ai"
              type="button"
              onClick={() => setText("Hi, is the property available for immediate move-in? What are the deposit terms?")}
              title="Addis AI suggestion"
            >
              ✦
            </button>
            <button className="send" onClick={send} type="button">
              <Icon name="send" />
            </button>
          </div>
        </section>

        <aside className="context">
          <img src={photo} alt={currentConv.property} />
          <span className="verified">
            <Icon name="check" /> Property verified
          </span>
          <h2>{currentConv.property}</h2>
          <p>
            <Icon name="pin" />
            {currentConv.loc}
          </p>
          <b>
            ETB {currentConv.rent} <em>/ month</em>
          </b>
          <div className="context-facts">
            <span>2 beds</span>
            <span>2 baths</span>
            <span>92 m²</span>
          </div>
          <span className="available">● Available now</span>
          <button type="button" onClick={() => nav("/property/sunlit-2bed")}>
            View full listing
          </button>
          <button
            className="viewing"
            type="button"
            onClick={() => {
              setText("I would like to request an in-person viewing appointment.");
            }}
          >
            Request viewing
          </button>
          <p className="safety">
            Messages stay connected to this property. Report conversation if something feels suspicious.
          </p>
        </aside>
      </div>
    </main>
  );
}
