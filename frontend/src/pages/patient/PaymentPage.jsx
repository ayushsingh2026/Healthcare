import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
    --shadow-sm:0 2px 12px rgba(13,79,79,.07);
    --shadow-md:0 8px 32px rgba(13,79,79,.13);
    --shadow-lg:0 24px 64px rgba(13,79,79,.18);
    --radius:20px; --radius-sm:12px;
  }
  @keyframes fadeUp  { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
  @keyframes spin    { to{transform:rotate(360deg)} }
  @keyframes checkPop{ 0%{transform:scale(0)} 60%{transform:scale(1.25)} 100%{transform:scale(1)} }
  @keyframes pulse-ring{ 0%{transform:scale(1);opacity:.4} 100%{transform:scale(1.5);opacity:0} }
  *, *::before, *::after { box-sizing:border-box; }

  .pp-shell { display:flex; min-height:100vh; background:var(--cream); font-family:'DM Sans',sans-serif; color:var(--text); }
  .pp-main  { flex:1; padding:40px 44px; overflow-x:hidden; }

  .pp-back {
    display:inline-flex; align-items:center; gap:8px; color:var(--teal-mid);
    font-size:.85rem; font-weight:600; background:none; border:none; cursor:pointer;
    padding:8px 0; margin-bottom:28px; transition:gap .2s;
    font-family:'DM Sans',sans-serif; animation:fadeIn .4s ease both;
  }
  .pp-back:hover{gap:13px;} .pp-back svg{width:18px;height:18px;}

  .pp-title { font-family:'DM Serif Display',serif; font-size:2.2rem; color:var(--teal-deep); margin-bottom:6px; animation:fadeUp .45s ease both; }
  .pp-sub   { font-size:.9rem; color:var(--slate); margin-bottom:36px; animation:fadeUp .45s .06s ease both; }

  .pp-layout { display:grid; grid-template-columns:1fr 340px; gap:28px; align-items:start; max-width:920px; }
  @media(max-width:900px){ .pp-layout{grid-template-columns:1fr;} }

  /* ── Method cards ── */
  .pp-card { background:var(--white); border-radius:var(--radius); box-shadow:var(--shadow-md); padding:34px 36px; border:1px solid rgba(13,79,79,.06); animation:fadeUp .45s .1s ease both; }
  .pp-section-label { font-size:.7rem; letter-spacing:.1em; text-transform:uppercase; color:var(--teal-mid); font-weight:600; margin-bottom:18px; }

  .pp-method-grid { display:grid; grid-template-columns:1fr 1fr; gap:14px; margin-bottom:28px; }
  .pp-method {
    border:2px solid var(--slate-border); border-radius:var(--radius-sm);
    padding:20px 16px; cursor:pointer; background:var(--white);
    transition:border-color .2s, box-shadow .2s, transform .2s;
    display:flex; flex-direction:column; align-items:center; gap:10px; text-align:center;
  }
  .pp-method:hover { border-color:var(--teal-soft); transform:translateY(-2px); box-shadow:var(--shadow-sm); }
  .pp-method.selected { border-color:var(--teal-mid); background:var(--teal-xpale); box-shadow:0 0 0 3px rgba(20,184,166,.18); }
  .pp-method-icon { font-size:2rem; }
  .pp-method-name { font-weight:700; font-size:.9rem; color:var(--text); }
  .pp-method-desc { font-size:.75rem; color:var(--slate); }
  .pp-method-check {
    width:20px; height:20px; border-radius:50%;
    background:var(--teal-mid); display:flex; align-items:center; justify-content:center;
    opacity:0; transition:opacity .2s; margin-top:4px;
  }
  .pp-method.selected .pp-method-check { opacity:1; animation:checkPop .3s ease; }
  .pp-method-check svg { width:12px; height:12px; color:white; }

  /* ── Selected method detail ── */
  .pp-method-detail {
    background:var(--teal-xpale); border:1.5px solid var(--teal-pale);
    border-radius:var(--radius-sm); padding:16px 18px; margin-bottom:24px;
    font-size:.85rem; color:var(--teal-deep); display:flex; gap:12px; align-items:flex-start;
    animation:fadeIn .3s ease;
  }
  .pp-method-detail svg { width:18px; height:18px; flex-shrink:0; margin-top:1px; }

  /* ── Pay button ── */
  .pp-pay-btn {
    width:100%; padding:16px;
    background:linear-gradient(135deg,var(--teal-mid),var(--teal-deep));
    color:var(--white); border:none; border-radius:var(--radius-sm);
    font-family:'DM Sans',sans-serif; font-size:.98rem; font-weight:700;
    cursor:pointer; letter-spacing:.03em;
    display:flex; align-items:center; justify-content:center; gap:10px;
    transition:opacity .2s, transform .15s;
    position:relative; overflow:hidden;
  }
  .pp-pay-btn:hover:not(:disabled){opacity:.9;transform:scale(.99);}
  .pp-pay-btn:disabled{opacity:.55;cursor:not-allowed;}
  .pp-spinner{width:18px;height:18px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:spin .7s linear infinite;}

  /* ── Order summary card ── */
  .pp-summary {
    background:linear-gradient(145deg,var(--teal-deep),var(--teal-mid));
    border-radius:var(--radius); padding:28px 26px; color:var(--white);
    position:sticky; top:24px; animation:fadeUp .45s .18s ease both;
  }
  .pp-summary-title { font-family:'DM Serif Display',serif; font-size:1.3rem; margin-bottom:6px; }
  .pp-summary-sub   { font-size:.8rem; opacity:.65; margin-bottom:22px; }

  .pp-summary-rows { margin-bottom:20px; }
  .pp-s-row { display:flex; justify-content:space-between; padding:10px 0; border-bottom:1px solid rgba(255,255,255,.1); font-size:.84rem; }
  .pp-s-row:last-of-type{border-bottom:none;}
  .pp-s-row .lbl{opacity:.7;} .pp-s-row .val{font-weight:600;}

  .pp-total-box { background:rgba(255,255,255,.12); border-radius:var(--radius-sm); padding:18px; text-align:center; margin-bottom:16px; }
  .pp-total-box .label { font-size:.75rem; opacity:.65; text-transform:uppercase; letter-spacing:.06em; margin-bottom:4px; }
  .pp-total-box .amount { font-family:'DM Serif Display',serif; font-size:2.4rem; }

  .pp-secure { display:flex; align-items:center; gap:8px; font-size:.75rem; opacity:.65; justify-content:center; }
  .pp-secure svg { width:14px; height:14px; }

  @media(max-width:768px){ .pp-main{padding:20px 18px;} .pp-card{padding:24px 20px;} .pp-method-grid{grid-template-columns:1fr 1fr;} }
`;

const Icon = ({d,style}) => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} style={style}><path strokeLinecap="round" strokeLinejoin="round" d={d}/></svg>;

const METHODS = [
  { id:"online",  icon:"💳", name:"Pay Online",    desc:"Instant confirmation" },
  { id:"offline", icon:"🏥", name:"Pay at Hospital", desc:"Pending until payment" },
];

const methodInfo = {
  online:  { icon:"M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", text:"Your appointment will be confirmed immediately upon successful payment. A confirmation receipt will be sent to your email." },
  offline: { icon:"M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z", text:"Your request will be held as pending. Please complete payment at the hospital counter to confirm your appointment." },
};

/* ─── Component ───────────────────────────────────────────────────────── */
const PaymentPage = () => {
  const location = useLocation();
  const navigate  = useNavigate();

  const amount     = location.state?.amount     || 500;
  const source     = location.state?.source     || "service";
  const sourceType = location.state?.sourceType;
  const sourceId   = location.state?.sourceId;

  const [method,  setMethod]  = useState("");
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    if (!method)             { toast.error("Select a payment method"); return; }
    if (!sourceType || !sourceId) { toast.error("Invalid payment source."); return; }
    setLoading(true);
    try {
      await api.post("/payments", { amount, paymentMethod:method, sourceType, sourceId });
      toast.success(method==="online" ? "Payment successful! Appointment confirmed." : "Request submitted. Pay at hospital to confirm.");
      navigate("/patient/account");
    } catch (err) {
      toast.error(err.response?.data?.message || "Payment failed");
    } finally { setLoading(false); }
  };

  const tax  = Math.round(amount * 0.05);
  const total = amount + tax;

  return (
    <>
      <style>{styles}</style>
      <Layout role="patient">
        <div className="pp-main">

          <button className="pp-back" onClick={() => navigate(-1)}>
            <Icon d="M19 12H5m0 0l7 7m-7-7l7-7"/> Back
          </button>

          <h1 className="pp-title">Complete Payment</h1>
          <p className="pp-sub">Choose how you'd like to pay for your <strong style={{color:"var(--teal-mid)"}}>{source}</strong></p>

          <div className="pp-layout">

            {/* ── Left: method selector ── */}
            <div className="pp-card">
              <div className="pp-section-label">Payment Method</div>
              <div className="pp-method-grid">
                {METHODS.map(m => (
                  <div
                    key={m.id}
                    className={`pp-method${method===m.id?" selected":""}`}
                    onClick={() => setMethod(m.id)}
                  >
                    <div className="pp-method-icon">{m.icon}</div>
                    <div className="pp-method-name">{m.name}</div>
                    <div className="pp-method-desc">{m.desc}</div>
                    <div className="pp-method-check">
                      <Icon d="M5 13l4 4L19 7"/>
                    </div>
                  </div>
                ))}
              </div>

              {method && (
                <div className="pp-method-detail">
                  <Icon d={methodInfo[method].icon} style={{flexShrink:0}}/>
                  <span>{methodInfo[method].text}</span>
                </div>
              )}

              <button className="pp-pay-btn" onClick={handlePay} disabled={loading||!method}>
                {loading
                  ? <><div className="pp-spinner"/>Processing Payment…</>
                  : <>Confirm & Pay Rs. {total} →</>
                }
              </button>
            </div>

            {/* ── Right: order summary ── */}
            <div className="pp-summary">
              <div className="pp-summary-title">Order Summary</div>
              <div className="pp-summary-sub">Billing breakdown</div>

              <div className="pp-summary-rows">
                {[
                  { lbl:"Service",      val: source },
                  { lbl:"Subtotal",     val: `Rs. ${amount}` },
                  { lbl:"Service Tax",  val: `Rs. ${tax}` },
                ].map(({lbl,val}) => (
                  <div className="pp-s-row" key={lbl}>
                    <span className="lbl">{lbl}</span>
                    <span className="val">{val}</span>
                  </div>
                ))}
              </div>

              <div className="pp-total-box">
                <div className="label">Total Amount</div>
                <div className="amount">Rs. {total}</div>
              </div>

              <div className="pp-secure">
                <Icon d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                Secured &amp; Encrypted Transaction
              </div>
            </div>

          </div>
        </div>
      </Layout>
    </>
  );
};

export default PaymentPage;
