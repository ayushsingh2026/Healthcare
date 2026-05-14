import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Layout from "../../components/Layout";
import api from "../../services/api";

/* ── tiny helpers ── */
const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const statusColors = {
  pending:        { bg: "#fef3c7", text: "#92400e", dot: "#f59e0b" },
  confirmed:      { bg: "#dbeafe", text: "#1e40af", dot: "#3b82f6" },
  inConsultation: { bg: "#ede9fe", text: "#5b21b6", dot: "#8b5cf6" },
  completed:      { bg: "#d1fae5", text: "#065f46", dot: "#10b981" },
  cancelled:      { bg: "#fee2e2", text: "#991b1b", dot: "#ef4444" },
};

const paymentStatusColor = (s) =>
  s === "completed" ? "#10b981" : s === "pending" ? "#f59e0b" : "#ef4444";

/* ── Stat Card ── */
const StatCard = ({ label, value, icon, accent, delay }) => (
  <div className="adm-stat-card" style={{ animationDelay: delay, "--accent": accent }}>
    <div className="adm-stat-icon-wrap">{icon}</div>
    <div className="adm-stat-body">
      <p className="adm-stat-label">{label}</p>
      <p className="adm-stat-value">{value ?? 0}</p>
    </div>
    <div className="adm-stat-glow" />
  </div>
);

/* ── Bar chart row ── */
const BarRow = ({ label, value, max, index }) => {
  const pct = max ? Math.round((value / max) * 100) : 0;
  const hue = 160 + index * 12;
  return (
    <div className="adm-bar-row">
      <span className="adm-bar-label">{label}</span>
      <div className="adm-bar-track">
        <div
          className="adm-bar-fill"
          style={{ width: `${pct}%`, background: `hsl(${hue}, 70%, 45%)`, animationDelay: `${index * 60}ms` }}
        />
      </div>
      <span className="adm-bar-val">₹{value.toLocaleString()}</span>
    </div>
  );
};

/* ── Status Badge ── */
const StatusBadge = ({ status }) => {
  const c = statusColors[status] || { bg: "#f1f5f9", text: "#64748b", dot: "#94a3b8" };
  return (
    <span className="adm-badge" style={{ background: c.bg, color: c.text }}>
      <span className="adm-badge-dot" style={{ background: c.dot }} />
      {status}
    </span>
  );
};

