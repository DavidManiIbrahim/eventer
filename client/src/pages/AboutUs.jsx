import React from "react";
import "./CSS/AboutUs.css"
import { Link } from "react-router-dom";

export default function AboutUs() {
  return (
    
    <div className="static-page">
      <h1>About Us</h1>
      <p>
        Welcome to <strong>TickiSpot</strong> — your all-in-one event management platform that helps you
        create, promote, and manage events effortlessly. We believe in making
        every gathering — big or small — a success.
      </p>

      <section>
        <h2>Our Mission</h2>
        <p>
          Our goal is to empower event creators and attendees through
          technology-driven solutions that make organizing and joining events
          seamless and exciting.
        </p>
      </section>

      <section>
        <h2>Our Story</h2>
        <p>
          Founded with a passion for bringing people together, TickiSpot helps
          organizers manage, promote, and sell tickets with ease — whether for
          concerts, conferences, or online meetups.
        </p>
      </section>

      <footer className="page-footer">
        <Link to="/">← Back to Home</Link>
      </footer>
    </div>
  );
}
