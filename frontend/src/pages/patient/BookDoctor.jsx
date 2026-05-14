import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Layout from "../../components/Layout";
import api from "../../services/api";

const BookDoctor = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    disease: "",
    doctorId: "",
    appointmentDate: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.disease || !formData.appointmentDate) {
      toast.error("Disease and date are required");
      return;
    }

    setLoading(true);
    try {
      await api.post("/appointments/book", {
        doctorId: formData.doctorId || undefined,
        disease: formData.disease,
        appointmentDate: formData.appointmentDate,
      });
      toast.success("Appointment booked successfully");
      navigate("/patient/payment", {
        state: { amount: 500, source: "doctor appointment" },
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to book appointment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout role="patient">
      <div className="p-8 min-h-screen">
        <h1 className="text-3xl font-bold mb-8">Book Doctor Appointment</h1>

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow max-w-3xl grid gap-4">
          <input type="text" placeholder="Disease / Symptoms" className="border px-4 py-3 rounded-lg" name="disease" value={formData.disease} onChange={handleChange} />

          <select className="border px-4 py-3 rounded-lg" name="doctorId" value={formData.doctorId} onChange={handleChange}>
            <option value="">Select Doctor (optional ID)</option>
            <option value="">General Physician</option>
            <option value="">Cardiologist</option>
            <option value="">Dermatologist</option>
            <option value="">Endocrinologist</option>
          </select>

          <input type="date" className="border px-4 py-3 rounded-lg" name="appointmentDate" value={formData.appointmentDate} onChange={handleChange} />

          <button
            type="submit"
            disabled={loading}
            className="bg-sky-600 text-white py-3 rounded-lg disabled:opacity-60"
          >
            {loading ? "Booking..." : "Proceed to Payment"}
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default BookDoctor;




