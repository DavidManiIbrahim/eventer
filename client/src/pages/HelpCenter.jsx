import React from "react";
import "./CSS/HelpCenter.css";

export default function HelpCenter() {
  const helpTopics = [
    { icon: "🎟", title: "How to create an event" },
    { icon: "💳", title: "Payments, refunds & billing" },
    { icon: "👤", title: "Managing your account" },
    { icon: "📡", title: "Streaming your live events" },
    { icon: "🛠", title: "Troubleshooting common issues" },
    { icon: "📈", title: "Analytics & reporting" },
  ];

  return (
    <div className="page-container">
      <h1 className="page-title">Help Center</h1>
      <p className="page-text">
        Find answers to your questions, troubleshoot issues, and learn how to 
        make the most of TickiSpot with step-by-step guides and helpful resources.
      </p>

      <ul className="help-list">
        {helpTopics.map((topic, index) => (
          <li key={index} >
            <span>{topic.icon}</span> {topic.title}
          </li>
        ))}
      </ul>
    </div>
  );
}
