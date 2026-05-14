import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import Sidebar from "../../components/Sidebar";
import api from "../../services/api";
import { resolveMediaUrl } from "../../utils/constants";

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&family=Sora:wght@300;400;500;600&display=swap');

  :root {
    --white: #ffffff;
    --surface: #f5f7fa;
    --ink: #0d1117;
    --ink2: #3a4150;
    --muted: #8a93a3;
    --line: #e8ecf2;
    --line2: #d2d8e3;
    --blue: #1a6ef5;
    --blue-lt: #eef3fe;
    --blue-mid: #c5d8fd;
    --teal: #0b9e8a;
    --teal-lt: #e5f7f5;
    --green: #179a52;
    --green-lt: #e8f7ee;
    --amber: #d97706;
    --amber-lt: #fef3e2;
    --sidebar-w: 260px;
    --rx: 20px;
    --rm: 12px;
    --ease: cubic-bezier(.4,0,.2,1);
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  /* Root: flex row */
  .dr-root {
    display: flex;
    min-height: 100vh;
    background: var(--surface);
    font-family: 'Sora', sans-serif;
    color: var(--ink);
  }

  /* Sidebar column */
  .dr-sidebar-wrap {
    width: var(--sidebar-w);
    flex-shrink: 0;
    z-index: 100;
    align-self: stretch;
    transition: width .25s var(--ease);
  }

  .dr-sidebar-wrap > div {
    width: var(--sidebar-w) !important;
    height: 100%;
    min-height: 100vh;
    background:
      radial-gradient(140% 80% at 0% 0%, #23365e 0%, transparent 52%),
      linear-gradient(180deg, #172644 0%, #111c35 100%);
    color: var(--white);
    padding: 22px 16px;
    border-right: 1px solid rgba(255,255,255,.08);
    box-shadow: inset -1px 0 0 rgba(255,255,255,.03);
  }

  .dr-sidebar-wrap h2 {
    font-family: 'Playfair Display', serif;
    font-size: 2rem;
    line-height: 1.05;
    letter-spacing: .02em;
    margin-bottom: 20px;
    color: #f8fbff;
  }

  .dr-sidebar-wrap h2::after {
    content: "";
    display: block;
    width: 42px;
    height: 3px;
    border-radius: 999px;
    margin-top: 10px;
    background: linear-gradient(90deg, #9ec1ff 0%, #6ba0ff 100%);
    opacity: .95;
  }

  .dr-sidebar-wrap .flex.flex-col.gap-3 { gap: 10px; }

  .dr-sidebar-wrap a {
    background: rgba(255,255,255,.10) !important;
    border: 1px solid rgba(255,255,255,.08);
    border-radius: 12px !important;
    padding: 11px 14px !important;
    font-weight: 500;
    color: #e8f0ff;
    transition: all .2s var(--ease);
  }

  .dr-sidebar-wrap a:hover {
    background: rgba(120,165,255,.26) !important;
    border-color: rgba(179,206,255,.45);
    transform: translateX(2px);
  }

  .dr-sidebar-wrap button {
    margin-top: 14px !important;
    border: 1px solid rgba(255,255,255,.14);
    border-radius: 12px !important;
    background: linear-gradient(180deg, #ff3c4e 0%, #e11d48 100%) !important;
    color: #fff;
    font-weight: 600;
    transition: filter .15s, transform .12s;
  }

  .dr-sidebar-wrap button:hover { filter: brightness(1.05); transform: translateY(-1px); }

  .dr-sidebar-wrap.off { width: 0; overflow: hidden; }

  /* Toggle */
  .dr-toggle {
    position: fixed;
    top: 22px;
    left: calc(var(--sidebar-w) + 14px);
    z-index: 200;
    width: 38px;
    height: 38px;
    border-radius: 50%;
    border: 1px solid var(--line2);
    background: var(--white);
    color: var(--ink2);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all .2s var(--ease);
  }
  .dr-toggle.off { left: 14px; }
  .dr-toggle:hover { background: var(--ink); color: var(--white); border-color: var(--ink); }
  .dr-toggle svg { width: 16px; height: 16px; }

  /* Main */
  .dr-main {
    flex: 1;
    min-width: 0;
    padding: 40px 48px 80px;
    transition: padding .25s var(--ease);
  }
  .dr-main.wide { padding-left: 68px; }

  .dr-wrap { max-width: 1100px; margin: 0 auto; }

  /* Back */
  .dr-back {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: var(--muted);
    background: none;
    border: none;
    cursor: pointer;
    font-size: .8rem;
    font-weight: 500;
    letter-spacing: .03em;
    text-transform: uppercase;
    padding: 0;
    margin-bottom: 32px;
    transition: color .18s var(--ease);
  }
  .dr-back:hover { color: var(--blue); }
  .dr-back svg { width: 14px; height: 14px; }

  /* Hero */
  .dr-hero {
    background: var(--white);
    border: 1px solid var(--line);
    border-radius: var(--rx);
    padding: 44px 48px;
    margin-bottom: 24px;
    display: flex;
    gap: 48px;
    align-items: flex-start;
  }

  .dr-avatar-col {
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }

  .dr-avatar-ring {
    position: relative;
    width: 168px;
    height: 168px;
  }

  .dr-avatar-ring::before {
    content: '';
    position: absolute;
    inset: -4px;
    border-radius: 50%;
    border: 1.5px dashed var(--blue-mid);
  }

  .dr-img {
    width: 168px;
    height: 168px;
    object-fit: cover;
    border-radius: 50%;
    border: 3px solid var(--white);
    box-shadow: 0 0 0 1px var(--line);
  }

  .dr-avail-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: var(--green-lt);
    border: 1px solid #b7e8cf;
    border-radius: 20px;
    padding: 5px 14px;
    font-size: .72rem;
    font-weight: 600;
    color: var(--green);
    white-space: nowrap;
  }

  .dr-avail-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: var(--green);
    animation: pulse 1.8s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: .5; transform: scale(1.4); }
  }

  .dr-hero-info { flex: 1; min-width: 0; }

  .dr-spec-badge {
    display: inline-block;
    background: var(--blue-lt);
    color: var(--blue);
    border: 1px solid var(--blue-mid);
    padding: 4px 14px;
    border-radius: 20px;
    font-size: .7rem;
    font-weight: 600;
    letter-spacing: .04em;
    text-transform: uppercase;
    margin-bottom: 16px;
  }

  .dr-name {
    font-family: 'Playfair Display', serif;
    font-size: 2.6rem;
    font-weight: 500;
    color: var(--ink);
    line-height: 1.15;
    margin-bottom: 12px;
  }

  .dr-tagline {
    font-size: .88rem;
    color: var(--ink2);
    line-height: 1.75;
    margin-bottom: 28px;
    max-width: 560px;
  }

  .dr-stat-row {
    display: flex;
    margin-bottom: 32px;
    border: 1px solid var(--line);
    border-radius: var(--rm);
    overflow: hidden;
  }

  .dr-stat { flex: 1; padding: 16px 20px; border-right: 1px solid var(--line); }
  .dr-stat:last-child { border-right: none; }
  .dr-stat-val { font-size: 1.25rem; font-weight: 600; color: var(--ink); margin-bottom: 3px; }
  .dr-stat-lbl { font-size: .68rem; color: var(--muted); text-transform: uppercase; letter-spacing: .05em; font-weight: 500; }

  .dr-hero-actions { display: flex; gap: 12px; }

  .dr-btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: var(--ink);
    color: var(--white);
    border: none;
    padding: 13px 28px;
    border-radius: var(--rm);
    font-family: 'Sora', sans-serif;
    font-size: .85rem;
    font-weight: 600;
    cursor: pointer;
    transition: background .18s var(--ease), transform .12s var(--ease);
  }
  .dr-btn-primary:hover { background: var(--blue); transform: translateY(-1px); }
  .dr-btn-primary svg { width: 16px; height: 16px; }

  .dr-btn-ghost {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: none;
    color: var(--ink2);
    border: 1px solid var(--line2);
    padding: 13px 22px;
    border-radius: var(--rm);
    font-family: 'Sora', sans-serif;
    font-size: .85rem;
    font-weight: 500;
    cursor: pointer;
    transition: border-color .18s, color .18s;
  }
  .dr-btn-ghost:hover { border-color: var(--ink); color: var(--ink); }
  .dr-btn-ghost svg { width: 16px; height: 16px; }

  /* Info grid */
  .dr-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; }

  .dr-card { background: var(--white); border: 1px solid var(--line); border-radius: var(--rx); padding: 28px 32px; }
  .dr-card.span2 { grid-column: span 2; }
  .dr-card.full  { grid-column: span 3; }

  .dr-card-head {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 1px solid var(--line);
  }

  .dr-card-icon { width: 34px; height: 34px; border-radius: 9px; display: flex; align-items: center; justify-content: center; font-size: .95rem; }
  .dr-card-icon.blue  { background: var(--blue-lt); }
  .dr-card-icon.teal  { background: var(--teal-lt); }
  .dr-card-icon.amber { background: var(--amber-lt); }
  .dr-card-icon.green { background: var(--green-lt); }

  .dr-card-title { font-family: 'Playfair Display', serif; font-size: 1.15rem; font-weight: 500; color: var(--ink); }

  .dr-details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }

  .dr-field-lbl { font-size: .67rem; color: var(--muted); text-transform: uppercase; letter-spacing: .06em; font-weight: 600; margin-bottom: 5px; }
  .dr-field-val { font-size: .88rem; color: var(--ink); font-weight: 500; word-break: break-word; }
  .dr-field-val.blue  { color: var(--blue); }
  .dr-field-val.green { color: var(--green); }

  /* Rating */
  .dr-rating-big { text-align: center; padding: 12px 0 20px; }
  .dr-rating-num { font-family: 'Playfair Display', serif; font-size: 3.8rem; font-weight: 600; color: var(--ink); line-height: 1; margin-bottom: 6px; }
  .dr-stars { font-size: 1.1rem; color: var(--amber); letter-spacing: 2px; margin-bottom: 6px; }
  .dr-rating-sub { font-size: .72rem; color: var(--muted); }

  .dr-bar-row { margin-bottom: 14px; }
  .dr-bar-label-row { display: flex; justify-content: space-between; margin-bottom: 6px; }
  .dr-bar-lbl { font-size: .75rem; color: var(--ink2); }
  .dr-bar-pct { font-size: .75rem; font-weight: 600; color: var(--amber); }
  .dr-bar-track { height: 3px; background: var(--line); border-radius: 2px; }
  .dr-bar-fill  { height: 100%; background: var(--amber); border-radius: 2px; }

  /* Tags */
  .dr-tags { display: flex; flex-wrap: wrap; gap: 8px; }
  .dr-tag { background: var(--surface); border: 1px solid var(--line); color: var(--ink2); padding: 5px 12px; border-radius: 6px; font-size: .73rem; font-weight: 500; }

  /* About */
  .dr-about-text { font-size: .88rem; color: var(--ink2); line-height: 1.8; font-style: italic; padding-left: 18px; border-left: 3px solid var(--line2); }

  /* Availability */
  .dr-avail-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 10px; }
  .dr-avail-day { background: var(--surface); border: 1px solid var(--line); border-radius: var(--rm); padding: 14px 12px; text-align: center; }
  .dr-avail-day-name { font-size: .7rem; font-weight: 600; color: var(--muted); text-transform: uppercase; letter-spacing: .06em; margin-bottom: 8px; }
  .dr-avail-day-time { font-size: .78rem; font-weight: 600; color: var(--green); }

  /* CTA */
  .dr-cta {
    margin-top: 24px;
    background: var(--ink);
    border-radius: var(--rx);
    padding: 32px 44px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
  }
  .dr-cta-label { font-size: .7rem; font-weight: 600; letter-spacing: .1em; text-transform: uppercase; color: rgba(255,255,255,.4); margin-bottom: 6px; }
  .dr-cta-title { font-family: 'Playfair Display', serif; font-size: 1.6rem; color: var(--white); font-weight: 500; }
  .dr-cta-sub   { font-size: .8rem; color: rgba(255,255,255,.5); margin-top: 4px; }
  .dr-cta-btn {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    background: var(--white);
    color: var(--ink);
    border: none;
    padding: 14px 32px;
    border-radius: var(--rm);
    font-family: 'Sora', sans-serif;
    font-size: .85rem;
    font-weight: 700;
    cursor: pointer;
    white-space: nowrap;
    transition: background .18s, transform .12s;
  }
  .dr-cta-btn:hover { background: var(--blue-lt); transform: translateY(-1px); }
  .dr-cta-btn svg { width: 16px; height: 16px; }

  /* Skeleton */
  .dr-skel {
    background: linear-gradient(90deg, var(--line) 25%, var(--surface) 50%, var(--line) 75%);
    background-size: 200% 100%;
    animation: shimmer 1.4s infinite;
    border-radius: var(--rx);
  }
  @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

  /* Responsive */
  @media (max-width: 960px) {
    .dr-main { padding: 20px; }
    .dr-hero { flex-direction: column; align-items: center; text-align: center; padding: 32px 24px; }
    .dr-tagline { max-width: 100%; }
    .dr-stat-row { flex-wrap: wrap; }
    .dr-hero-actions { justify-content: center; }
    .dr-grid { grid-template-columns: 1fr; }
    .dr-card.span2, .dr-card.full { grid-column: span 1; }
    .dr-avail-grid { grid-template-columns: repeat(3, 1fr); }
    .dr-cta { flex-direction: column; text-align: center; padding: 28px 24px; }
    .dr-details-grid { grid-template-columns: 1fr; }
  }

  @media (max-width: 768px) {
    .dr-sidebar-wrap { position: fixed; top: 0; left: 0; height: 100%; }
    .dr-sidebar-wrap.off { transform: translateX(-100%); width: var(--sidebar-w); overflow: visible; }
  }
