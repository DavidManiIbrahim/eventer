import React from "react";

export default function Pricing() {
  return (
    <div className="page-container">
      <h1 className="page-title">Pricing</h1>
      <div className="pricing-grid">
        <div className="pricing-card">
          <h2>Free</h2>
          <p>₦0/month</p>
          <ul>
            <li>2 Events per month</li>
            <li>Basic Support</li>
            <li>Community Access</li>
          </ul>
        </div>
        <div className="pricing-card highlight">
          <h2>Pro</h2>
          <p>₦4,999/month</p>
          <ul>
            <li>Unlimited Events</li>
            <li>Analytics Dashboard</li>
            <li>Priority Support</li>
          </ul>
        </div>
        <div className="pricing-card">
          <h2>Enterprise</h2>
          <p>Custom</p>
          <ul>
            <li>Dedicated Manager</li>
            <li>Custom Branding</li>
            <li>Full Integrations</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
