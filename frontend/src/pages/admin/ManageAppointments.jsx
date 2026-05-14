import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Layout from "../../components/Layout";
import api from "../../services/api";

const statusOptions = ["Pending", "Confirmed", "In Consultation", "Completed", "Cancelled"];

const ManageAppointments = () => {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [when, setWhen] = useState("");

  const load = async () => {
    try {
      const { data } = await api.get(`/admin/appointments?q=${encodeURIComponent(q)}&status=${encodeURIComponent(status)}&when=${encodeURIComponent(when)}`);
      setItems(data);
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to load appointments");
    }
  };

  useEffect(() => { load(); }, [q, status, when]);

  const update = async (a, newStatus) => {
    try {
      await api.patch(`/admin/appointments/${a._id}`, { status: newStatus });
      toast.success("Appointment updated");
      load();
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to update appointment");
    }
  };

  const remove = async (id) => {
    try {
      await api.delete(`/admin/appointments/${id}`);
      toast.success("Appointment deleted");
      load();
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to delete appointment");
    }
  };

  return (
    <Layout role="admin">
      <div className="min-h-screen bg-slate-100 p-4 md:p-8">
        <div className="mx-auto max-w-7xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold">Appointments</h1>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <input className="rounded-lg border border-slate-300 px-3 py-2.5" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search patient or condition" />
            <select className="rounded-lg border border-slate-300 px-3 py-2.5" value={status} onChange={(e) => setStatus(e.target.value)}><option value="">All status</option>{statusOptions.map((s) => <option key={s}>{s}</option>)}</select>
            <select className="rounded-lg border border-slate-300 px-3 py-2.5" value={when} onChange={(e) => setWhen(e.target.value)}><option value="">Any date</option><option value="today">Today</option><option value="week">This Week</option></select>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr><th className="px-3 py-2">Patient</th><th className="px-3 py-2">Doctor</th><th className="px-3 py-2">Date</th><th className="px-3 py-2">Time</th><th className="px-3 py-2">Condition</th><th className="px-3 py-2">Payment</th><th className="px-3 py-2">Status</th><th className="px-3 py-2">Actions</th></tr>
              </thead>
              <tbody>
                {items.map((a) => (
                  <tr key={a._id} className="border-t border-slate-100">
                    <td className="px-3 py-2">{a.patientId?.name || a.patientName}</td>
                    <td className="px-3 py-2">{a.doctorId?.name || "-"}</td>
                    <td className="px-3 py-2">{a.appointmentDate?.slice(0, 10)}</td>
                    <td className="px-3 py-2">{a.appointmentTime || "-"}</td>
                    <td className="px-3 py-2">{a.condition || a.disease}</td>
                    <td className="px-3 py-2">{a.paymentStatus || "-"}</td>
                    <td className="px-3 py-2">
                      <select value={a.status} onChange={(e) => update(a, e.target.value)} className="rounded border border-slate-300 px-2 py-1">
                        {statusOptions.map((s) => <option key={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="px-3 py-2"><button onClick={() => remove(a._id)} className="rounded bg-rose-600 px-2 py-1 text-white">Delete</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ManageAppointments;

