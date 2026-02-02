import React from "react";

export default function Documentation() {
  return (
    <div className="page-container">
      <h1 className="page-title">Developer Documentation</h1>
      <p className="page-text">
        TickiSpot provides a powerful API, SDKs, and developer tools to help you 
        integrate event creation, ticketing, and livestream features seamlessly 
        into your web and mobile apps. 
        <br /><br />
        Get started quickly with our step-by-step guides, interactive examples, 
        and reference materials to build custom solutions that scale.
      </p>
      <a 
        href="/docs" 
        className="btn btn-secondary mt-4"
        target="_blank"
        rel="noopener noreferrer"
      >
        📖 View Developer Docs
      </a>
    </div>
  );
}
