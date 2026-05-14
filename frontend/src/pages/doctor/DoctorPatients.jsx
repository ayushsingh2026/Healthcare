import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import Layout from "../../components/Layout";
import api from "../../services/api";

const DoctorPatients = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/doctor/patients");
        setItems(data);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to load patients");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(
    () =>
      items.filter((i) =>
        `${i.patientId?.name || i.patientName || ""} ${i.condition || ""}`.toLowerCase().includes(search.toLowerCase())
      ),
    [items, search]
  );

  return (
    <Layout role="doctor">
      <div className="min-h-screen bg-slate-100 p-4 md:p-8">
        <div className="mx-auto max-w-7xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">Patients</h1>
            <input className="w-full rounded-xl border border-slate-300 px-4 py-2.5 md:w-80" placeholder="Search patient or condition" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          {loading ? (
            <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{[...Array(6)].map((_, i) => <div key={i} className="h-44 animate-pulse rounded-2xl bg-slate-100" />)}</div>
          ) : (
            <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((a) => (
                <div key={a._id} className="rounded-2xl border border-slate-200 p-4">
                  <p className="font-semibold text-slate-900">{a.patientId?.name || a.patientName}</p>
                  <p className="text-sm text-slate-600">{a.patientId?.gender || a.patientSex} • Age {a.patientId?.age || a.patientAge}</p>
                  <p className="mt-2 text-sm text-slate-600">Condition: {a.condition || a.disease}</p>
                  <p className="text-sm text-slate-600">Location: {a.patientId?.address || a.patientLocation || "-"}</p>
                  <p className="text-sm text-slate-600">Appointment: {a.appointmentDate?.slice(0, 10)} {a.appointmentTime || ""}</p>
                  <p className="text-sm text-slate-600">Payment: {a.paymentStatus}</p>
                  <p className="text-sm text-slate-600">Status: {a.status}</p>
                  <div className="mt-3 flex gap-2">
                    <Link to={`/doctor/patients/${a._id}`} className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm">View Details</Link>
                    <Link to="/doctor/appointments" className="rounded-lg bg-sky-600 px-3 py-1.5 text-sm text-white">Update Status</Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default DoctorPatients;

