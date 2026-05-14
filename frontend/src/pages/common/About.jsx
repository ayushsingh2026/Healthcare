import React from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";


import '../../css/About.css';

const stats = [
  { value: "10k+", label: "Patients Served" },
  { value: "100+", label: "Specialist Doctors" },
  { value: "25+",  label: "Diagnostic Labs" },
  { value: "99%",  label: "Satisfaction Rate" },
];

const values = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" style={{width:24,height:24}}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: "Trust & Safety",
    desc: "Every provider on our platform is verified. Your data is encrypted and handled with HIPAA-compliant standards.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" style={{width:24,height:24}}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: "Speed & Access",
    desc: "Book appointments, get lab results, and manage your health records in minutes — not days.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" style={{width:24,height:24}}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: "People First",
    desc: "We built MediCare with patients, doctors, and lab professionals at the center — every feature solves a real problem.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" style={{width:24,height:24}}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
      </svg>
    ),
    title: "End-to-End Care",
    desc: "From booking to diagnosis to follow-up — our unified platform keeps every stakeholder connected and informed.",
  },
];

const team = [
  { name: "Dr. Priya Sharma", role: "Chief Medical Officer", initial: "P" },
  { name: "Shubham Kushwa",      role: "Head of Engineering",  initial: "S" },
  { name: "Sara Qureshi",     role: "Patient Experience",   initial: "S" },
];

const About = () => {
  return (
    <>
      

      <Navbar />
      <div className="about-root">

        {/* Hero */}
        <section className="ab-hero">
          <div className="ab-hero-inner">
            <div className="ab-pill"><span className="ab-pill-dot" /> Our Story</div>
            <h1>Healthcare that puts <em>people first</em></h1>
            <p>
              MediCare was built with one belief: that accessing quality healthcare should be simple, transparent, and stress-free for everyone — patients, doctors, and labs alike.
            </p>
          </div>
        </section>

        {/* Stats */}
        <div className="ab-stats">
          {stats.map((s) => (
            <div className="ab-stat" key={s.label}>
              <div className="ab-stat-val">{s.value}</div>
              <div className="ab-stat-lbl">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Mission */}
        <section className="ab-section" style={{ marginTop: "4rem" }}>
          <p className="ab-eyebrow">Our Mission</p>
          <h2 className="ab-title">Why we built MediCare</h2>
          <div className="ab-mission-card">
            <div>
              <p className="ab-body">
                We started MediCare after seeing how fragmented healthcare access can be — long waits, disconnected systems, and lost paperwork. We knew there was a better way.
              </p>
              <p className="ab-body" style={{ marginTop: "1rem" }}>
                Today, our platform unifies patients, specialist doctors, diagnostic labs, and administrators into one seamless experience — so care can move at the speed of life.
              </p>
            </div>
            <div className="ab-mission-visual">
              <div className="ab-vis-line">
                <span className="ab-vis-dot" style={{ background: "#34d399" }} />
                Patient books appointment
              </div>
              <div className="ab-vis-line">
                <span className="ab-vis-dot" style={{ background: "#60a5fa" }} />
                Doctor reviews & confirms
              </div>
              <div className="ab-vis-line">
                <span className="ab-vis-dot" style={{ background: "#f59e0b" }} />
                Lab test scheduled
              </div>
              <div className="ab-vis-line">
                <span className="ab-vis-dot" style={{ background: "#c084fc" }} />
                Results delivered digitally
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="ab-section">
          <p className="ab-eyebrow">What We Stand For</p>
          <h2 className="ab-title">Our core values</h2>
          <div className="ab-values-grid">
            {values.map((v) => (
              <div className="ab-value-card" key={v.title}>
                <div className="ab-val-icon">{v.icon}</div>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Team */}
        <section className="ab-section">
          <p className="ab-eyebrow">The People Behind It</p>
          <h2 className="ab-title">Meet the team</h2>
          <div className="ab-team-grid">
            {team.map((t) => (
              <div className="ab-team-card" key={t.name}>
                <div className="ab-avatar">{t.initial}</div>
                <div className="ab-team-name">{t.name}</div>
                <div className="ab-team-role">{t.role}</div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="ab-cta">
          <div>
            <h2>Ready to experience it?</h2>
            <p>Join MediCare today — it takes less than two minutes to get started.</p>
          </div>
          <a href="/register" className="ab-cta-btn">Create Free Account</a>
        </div>

      </div>
      <Footer />
    </>
  );
};

export default About;