/* ── Main Dashboard ── */
const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/admin/dashboard");
        setData(res.data);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to fetch dashboard stats");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const cards      = data?.cards || {};
  const monthly    = data?.charts?.monthlyPayments || Array(12).fill(0);
  const maxMonthly = Math.max(...monthly, 1);
  const ov         = data?.charts?.appointmentsOverview || {};
  const activity   = data?.widgets?.systemActivity || [];
  const recAppts   = data?.widgets?.recentAppointments || [];
  const recRegs    = data?.widgets?.recentRegistrations || [];
  const latPays    = data?.widgets?.latestPayments || [];

  const statCards = [
    { label: "Total Doctors",             value: cards.doctors,              accent: "#0ea5e9", icon: <DoctorIcon /> },
    { label: "Total Patients",            value: cards.patients,             accent: "#10b981", icon: <PatientIcon /> },
    { label: "Lab Users",                 value: cards.labs,                 accent: "#8b5cf6", icon: <LabIcon /> },
    { label: "Appointments",              value: cards.appointments,         accent: "#f59e0b", icon: <ApptIcon /> },
    { label: "Total Payments",            value: cards.payments,             accent: "#06b6d4", icon: <PayIcon /> },
    { label: "Pending Payments",          value: cards.pendingPayments,      accent: "#f97316", icon: <PendingIcon /> },
    { label: "Completed Appointments",    value: cards.completedAppointments, accent: "#10b981", icon: <CheckIcon /> },
    { label: "Cancelled Appointments",   value: cards.cancelledAppointments, accent: "#ef4444", icon: <CancelIcon /> },
  ];

  const totalRevenue = cards.totalRevenue || 0;

  return (
    <Layout role="admin">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

        .adm * { box-sizing: border-box; }
        .adm {
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          background: #0d1117;
          padding: 1.75rem 1.5rem 3rem;
          color: #e2e8f0;
        }

        /* ── HEADER ── */
        .adm-header {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;
          animation: fadeDown 0.5s ease both;
        }
        .adm-header-left {}
        .adm-eyebrow {
          font-size: 0.68rem; font-weight: 600; letter-spacing: 0.14em;
          text-transform: uppercase; color: #10b981; margin-bottom: 0.25rem;
        }
        .adm-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(1.6rem, 3vw, 2.2rem); font-weight: 800;
          color: #f8fafc; letter-spacing: -0.02em; margin: 0;
        }

        .adm-header-right { display: flex; align-items: center; gap: 10px; }
        .adm-notif-pill {
          display: flex; align-items: center; gap: 7px;
          background: #1e2533; border: 1px solid #2d3748;
          border-radius: 100px; padding: 0.45rem 1rem;
          font-size: 0.82rem; color: #94a3b8;
        }
        .adm-notif-count {
          background: #10b981; color: white; border-radius: 100px;
          padding: 0.1rem 0.5rem; font-size: 0.72rem; font-weight: 700;
        }
        .adm-now {
          background: #1e2533; border: 1px solid #2d3748;
          border-radius: 100px; padding: 0.45rem 1rem;
          font-size: 0.8rem; color: #64748b;
        }

        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        /* ── STAT CARDS ── */
        .adm-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px; margin-bottom: 1.75rem;
        }
        @media (max-width: 1100px) { .adm-stats { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 560px)  { .adm-stats { grid-template-columns: 1fr; } }

        .adm-stat-card {
          background: #161b27;
          border: 1px solid #222d3d;
          border-radius: 18px; padding: 1.35rem 1.25rem;
          position: relative; overflow: hidden;
          display: flex; align-items: center; gap: 1rem;
          animation: fadeUp 0.5s ease both;
          transition: transform 0.2s ease, border-color 0.2s ease;
        }
        .adm-stat-card:hover {
          transform: translateY(-3px);
          border-color: var(--accent, #10b981);
        }
        .adm-stat-icon-wrap {
          width: 46px; height: 46px; border-radius: 12px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,0.04);
          border: 1px solid #2d3748; color: var(--accent, #10b981);
        }
        .adm-stat-body { flex: 1; }
        .adm-stat-label { font-size: 0.75rem; color: #64748b; font-weight: 500; margin-bottom: 0.2rem; }
        .adm-stat-value {
          font-family: 'Syne', sans-serif;
          font-size: 1.75rem; font-weight: 700; color: #f1f5f9; line-height: 1;
        }
        .adm-stat-glow {
          position: absolute; bottom: -20px; right: -20px;
          width: 70px; height: 70px; border-radius: 50%;
          background: radial-gradient(circle, var(--accent, #10b981) 0%, transparent 70%);
          opacity: 0.15; pointer-events: none;
        }

        /* ── SECTION TITLE ── */
        .adm-section-title {
          font-family: 'Syne', sans-serif;
          font-size: 0.95rem; font-weight: 700; color: #f1f5f9;
          margin: 0 0 1.25rem; letter-spacing: -0.01em;
        }

        /* ── PANELS ── */
        .adm-panel {
          background: #161b27; border: 1px solid #222d3d;
          border-radius: 20px; padding: 1.5rem;
          animation: fadeUp 0.5s ease both;
        }

        /* ── CHART AREA ── */
        .adm-charts { display: grid; grid-template-columns: 1fr 340px; gap: 14px; margin-bottom: 1.75rem; }
        @media (max-width: 900px) { .adm-charts { grid-template-columns: 1fr; } }

        /* Bar chart */
        .adm-bar-row {
          display: grid; grid-template-columns: 32px 1fr 64px;
          align-items: center; gap: 10px; margin-bottom: 10px;
        }
        .adm-bar-label { font-size: 0.72rem; color: #64748b; font-weight: 600; }
        .adm-bar-track {
          height: 7px; background: #1e2533; border-radius: 100px; overflow: hidden;
        }
        .adm-bar-fill {
          height: 100%; border-radius: 100px;
          animation: growWidth 0.8s cubic-bezier(0.16,1,0.3,1) both;
        }
        @keyframes growWidth {
          from { width: 0% !important; }
        }
        .adm-bar-val { font-size: 0.72rem; color: #94a3b8; text-align: right; font-weight: 500; }

        /* Revenue donut-style overview */
        .adm-overview-list { display: flex; flex-direction: column; gap: 12px; }
        .adm-ov-row {
          display: flex; align-items: center; justify-content: space-between;
          padding: 0.6rem 0.85rem; background: #1a2133; border-radius: 10px;
          border: 1px solid #232d40;
        }
        .adm-ov-left { display: flex; align-items: center; gap: 8px; font-size: 0.83rem; color: #94a3b8; }
        .adm-ov-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
        .adm-ov-val { font-family: 'Syne', sans-serif; font-size: 0.95rem; font-weight: 700; color: #f1f5f9; }

        .adm-revenue-banner {
          margin-top: 1.25rem; padding: 1rem;
          background: linear-gradient(135deg, rgba(16,185,129,0.12), rgba(14,116,144,0.12));
          border: 1px solid rgba(16,185,129,0.2); border-radius: 12px;
          display: flex; align-items: center; justify-content: space-between;
        }
        .adm-revenue-label { font-size: 0.78rem; color: #6ee7b7; font-weight: 500; }
        .adm-revenue-val {
          font-family: 'Syne', sans-serif; font-size: 1.4rem;
          font-weight: 800; color: #10b981;
        }

        /* ── WIDGETS ROW ── */
        .adm-widgets { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
        @media (max-width: 900px) { .adm-widgets { grid-template-columns: 1fr; } }

        /* widget list items */
        .adm-list-item {
          padding: 0.7rem 0.85rem; border-radius: 10px;
          background: #1a2133; border: 1px solid #232d40;
          transition: border-color 0.18s ease;
          margin-bottom: 8px;
        }
        .adm-list-item:last-child { margin-bottom: 0; }
        .adm-list-item:hover { border-color: #2d4060; }

        .adm-list-name { font-size: 0.83rem; font-weight: 600; color: #e2e8f0; margin-bottom: 0.15rem; }
        .adm-list-sub  { font-size: 0.75rem; color: #64748b; }

        /* badge */
        .adm-badge {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 0.15rem 0.55rem; border-radius: 100px;
          font-size: 0.7rem; font-weight: 600; text-transform: capitalize;
        }
        .adm-badge-dot { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; }

        /* role chip */
        .adm-role-chip {
          display: inline-block; padding: 0.1rem 0.55rem;
          border-radius: 100px; font-size: 0.7rem; font-weight: 600;
          text-transform: capitalize;
        }

        /* loading skeleton */
        .adm-skeleton {
          height: 1rem; border-radius: 6px;
          background: linear-gradient(90deg, #1e2533 25%, #232d40 50%, #1e2533 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite;
        }
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        /* scrollbar for webkit */
        .adm ::-webkit-scrollbar { width: 4px; }
        .adm ::-webkit-scrollbar-track { background: transparent; }
        .adm ::-webkit-scrollbar-thumb { background: #2d3748; border-radius: 10px; }
      `}</style>

      <div className="adm">
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>

          {/* ── HEADER ── */}
          <header className="adm-header">
            <div className="adm-header-left">
              <p className="adm-eyebrow">Control Center</p>
              <h1 className="adm-title">Admin Dashboard</h1>
            </div>
            <div className="adm-header-right">
              <div className="adm-notif-pill">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                Alerts
                <span className="adm-notif-count">{activity.length || 0}</span>
              </div>
              <div className="adm-now">
                {new Date().toLocaleDateString("en-IN", { weekday:"short", day:"numeric", month:"short" })}
              </div>
            </div>
          </header>

          {/* ── STAT CARDS ── */}
          <div className="adm-stats">
            {statCards.map((c, i) => (
              <StatCard key={c.label} label={c.label} value={loading ? "…" : c.value}
                icon={c.icon} accent={c.accent} delay={`${i * 55}ms`} />
            ))}
          </div>

          {/* ── CHARTS ── */}
          <div className="adm-charts">
            {/* Monthly payments bar */}
            <div className="adm-panel" style={{ animationDelay: "200ms" }}>
              <p className="adm-section-title">Monthly Payments (₹)</p>
              {loading
                ? Array(6).fill(0).map((_, i) => <div key={i} className="adm-skeleton" style={{ marginBottom: 12, width: `${70 + Math.random()*30}%` }} />)
                : monthly.map((v, i) => (
                  <BarRow key={i} label={months[i]} value={v} max={maxMonthly} index={i} />
                ))
              }
            </div>

            {/* Appointments overview */}
            <div className="adm-panel" style={{ animationDelay: "260ms" }}>
              <p className="adm-section-title">Appointments Overview</p>
              <div className="adm-overview-list">
                {[
                  { label: "Pending",         val: ov.pending,        dot: "#f59e0b" },
                  { label: "Confirmed",       val: ov.confirmed,      dot: "#3b82f6" },
                  { label: "In Consultation", val: ov.inConsultation, dot: "#8b5cf6" },
                  { label: "Completed",       val: ov.completed,      dot: "#10b981" },
                  { label: "Cancelled",       val: ov.cancelled,      dot: "#ef4444" },
                ].map((r) => (
                  <div className="adm-ov-row" key={r.label}>
                    <div className="adm-ov-left">
                      <span className="adm-ov-dot" style={{ background: r.dot }} />
                      {r.label}
                    </div>
                    <span className="adm-ov-val">{loading ? "…" : r.val ?? 0}</span>
                  </div>
                ))}
              </div>
              <div className="adm-revenue-banner">
                <span className="adm-revenue-label">Total Revenue</span>
                <span className="adm-revenue-val">₹{loading ? "…" : totalRevenue.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* ── WIDGETS ── */}
          <div className="adm-widgets">

            {/* Recent Appointments */}
            <div className="adm-panel" style={{ animationDelay: "320ms" }}>
              <p className="adm-section-title">Recent Appointments</p>
              {loading
                ? Array(4).fill(0).map((_, i) => <div key={i} className="adm-skeleton" style={{ marginBottom: 10, height: 54 }} />)
                : recAppts.length === 0
                  ? <p style={{ fontSize: "0.82rem", color: "#64748b" }}>No appointments yet.</p>
                  : recAppts.map((a) => (
                    <div className="adm-list-item" key={a._id}>
                      <div className="adm-list-name">{a.patientId?.name || "—"}</div>
                      <div className="adm-list-sub">
                        with Dr. {a.doctorId?.name || "—"}
                        &nbsp;·&nbsp;
                        <StatusBadge status={a.status} />
                      </div>
                    </div>
                  ))
              }
            </div>

            {/* Recent Registrations */}
            <div className="adm-panel" style={{ animationDelay: "380ms" }}>
              <p className="adm-section-title">Recent Registrations</p>
              {loading
                ? Array(4).fill(0).map((_, i) => <div key={i} className="adm-skeleton" style={{ marginBottom: 10, height: 54 }} />)
                : recRegs.length === 0
                  ? <p style={{ fontSize: "0.82rem", color: "#64748b" }}>No registrations yet.</p>
                  : recRegs.map((u) => (
                    <div className="adm-list-item" key={u._id}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div className="adm-list-name">{u.name}</div>
                        <span className="adm-role-chip" style={{
                          background: u.role === "doctor" ? "rgba(14,116,144,0.15)" : u.role === "lab" ? "rgba(139,92,246,0.15)" : "rgba(16,185,129,0.15)",
                          color:      u.role === "doctor" ? "#06b6d4"               : u.role === "lab" ? "#a78bfa"               : "#10b981",
                        }}>{u.role}</span>
                      </div>
                      <div className="adm-list-sub">{u.email}</div>
                    </div>
                  ))
              }
            </div>

            {/* Latest Payments */}
            <div className="adm-panel" style={{ animationDelay: "440ms" }}>
              <p className="adm-section-title">Latest Payments</p>
              {loading
                ? Array(4).fill(0).map((_, i) => <div key={i} className="adm-skeleton" style={{ marginBottom: 10, height: 54 }} />)
                : latPays.length === 0
                  ? <p style={{ fontSize: "0.82rem", color: "#64748b" }}>No payments yet.</p>
                  : latPays.map((p) => (
                    <div className="adm-list-item" key={p._id}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div className="adm-list-name">{p.patientId?.name || "—"}</div>
                        <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "0.92rem", color: paymentStatusColor(p.status) }}>
                          ₹{p.amount?.toLocaleString()}
                        </span>
                      </div>
                      <div className="adm-list-sub" style={{ textTransform: "capitalize" }}>{p.status}</div>
                    </div>
                  ))
              }
            </div>

          </div>
        </div>
      </div>
    </Layout>
  );
};

/* ── SVG Icons ── */
const DoctorIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
  </svg>
);
const PatientIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);
const LabIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
  </svg>
);
const ApptIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);
const PayIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);
const PendingIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const CancelIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export default AdminDashboard;