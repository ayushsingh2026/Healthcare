import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";


import '../../css/Contact.css';

const contactMethods = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" style={{width:22,height:22}}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    label: "Email Us",
    value: "support@medicare.health",
    sub: "We respond within 24 hours",
    color: "#0f766e",
    bg: "#f0fdfa",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" style={{width:22,height:22}}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
    label: "Call Us",
    value: "+91 1800-MED-CARE",
    sub: "Mon – Sat, 9 AM to 6 PM",
    color: "#0e7490",
    bg: "#ecfeff",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" style={{width:22,height:22}}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    label: "Visit Us",
    value: "New Delhi, India",
    sub: "MediCare HQ, Sector 62",
    color: "#0c4a6e",
    bg: "#f0f9ff",
  },
];

const topics = ["General Inquiry", "Technical Support", "Billing", "Doctor Partnership", "Lab Partnership", "Other"];

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", topic: "", message: "" });
  const [focused, setFocused] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setSubmitted(true); }, 1400);
  };

  const ff = (n) => focused === n;

  return (
    <>
      

      <Navbar />
      <div className="ct-root">

        {/* Hero */}
        <section className="ct-hero">
          <div className="ct-hero-inner">
            <div className="ct-pill"><span className="ct-pill-dot" /> We're here for you</div>
            <h1>Get in <em>touch</em></h1>
            <p>Whether you have a question, need support, or want to partner with us — our team is ready to help.</p>
          </div>
        </section>

        {/* Contact methods */}
        <div className="ct-methods">
          {contactMethods.map((m) => (
            <div className="ct-method" key={m.label}>
              <div className="ct-method-icon" style={{ background: m.bg, color: m.color }}>{m.icon}</div>
              <div className="ct-method-label">{m.label}</div>
              <div className="ct-method-val">{m.value}</div>
              <div className="ct-method-sub">{m.sub}</div>
            </div>
          ))}
        </div>

        {/* Main */}
        <div className="ct-main">

          {/* Info */}
          <div className="ct-info">
            <p className="ct-info-eyebrow">Support</p>
            <h2>How can we help you?</h2>
            <p>Browse common questions below, or send us a message and we'll get back to you as soon as possible.</p>
            <div className="ct-faq">
              <div className="ct-faq-item">
                <div className="ct-faq-q">How do I book a doctor?</div>
                <div className="ct-faq-a">Create a patient account, browse specialists, and select an available time slot — done in under a minute.</div>
              </div>
              <div className="ct-faq-item">
                <div className="ct-faq-q">How do I get my lab results?</div>
                <div className="ct-faq-a">Results are uploaded directly to your dashboard by the lab as soon as they're ready.</div>
              </div>
              <div className="ct-faq-item">
                <div className="ct-faq-q">Can I join as a doctor or lab?</div>
                <div className="ct-faq-a">Yes — register with the Doctor or Lab role. Our team will verify your profile within 48 hours.</div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="ct-form-card">
            {submitted ? (
              <div className="ct-success">
                <div className="ct-success-icon">
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3>Message sent!</h3>
                <p>Thanks for reaching out. We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <>
                <h2 className="ct-form-title">Send a Message</h2>
                <p className="ct-form-sub">We read every message and respond promptly.</p>

                <form onSubmit={handleSubmit}>
                  <div className="ct-row">
                    {/* Name */}
                    <div className="ct-field">
                      <div className="ct-field-wrap">
                        <span className={`ct-field-icon${ff("name") ? " focused" : ""}`}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </span>
                        <input name="name" type="text" placeholder="Your Name" className="ct-input"
                          value={form.name} onChange={handleChange}
                          onFocus={() => setFocused("name")} onBlur={() => setFocused(null)} />
                      </div>
                    </div>
                    {/* Email */}
                    <div className="ct-field">
                      <div className="ct-field-wrap">
                        <span className={`ct-field-icon${ff("email") ? " focused" : ""}`}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </span>
                        <input name="email" type="email" placeholder="Email Address" className="ct-input"
                          value={form.email} onChange={handleChange}
                          onFocus={() => setFocused("email")} onBlur={() => setFocused(null)} />
                      </div>
                    </div>
                  </div>

                  {/* Topic */}
                  <div className="ct-field">
                    <div className="ct-field-wrap">
                      <span className="ct-field-icon">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                      </span>
                      <select name="topic" className="ct-select" value={form.topic} onChange={handleChange}>
                        <option value="">Select a topic</option>
                        {topics.map((t) => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="ct-field" style={{ position: "relative" }}>
                    <span className={`ct-textarea-icon${ff("message") ? " focused" : ""}`}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                    </span>
                    <textarea name="message" placeholder="Write your message here…" rows="4"
                      className="ct-textarea"
                      value={form.message} onChange={handleChange}
                      onFocus={() => setFocused("message")} onBlur={() => setFocused(null)} />
                  </div>

                  <button type="submit" className="ct-submit" disabled={loading || !form.name || !form.email || !form.message}>
                    {loading ? (
                      <><span className="ct-spinner" /> Sending…</>
                    ) : (
                      <>
                        Send Message
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                      </>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>

        </div>
      </div>
      <Footer />
    </>
  );
};

export default Contact;


