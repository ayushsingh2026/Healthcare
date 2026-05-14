import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import { resolveMediaUrl } from "../../utils/constants";

const G = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&family=Sora:wght@300;400;500;600&display=swap');

  :root {
    --white: #ffffff;
    --off: #fafafa;
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
    --red-lt: #fef2f2;
    --red: #dc2626;
    --sidebar-w: 260px;
    --rx: 20px;
    --rm: 12px;
    --ease: cubic-bezier(.4,0,.2,1);
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .pd-root {
    display: flex;
    min-height: 100vh;
    background: var(--surface);
    font-family: 'Sora', sans-serif;
    color: var(--ink);
  }

  .pd-sidebar-wrap {
    width: var(--sidebar-w);
    flex-shrink: 0;
    z-index: 100;
    align-self: stretch;
  }

  /* Patient panel theme overrides for shared Sidebar */
  .pd-sidebar-wrap > div {
    width: var(--sidebar-w) !important;
    height: 100%;
    min-height: 100%;
    background:
      radial-gradient(140% 80% at 0% 0%, #23365e 0%, transparent 52%),
      linear-gradient(180deg, #172644 0%, #111c35 100%);
    color: var(--white);
    padding: 22px 16px;
    border-right: 1px solid rgba(255, 255, 255, .08);
    box-shadow: inset -1px 0 0 rgba(255, 255, 255, .03);
  }

  .pd-sidebar-wrap h2 {
    font-family: 'Playfair Display', serif;
    font-size: 2rem;
    line-height: 1.05;
    letter-spacing: .02em;
    margin-bottom: 20px;
    color: #f8fbff;
  }

  .pd-sidebar-wrap h2::after {
    content: "";
    display: block;
    width: 42px;
    height: 3px;
    border-radius: 999px;
    margin-top: 10px;
    background: linear-gradient(90deg, #9ec1ff 0%, #6ba0ff 100%);
    opacity: .95;
  }

  .pd-sidebar-wrap .flex.flex-col.gap-3 {
    gap: 10px;
  }

  .pd-sidebar-wrap a {
    background: rgba(255, 255, 255, .10) !important;
    border: 1px solid rgba(255, 255, 255, .08);
    border-radius: 12px !important;
    padding: 11px 14px !important;
    font-weight: 500;
    color: #e8f0ff;
    transition: all .2s var(--ease);
  }

  .pd-sidebar-wrap a:hover {
    background: rgba(120, 165, 255, .26) !important;
    border-color: rgba(179, 206, 255, .45);
    transform: translateX(2px);
  }

  .pd-sidebar-wrap button {
    margin-top: 14px !important;
    border: 1px solid rgba(255, 255, 255, .14);
    border-radius: 12px !important;
    background: linear-gradient(180deg, #ff3c4e 0%, #e11d48 100%) !important;
    color: #fff;
    font-weight: 600;
    letter-spacing: .01em;
    transition: filter .15s, transform .12s;
  }

  .pd-sidebar-wrap button:hover {
    filter: brightness(1.03);
    transform: translateY(-1px);
  }

  .pd-sidebar-wrap.off {
    width: 0;
    overflow: hidden;
  }

  .pd-toggle {
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

  .pd-toggle.off { left: 14px; }
  .pd-toggle:hover { background: var(--ink); color: var(--white); border-color: var(--ink); }
  .pd-toggle svg { width: 16px; height: 16px; }

  .pd-main {
    flex: 1;
    min-width: 0;
    padding: 40px 48px 80px;
  }

  .pd-main.wide { padding-left: 68px; }

  /* Page header */
  .pd-page-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 32px;
  }

  .pd-page-eyebrow {
    font-size: .68rem;
    font-weight: 600;
    letter-spacing: .1em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 4px;
  }

  .pd-page-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.9rem;
    font-weight: 500;
    color: var(--ink);
  }

  .pd-date-pill {
    background: var(--white);
    border: 1px solid var(--line);
    border-radius: 20px;
    padding: 7px 16px;
    font-size: .75rem;
    color: var(--muted);
    font-weight: 500;
  }

  /* Hero card */
  .pd-hero {
    background: var(--white);
    border: 1px solid var(--line);
    border-radius: var(--rx);
    padding: 36px 40px;
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    gap: 36px;
  }

  .pd-avatar {
    width: 68px;
    height: 68px;
    border-radius: 50%;
    background: var(--ink);
    color: var(--white);
    font-size: 1.4rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    border: 3px solid var(--white);
    box-shadow: 0 0 0 1.5px var(--line2);
  }

  .pd-hero-text { flex: 1; min-width: 0; }

  .pd-welcome {
    font-family: 'Playfair Display', serif;
    font-size: 1.7rem;
    font-weight: 500;
    color: var(--ink);
    margin-bottom: 6px;
  }

  .pd-hero-sub {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }

  .pd-status-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: var(--green-lt);
    border: 1px solid #b7e8cf;
    border-radius: 20px;
    padding: 4px 12px;
    font-size: .7rem;
    font-weight: 600;
    color: var(--green);
  }

  .pd-status-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: var(--green);
    animation: blink 1.8s ease-in-out infinite;
  }

  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: .35; }
  }

  .pd-patient-id {
    font-size: .72rem;
    color: var(--muted);
    font-weight: 500;
  }

  .pd-hero-info {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 0;
    border: 1px solid var(--line);
    border-radius: var(--rm);
    overflow: hidden;
  }

  .pd-info-cell {
    padding: 14px 18px;
    border-right: 1px solid var(--line);
  }

  .pd-info-cell:last-child { border-right: none; }

  .pd-info-cell.highlight { background: #fffbeb; }

  .pd-info-lbl {
    font-size: .65rem;
    font-weight: 600;
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: .06em;
    margin-bottom: 5px;
  }

  .pd-info-val {
    font-size: .83rem;
    font-weight: 500;
    color: var(--ink);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .pd-info-val.amber { color: var(--amber); }

  /* Stats */
  .pd-stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    margin-bottom: 32px;
  }

  .pd-stat {
    background: var(--white);
    border: 1px solid var(--line);
    border-radius: var(--rx);
    padding: 22px 24px;
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .pd-stat-icon {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.1rem;
    flex-shrink: 0;
  }

  .pd-stat-icon.blue  { background: var(--blue-lt); }
  .pd-stat-icon.amber { background: var(--amber-lt); }
  .pd-stat-icon.red   { background: var(--red-lt); }
  .pd-stat-icon.green { background: var(--green-lt); }

  .pd-stat-num {
    font-family: 'Playfair Display', serif;
    font-size: 1.8rem;
    font-weight: 500;
    color: var(--ink);
    line-height: 1;
    margin-bottom: 3px;
  }

  .pd-stat-lbl {
    font-size: .72rem;
    color: var(--muted);
    font-weight: 500;
  }

  /* Section head */
  .pd-section-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
    padding-bottom: 16px;
    border-bottom: 1px solid var(--line);
  }

  .pd-section-left {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .pd-section-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.35rem;
    font-weight: 500;
    color: var(--ink);
  }

  .pd-section-count {
    background: var(--blue-lt);
    color: var(--blue);
    border: 1px solid var(--blue-mid);
    padding: 3px 10px;
    border-radius: 20px;
    font-size: .7rem;
    font-weight: 600;
  }

  /* Doctor cards grid */
  .pd-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
    gap: 20px;
  }

  .pd-doc-card {
    background: var(--white);
    border: 1px solid var(--line);
    border-radius: var(--rx);
    overflow: hidden;
    transition: transform .2s var(--ease), box-shadow .2s var(--ease);
  }

  .pd-doc-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(0,0,0,.08);
  }

  .pd-doc-img-wrap {
    height: 180px;
    position: relative;
    overflow: hidden;
    background: var(--surface);
  }

  .pd-doc-img-wrap img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .pd-spec-badge {
    position: absolute;
    bottom: 10px;
    left: 10px;
    background: var(--ink);
    color: var(--white);
    padding: 4px 10px;
    border-radius: 6px;
    font-size: .65rem;
    font-weight: 600;
    letter-spacing: .03em;
  }

  .pd-online-badge {
    position: absolute;
    top: 10px;
    right: 10px;
    background: var(--white);
    border: 1px solid #b7e8cf;
    color: var(--green);
    padding: 4px 10px;
    border-radius: 20px;
    font-size: .65rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .pd-online-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: var(--green);
    animation: blink 1.8s ease-in-out infinite;
  }

  .pd-doc-body {
    padding: 20px;
  }

  .pd-doc-name {
    font-family: 'Playfair Display', serif;
    font-size: 1.15rem;
    font-weight: 500;
    color: var(--ink);
    margin-bottom: 10px;
  }

  .pd-doc-meta {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
    margin-bottom: 12px;
  }

  .pd-meta-tag {
    background: var(--surface);
    border: 1px solid var(--line);
    color: var(--ink2);
    padding: 3px 10px;
    border-radius: 6px;
    font-size: .7rem;
    font-weight: 500;
  }

  .pd-meta-tag.amber {
    background: var(--amber-lt);
    border-color: #fde68a;
    color: var(--amber);
  }

  .pd-doc-rating {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 16px;
  }

  .pd-stars { color: var(--amber); font-size: .85rem; }

  .pd-rating-txt {
    font-size: .72rem;
    color: var(--muted);
  }

  .pd-doc-divider {
    height: 1px;
    background: var(--line);
    margin-bottom: 16px;
  }

  .pd-doc-actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }

  .pd-btn-outline {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    border: 1px solid var(--line2);
    background: none;
    color: var(--ink2);
    padding: 9px;
    border-radius: var(--rm);
    font-family: 'Sora', sans-serif;
    font-size: .75rem;
    font-weight: 500;
    text-decoration: none;
    cursor: pointer;
    transition: border-color .15s, color .15s;
  }

  .pd-btn-outline:hover { border-color: var(--ink); color: var(--ink); }

  .pd-btn-fill {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    background: var(--ink);
    color: var(--white);
    padding: 9px;
    border-radius: var(--rm);
    border: none;
    font-family: 'Sora', sans-serif;
    font-size: .75rem;
    font-weight: 600;
    cursor: pointer;
    transition: background .15s, transform .12s;
  }

  .pd-btn-fill:hover { background: var(--blue); transform: translateY(-1px); }

  /* Skeleton */
  .pd-skel {
    background: linear-gradient(90deg, var(--line) 25%, var(--surface) 50%, var(--line) 75%);
    background-size: 200% 100%;
    animation: shimmer 1.4s infinite;
    border-radius: var(--rm);
  }

  @keyframes shimmer {
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  /* Empty */
  .pd-empty {
    grid-column: 1 / -1;
    text-align: center;
    padding: 60px 0;
    color: var(--muted);
  }

  .pd-empty-icon { font-size: 2.5rem; margin-bottom: 12px; }

  /* Responsive */
  @media (max-width: 1024px) {
    .pd-stats { grid-template-columns: repeat(2, 1fr); }
    .pd-hero-info { grid-template-columns: repeat(3, 1fr); }
    .pd-info-cell:nth-child(3) { border-right: none; }
    .pd-info-cell:nth-child(4) { border-top: 1px solid var(--line); }
    .pd-info-cell:nth-child(6) { border-right: none; }
  }

  @media (max-width: 768px) {
    .pd-main { padding: 20px; }
    .pd-hero { flex-direction: column; align-items: flex-start; gap: 20px; }
    .pd-hero-info { grid-template-columns: repeat(2, 1fr); }
    .pd-info-cell { border-right: none !important; border-bottom: 1px solid var(--line); }
    .pd-info-cell:last-child { border-bottom: none; }
    .pd-stats { grid-template-columns: 1fr 1fr; }
    .pd-sidebar-wrap { position: fixed; top: 0; left: 0; height: 100%; }
    .pd-sidebar-wrap.off { transform: translateX(-100%); width: var(--sidebar-w); overflow: visible; }
  }

  @media (max-width: 480px) {
    .pd-stats { grid-template-columns: 1fr; }
    .pd-hero-info { grid-template-columns: 1fr; }
  }
`;

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

const CalIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} width={13} height={13}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
  </svg>
);

const EyeIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} width={13} height={13}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
  </svg>
);

const STATS = [
  { icon: "🩺", label: "Doctors Available", key: "doctors", cls: "blue" },
  { icon: "📅", label: "Appointments",      val: "3",       cls: "amber" },
  { icon: "💊", label: "Prescriptions",     val: "2",       cls: "red" },
  { icon: "✅", label: "Reports Ready",      val: "1",       cls: "green" },
];

const PatientDashboard = () => {
  const { user, refreshMe } = useAuth();
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(true);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const loadDoctors = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      await refreshMe();
      const { data } = await api.get("/doctors");
      setDoctors(data);
    } catch (e) {
      if (!silent) toast.error(e.response?.data?.message || "Failed to load doctors");
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    loadDoctors();
    const intervalId = setInterval(() => loadDoctors(true), 10000);
    const onFocus = () => loadDoctors(true);
    window.addEventListener("focus", onFocus);
    return () => {
      clearInterval(intervalId);
      window.removeEventListener("focus", onFocus);
    };
  }, [refreshMe]);

  const initials = n =>
    n ? n.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() : "P";

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric",
  });

  const uploadPhoto = async (file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append("profilePhoto", file);
    setUploadingPhoto(true);
    try {
      await api.post("/auth/profile/photo", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      await refreshMe();
      toast.success("Profile photo updated");
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to upload profile photo");
    } finally {
      setUploadingPhoto(false);
    }
  };

  return (
    <>
      <style>{G}</style>
      <div className="pd-root">

        {/* Sidebar */}
        <div className={`pd-sidebar-wrap${open ? "" : " off"}`}>
          <Sidebar role="patient" />
        </div>

        {/* Toggle */}
        <button
          className={`pd-toggle${open ? "" : " off"}`}
          onClick={() => setOpen(v => !v)}
          aria-label="Toggle sidebar"
        >
          {open ? <ChevronLeft /> : <BurgerIcon />}
        </button>

        {/* Main */}
        <div className={`pd-main${open ? "" : " wide"}`}>

          {/* Page header */}
          <div className="pd-page-head">
            <div>
              <div className="pd-page-eyebrow">Patient Portal</div>
              <div className="pd-page-title">Dashboard</div>
            </div>
            <div className="pd-date-pill">{today}</div>
          </div>

          {/* Hero */}
          <div className="pd-hero">
            {user?.profilePhoto || user?.photoUrl ? (
              <img
                src={resolveMediaUrl(user?.profilePhoto || user?.photoUrl)}
                alt={user?.name}
                className="pd-avatar"
                style={{ objectFit: "cover" }}
              />
            ) : (
              <div className="pd-avatar">{initials(user?.name)}</div>
            )}
            <div className="pd-hero-text">
              <div className="pd-welcome">
                Welcome back, {user?.name || "Patient"}
              </div>
              <div className="pd-hero-sub">
                <div className="pd-status-pill">
                  <span className="pd-status-dot" />
                  Active Patient
                </div>
                <span className="pd-patient-id">
                  ID · {user?._id?.slice(-8)?.toUpperCase() || "——"}
                </span>
              </div>
              <div style={{ marginTop: 10 }}>
                <label style={{ fontSize: ".75rem", color: "#64748b", display: "inline-block", marginBottom: 6 }}>
                  Update profile photo
                </label>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  disabled={uploadingPhoto}
                  onChange={(e) => uploadPhoto(e.target.files?.[0])}
                  style={{ display: "block", fontSize: ".78rem" }}
                />
              </div>
            </div>
          </div>

          {/* Info strip */}
          <div className="pd-hero-info" style={{ marginBottom: 24 }}>
            {[
              { lbl: "Email",     val: user?.email,              highlight: false },
              { lbl: "Age",       val: user?.age,                highlight: false },
              { lbl: "Sex",       val: user?.sex || user?.gender, highlight: false },
              { lbl: "Phone",     val: user?.phone,              highlight: false },
              { lbl: "Address",   val: user?.address,            highlight: false },
              { lbl: "Condition", val: user?.disease || "General", highlight: true },
            ].map(({ lbl, val, highlight }) => (
              <div className={`pd-info-cell${highlight ? " highlight" : ""}`} key={lbl}>
                <div className="pd-info-lbl">{lbl}</div>
                <div className={`pd-info-val${highlight ? " amber" : ""}`}>{val || "—"}</div>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="pd-stats">
            {STATS.map(({ icon, label, val, key, cls }) => (
              <div className="pd-stat" key={label}>
                <div className={`pd-stat-icon ${cls}`}>{icon}</div>
                <div>
                  <div className="pd-stat-num">
                    {key === "doctors" ? (loading ? "—" : doctors.length) : val}
                  </div>
                  <div className="pd-stat-lbl">{label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Doctors section */}
          <div className="pd-section-head">
            <div className="pd-section-left">
              <span className="pd-section-title">Available Doctors</span>
              {!loading && (
                <span className="pd-section-count">{doctors.length} online</span>
              )}
            </div>
          </div>

          <div className="pd-grid">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="pd-doc-card">
                    <div className="pd-skel" style={{ height: 180, borderRadius: 0 }} />
                    <div className="pd-doc-body">
                      <div className="pd-skel" style={{ height: 18, width: "55%", marginBottom: 10 }} />
                      <div className="pd-skel" style={{ height: 12, width: "80%", marginBottom: 18 }} />
                      <div className="pd-skel" style={{ height: 36, width: "100%", borderRadius: 10 }} />
                    </div>
                  </div>
                ))
              : doctors.length > 0
              ? doctors.map(doc => (
                  <div key={doc._id} className="pd-doc-card">
                    <div className="pd-doc-img-wrap">
                      {(() => {
                        const cleanName = (doc.name || "").replace(/^dr\.?\s*/i, "").trim();
                        const doctorImage =
                          resolveMediaUrl(doc.profilePhoto || doc.photoUrl) ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(cleanName || doc.name)}&background=0d1117&color=ffffff&size=400`;
                        return (
                      <img
                        src={doctorImage}
                        alt={doc.name}
                      />
                        );
                      })()}
                      {doc.specialization && (
                        <div className="pd-spec-badge">{doc.specialization}</div>
                      )}
                      <div className="pd-online-badge">
                        <span className="pd-online-dot" />
                        Online
                      </div>
                    </div>

                    <div className="pd-doc-body">
                      <h3 className="pd-doc-name">Dr. {(doc.name || "").replace(/^dr\.?\s*/i, "").trim()}</h3>

                      <div className="pd-doc-meta">
                        {doc.experience && (
                          <span className="pd-meta-tag amber">{doc.experience} yrs exp</span>
                        )}
                        <span className="pd-meta-tag">Age {doc.age || "—"}</span>
                        {doc.hospitalLocation && (
                          <span className="pd-meta-tag">{doc.hospitalLocation}</span>
                        )}
                      </div>

                      <div className="pd-doc-rating">
                        <span className="pd-stars">★★★★★</span>
                        <span className="pd-rating-txt">4.9 · 120 reviews</span>
                      </div>

                      <div className="pd-doc-divider" />

                      <div className="pd-doc-actions">
                        <Link
                          to={`/patient/doctors/${doc._id}`}
                          className="pd-btn-outline"
                        >
                          <EyeIcon /> View Profile
                        </Link>
                        <button
                          className="pd-btn-fill"
                          onClick={() => navigate(`/patient/book-appointment/${doc._id}`)}
                        >
                          <CalIcon /> Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              : (
                <div className="pd-empty">
                  <div className="pd-empty-icon">🩺</div>
                  <p>No doctors available right now.</p>
                </div>
              )}
          </div>

        </div>
      </div>
    </>
  );
};

export default PatientDashboard; 
