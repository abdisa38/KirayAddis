import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "./context/AuthContext";
import { apiRequest } from "./api/client";
import Logo from "./components/Logo";
import Icon from "./components/Icon";

interface IConversation {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  property: {
    id: string;
    title: string;
    price: number;
    subCity: string;
    neighborhood: string;
    bedrooms: number;
    bathrooms: number;
    area: number;
    image: string;
    status: string;
  };
  lastMsg: string;
  lastMsgTime: string;
  unreadCount: number;
}

interface IMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  text: string;
  time: string;
  isMe: boolean;
}

interface IViewing {
  id: string;
  propertyTitle: string;
  tenantName: string;
  landlordName: string;
  appointmentDate: string;
  appointmentTime: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  notes?: string;
}

export default function MessagingExperience() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<IConversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [viewings, setViewings] = useState<IViewing[]>([]);
  const [inputText, setInputText] = useState("");
  const [tab, setTab] = useState<"All" | "Unread" | "Viewing">("All");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const nav = useNavigate();

  // 1. Fetch Conversations and Viewings from Backend
  const loadConversations = async () => {
    try {
      setLoading(true);
      const [convRes, viewRes] = await Promise.all([
        apiRequest("/messages/conversations"),
        apiRequest("/messages/viewings").catch(() => ({ success: false, viewings: [] })),
      ]);

      if (convRes.success && convRes.conversations) {
        const currentUserId = user?.id;
        const mapped: IConversation[] = convRes.conversations.map((c: any) => {
          const other = c.participants?.find((p: any) => p._id !== currentUserId) || c.participants?.[0];
          const cover = c.property?.media?.find((m: any) => m.isCover) || c.property?.media?.[0];
          return {
            id: c._id,
            name: other?.name || "User",
            role: other?.role || "landlord",
            avatar: other?.avatar,
            property: {
              id: c.property?._id,
              title: c.property?.title || "Addis Ababa Rental",
              price: c.property?.price || 0,
              subCity: c.property?.location?.subCity || "Bole",
              neighborhood: c.property?.location?.neighborhood || "Medhanealem",
              bedrooms: c.property?.bedrooms || 2,
              bathrooms: c.property?.bathrooms || 1,
              area: c.property?.area || 85,
              image: cover?.url || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80",
              status: c.property?.availability?.status || "Available",
            },
            lastMsg: c.lastMessage || "Conversation started",
            lastMsgTime: new Date(c.lastMessageAt || Date.now()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            unreadCount: 0,
          };
        });

        setConversations(mapped);
        if (mapped.length > 0 && !activeConvId) {
          setActiveConvId(mapped[0].id);
        }
      }

      if (viewRes.success && viewRes.viewings) {
        const mappedViewings: IViewing[] = viewRes.viewings.map((v: any) => ({
          id: v._id,
          propertyTitle: v.property?.title || "Property Viewing",
          tenantName: v.tenant?.name || "Tenant",
          landlordName: v.landlord?.name || "Landlord",
          appointmentDate: new Date(v.appointmentDate).toLocaleDateString("en-US", { month: "short", day: "numeric", weekday: "short" }),
          appointmentTime: v.appointmentTime,
          status: v.status,
          notes: v.notes,
        }));
        setViewings(mappedViewings);
      }
    } catch (err) {
      console.error("Failed to load conversations:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConversations();
  }, [user]);

  // 2. Fetch Messages when active conversation changes
  useEffect(() => {
    if (!activeConvId) return;

    const fetchMessages = async () => {
      try {
        const data = await apiRequest(`/messages/conversations/${activeConvId}/messages`);
        if (data.success && data.messages) {
          const currentUserId = user?.id;
          const mappedMsgs: IMessage[] = data.messages.map((m: any) => {
            const isMe = m.sender?._id === currentUserId || (user?.email && m.sender?.email === user.email);
            return {
              id: m._id,
              senderId: m.sender?._id,
              senderName: m.sender?.name || (isMe ? "You" : "Other"),
              senderRole: m.sender?.role || "user",
              text: m.text,
              time: new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              isMe,
            };
          });
          setMessages(mappedMsgs);
        }
      } catch (err) {
        console.error("Failed to load messages:", err);
      }
    };

    fetchMessages();
  }, [activeConvId, user]);

  // 3. Send Message
  const handleSendMessage = async () => {
    if (!inputText.trim() || !activeConvId || sending) return;

    const textToSend = inputText.trim();
    setInputText("");
    setSending(true);

    // Optimistic message
    const tempMsg: IMessage = {
      id: Date.now().toString(),
      senderId: user?.id || "me",
      senderName: user?.name || "You",
      senderRole: user?.role || "tenant",
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isMe: true,
    };
    setMessages((prev) => [...prev, tempMsg]);

    try {
      const res = await apiRequest(`/messages/conversations/${activeConvId}/messages`, {
        method: "POST",
        body: JSON.stringify({ text: textToSend }),
      });

      if (res.success) {
        // Update last message in conversation list
        setConversations((prev) =>
          prev.map((c) => (c.id === activeConvId ? { ...c, lastMsg: textToSend, lastMsgTime: "Just now" } : c))
        );
      }
    } catch (err) {
      console.error("Error sending message:", err);
    } finally {
      setSending(false);
    }
  };

  // 4. Handle Confirm / Update Viewing Status
  const handleUpdateViewingStatus = async (viewingId: string, newStatus: "confirmed" | "cancelled") => {
    try {
      const res = await apiRequest(`/messages/viewings/${viewingId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.success) {
        setViewings((prev) =>
          prev.map((v) => (v.id === viewingId ? { ...v, status: newStatus } : v))
        );
      }
    } catch (err) {
      console.error("Error updating viewing:", err);
    }
  };

  const activeConv = conversations.find((c) => c.id === activeConvId) || conversations[0];
  const activeViewing = viewings.find((v) => v.status !== "cancelled");

  const getDashboardPath = () => {
    if (user?.role === "landlord") return "/landlord";
    if (user?.role === "admin") return "/admin";
    return "/tenant";
  };

  return (
    <main className="messaging">
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 24px", background: "#ffffff", borderBottom: "1px solid #dce5ec" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <Logo to="/" />
          <span style={{ fontSize: "12px", color: "#627d94", fontWeight: 600 }}>
            {user?.role === "landlord" ? "Landlord Communication Hub" : user?.role === "admin" ? "Admin Messaging & Moderation" : "Tenant Messages & Inquiries"}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "12px", color: "#11355b", fontWeight: 700 }}>
            Logged in as: <b>{user?.name || "Guest"}</b> ({user?.role || "tenant"})
          </span>
          <button
            type="button"
            className="btn outline"
            onClick={() => nav(getDashboardPath())}
            style={{ padding: "6px 12px", fontSize: "11px" }}
          >
            My Dashboard →
          </button>
        </div>
      </header>

      <div className="message-layout">
        {/* Left Column: Conversations List */}
        <aside className="conversation-list">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <h1 style={{ fontSize: "18px", fontWeight: 800, color: "#11355b", margin: 0 }}>Messages</h1>
            <button
              type="button"
              className="btn"
              onClick={() => nav("/search")}
              style={{ padding: "5px 10px", fontSize: "10px" }}
            >
              ＋ Find Home
            </button>
          </div>

          <nav style={{ display: "flex", gap: "6px", marginBottom: "12px" }}>
            {(["All", "Viewing"] as const).map((x) => (
              <button
                className={tab === x ? "active" : ""}
                onClick={() => setTab(x)}
                key={x}
                type="button"
              >
                {x}
              </button>
            ))}
          </nav>

          <section>
            {loading ? (
              <p style={{ padding: "20px", fontSize: "12px", color: "#6b8396" }}>Loading conversations...</p>
            ) : conversations.length === 0 ? (
              <div style={{ padding: "24px 16px", textAlign: "center" }}>
                <Icon name="message" style={{ fontSize: "24px", color: "#9bb0c1", marginBottom: "8px" }} />
                <p style={{ fontSize: "13px", color: "#36526c", fontWeight: 600 }}>No conversations yet</p>
                <p style={{ fontSize: "11px", color: "#748f9e" }}>Explore marketplace listings and send inquiries to landlords.</p>
                <button
                  type="button"
                  className="btn"
                  onClick={() => nav("/search")}
                  style={{ marginTop: "12px", fontSize: "11px" }}
                >
                  Browse Listings
                </button>
              </div>
            ) : (
              conversations.map((c) => (
                <button
                  onClick={() => setActiveConvId(c.id)}
                  className={activeConvId === c.id ? "selected" : ""}
                  key={c.id}
                  type="button"
                  style={{ textAlign: "left", width: "100%" }}
                >
                  <span className="person" style={{ background: c.role === "landlord" ? "#0b8879" : "#0d345b" }}>
                    {c.name.split(" ").map((x) => x[0]).join("")}
                  </span>
                  <div>
                    <b>{c.name} <span style={{ fontSize: "10px", fontWeight: 500, color: "#087d70" }}>({c.role})</span></b>
                    <small>{c.property.title}</small>
                    <p>{c.lastMsg}</p>
                  </div>
                  <time>{c.lastMsgTime}</time>
                </button>
              ))
            )}
          </section>
        </aside>

        {/* Center Column: Live Chat Messages */}
        <section className="chat">
          {activeConv ? (
            <>
              <div className="chat-head">
                <span className="person" style={{ background: activeConv.role === "landlord" ? "#0b8879" : "#0d345b" }}>
                  {activeConv.name.split(" ").map((x) => x[0]).join("")}
                </span>
                <div>
                  <b>{activeConv.name}</b>
                  <small>Active conversation · {activeConv.property.title}</small>
                </div>
                <button
                  type="button"
                  onClick={() => nav(`/property/${activeConv.property.id}`)}
                  style={{ marginLeft: "auto", fontSize: "11px", color: "#0b8879", fontWeight: 700, background: "none", border: "none", cursor: "pointer" }}
                >
                  View listing →
                </button>
              </div>

              {/* Property Mini Banner */}
              <div className="property-strip">
                <img src={activeConv.property.image} alt={activeConv.property.title} />
                <div>
                  <b>{activeConv.property.title}</b>
                  <span>
                    <Icon name="pin" />
                    {activeConv.property.neighborhood}, {activeConv.property.subCity} · ETB {activeConv.property.price.toLocaleString()} / month
                  </span>
                </div>
                <button type="button" onClick={() => nav(`/property/${activeConv.property.id}`)}>
                  View
                </button>
              </div>

              {/* Message Bubbles */}
              <div className="bubble-area">
                {messages.length === 0 ? (
                  <p style={{ textAlign: "center", color: "#8a9fb0", fontSize: "12px", marginTop: "20px" }}>
                    No messages yet in this inquiry thread. Send a greeting to start chatting!
                  </p>
                ) : (
                  messages.map((m) => (
                    <div className={m.isMe ? "bubble me" : "bubble"} key={m.id}>
                      <span style={{ fontSize: "10px", fontWeight: 700, opacity: 0.8, display: "block", marginBottom: "2px" }}>
                        {m.senderName} ({m.senderRole})
                      </span>
                      <p>{m.text}</p>
                      <small>{m.time}{m.isMe && " · Delivered"}</small>
                    </div>
                  ))
                )}

                {/* Real-time Viewing Appointment Card */}
                {activeViewing && (
                  <div className="viewing-card" style={{ background: "#edf7f5", border: "1px solid #bce1db" }}>
                    <Icon name="calendar" style={{ color: "#0b8879" }} />
                    <div>
                      <b>Viewing Appointment: {activeViewing.appointmentDate} at {activeViewing.appointmentTime}</b>
                      <span style={{ display: "block", fontSize: "11px", color: "#486577" }}>
                        Status: <b style={{ textTransform: "uppercase", color: activeViewing.status === "confirmed" ? "#0b8879" : "#b45309" }}>{activeViewing.status}</b>
                      </span>
                    </div>
                    {user?.role === "landlord" && activeViewing.status === "pending" && (
                      <div style={{ display: "flex", gap: "6px", marginLeft: "auto" }}>
                        <button
                          type="button"
                          className="btn"
                          style={{ padding: "4px 8px", fontSize: "10px" }}
                          onClick={() => handleUpdateViewingStatus(activeViewing.id, "confirmed")}
                        >
                          Confirm Viewing
                        </button>
                        <button
                          type="button"
                          className="btn outline"
                          style={{ padding: "4px 8px", fontSize: "10px" }}
                          onClick={() => handleUpdateViewingStatus(activeViewing.id, "cancelled")}
                        >
                          Decline
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Quick Questions / Suggestions */}
              <div className="quick-questions">
                {user?.role === "landlord"
                  ? [
                      "Yes, the apartment is available for in-person viewing.",
                      "The backup water tank reservoir is 3,000L.",
                      "Standard lease terms require 1 month security deposit.",
                      "What day and time works best for you?",
                    ].map((q) => (
                      <button onClick={() => setInputText(q)} key={q} type="button">
                        {q}
                      </button>
                    ))
                  : [
                      "Is this property still available?",
                      "Can I schedule a viewing this Saturday?",
                      "Is there a backup water tank & generator?",
                      "What are the lease and deposit terms?",
                    ].map((q) => (
                      <button onClick={() => setInputText(q)} key={q} type="button">
                        {q}
                      </button>
                    ))}
              </div>

              {/* Message Composer */}
              <div className="composer">
                <input
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder={user?.role === "landlord" ? "Reply to tenant inquiry..." : "Ask the landlord about this property..."}
                />
                <button
                  className="send"
                  onClick={handleSendMessage}
                  disabled={sending || !inputText.trim()}
                  type="button"
                  style={{ opacity: inputText.trim() ? 1 : 0.6 }}
                >
                  <Icon name="send" />
                </button>
              </div>
            </>
          ) : (
            <div style={{ display: "grid", placeItems: "center", height: "100%", padding: "40px", color: "#6e899e" }}>
              <p>Select a conversation to start messaging</p>
            </div>
          )}
        </section>

        {/* Right Column: Property Details Sidebar */}
        {activeConv && (
          <aside className="context">
            <img src={activeConv.property.image} alt={activeConv.property.title} />
            <span className="verified">
              <Icon name="check" /> Property verified
            </span>
            <h2>{activeConv.property.title}</h2>
            <p>
              <Icon name="pin" />
              {activeConv.property.neighborhood}, {activeConv.property.subCity}, Addis Ababa
            </p>
            <b>
              ETB {activeConv.property.price.toLocaleString()} <em>/ month</em>
            </b>
            <div className="context-facts">
              <span>{activeConv.property.bedrooms} beds</span>
              <span>{activeConv.property.bathrooms} bath</span>
              <span>{activeConv.property.area} m²</span>
            </div>
            <span className="available">● {activeConv.property.status}</span>
            <button
              type="button"
              className="btn"
              onClick={() => nav(`/property/${activeConv.property.id}`)}
              style={{ width: "100%", marginTop: "12px" }}
            >
              View full listing
            </button>
            <p className="safety" style={{ marginTop: "16px", fontSize: "11px", color: "#647f92" }}>
              Messages stay securely connected to this property in MongoDB Atlas. Never share financial passwords or off-platform payment codes.
            </p>
          </aside>
        )}
      </div>
    </main>
  );
}
