import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import Layout from "../../components/Layout";
import api from "../../services/api";

const DoctorPatientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/doctor/patients/${id}`);
      setItem(data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load patient detail");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  const setStatus = async (status) => {
    try {
      await api.patch(`/doctor/appointments/${id}/status`, { status });
      toast.success(`Marked as ${status}`);
      await load();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  const p = item?.patientId || {};
  return (
    <Layout role="doctor">
      <div className="min-h-screen bg-slate-100 p-4 md:p-8">
        <div className="mx-auto max-w-5xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <button onClick={() => navigate(-1)} className="mb-3 text-sm text-sky-600">← Back</button>
          {loading ? (
            <div className="h-72 animate-pulse rounded-2xl bg-slate-100" />
          ) : (
            <>
              <h1 className="text-2xl font-bold text-slate-900">Patient Details</h1>
              <div className="mt-4 grid gap-3 text-sm md:grid-cols-2">
                <p><b>Full Name:</b> {p.name || item.patientName}</p>
                <p><b>Age:</b> {p.age || item.patientAge || "-"}</p>
                <p><b>Sex:</b> {p.sex || p.gender || item.patientSex || "-"}</p>
                <p><b>Blood Group:</b> {p.bloodGroup || "-"}</p>
                <p><b>Phone:</b> {p.phone || "-"}</p>
                <p><b>Email:</b> {p.email || "-"}</p>
                <p><b>Address:</b> {p.address || item.patientLocation || "-"}</p>
                <p><b>Medical condition:</b> {item.condition || item.disease || p.disease || "-"}</p>
                <p><b>Symptoms:</b> {p.symptoms || "-"}</p>
                <p><b>Appointment date:</b> {item.appointmentDate?.slice(0, 10) || "-"}</p>
                <p><b>Appointment time:</b> {item.appointmentTime || "-"}</p>
                <p><b>Doctor assigned:</b> {item.doctorId?.name || "-"}</p>
                <p><b>Payment status:</b> {item.paymentStatus || "-"}</p>
                <p><b>Appointment status:</b> {item.status || "-"}</p>
                <p><b>Medical notes/history:</b> {item.notes || p.medicalHistory || "-"}</p>
                <p><b>Emergency contact:</b> {p.emergencyContact || "-"}</p>
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                <button onClick={() => setStatus("Pending")} className="rounded-lg border border-slate-300 px-3 py-2 text-sm">Mark as Pending</button>
                <button onClick={() => setStatus("In Consultation")} className="rounded-lg bg-indigo-600 px-3 py-2 text-sm text-white">Mark as In Consultation</button>
                <button onClick={() => setStatus("Completed")} className="rounded-lg bg-emerald-600 px-3 py-2 text-sm text-white">Mark as Completed</button>
                <button onClick={() => setStatus("Cancelled")} className="rounded-lg bg-rose-600 px-3 py-2 text-sm text-white">Cancel Appointment</button>
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default DoctorPatientDetail;

