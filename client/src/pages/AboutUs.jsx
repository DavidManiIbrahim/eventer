import React from "react";
import "./CSS/AboutUs.css";
import { Link } from "react-router-dom";

export default function AboutUs() {
  return (
    <div className="static-page">
      <h1>About Us</h1>
      <p>
        Welcome to <strong>TickiSpot</strong> — your all-in-one event management platform. 
        We empower organizers and attendees alike to create, promote, and manage events effortlessly, 
        ensuring every gathering — big or small — is a success.
      </p>

      <section>
        <h2>Our Mission</h2>
        <p>
          Our mission is to simplify event management through intuitive, technology-driven solutions, 
          making every event seamless, engaging, and unforgettable.
        </p>
      </section>

      <section>
        <h2>Our Story</h2>
        <p>
          Founded with a passion for connecting people, TickiSpot provides organizers the tools to manage, 
          promote, and sell tickets with ease — from concerts and conferences to online meetups.
        </p>
      </section>

      <footer className="page-footer">
        <Link to="/">← Back to Home</Link>
      </footer>
    </div>
  );
}
