import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import Layout from "../../components/Layout";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

/* ─── Styles ────────────────────────────────────────────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
  :root {
    --teal-deep:#0d4f4f; --teal-mid:#0f766e; --teal-soft:#14b8a6;
    --teal-pale:#ccfbf1; --teal-xpale:#f0fdfb; --cream:#f8faf9;
    --white:#ffffff; --slate:#64748b; --slate-light:#f1f5f4;
    --slate-border:#e2ecea; --text:#0f2b2b; --red:#ef4444;
    --shadow-sm:0 2px 12px rgba(13,79,79,.07);
    --shadow-md:0 8px 32px rgba(13,79,79,.13);
    --shadow-lg:0 24px 64px rgba(13,79,79,.18);
    --radius:20px; --radius-sm:12px;
  }
  @keyframes fadeUp  { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
  @keyframes spin    { to{transform:rotate(360deg)} }
  *, *::before, *::after { box-sizing:border-box; }

  .ba-shell { display:flex; min-height:100vh; background:var(--cream); font-family:'DM Sans',sans-serif; color:var(--text); }
  .ba-main  { flex:1; padding:40px 44px; overflow-x:hidden; }

  .ba-back {
    display:inline-flex; align-items:center; gap:8px;
    color:var(--teal-mid); font-size:.85rem; font-weight:600;
    background:none; border:none; cursor:pointer; padding:8px 0; margin-bottom:28px;
    transition:gap .2s; font-family:'DM Sans',sans-serif; animation:fadeIn .4s ease both;
  }
  .ba-back:hover{gap:13px;}
  .ba-back svg{width:18px;height:18px;}

  /* ── Doctor pill ── */
  .ba-doctor-pill {
    display:inline-flex; align-items:center; gap:12px;
    background:var(--white);
    border:1px solid var(--slate-border);
    border-radius:50px;
    padding:8px 20px 8px 8px;
    box-shadow:var(--shadow-sm);
    margin-bottom:32px;
    animation:fadeUp .45s .05s ease both;
  }
  .ba-doctor-avatar {
    width:44px; height:44px; border-radius:50%;
    background:linear-gradient(135deg,var(--teal-mid),var(--teal-deep));
    display:flex; align-items:center; justify-content:center;
    color:var(--white); font-family:'DM Serif Display',serif; font-size:1.1rem;
    flex-shrink:0;
  }
  .ba-doctor-info .ba-doctor-name { font-weight:600; font-size:.95rem; color:var(--text); }
  .ba-doctor-info .ba-doctor-spec { font-size:.78rem; color:var(--slate); }

  /* ── Page title ── */
  .ba-title { font-family:'DM Serif Display',serif; font-size:2.2rem; color:var(--teal-deep); margin-bottom:6px; animation:fadeUp .45s ease both; }
  .ba-sub   { font-size:.9rem; color:var(--slate); margin-bottom:32px; animation:fadeUp .45s .06s ease both; }

  /* ── Form layout ── */
  .ba-layout { display:grid; grid-template-columns:1fr 320px; gap:28px; align-items:start; }
  @media(max-width:900px){ .ba-layout{grid-template-columns:1fr;} }

  /* ── Form card ── */
  .ba-form-card {
    background:var(--white); border-radius:var(--radius);
    box-shadow:var(--shadow-md); padding:36px 40px;
    border:1px solid rgba(13,79,79,.06);
    animation:fadeUp .45s .1s ease both;
  }
  .ba-section-label {
    font-size:.7rem; letter-spacing:.1em; text-transform:uppercase;
    color:var(--teal-mid); font-weight:600; margin-bottom:16px; margin-top:28px;
  }
  .ba-section-label:first-child{margin-top:0;}
  .ba-divider{height:1px;background:var(--slate-light);margin:24px 0;}

  .ba-row { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
  @media(max-width:600px){ .ba-row{grid-template-columns:1fr;} }

  /* ── Field ── */
  .ba-field { display:flex; flex-direction:column; gap:6px; }
  .ba-label { font-size:.78rem; font-weight:600; color:var(--text); letter-spacing:.02em; }
  .ba-label span { color:var(--red); margin-left:2px; }
  .ba-input, .ba-select {
    padding:12px 16px;
    border:1.5px solid var(--slate-border);
    border-radius:var(--radius-sm);
    font-size:.9rem; font-family:'DM Sans',sans-serif;
    color:var(--text); background:var(--white);
    transition:border-color .2s, box-shadow .2s;
    outline:none; width:100%;
    -webkit-appearance:none;
  }
  .ba-input:focus, .ba-select:focus {
    border-color:var(--teal-soft);
    box-shadow:0 0 0 3px rgba(20,184,166,.15);
  }
  .ba-input::placeholder { color:#b0c4c4; }
  .ba-input[type="date"]::-webkit-calendar-picker-indicator { opacity:.5; cursor:pointer; }

  /* ── Submit btn ── */
  .ba-submit {
    width:100%; padding:16px;
    background:linear-gradient(135deg,var(--teal-mid),var(--teal-deep));
    color:var(--white); border:none; border-radius:var(--radius-sm);
    font-family:'DM Sans',sans-serif; font-size:.95rem; font-weight:700;
    cursor:pointer; margin-top:28px; letter-spacing:.03em;
    transition:opacity .2s, transform .15s;
    display:flex; align-items:center; justify-content:center; gap:10px;
  }
  .ba-submit:hover:not(:disabled){opacity:.9;transform:scale(.99);}
  .ba-submit:disabled{opacity:.55;cursor:not-allowed;}
  .ba-spinner{width:18px;height:18px;border:2px solid rgba(255,255,255,.35);border-top-color:#fff;border-radius:50%;animation:spin .7s linear infinite;}

  /* ── Summary card ── */
  .ba-summary {
    background:linear-gradient(145deg,var(--teal-deep),var(--teal-mid));
    border-radius:var(--radius);
    padding:28px 26px;
    color:var(--white);
    position:sticky; top:24px;
    animation:fadeUp .45s .18s ease both;
  }
  .ba-summary-title { font-family:'DM Serif Display',serif; font-size:1.3rem; margin-bottom:6px; }
  .ba-summary-sub   { font-size:.8rem; opacity:.65; margin-bottom:22px; }
  .ba-summary-row   { display:flex; justify-content:space-between; align-items:center; padding:10px 0; border-bottom:1px solid rgba(255,255,255,.12); font-size:.85rem; }
  .ba-summary-row:last-of-type { border-bottom:none; }
  .ba-summary-row .label { opacity:.7; }
  .ba-summary-row .value { font-weight:600; }
  .ba-summary-total { margin-top:20px; padding:16px; background:rgba(255,255,255,.12); border-radius:var(--radius-sm); text-align:center; }
  .ba-summary-total .amt { font-family:'DM Serif Display',serif; font-size:2rem; }
  .ba-summary-total .note { font-size:.75rem; opacity:.65; margin-top:4px; }
  .ba-note-box { margin-top:20px; background:rgba(255,255,255,.1); border-radius:var(--radius-sm); padding:12px 14px; font-size:.78rem; opacity:.8; line-height:1.5; }

  @media(max-width:768px){ .ba-main{padding:20px 18px;} .ba-form-card{padding:24px 20px;} }
`;

/* ─── Helpers ─────────────────────────────────────────────────────────── */
const initials = (n) => n ? n.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase() : "DR";
const Icon = ({d}) => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} style={{width:18,height:18}}><path strokeLinecap="round" strokeLinejoin="round" d={d}/></svg>;

/* ─── Component ───────────────────────────────────────────────────────── */
const BookAppointmentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    patientName: user?.name || "",
    patientAge:  user?.age  || "",
    patientSex:  user?.sex  || user?.gender || "",
    condition:   user?.disease || "",
    appointmentDate: "",
    patientLocation: user?.address || "",
  });

  useEffect(() => {
    api.get(`/doctors/${id}`)
      .then(({data}) => setDoctor(data))
      .catch(err => toast.error(err.response?.data?.message || "Failed to load doctor"));
  }, [id]);

  const handleChange = (e) => setFormData(p => ({...p,[e.target.name]:e.target.value}));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const missing = Object.values(formData).some(v => !v);
    if (missing) { toast.error("Please fill all fields"); return; }
    setLoading(true);
    try {
      const {data} = await api.post("/appointments/book", {
        doctorId: id,
        patientName: formData.patientName,
        patientAge:  Number(formData.patientAge),
        patientSex:  formData.patientSex,
        condition:   formData.condition,
        disease:     formData.condition,
        appointmentDate: formData.appointmentDate,
        patientLocation: formData.patientLocation,
      });
      toast.success("Appointment submitted. Proceed to payment.");
      navigate("/patient/payment", {
        state: { amount:500, source:`appointment with Dr. ${doctor?.name||""}`, sourceType:"appointment", sourceId:data._id }
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit");
    } finally { setLoading(false); }
  };

  return (
    <>
      <style>{styles}</style>
      <Layout role="patient">
        <div className="ba-main">

          <button className="ba-back" onClick={() => navigate(-1)}>
            <Icon d="M19 12H5m0 0l7 7m-7-7l7-7"/> Back to Doctor
          </button>

          <h1 className="ba-title">Book Appointment</h1>
          <p className="ba-sub">Fill in your details to request a consultation</p>

          {doctor && (
            <div className="ba-doctor-pill">
              <div className="ba-doctor-avatar">{initials(doctor.name)}</div>
              <div className="ba-doctor-info">
                <div className="ba-doctor-name">Dr. {doctor.name}</div>
                <div className="ba-doctor-spec">{doctor.specialization || "Specialist"}</div>
              </div>
            </div>
          )}

          <div className="ba-layout">
            {/* ── Form ── */}
            <form className="ba-form-card" onSubmit={handleSubmit}>

              <div className="ba-section-label">Patient Information</div>
              <div className="ba-row">
                <div className="ba-field">
                  <label className="ba-label">Full Name <span>*</span></label>
                  <input className="ba-input" name="patientName" value={formData.patientName} onChange={handleChange} placeholder="Your full name" />
                </div>
                <div className="ba-field">
                  <label className="ba-label">Age <span>*</span></label>
                  <input className="ba-input" name="patientAge" value={formData.patientAge} onChange={handleChange} type="number" placeholder="e.g. 28" min="1" max="120" />
                </div>
              </div>

              <div className="ba-row" style={{marginTop:16}}>
                <div className="ba-field">
                  <label className="ba-label">Sex <span>*</span></label>
                  <select className="ba-select" name="patientSex" value={formData.patientSex} onChange={handleChange}>
                    <option value="">Select</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="ba-field">
                  <label className="ba-label">Location <span>*</span></label>
                  <input className="ba-input" name="patientLocation" value={formData.patientLocation} onChange={handleChange} placeholder="Your city / address" />
                </div>
              </div>

              <div className="ba-divider"/>
              <div className="ba-section-label">Appointment Details</div>

              <div className="ba-field">
                <label className="ba-label">Condition / Chief Complaint <span>*</span></label>
                <input className="ba-input" name="condition" value={formData.condition} onChange={handleChange} placeholder="e.g. Chest pain, fever, general checkup" />
              </div>

              <div className="ba-field" style={{marginTop:16}}>
                <label className="ba-label">Preferred Date <span>*</span></label>
                <input className="ba-input" name="appointmentDate" value={formData.appointmentDate} onChange={handleChange} type="date" min={new Date().toISOString().split("T")[0]} />
              </div>

              <button type="submit" className="ba-submit" disabled={loading}>
                {loading ? <><div className="ba-spinner"/>Processing…</> : <>Submit & Go to Payment →</>}
              </button>
            </form>

            {/* ── Summary ── */}
            <div className="ba-summary">
              <div className="ba-summary-title">Booking Summary</div>
              <div className="ba-summary-sub">Review before confirming</div>

              {[
                {label:"Doctor",   value: doctor ? `Dr. ${doctor.name}` : "—"},
                {label:"Specialty",value: doctor?.specialization || "—"},
                {label:"Patient",  value: formData.patientName   || "—"},
                {label:"Date",     value: formData.appointmentDate || "—"},
                {label:"Condition",value: formData.condition     || "—"},
              ].map(({label,value}) => (
                <div className="ba-summary-row" key={label}>
                  <span className="label">{label}</span>
                  <span className="value">{value}</span>
                </div>
              ))}

              <div className="ba-summary-total">
                <div className="amt">Rs. 500</div>
                <div className="note">Consultation fee</div>
              </div>

              <div className="ba-note-box">
                💳 Payment will be processed on the next step. You can pay online or at the hospital.
              </div>
            </div>
          </div>

        </div>
      </Layout>
    </>
  );
};

export default BookAppointmentForm;
