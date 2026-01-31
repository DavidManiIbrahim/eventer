import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import "./css/LiveChat.css";

export default function LiveChat({ eventId, username, onClose }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const socket = io(`http://localhost:5000`);
    socketRef.current = socket;

    socket.emit("joinRoom", eventId);

    const joinMessage = {
      eventId,
      username,
      text: `${username} joined the chat.`,
      system: true,
      timestamp: new Date(),
    };
    socket.emit("sendMessage", joinMessage);

    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.disconnect();
    };
  }, [eventId, username]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (message.trim()) {
      const msgData = {
        eventId,
        username,
        text: message,
        timestamp: new Date(),
      };
      socketRef.current.emit("sendMessage", msgData);
      setMessages((prev) => [...prev, msgData]);
      setMessage("");
    }
  };

  return (
    <div className="livechat-panel">
      <div className="livechat-header">
        💬 Live Chat
        <button className="livechat-close-btn" onClick={onClose}>
          ✖
        </button>
      </div>

      <div className="livechat-messages">
        {messages.map((msg, i) => (
          <div key={i}>
            {msg.system ? (
              <p className="livechat-system-message">{msg.text}</p>
            ) : (
              <div
                className={`livechat-message-row ${
                  msg.username === username ? "livechat-message-sent" : "livechat-message-received"
                }`}
              >
                <div className="livechat-message-bubble">
                  <span className="livechat-message-user">{msg.username}: </span>
                  {msg.text}
                  <div className="livechat-message-time">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="livechat-input-area">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message..."
          className="livechat-input"
        />
        <button onClick={sendMessage} className="livechat-send-btn">
          Send
        </button>
      </div>
    </div>
  );
}
