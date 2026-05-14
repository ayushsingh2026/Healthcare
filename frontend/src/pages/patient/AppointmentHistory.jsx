import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Layout from "../../components/Layout";
import api from "../../services/api";

/* ─── Styles ────────────────────────────────────────────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
  :root {
    --teal-deep:#0d4f4f; --teal-mid:#0f766e; --teal-soft:#14b8a6;
    --teal-pale:#ccfbf1; --teal-xpale:#f0fdfb; --cream:#f8faf9;
    --white:#ffffff; --slate:#64748b; --slate-light:#f1f5f4;
    --slate-border:#e2ecea; --text:#0f2b2b;
    --green:#22c55e; --amber:#f59e0b; --red:#ef4444; --blue:#3b82f6;
    --shadow-sm:0 2px 12px rgba(13,79,79,.07);
    --shadow-md:0 8px 32px rgba(13,79,79,.12);
    --radius:20px; --radius-sm:12px;
  }
  @keyframes fadeUp  { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  @keyframes shimmer { 0%{background-position:-400px 0} 100%{background-position:400px 0} }
  *, *::before, *::after { box-sizing:border-box; }

  .ah-shell { display:flex; min-height:100vh; background:var(--cream); font-family:'DM Sans',sans-serif; color:var(--text); }
  .ah-main  { flex:1; padding:40px 44px; overflow-x:hidden; }

  .ah-header { margin-bottom:36px; animation:fadeUp .45s ease both; }
  .ah-title { font-family:'DM Serif Display',serif; font-size:2.3rem; color:var(--teal-deep); margin-bottom:6px; }
  .ah-sub   { font-size:.9rem; color:var(--slate); }

  /* ── Tabs ── */
  .ah-tabs { display:flex; gap:4px; background:var(--white); border-radius:50px; padding:5px; width:fit-content; box-shadow:var(--shadow-sm); margin-bottom:32px; border:1px solid var(--slate-border); animation:fadeUp .45s .08s ease both; }
  .ah-tab {
    padding:10px 24px; border-radius:50px; border:none; cursor:pointer;
    font-family:'DM Sans',sans-serif; font-size:.85rem; font-weight:600;
    background:transparent; color:var(--slate);
    transition:background .2s, color .2s, box-shadow .2s;
    display:flex; align-items:center; gap:8px;
  }
  .ah-tab.active { background:linear-gradient(135deg,var(--teal-mid),var(--teal-deep)); color:var(--white); box-shadow:0 4px 14px rgba(13,79,79,.25); }
  .ah-tab svg { width:16px; height:16px; }
  .ah-tab-count { background:rgba(255,255,255,.25); border-radius:20px; padding:1px 8px; font-size:.72rem; }
  .ah-tab:not(.active) .ah-tab-count { background:var(--slate-light); color:var(--slate); }

  /* ── Grid ── */
  .ah-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(320px,1fr)); gap:20px; animation:fadeUp .45s .14s ease both; }

  /* ── Card ── */
  .ah-card {
    background:var(--white); border-radius:var(--radius);
    box-shadow:var(--shadow-sm); border:1px solid rgba(13,79,79,.06);
    padding:22px 24px; transition:transform .22s, box-shadow .22s;
  }
  .ah-card:hover { transform:translateY(-3px); box-shadow:var(--shadow-md); }

  .ah-card-top { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:16px; }
  .ah-card-avatar {
    width:46px; height:46px; border-radius:50%;
    background:linear-gradient(135deg,var(--teal-mid),var(--teal-deep));
    display:flex; align-items:center; justify-content:center;
    color:var(--white); font-family:'DM Serif Display',serif; font-size:1.05rem;
    flex-shrink:0;
  }
  .ah-card-avatar.lab { background:linear-gradient(135deg,#0ea5e9,#0369a1); }
  .ah-card-name { font-family:'DM Serif Display',serif; font-size:1.1rem; margin-bottom:2px; color:var(--text); }
  .ah-card-spec { font-size:.78rem; color:var(--slate); }

  /* Status badge */
  .ah-status { display:inline-flex; align-items:center; gap:5px; padding:4px 12px; border-radius:20px; font-size:.72rem; font-weight:700; letter-spacing:.05em; text-transform:uppercase; }
  .ah-status.pending   { background:#fef3c7; color:#92400e; }
  .ah-status.approved  { background:#dcfce7; color:#166534; }
  .ah-status.completed { background:#dbeafe; color:#1e40af; }
  .ah-status.rejected  { background:#fee2e2; color:#991b1b; }
  .ah-status-dot { width:6px; height:6px; border-radius:50%; background:currentColor; }

  .ah-card-divider { height:1px; background:var(--slate-light); margin:16px 0; }

  .ah-card-rows { display:flex; flex-direction:column; gap:8px; }
  .ah-card-row  { display:flex; align-items:center; gap:10px; font-size:.82rem; }
  .ah-card-row svg { width:15px; height:15px; color:var(--teal-mid); flex-shrink:0; }
  .ah-card-row .lbl { color:var(--slate); width:72px; flex-shrink:0; }
  .ah-card-row .val { color:var(--text); font-weight:500; }

  .ah-card-footer { margin-top:14px; font-size:.72rem; color:var(--slate); display:flex; align-items:center; gap:5px; }
  .ah-card-footer svg { width:13px; height:13px; }

  /* ── Empty ── */
  .ah-empty { grid-column:1/-1; text-align:center; padding:80px 20px; color:var(--slate); }
  .ah-empty-icon { font-size:3rem; opacity:.3; margin-bottom:12px; }

  /* ── Skeleton ── */
  .skel {
    background:linear-gradient(90deg,#e8f0ef 25%,#d0e6e4 50%,#e8f0ef 75%);
    background-size:400px 100%;
    animation:shimmer 1.4s infinite linear; border-radius:10px;
  }

  @media(max-width:768px){ .ah-main{padding:20px 18px;} }
`;

/* ─── Helpers ─────────────────────────────────────────────────────────── */
const initials = (n) => n ? n.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase() : "?";
const Icon = ({d}) => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d={d}/></svg>;

const statusClass = (s) => {
  const m = {
    pending:"pending",
    confirmed:"approved",
    "in consultation":"approved",
    approved:"approved",
    completed:"completed",
    cancelled:"rejected",
    rejected:"rejected",
  };
  return m[s?.toLowerCase()] || "pending";
};

/* ─── Component ───────────────────────────────────────────────────────── */
const AppointmentHistory = () => {
  const [doctorAppts, setDoctorAppts] = useState([]);
  const [labBookings, setLabBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("doctor");

  const loadHistory = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const [a, l] = await Promise.all([api.get("/appointments/patient"), api.get("/lab/patient/bookings")]);
      setDoctorAppts(a.data);
      setLabBookings(l.data);
    } catch (err) {
      if (!silent) toast.error(err.response?.data?.message || "Failed to load history");
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
    const intervalId = setInterval(() => loadHistory(true), 8000);
    const onFocus = () => loadHistory(true);
    window.addEventListener("focus", onFocus);
    return () => {
      clearInterval(intervalId);
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  const docIcons = {
    disease:  "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
    date:     "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
    doctor:   "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
    clock:    "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
    flask:    "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z",
  };

  return (
    <>
      <style>{styles}</style>
      <Layout role="patient">
        <div className="ah-main">

          <div className="ah-header">
            <h1 className="ah-title">My Health History</h1>
            <p className="ah-sub">Track all your appointments and lab tests in one place</p>
          </div>

          <div className="ah-tabs">
            <button className={`ah-tab ${tab==="doctor"?"active":""}`} onClick={()=>setTab("doctor")}>
              <Icon d={docIcons.doctor}/>
              Doctor Visits
              <span className="ah-tab-count">{doctorAppts.length}</span>
            </button>
            <button className={`ah-tab ${tab==="lab"?"active":""}`} onClick={()=>setTab("lab")}>
              <Icon d={docIcons.flask}/>
              Lab Tests
              <span className="ah-tab-count">{labBookings.length}</span>
            </button>
          </div>

          {loading ? (
            <div className="ah-grid">
              {[...Array(4)].map((_,i) => (
                <div key={i} className="ah-card">
                  <div style={{display:"flex",gap:12,marginBottom:16}}>
                    <div className="skel" style={{width:46,height:46,borderRadius:"50%",flexShrink:0}}/>
                    <div style={{flex:1}}><div className="skel" style={{height:16,width:"60%",marginBottom:8}}/><div className="skel" style={{height:12,width:"40%"}}/></div>
                  </div>
                  <div className="skel" style={{height:12,marginBottom:8}}/>
                  <div className="skel" style={{height:12,width:"70%",marginBottom:8}}/>
                  <div className="skel" style={{height:12,width:"50%"}}/>
                </div>
              ))}
            </div>
          ) : tab === "doctor" ? (
            <div className="ah-grid">
              {doctorAppts.length > 0 ? doctorAppts.map((a,i) => (
                <div className="ah-card" key={a._id} style={{animationDelay:`${i*.06}s`}}>
                  <div className="ah-card-top">
                    <div style={{display:"flex",gap:12,alignItems:"center"}}>
                      <div className="ah-card-avatar">{initials(a.doctorId?.name)}</div>
                      <div>
                        <div className="ah-card-name">Dr. {a.doctorId?.name || "—"}</div>
                        <div className="ah-card-spec">{a.doctorId?.specialization || "Specialist"}</div>
                      </div>
                    </div>
                    <span className={`ah-status ${statusClass(a.status)}`}>
                      <span className="ah-status-dot"/>
                      {a.status || "pending"}
                    </span>
                  </div>
                  <div className="ah-card-divider"/>
                  <div className="ah-card-rows">
                    <div className="ah-card-row"><Icon d={docIcons.disease}/><span className="lbl">Condition</span><span className="val">{a.disease || "—"}</span></div>
                    <div className="ah-card-row"><Icon d={docIcons.date}/><span className="lbl">Appt Date</span><span className="val">{a.appointmentDate?.slice(0,10) || "—"}</span></div>
                    <div className="ah-card-row"><Icon d={docIcons.clock}/><span className="lbl">Payment</span><span className="val">{a.paymentStatus || "Pending"}</span></div>
                  </div>
                  <div className="ah-card-footer"><Icon d={docIcons.clock}/> Requested on {a.createdAt?.slice(0,10)}</div>
                </div>
              )) : (
                <div className="ah-empty"><div className="ah-empty-icon">🩺</div><p>No doctor appointments yet.</p></div>
              )}
            </div>
          ) : (
            <div className="ah-grid">
              {labBookings.length > 0 ? labBookings.map((l,i) => (
                <div className="ah-card" key={l._id} style={{animationDelay:`${i*.06}s`}}>
                  <div className="ah-card-top">
                    <div style={{display:"flex",gap:12,alignItems:"center"}}>
                      <div className="ah-card-avatar lab"><Icon d={docIcons.flask}/></div>
                      <div>
                        <div className="ah-card-name">{l.testName}</div>
                        <div className="ah-card-spec">{l.labName || "Lab Test"}</div>
                      </div>
                    </div>
                    <span className={`ah-status ${statusClass(l.status)}`}>
                      <span className="ah-status-dot"/>
                      {l.status || "pending"}
                    </span>
                  </div>
                  <div className="ah-card-divider"/>
                  <div className="ah-card-rows">
                    <div className="ah-card-row"><Icon d={docIcons.date}/><span className="lbl">Test Date</span><span className="val">{l.appointmentDate?.slice(0,10) || "—"}</span></div>
                    <div className="ah-card-row"><Icon d={docIcons.clock}/><span className="lbl">Slot</span><span className="val">{l.timeSlot || "—"}</span></div>
                  </div>
                  {l.reportUrl ? (
                    <a
                      href={`${api.defaults.baseURL.replace("/api", "")}${l.reportUrl}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{ fontSize: ".78rem", color: "#0369a1", fontWeight: 600, marginTop: 12, display: "inline-block" }}
                    >
                      Download Report
                    </a>
                  ) : null}
                  <div className="ah-card-footer"><Icon d={docIcons.clock}/> Requested on {l.createdAt?.slice(0,10)}</div>
                </div>
              )) : (
                <div className="ah-empty"><div className="ah-empty-icon">🔬</div><p>No lab tests booked yet.</p></div>
              )}
            </div>
          )}

        </div>
      </Layout>
    </>
  );
};

export default AppointmentHistory;
