import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import "./css/LiveChat.css"; 

export default function LiveChat({ eventId, username }) {
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
    <div className="livechat-container w-full max-w-md border rounded-2xl shadow-md flex flex-col h-96">
      {/* Header */}
      <div className="livechat-header p-3 border-b font-semibold rounded-t-2xl">
        💬 Live Chat
      </div>

      {/* Messages */}
      <div className="livechat-messages flex-1 overflow-y-auto p-3 space-y-2">
        {messages.map((msg, i) => (
          <div key={i}>
            {msg.system ? (
              <p className="system-message italic text-center">{msg.text}</p>
            ) : (
              <div
                className={`flex ${
                  msg.username === username ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`message-bubble max-w-xs px-3 py-2 rounded-lg text-sm shadow ${
                    msg.username === username
                      ? "sent-message"
                      : "received-message"
                  }`}
                >
                  <span className="font-semibold">{msg.username}: </span>
                  {msg.text}
                  <div className="message-time text-xs mt-1 opacity-70">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="livechat-input p-3 border-t flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message..."
          className="chat-input flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button onClick={sendMessage} className="send-btn px-4 rounded-lg shadow transition">
          Send
        </button>
      </div>
    </div>
  );
}