`;

const DoctorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(true);
  const doctorDisplayName = (doctor?.name || "").replace(/^dr\.?\s*/i, "").trim();
  const doctorImage =
    resolveMediaUrl(doctor?.profilePhoto || doctor?.photoUrl) ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(doctorDisplayName || doctor?.name || "Doctor")}&background=0d1117&color=ffffff&size=400`;

  const loadDoctor = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const { data } = await api.get(`/doctors/${id}`);
      setDoctor(data);
    } catch (e) {
      if (!silent) toast.error(e.response?.data?.message || "Failed to load doctor");
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    loadDoctor();
    const intervalId = setInterval(() => loadDoctor(true), 10000);
    const onFocus = () => loadDoctor(true);
    window.addEventListener("focus", onFocus);
    return () => {
      clearInterval(intervalId);
      window.removeEventListener("focus", onFocus);
    };
  }, [id]);

  const days  = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const times = ["9–12 AM", "10–1 PM", "9–11 AM", "11–2 PM", "9–1 PM", "10–12 PM"];

  const CalIcon = () => (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
    </svg>
  );

  const PhoneIcon = () => (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
    </svg>
  );

  const BackArrow = () => (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
    </svg>
  );

  const ChevronLeft = () => (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
    </svg>
  );

  const BurgerIcon = () => (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
    </svg>
  );

  return (
    <>
      <style>{S}</style>
      <div className="dr-root">

        {/* Sidebar */}
        <div className={`dr-sidebar-wrap${open ? "" : " off"}`}>
          <Sidebar role="patient" />
        </div>

        {/* Toggle */}
        <button
          className={`dr-toggle${open ? "" : " off"}`}
          onClick={() => setOpen(v => !v)}
          aria-label="Toggle sidebar"
        >
          {open ? <ChevronLeft /> : <BurgerIcon />}
        </button>

        {/* Main */}
        <div className={`dr-main${open ? "" : " wide"}`}>
          <div className="dr-wrap">

            <button className="dr-back" onClick={() => navigate(-1)}>
              <BackArrow /> Back to Doctors
            </button>

            {loading ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div className="dr-skel" style={{ height: 280 }} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}>
                  {[1, 2, 3].map(i => <div key={i} className="dr-skel" style={{ height: 200 }} />)}
                </div>
              </div>
            ) : !doctor ? (
              <p style={{ color: "var(--muted)", textAlign: "center", padding: "80px 0" }}>
                Doctor not found.
              </p>
            ) : (
              <>
                {/* HERO */}
                <div className="dr-hero">
                  <div className="dr-avatar-col">
                    <div className="dr-avatar-ring">
                      <img
                        className="dr-img"
                        src={doctorImage}
                        alt={doctor.name}
                      />
                    </div>
                    <div className="dr-avail-pill">
                      <span className="dr-avail-dot" />
                      Accepting Patients
                    </div>
                  </div>

                  <div className="dr-hero-info">
                    <div className="dr-spec-badge">{doctor.specialization || "Physician"}</div>
                    <h1 className="dr-name">Dr. {doctorDisplayName}</h1>
                    <p className="dr-tagline">
                      {doctor.bio ||
                        "Providing compassionate, evidence-based care for every patient — with dedication, precision, and a commitment to long-term health outcomes."}
                    </p>

                    <div className="dr-stat-row">
                      <div className="dr-stat">
                        <div className="dr-stat-val">{doctor.experience || 0}+</div>
                        <div className="dr-stat-lbl">Years Exp.</div>
                      </div>
                      <div className="dr-stat">
                        <div className="dr-stat-val">4.9</div>
                        <div className="dr-stat-lbl">Rating</div>
                      </div>
                      <div className="dr-stat">
                        <div className="dr-stat-val">120+</div>
                        <div className="dr-stat-lbl">Reviews</div>
                      </div>
                      <div className="dr-stat">
                        <div className="dr-stat-val">{doctor.education || "MD"}</div>
                        <div className="dr-stat-lbl">Degree</div>
                      </div>
                    </div>

                    <div className="dr-hero-actions">
                      <button
                        className="dr-btn-primary"
                        onClick={() => navigate(`/patient/book-appointment/${doctor._id}`)}
                      >
                        <CalIcon /> Book Appointment
                      </button>
                      <button className="dr-btn-ghost">
                        <PhoneIcon /> {doctor.phone || "Contact"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* INFO GRID */}
                <div className="dr-grid">

                  {/* Professional Details */}
                  <div className="dr-card span2">
                    <div className="dr-card-head">
                      <div className="dr-card-icon blue">🩺</div>
                      <span className="dr-card-title">Professional Details</span>
                    </div>
                    <div className="dr-details-grid">
                      {[
                        { lbl: "Full Name",      val: `Dr. ${doctorDisplayName}`,              cls: "" },
                        { lbl: "Specialization", val: doctor.specialization || "General",       cls: "blue" },
                        { lbl: "Education",      val: doctor.education || "—",                  cls: "" },
                        { lbl: "Hospital",       val: doctor.hospitalLocation || "—",           cls: "" },
                        { lbl: "Availability",   val: doctor.availabilityTime || "Mon–Fri 9–5", cls: "green" },
                        { lbl: "Contact",        val: doctor.phone || "—",                      cls: "" },
                        { lbl: "Age",            val: doctor.age || "—",                        cls: "" },
                        { lbl: "Email",          val: doctor.email || "—",                      cls: "blue" },
                      ].map(({ lbl, val, cls }) => (
                        <div key={lbl}>
                          <div className="dr-field-lbl">{lbl}</div>
                          <div className={`dr-field-val${cls ? " " + cls : ""}`}>{val}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="dr-card">
                    <div className="dr-card-head">
                      <div className="dr-card-icon amber">⭐</div>
                      <span className="dr-card-title">Rating</span>
                    </div>
                    <div className="dr-rating-big">
                      <div className="dr-rating-num">4.9</div>
                      <div className="dr-stars">★★★★★</div>
                      <div className="dr-rating-sub">120 patient reviews</div>
                    </div>
                    <div style={{ marginTop: 16 }}>
                      {[["Expertise", "97%"], ["Bedside Manner", "95%"], ["Punctuality", "92%"]].map(([lbl, pct]) => (
                        <div className="dr-bar-row" key={lbl}>
                          <div className="dr-bar-label-row">
                            <span className="dr-bar-lbl">{lbl}</span>
                            <span className="dr-bar-pct">{pct}</span>
                          </div>
                          <div className="dr-bar-track">
                            <div className="dr-bar-fill" style={{ width: pct }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Areas of Expertise */}
                  <div className="dr-card">
                    <div className="dr-card-head">
                      <div className="dr-card-icon teal">🔬</div>
                      <span className="dr-card-title">Areas of Expertise</span>
                    </div>
                    <div className="dr-tags">
                      {(doctor.specialization ? [doctor.specialization] : [])
                        .concat(["Diagnosis", "Patient Care", "Surgery", "Consultation", "Emergency", "Research"])
                        .slice(0, 8)
                        .map(t => <span className="dr-tag" key={t}>{t}</span>)}
                    </div>
                  </div>

                  {/* About */}
                  <div className="dr-card">
                    <div className="dr-card-head">
                      <div className="dr-card-icon green">💬</div>
                      <span className="dr-card-title">About</span>
                    </div>
                    <p className="dr-about-text">
                      {doctor.bio ||
                        "Committed to delivering evidence-based, compassionate medical care with a patient-first approach. Every visit is an opportunity to listen, diagnose, and heal."}
                    </p>
                  </div>

                  {/* Weekly Availability */}
                  <div className="dr-card full">
                    <div className="dr-card-head">
                      <div className="dr-card-icon green">📅</div>
                      <span className="dr-card-title">Weekly Availability</span>
                    </div>
                    <div className="dr-avail-grid">
                      {days.map((d, i) => (
                        <div className="dr-avail-day" key={d}>
                          <div className="dr-avail-day-name">{d}</div>
                          <div className="dr-avail-day-time">{times[i]}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* CTA */}
                <div className="dr-cta">
                  <div>
                    <div className="dr-cta-label">Ready to get started?</div>
                    <div className="dr-cta-title">Book with Dr. {doctorDisplayName}</div>
                    <div className="dr-cta-sub">Slots available this week · Confirmation within minutes</div>
                  </div>
                  <button
                    className="dr-cta-btn"
                    onClick={() => navigate(`/patient/book-appointment/${doctor._id}`)}
                  >
                    <CalIcon /> Book Appointment
                  </button>
                </div>

              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default DoctorDetails;
