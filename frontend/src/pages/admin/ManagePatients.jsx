import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Layout from "../../components/Layout";
import api from "../../services/api";

const ManagePatients = () => {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [gender, setGender] = useState("");
  const [appointmentStatus, setAppointmentStatus] = useState("");

  const load = async () => {
    try {
      const { data } = await api.get(`/admin/patients?q=${encodeURIComponent(q)}&gender=${encodeURIComponent(gender)}&appointmentStatus=${encodeURIComponent(appointmentStatus)}`);
      setItems(data.items || []);
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to load patients");
    }
  };

  useEffect(() => {
    load();
  }, [q, gender, appointmentStatus]);

  const block = async (p) => {
    try {
      await api.patch(`/admin/patients/${p._id}`, { accountStatus: p.accountStatus === "Blocked" ? "Active" : "Blocked" });
      toast.success("Patient status updated");
      load();
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to update patient");
    }
  };

  const remove = async (id) => {
    try {
      await api.delete(`/admin/patients/${id}`);
      toast.success("Patient deleted");
      load();
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to delete patient");
    }
  };

  return (
    <Layout role="admin">
      <div className="min-h-screen bg-slate-100 p-4 md:p-8">
        <div className="mx-auto max-w-7xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold text-slate-900">Patients</h1>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search patient by name" className="rounded-lg border border-slate-300 px-3 py-2.5" />
            <select value={gender} onChange={(e) => setGender(e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2.5"><option value="">All genders</option><option>Male</option><option>Female</option><option>Other</option></select>
            <select value={appointmentStatus} onChange={(e) => setAppointmentStatus(e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2.5"><option value="">All statuses</option><option>Pending</option><option>Confirmed</option><option>In Consultation</option><option>Completed</option><option>Cancelled</option></select>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr><th className="px-3 py-2">Name</th><th className="px-3 py-2">Age</th><th className="px-3 py-2">Gender</th><th className="px-3 py-2">Condition</th><th className="px-3 py-2">Doctor</th><th className="px-3 py-2">Appointment</th><th className="px-3 py-2">Payment</th><th className="px-3 py-2">Actions</th></tr>
              </thead>
              <tbody>
                {items.map((p) => (
                  <tr key={p._id} className="border-t border-slate-100">
                    <td className="px-3 py-2 font-medium">{p.name}</td>
                    <td className="px-3 py-2">{p.age}</td>
                    <td className="px-3 py-2">{p.gender || p.sex}</td>
                    <td className="px-3 py-2">{p.disease}</td>
                    <td className="px-3 py-2">{p.latestAppointment?.doctorId?.name || "-"}</td>
                    <td className="px-3 py-2">{p.latestAppointment?.appointmentDate?.slice(0, 10) || "-"}</td>
                    <td className="px-3 py-2">{p.latestAppointment?.paymentStatus || "-"}</td>
                    <td className="px-3 py-2 space-x-2">
                      <button onClick={() => block(p)} className="rounded bg-indigo-600 px-2 py-1 text-white">{p.accountStatus === "Blocked" ? "Unblock" : "Block"}</button>
                      <button onClick={() => remove(p._id)} className="rounded bg-rose-600 px-2 py-1 text-white">Delete</button>
                    </td>
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

export default ManagePatients;

