import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Layout from "../../components/Layout";
import api from "../../services/api";

const Bar = ({ label, value, max }) => (
  <div>
    <div className="mb-1 flex justify-between text-xs text-slate-600"><span>{label}</span><span>{value}</span></div>
    <div className="h-2 rounded bg-slate-100"><div className="h-2 rounded bg-sky-500" style={{ width: `${max ? (value / max) * 100 : 0}%` }} /></div>
  </div>
);

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/admin/dashboard");
        setData(data);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch dashboard stats");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const cards = data?.cards || {};
  const monthly = data?.charts?.monthlyPayments || [];
  const maxMonthly = Math.max(...monthly, 1);
  const ov = data?.charts?.appointmentsOverview || {};

  return (
    <Layout role="admin">
      <div className="min-h-screen bg-slate-100 p-4 md:p-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
            <div className="rounded-full bg-white px-4 py-2 text-sm shadow">Notifications: {data?.widgets?.systemActivity?.length || 0}</div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Total Doctors", cards.doctors],
              ["Total Patients", cards.patients],
              ["Total Lab Users", cards.labs],
              ["Total Appointments", cards.appointments],
              ["Total Payments", cards.payments],
              ["Pending Payments", cards.pendingPayments],
              ["Completed Appointments", cards.completedAppointments],
              ["Cancelled Appointments", cards.cancelledAppointments],
            ].map(([k, v]) => (
              <div key={k} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">{k}</p>
                <p className="mt-1 text-3xl font-bold text-slate-900">{loading ? "..." : v ?? 0}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
              <h2 className="mb-4 text-lg font-semibold text-slate-900">Monthly Payments</h2>
              <div className="grid gap-2">
                {monthly.map((v, i) => <Bar key={i} label={new Date(2026, i, 1).toLocaleString("en-US", { month: "short" })} value={v} max={maxMonthly} />)}
              </div>
            </section>
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-slate-900">Appointments Overview</h2>
              <div className="space-y-2 text-sm">
                <p>Pending: <b>{ov.pending || 0}</b></p>
                <p>Confirmed: <b>{ov.confirmed || 0}</b></p>
                <p>In Consultation: <b>{ov.inConsultation || 0}</b></p>
                <p>Completed: <b>{ov.completed || 0}</b></p>
                <p>Cancelled: <b>{ov.cancelled || 0}</b></p>
                <p className="pt-2">Revenue: <b>₹{cards.totalRevenue || 0}</b></p>
              </div>
            </section>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="mb-3 font-semibold">Recent Appointments</h3>
              <div className="space-y-2 text-sm">{(data?.widgets?.recentAppointments || []).map((a) => <p key={a._id}>{a.patientId?.name} with {a.doctorId?.name}</p>)}</div>
            </section>
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="mb-3 font-semibold">Recent Registrations</h3>
              <div className="space-y-2 text-sm">{(data?.widgets?.recentRegistrations || []).map((u) => <p key={u._id}>{u.name} ({u.role})</p>)}</div>
            </section>
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="mb-3 font-semibold">Latest Payments</h3>
              <div className="space-y-2 text-sm">{(data?.widgets?.latestPayments || []).map((p) => <p key={p._id}>{p.patientId?.name} - ₹{p.amount} ({p.status})</p>)}</div>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;

