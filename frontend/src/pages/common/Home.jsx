import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";


import '../../css/Home.css';

const stats = [
  { value: "100+", label: "Specialist Doctors", icon: "🩺" },
  { value: "25+",  label: "Diagnostic Labs",    icon: "🔬" },
  { value: "10k+", label: "Patients Served",    icon: "❤️" },
  { value: "99%",  label: "Satisfaction Rate",  icon: "⭐" },
];

const features = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="feat-svg">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    title: "Easy Appointments",
    desc: "Book doctor visits in seconds. Real-time slot availability, instant confirmations.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="feat-svg">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
    title: "Lab Test Booking",
    desc: "Schedule diagnostics at 25+ trusted labs. Receive results digitally.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="feat-svg">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: "Secure & Private",
    desc: "HIPAA-compliant, role-based dashboards. Your data is encrypted end-to-end.",
  },
];

const Home = () => {
  return (
    <>
      

      <Navbar />

      <div className="home-root">
        {/* Hero */}
        <section className="hero">
          <div className="hero-inner">
            <div className="hero-pill">
              <span className="pill-dot" />
              Trusted Healthcare Platform
            </div>
            <h1>
              Better Care,<br />
              <em>Faster Access.</em>
            </h1>
            <p>
              Connect with top specialists, schedule lab tests, and manage your health journey — all from one secure, seamless platform.
            </p>
            <div className="hero-cta">
              <Link to="/login" className="btn-primary">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Sign In
              </Link>
              <Link to="/register" className="btn-outline">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                Create Account
              </Link>
            </div>
          </div>
        </section>

        {/* Stats */}
        <div className="stats-strip">
          {stats.map((s) => (
            <div className="stat-card" key={s.label}>
              <div className="stat-icon">{s.icon}</div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Features */}
        <section className="features-section">
          <p className="section-eyebrow">Why MediCare</p>
          <h2 className="section-title">Everything you need,<br />in one place</h2>
          <div className="features-grid">
            {features.map((f) => (
              <div className="feature-card" key={f.title}>
                <div className="feat-icon-wrap">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Banner */}
        <div className="cta-banner">
          <div>
            <h2>Ready to get started?</h2>
            <p>Join thousands of patients managing their healthcare with confidence.</p>
          </div>
          <div className="cta-actions">
            <Link to="/register" className="cta-btn-white">Create Free Account</Link>
            <Link to="/login" className="cta-btn-ghost">Sign In</Link>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Home;


