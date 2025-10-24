import React from "react";

export default function HelpCenter() {
  return (
    <div className="page-container">
      <h1 className="page-title">Help Center</h1>
      <p className="page-text">
        Find answers to your questions, troubleshoot issues, and learn how to
        make the most of TickiSpot.
      </p>
      <ul className="help-list">
        <li>🎟 How to create an event</li>
        <li>💳 How payments and refunds work</li>
        <li>👤 Managing your account</li>
        <li>📡 Streaming your live events</li>
      </ul>
    </div>
  );
}
