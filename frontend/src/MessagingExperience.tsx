import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "./context/AuthContext";
import { apiRequest } from "./api/client";
import Logo from "./components/Logo";
import Icon from "./components/Icon";

const photo =
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80";

const fallbackConversations = [
  {
    id: "1",
    name: "Kalkidan M.",
    property: "Sunlit Two-Bedroom Apartment",
    loc: "Bole Medhanealem",
    rent: "42,000",
    lastMsg: "Yes, Saturday works for me. I can show you the apartment at 10:00 AM.",
    time: "10:42 AM",
    unread: "1",
    messages: [
      { me: false, text: "Hello! I’m interested in the Sunlit Two-Bedroom Apartment. Is it still available?", time: "10:31 AM" },
      { me: false, text: "Yes, it is still available. Would you like to schedule a viewing?", time: "10:33 AM" },
      { me: true, text: "Yes please. Is Saturday morning possible?", time: "10:36 AM" },
      { me: false, text: "Yes, Saturday works for me. I can show you the apartment at 10:00 AM.", time: "10:42 AM" },
    ],
  },
  {
    id: "2",
    name: "Henok T.",
    property: "Modern apartment near Atlas",
    loc: "Bole Atlas, Addis Ababa",
    rent: "36,000",
    lastMsg: "Thanks for your interest. The water tank reservoir is 3,000L.",
    time: "Yesterday",
    unread: "",
    messages: [
      { me: true, text: "Hi Henok, is the water tank reservoir continuous?", time: "Yesterday 2:15 PM" },
      { me: false, text: "Thanks for your interest. The water tank reservoir is 3,000L.", time: "Yesterday 2:40 PM" },
    ],
  },
];

export default function MessagingExperience() {
  const { user, login } = useAuth();
  const [selected, setSelected] = useState(0);
  const [tab, setTab] = useState("All");
  const [text, setText] = useState("");
  const [threads, setThreads] = useState(fallbackConversations);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const nav = useNavigate();

  useEffect(() => {
    const fetchConvs = async () => {
      try {
        if (!user) {
          await login("alem@example.com", "password123");
        }

        const data = await apiRequest("/messages/conversations");
        if (data.success && data.conversations?.length) {
          const mapped = data.conversations.map((c: any) => {
            const otherParticipant = c.participants?.find((p: any) => p._id !== user?.id) || c.participants?.[0];
            return {
              id: c._id,
              name: otherParticipant?.name || "Kalkidan M.",
              property: c.property?.title || "Sunlit Two-Bedroom Apartment",
              loc: `${c.property?.location?.neighborhood || c.property?.location?.subCity || "Bole"}, Addis Ababa`,
              rent: Number(c.property?.price || 42000).toLocaleString(),
              lastMsg: c.lastMessage || "Inquiry conversation active",
              time: "Today",
              unread: "",
              propertyId: c.property?._id,
              messages: [
                { me: true, text: "Hello! I’m interested in this apartment. Is it still available?", time: "10:31 AM" },
                { me: false, text: c.lastMessage || "Yes, it is still available. Would you like to schedule a viewing?", time: "10:33 AM" },
              ],
            };
          });
          setThreads(mapped);
          setActiveThreadId(mapped[0]?.id || null);
        }
      } catch (err) {}
    };

    fetchConvs();
  }, [user]);

  const currentConv = threads[selected] || fallbackConversations[0];

  const send = async () => {
    if (!text.trim()) return;
    const msgText = text.trim();
    const newMsg = { me: true, text: msgText, time: "Just now" };
    const updated = [...threads];
    updated[selected].messages = [...updated[selected].messages, newMsg];
    updated[selected].lastMsg = msgText;
    setThreads(updated);
    setText("");

    if (activeThreadId) {
      try {
        await apiRequest(`/messages/conversations/${activeThreadId}/messages`, {
          method: "POST",
          body: JSON.stringify({ text: msgText }),
        });
      } catch (err) {}
    }

    // Landlord simulated reply
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
                {x === "Unread" && <b>1</b>}
              </button>
            ))}
          </nav>
          <section>
            {threads.map((c, i) => (
              <button
                onClick={() => {
                  setSelected(i);
                  setActiveThreadId(c.id);
                }}
                className={selected === i ? "selected" : ""}
                key={c.name + i}
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
