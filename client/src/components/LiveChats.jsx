import { useEffect, useRef, useState } from "react";
import "./css/LiveChat.css";

export default function LiveChat({ socket, user }) {
  const [isOpen, setIsOpen] = useState(true);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [unread, setUnread] = useState(0);
  const messagesEndRef = useRef(null);

  // Auto scroll
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  // Socket listener
  useEffect(() => {
    if (!socket) return;

    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);

      if (!isOpen && !msg.system) {
        setUnread((prev) => prev + 1);
      }
    });

    return () => socket.off("receiveMessage");
  }, [socket, isOpen]);

  const sendMessage = () => {
    if (!text.trim()) return;

    const msg = {
      user: user?.name || "Guest",
      text,
      time: new Date().toLocaleTimeString(),
    };

    socket.emit("sendMessage", msg);
    setMessages((prev) => [...prev, { ...msg, self: true }]);
    setText("");
  };

  /* ---------------- COLLAPSED TAB ---------------- */
  if (!isOpen) {
    return (
      <button
        className="livechat-collapsed-tab"
        onClick={() => {
          setIsOpen(true);
          setUnread(0);
        }}
      >
        💬 Live Chat
        {unread > 0 && <span className="livechat-unread">{unread}</span>}
      </button>
    );
  }

  /* ---------------- FULL PANEL ---------------- */
  return (
    <div className="livechat-panel">
      <div className="livechat-header">
        <span>💬 Live Event Chat</span>
        <button
          className="livechat-close-btn"
          onClick={() => setIsOpen(false)}
        >
          –
        </button>
      </div>

      <div className="livechat-messages">
        {messages.map((msg, i) =>
          msg.system ? (
            <div key={i} className="livechat-system-message">
              {msg.text}
            </div>
          ) : (
            <div
              key={i}
              className={`livechat-message-row ${
                msg.self ? "livechat-message-sent" : "livechat-message-received"
              }`}
            >
              <div className="livechat-message-bubble">
                {!msg.self && (
                  <div className="livechat-message-user">{msg.user}</div>
                )}
                {msg.text}
                <div className="livechat-message-time">{msg.time}</div>
              </div>
            </div>
          )
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="livechat-input-area">
        <input
          className="livechat-input"
          placeholder="Type a message…"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button className="livechat-send-btn" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
}
