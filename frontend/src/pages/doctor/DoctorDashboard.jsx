import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import Layout from "../../components/Layout";
import api from "../../services/api";
import { resolveMediaUrl } from "../../utils/constants";

const fallbackPhoto = (name = "Doctor") =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0f3460&color=ffffff&size=200`;

/* ─── tiny helpers ─────────────────────────────────── */
const PAYMENT_STYLES = {
  Paid: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  Pending: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  Failed: "bg-red-50 text-red-600 ring-1 ring-red-200",
};
const STATUS_STYLES = {
  Completed: "bg-sky-50 text-sky-700 ring-1 ring-sky-200",
  Pending: "bg-slate-100 text-slate-600 ring-1 ring-slate-200",
  Cancelled: "bg-red-50 text-red-600 ring-1 ring-red-200",
  Confirmed: "bg-violet-50 text-violet-700 ring-1 ring-violet-200",
};
const pill = (map, val) =>
  `inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${map[val] || "bg-slate-100 text-slate-500 ring-1 ring-slate-200"}`;

/* ─── stat card ─────────────────────────────────────── */
const STAT_META = [
  { key: "totalAppointments",     label: "Total",        accent: "from-sky-500 to-cyan-400",        icon: "M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5" },
  { key: "pendingAppointments",   label: "Pending",      accent: "from-amber-400 to-orange-400",    icon: "M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" },
  { key: "completedAppointments", label: "Completed",    accent: "from-emerald-500 to-teal-400",    icon: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
  { key: "paymentPending",        label: "Pay Pending",  accent: "from-rose-400 to-pink-400",       icon: "M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" },
  { key: "paymentCompleted",      label: "Pay Done",     accent: "from-violet-500 to-indigo-500",   icon: "M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" },
];

function StatCard({ label, value, accent, icon, index }) {
  return (
    <div
      className="group relative overflow-hidden rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/80 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* gradient corner accent */}
      <div className={`absolute -right-4 -top-4 h-20 w-20 rounded-full bg-gradient-to-br ${accent} opacity-10 transition-all duration-300 group-hover:opacity-20 group-hover:scale-125`} />
      <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${accent} text-white shadow-sm`}>
        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.7} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
        </svg>
      </div>
      <p className="text-xs font-medium uppercase tracking-wider text-slate-400">{label}</p>
      <p className="mt-1 text-3xl font-bold text-slate-900 tabular-nums">{value}</p>
    </div>
  );
}

/* ─── info chip ─────────────────────────────────────── */
function Chip({ icon, label, value }) {
  if (!value || value === "-") return null;
  return (
    <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 ring-1 ring-slate-100">
      <svg className="h-4 w-4 shrink-0 text-slate-400" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
      </svg>
      <span className="text-xs text-slate-400">{label}</span>
      <span className="ml-auto text-xs font-semibold text-slate-700">{value}</span>
    </div>
  );
}

