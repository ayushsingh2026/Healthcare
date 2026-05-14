import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import Layout from "../../components/Layout";
import api from "../../services/api";

const statusOptions = ["Pending", "Confirmed", "In Consultation", "Completed", "Cancelled"];
const paymentOptions = ["Pending", "Paid"];

const Appointments = () => {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [page, setPage] = useState(1);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/doctor/appointments");
      setItems(data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const now = new Date();
    const weekEnd = new Date(now);
    weekEnd.setDate(now.getDate() + 7);
    return items.filter((a) => {
      const name = (a.patientId?.name || a.patientName || "").toLowerCase();
      if (search && !name.includes(search.toLowerCase())) return false;
      if (filter === "All") return true;
      if (filter === "Payment Pending") return a.paymentStatus === "Pending";
      if (filter === "Today") return (a.appointmentDate || "").slice(0, 10) === now.toISOString().slice(0, 10);
      if (filter === "This Week") {
        const d = new Date(a.appointmentDate);
        return d >= now && d <= weekEnd;
      }
      return a.status === filter;
    });
  }, [items, search, filter]);

  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/doctor/appointments/${id}/status`, { status });
      toast.success("Appointment status updated");
      await load();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  const updatePayment = async (id, paymentStatus) => {
    try {
      await api.patch(`/doctor/appointments/${id}/payment-status`, { paymentStatus });
      toast.success("Payment status updated");
      await load();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update payment");
    }
  };

  return (
    <Layout role="doctor">
      <div className="min-h-screen bg-slate-100 p-4 md:p-8">
        <div className="mx-auto max-w-7xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">Doctor Appointments</h1>
          <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <input
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 md:w-80"
              placeholder="Search patient name"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
            <select className="rounded-xl border border-slate-300 px-4 py-2.5" value={filter} onChange={(e) => { setFilter(e.target.value); setPage(1); }}>
              {["All", "Pending", "Completed", "Cancelled", "Today", "This Week", "Payment Pending"].map((f) => <option key={f}>{f}</option>)}
            </select>
          </div>

          {loading ? (
            <div className="mt-6 grid gap-3">{[...Array(6)].map((_, i) => <div key={i} className="h-12 animate-pulse rounded-lg bg-slate-100" />)}</div>
          ) : (
            <div className="mt-6 overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="px-3 py-3">Patient Name</th>
                    <th className="px-3 py-3">Date</th>
                    <th className="px-3 py-3">Time</th>
                    <th className="px-3 py-3">Condition</th>
                    <th className="px-3 py-3">Payment Status</th>
                    <th className="px-3 py-3">Appointment Status</th>
                    <th className="px-3 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paged.map((a) => (
                    <tr key={a._id} className="border-t border-slate-100">
                      <td className="px-3 py-3 font-medium">{a.patientId?.name || a.patientName}</td>
                      <td className="px-3 py-3">{a.appointmentDate?.slice(0, 10)}</td>
                      <td className="px-3 py-3">{a.appointmentTime || "-"}</td>
                      <td className="px-3 py-3">{a.condition || a.disease || "-"}</td>
                      <td className="px-3 py-3">
                        <select value={a.paymentStatus} onChange={(e) => updatePayment(a._id, e.target.value)} className="rounded-lg border border-slate-300 px-2 py-1.5">
                          {paymentOptions.map((p) => <option key={p}>{p}</option>)}
                        </select>
                      </td>
                      <td className="px-3 py-3">
                        <select value={a.status} onChange={(e) => updateStatus(a._id, e.target.value)} className="rounded-lg border border-slate-300 px-2 py-1.5">
                          {statusOptions.map((s) => <option key={s}>{s}</option>)}
                        </select>
                      </td>
                      <td className="px-3 py-3 text-sky-600">Updated Live</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="mt-4 flex items-center justify-end gap-2">
            <button className="rounded border px-3 py-1.5 disabled:opacity-50" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>Prev</button>
            <span className="text-sm text-slate-600">{page} / {totalPages}</span>
            <button className="rounded border px-3 py-1.5 disabled:opacity-50" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>Next</button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Appointments;

