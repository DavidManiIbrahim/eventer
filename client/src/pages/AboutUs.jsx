import React from "react";
import "./CSS/AboutUs.css";
import "./CSS/landing.css";
import { Link } from "react-router-dom";
import LandingNavbar from "../components/LandingNavbar";
import Footer from "../components/Footer";

export default function AboutUs() {
  return (
    <div className="landing-page">
      <div className="grid-background"></div>
      <LandingNavbar />

      <div style={{ paddingTop: "120px", paddingBottom: "60px", maxWidth: "800px", margin: "0 auto", paddingLeft: "20px", paddingRight: "20px", position: "relative", zIndex: 1 }}>
        <div className="section-header animate-in" style={{ marginBottom: "40px" }}>
          <h1 className="section-title">
            <span className="title-box title-box-border">About</span>
            <span className="title-box title-box-filled">Us</span>
          </h1>
        </div>

        <div className="feature-card animate-in" style={{ padding: "2rem" }}>
          <p style={{ fontSize: "1.2rem", lineHeight: "1.6", marginBottom: "2rem", color: "var(--text-color)" }}>
            Welcome to <strong>TickiSpot</strong>  your all-in-one event management platform.
            We empower organizers and attendees alike to create, promote, and manage events effortlessly,
            ensuring every gathering big or small is a success.
          </p>

          <section style={{ marginBottom: "2rem" }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1rem" }}>Our Mission</h2>
            <p style={{ lineHeight: "1.6", color: "var(--text-muted)" }}>
              Our mission is to simplify event management through intuitive, technology-driven solutions,
              making every event seamless, engaging, and unforgettable.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1rem" }}>Our Story</h2>
            <p style={{ lineHeight: "1.6", color: "var(--text-muted)" }}>
              Founded with a passion for connecting people, TickiSpot provides organizers the tools to manage,
              promote, and sell tickets with ease  from concerts and conferences to online meetups.
            </p>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}