/* ─── patient card ──────────────────────────────────── */
function PatientCard({ a }) {
  const patient = a.patientId || {};
  const name = patient.name || a.patientName || "Patient";
  const photo = resolveMediaUrl(patient.profilePhoto || patient.photoUrl) || fallbackPhoto(name);
  const gender = patient.gender || a.patientSex;
  const age = patient.age || a.patientAge;
  const condition = a.condition || a.disease;
  const location = patient.address || a.patientLocation;

  return (
    <div className="group flex flex-col rounded-2xl bg-white p-5 ring-1 ring-slate-200/80 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-100">
      {/* header */}
      <div className="flex items-start gap-3">
        <div className="relative shrink-0">
          <img
            src={photo}
            alt={name}
            className="h-14 w-14 rounded-xl object-cover ring-2 ring-white shadow-md"
            onError={(e) => { e.target.src = fallbackPhoto(name); }}
          />
          {/* status dot */}
          <span className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white ${a.status === "Completed" ? "bg-emerald-400" : a.status === "Cancelled" ? "bg-red-400" : "bg-amber-400"}`} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-bold text-slate-900">{name}</p>
          <p className="text-xs text-slate-400">{[gender, age ? `Age ${age}` : null].filter(Boolean).join(" · ")}</p>
          {condition && (
            <span className="mt-1 inline-block rounded-lg bg-sky-50 px-2 py-0.5 text-xs font-medium text-sky-700 ring-1 ring-sky-100">
              {condition}
            </span>
          )}
        </div>
      </div>

      {/* details */}
      <div className="mt-4 space-y-1.5 text-xs text-slate-500">
        {location && (
          <div className="flex items-center gap-1.5">
            <svg className="h-3.5 w-3.5 text-slate-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0zM19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            {location}
          </div>
        )}
        {a.appointmentDate && (
          <div className="flex items-center gap-1.5">
            <svg className="h-3.5 w-3.5 text-slate-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5A2.25 2.25 0 015.25 5.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5" />
            </svg>
            {a.appointmentDate.slice(0, 10)}{a.appointmentTime ? ` · ${a.appointmentTime}` : ""}
          </div>
        )}
      </div>

      {/* badges */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        <span className={pill(STATUS_STYLES, a.status)}>{a.status || "—"}</span>
        <span className={pill(PAYMENT_STYLES, a.paymentStatus)}>{a.paymentStatus || "—"}</span>
      </div>

      {/* actions */}
      <div className="mt-4 flex gap-2 pt-3 border-t border-slate-100">
        <Link
          to={`/doctor/patients/${a._id}`}
          className="flex-1 rounded-xl border border-slate-200 py-2 text-center text-xs font-semibold text-slate-600 transition hover:bg-slate-50 hover:border-slate-300"
        >
          View Details
        </Link>
        <Link
          to="/doctor/appointments"
          className="flex-1 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 py-2 text-center text-xs font-semibold text-white shadow-sm shadow-sky-200 transition hover:from-sky-600 hover:to-cyan-600 active:scale-95"
        >
          Update Status
        </Link>
      </div>
    </div>
  );
}

/* ─── skeleton ──────────────────────────────────────── */
function Skeleton({ className }) {
  return <div className={`animate-pulse rounded-2xl bg-slate-100 ${className}`} />;
}

/* ─── main component ────────────────────────────────── */
const DoctorDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ doctor: null, stats: {}, recentPatients: [] });

  useEffect(() => {
    (async () => {
      try {
        const { data: payload } = await api.get("/doctor/dashboard");
        setData(payload);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to load doctor dashboard");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const doctor = data.doctor;
  const photo = resolveMediaUrl(doctor?.profilePhoto) || fallbackPhoto(doctor?.name);

  return (
    <Layout role="doctor">
      {/* page background */}
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50/20 to-slate-100 p-4 md:p-8">
        <div className="mx-auto max-w-7xl space-y-6">

          {/* ── Profile hero ── */}
          <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0f3460] via-[#16213e] to-[#0f3460] p-6 shadow-xl md:p-8">
            {/* decorative circles */}
            <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-sky-400/10" />
            <div className="pointer-events-none absolute -bottom-10 left-1/3 h-40 w-40 rounded-full bg-cyan-400/10" />

            {loading ? (
              <div className="flex gap-6">
                <Skeleton className="h-28 w-28 shrink-0 rounded-2xl" />
                <div className="flex-1 space-y-3">
                  <Skeleton className="h-7 w-48" />
                  <Skeleton className="h-4 w-64" />
                  <div className="grid grid-cols-3 gap-2 pt-2">
                    {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-9" />)}
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative flex flex-col gap-6 md:flex-row md:items-start">
                {/* photo */}
                <div className="shrink-0">
                  <img
                    src={photo}
                    alt={doctor?.name}
                    className="h-28 w-28 rounded-2xl object-cover ring-4 ring-white/20 shadow-2xl"
                    onError={(e) => { e.target.src = fallbackPhoto(doctor?.name); }}
                  />
                </div>

                {/* info */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-sky-300/80">Doctor Profile</p>
                      <h1 className="mt-1 text-3xl font-bold text-white">{doctor?.name}</h1>
                      <p className="mt-1 text-sky-200/80 text-sm">
                        {doctor?.specialization}
                        {doctor?.experience ? ` · ${doctor.experience} yrs experience` : ""}
                      </p>
                    </div>
                    <Link
                      to="/doctor/profile"
                      className="rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
                    >
                      Edit Profile
                    </Link>
                  </div>

                  <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    <Chip icon="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" label="Hospital" value={doctor?.hospitalName} />
                    <Chip icon="M15 10.5a3 3 0 11-6 0 3 3 0 016 0zM19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" label="Location" value={doctor?.hospitalLocation} />
                    <Chip icon="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" label="Available" value={doctor?.availabilityTime} />
                    <Chip icon="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" label="Phone" value={doctor?.phone} />
                    <Chip icon="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" label="Email" value={doctor?.email} />
                    <Chip icon="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" label="Qualification" value={doctor?.qualification} />
                    {doctor?.age && <Chip icon="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" label="Age" value={doctor?.age} />}
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* ── Stat cards ── */}
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {loading
              ? [...Array(5)].map((_, i) => <Skeleton key={i} className="h-32" />)
              : STAT_META.map((m, i) => (
                  <StatCard
                    key={m.key}
                    label={m.label}
                    value={data.stats?.[m.key] ?? 0}
                    accent={m.accent}
                    icon={m.icon}
                    index={i}
                  />
                ))}
          </section>

          {/* ── Patient list ── */}
          <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm md:p-8">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Recent Patients</h2>
                <p className="mt-0.5 text-sm text-slate-400">Latest appointments at a glance</p>
              </div>
              <Link
                to="/doctor/patients"
                className="flex items-center gap-1.5 rounded-xl border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-600 transition hover:bg-sky-100"
              >
                View all
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>

            {loading ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-52" />)}
              </div>
            ) : (data.recentPatients || []).length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl bg-slate-50 py-16 text-center">
                <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-200 text-slate-400">
                  <svg className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                  </svg>
                </div>
                <p className="font-semibold text-slate-600">No patients yet</p>
                <p className="mt-1 text-sm text-slate-400">Recent appointments will appear here</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {(data.recentPatients || []).map((a) => (
                  <PatientCard key={a._id} a={a} />
                ))}
              </div>
            )}
          </section>

        </div>
      </div>
    </Layout>
  );
};

export default DoctorDashboard;