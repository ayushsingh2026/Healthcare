import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";


import '../../css/Register.css';

const roles = [
  {
    value: "patient",
    label: "Patient",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{width:18,height:18}}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
  {
    value: "doctor",
    label: "Doctor",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{width:18,height:18}}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
  },
  {
    value: "lab",
    label: "Lab Assistant",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{width:18,height:18}}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
  },
];

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    role: "patient", name: "", age: "", gender: "", phone: "",
    email: "", password: "", disease: "", address: "",
    specialization: "", qualification: "", experience: "",
    hospitalName: "", hospitalLocation: "", availabilityTime: "",
    bio: "", city: "", workingHours: "",
  });
  const [loading, setLoading] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePhoto = (e) => {
    const file = e.target.files?.[0] || null;
    setProfilePhoto(file);
    if (file) setPhotoPreview(URL.createObjectURL(file));
    else setPhotoPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      toast.error("Name, email, and password are required");
      return;
    }
    setLoading(true);
    try {
      const payload = new FormData();
      Object.entries({
        ...formData,
        age: formData.age ? Number(formData.age) : "",
        experience: formData.experience ? Number(formData.experience) : "",
      }).forEach(([k, v]) => {
        if (v !== undefined && v !== null && String(v).trim() !== "") payload.append(k, v);
      });
      if (profilePhoto) payload.append("profilePhoto", profilePhoto);
      await register(payload);
      toast.success("Registration successful");
      if (formData.role === "doctor") navigate("/doctor/dashboard");
      else if (formData.role === "lab") navigate("/lab/dashboard");
      else navigate("/patient/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const ff = (name) => focusedField === name;

  return (
    <>
      

      <Navbar />

      <div className="reg-root">
        <div className="cross-bg" />

        <div className="reg-card">
          {/* Header */}
          <div className="reg-header">
            <div className="logo-mark">
              <div className="logo-cross">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" d="M12 5v14M5 12h14" />
                </svg>
              </div>
              <span className="logo-text">MediCare Portal</span>
            </div>
            <h1>Create Account</h1>
            <p>Join thousands managing their healthcare with confidence</p>
          </div>

          {/* Body */}
          <div className="reg-body">
            <form onSubmit={handleSubmit}>

              {/* Role */}
              <span className="step-label">I am registering as</span>
              <div className="role-grid">
                {roles.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    className={`role-btn${formData.role === r.value ? " active" : ""}`}
                    onClick={() => setFormData((p) => ({ ...p, role: r.value }))}
                  >
                    <span className="r-icon">{r.icon}</span>
                    {r.label}
                  </button>
                ))}
              </div>

              {/* Basic info */}
              <div className="section-divider"><span>Basic Information</span></div>

              <div className="form-grid">
                {/* Name */}
                <div className="field-wrap">
                  <span className={`field-icon${ff("name") ? " focused" : ""}`}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </span>
                  <input name="name" type="text" placeholder="Full Name" className="field-input"
                    value={formData.name} onChange={handleChange}
                    onFocus={() => setFocusedField("name")} onBlur={() => setFocusedField(null)} />
                </div>

                {/* Age */}
                <div className="field-wrap">
                  <span className={`field-icon${ff("age") ? " focused" : ""}`}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </span>
                  <input name="age" type="number" placeholder="Age" className="field-input"
                    value={formData.age} onChange={handleChange}
                    onFocus={() => setFocusedField("age")} onBlur={() => setFocusedField(null)} />
                </div>

                {/* Gender */}
                <div className="field-wrap">
                  <span className="field-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </span>
                  <select name="gender" className="field-select" value={formData.gender} onChange={handleChange}>
                    <option value="">Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Phone */}
                <div className="field-wrap">
                  <span className={`field-icon${ff("phone") ? " focused" : ""}`}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </span>
                  <input name="phone" type="text" placeholder="Phone Number" className="field-input"
                    value={formData.phone} onChange={handleChange}
                    onFocus={() => setFocusedField("phone")} onBlur={() => setFocusedField(null)} />
                </div>
              </div>

              {/* Account */}
              <div className="section-divider"><span>Account Credentials</span></div>

              <div className="form-grid">
                {/* Email */}
                <div className="field-wrap">
                  <span className={`field-icon${ff("email") ? " focused" : ""}`}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </span>
                  <input name="email" type="email" placeholder="Email Address" className="field-input"
                    value={formData.email} onChange={handleChange}
                    onFocus={() => setFocusedField("email")} onBlur={() => setFocusedField(null)} />
                </div>

                {/* Password */}
                <div className="field-wrap">
                  <span className={`field-icon${ff("password") ? " focused" : ""}`}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </span>
                  <input name="password" type={showPassword ? "text" : "password"} placeholder="Password"
                    className="field-input" style={{ paddingRight: "2.8rem" }}
                    value={formData.password} onChange={handleChange}
                    onFocus={() => setFocusedField("password")} onBlur={() => setFocusedField(null)} />
                  <button type="button" className="pw-toggle" onClick={() => setShowPassword(v => !v)} tabIndex={-1}>
                    {showPassword
                      ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                      : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    }
                  </button>
                </div>
              </div>

              {/* Profile Photo */}
              <div style={{ marginTop: 12 }}>
                <label className="photo-upload-wrap" htmlFor="photo-input">
                  {photoPreview
                    ? <img src={photoPreview} className="photo-preview" alt="Preview" />
                    : <div className="photo-placeholder">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                  }
                  <div className="photo-info">
                    <div className="photo-info-title">{photoPreview ? "Photo selected ✓" : "Upload Profile Photo"}</div>
                    <div className="photo-info-sub">JPG or PNG · Optional</div>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                </label>
                <input id="photo-input" className="photo-input" type="file" accept=".jpg,.jpeg,.png" onChange={handlePhoto} />
              </div>

              {/* Patient fields */}
              {formData.role === "patient" && (
                <div className="extra-fields">
                  <div className="section-divider"><span>Health Information</span></div>
                  <div className="field-wrap">
                    <span className={`field-icon${ff("disease") ? " focused" : ""}`}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </span>
                    <input name="disease" type="text" placeholder="Disease / Symptoms (if any)" className="field-input"
                      value={formData.disease} onChange={handleChange}
                      onFocus={() => setFocusedField("disease")} onBlur={() => setFocusedField(null)} />
                  </div>
                </div>
              )}

              {/* Doctor fields */}
              {formData.role === "doctor" && (
                <div className="extra-fields">
                  <div className="section-divider"><span>Professional Details</span></div>
                  <div className="form-grid">
                    <div className="field-wrap">
                      <span className={`field-icon${ff("specialization") ? " focused" : ""}`}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </span>
                      <input name="specialization" type="text" placeholder="Specialization" className="field-input"
                        value={formData.specialization} onChange={handleChange}
                        onFocus={() => setFocusedField("specialization")} onBlur={() => setFocusedField(null)} />
                    </div>
                    <div className="field-wrap">
                      <span className={`field-icon${ff("qualification") ? " focused" : ""}`}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                        </svg>
                      </span>
                      <input name="qualification" type="text" placeholder="Qualification" className="field-input"
                        value={formData.qualification} onChange={handleChange}
                        onFocus={() => setFocusedField("qualification")} onBlur={() => setFocusedField(null)} />
                    </div>
                    <div className="field-wrap">
                      <span className={`field-icon${ff("experience") ? " focused" : ""}`}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </span>
                      <input name="experience" type="number" placeholder="Experience (years)" className="field-input"
                        value={formData.experience} onChange={handleChange}
                        onFocus={() => setFocusedField("experience")} onBlur={() => setFocusedField(null)} />
                    </div>
                    <div className="field-wrap">
                      <span className={`field-icon${ff("availabilityTime") ? " focused" : ""}`}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </span>
                      <input name="availabilityTime" type="text" placeholder="Availability (e.g. 9am–5pm)" className="field-input"
                        value={formData.availabilityTime} onChange={handleChange}
                        onFocus={() => setFocusedField("availabilityTime")} onBlur={() => setFocusedField(null)} />
                    </div>
                    <div className="field-wrap">
                      <span className={`field-icon${ff("hospitalName") ? " focused" : ""}`}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </span>
                      <input name="hospitalName" type="text" placeholder="Hospital Name" className="field-input"
                        value={formData.hospitalName} onChange={handleChange}
                        onFocus={() => setFocusedField("hospitalName")} onBlur={() => setFocusedField(null)} />
                    </div>
                    <div className="field-wrap">
                      <span className={`field-icon${ff("hospitalLocation") ? " focused" : ""}`}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </span>
                      <input name="hospitalLocation" type="text" placeholder="Hospital Location" className="field-input"
                        value={formData.hospitalLocation} onChange={handleChange}
                        onFocus={() => setFocusedField("hospitalLocation")} onBlur={() => setFocusedField(null)} />
                    </div>

                    <div className="field-wrap col-span-2" style={{ position: "relative" }}>
                      <span className={`textarea-icon${ff("bio") ? " focused" : ""}`}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" />
                        </svg>
                      </span>
                      <textarea name="bio" placeholder="Short bio / about yourself" rows="3"
                        className="field-textarea"
                        value={formData.bio} onChange={handleChange}
                        onFocus={() => setFocusedField("bio")} onBlur={() => setFocusedField(null)} />
                    </div>
                  </div>
                </div>
              )}

              {/* Lab fields */}
              {formData.role === "lab" && (
                <div className="extra-fields">
                  <div className="section-divider"><span>Lab Details</span></div>
                  <div className="form-grid">
                    <div className="field-wrap">
                      <span className={`field-icon${ff("city") ? " focused" : ""}`}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </span>
                      <input name="city" type="text" placeholder="City" className="field-input"
                        value={formData.city} onChange={handleChange}
                        onFocus={() => setFocusedField("city")} onBlur={() => setFocusedField(null)} />
                    </div>
                    <div className="field-wrap">
                      <span className={`field-icon${ff("workingHours") ? " focused" : ""}`}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </span>
                      <input name="workingHours" type="text" placeholder="Working Hours" className="field-input"
                        value={formData.workingHours} onChange={handleChange}
                        onFocus={() => setFocusedField("workingHours")} onBlur={() => setFocusedField(null)} />
                    </div>
                  </div>
                </div>
              )}

              {/* Address */}
              <div style={{ marginTop: 12, position: "relative" }}>
                <span className={`textarea-icon${ff("address") ? " focused" : ""}`}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </span>
                <textarea name="address" placeholder="Full Address" rows="3"
                  className="field-textarea"
                  value={formData.address} onChange={handleChange}
                  onFocus={() => setFocusedField("address")} onBlur={() => setFocusedField(null)} />
              </div>

              {/* Submit */}
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? (
                  <><span className="spinner" />Creating Account…</>
                ) : (
                  <>
                    Create Account
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </button>

              <p className="login-prompt">
                Already have an account? <Link to="/login">Sign in</Link>
              </p>

              <div className="secure-badge">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                256-bit encrypted · HIPAA compliant
              </div>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Register;


