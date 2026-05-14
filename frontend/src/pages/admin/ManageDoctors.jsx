import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Layout from "../../components/Layout";
import api from "../../services/api";

const empty = {
  name: "", email: "", password: "", age: "", gender: "", specialization: "", qualification: "",
  experience: "", hospitalName: "", hospitalLocation: "", availabilityTime: "", phone: "", bio: "",
};

const ManageDoctors = () => {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [form, setForm] = useState(empty);
  const [photo, setPhoto] = useState(null);

  const load = async () => {
    try {
      const { data } = await api.get(`/admin/doctors?q=${encodeURIComponent(q)}&specialization=${encodeURIComponent(specialization)}&page=${page}&limit=8`);
      setItems(data.items || []);
      setPagination(data.pagination || { page: 1, totalPages: 1 });
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to load doctors");
    }
  };

  useEffect(() => {
    load();
  }, [q, specialization, page]);

  const add = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (photo) fd.append("photo", photo);
      await api.post("/admin/doctors", fd, { headers: { "Content-Type": "multipart/form-data" } });
      toast.success("Doctor created");
      setForm(empty);
      setPhoto(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create doctor");
    }
  };

  const remove = async (id) => {
    try {
      await api.delete(`/admin/doctors/${id}`);
      toast.success("Doctor deleted");
      load();
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to delete doctor");
    }
  };

  const toggleStatus = async (d) => {
    try {
      await api.patch(`/admin/doctors/${d._id}`, { accountStatus: d.accountStatus === "Active" ? "Inactive" : "Active" });
      toast.success("Doctor status updated");
      load();
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to update status");
    }
  };

  return (
    <Layout role="admin">
      <div className="min-h-screen bg-slate-100 p-4 md:p-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h1 className="text-2xl font-semibold text-slate-900">Doctors</h1>
            <form onSubmit={add} className="mt-4 grid gap-3 md:grid-cols-3">
              {Object.entries({
                name: "Full name", email: "Email", password: "Password", age: "Age", gender: "Gender", specialization: "Specialization",
                qualification: "Qualification", experience: "Experience", hospitalName: "Hospital name", hospitalLocation: "Hospital location",
                availabilityTime: "Availability", phone: "Phone", bio: "Bio",
              }).map(([k, p]) => (
                <input key={k} required={["name", "email", "password"].includes(k)} value={form[k]} onChange={(e) => setForm((s) => ({ ...s, [k]: e.target.value }))} placeholder={p} className="rounded-lg border border-slate-300 px-3 py-2.5" />
              ))}
              <input type="file" accept=".jpg,.jpeg,.png" onChange={(e) => setPhoto(e.target.files?.[0] || null)} className="rounded-lg border border-slate-300 px-3 py-2.5" />
              <button className="rounded-lg bg-sky-600 px-4 py-2.5 font-semibold text-white md:col-span-3">Add Doctor</button>
            </form>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex flex-col gap-3 md:flex-row">
              <input value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} placeholder="Search doctor by name" className="rounded-lg border border-slate-300 px-3 py-2.5 md:w-80" />
              <input value={specialization} onChange={(e) => { setSpecialization(e.target.value); setPage(1); }} placeholder="Filter specialization" className="rounded-lg border border-slate-300 px-3 py-2.5 md:w-80" />
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600">
                  <tr><th className="px-3 py-2">Name</th><th className="px-3 py-2">Specialization</th><th className="px-3 py-2">Experience</th><th className="px-3 py-2">Hospital</th><th className="px-3 py-2">Phone</th><th className="px-3 py-2">Status</th><th className="px-3 py-2">Actions</th></tr>
                </thead>
                <tbody>
                  {items.map((d) => (
                    <tr key={d._id} className="border-t border-slate-100">
                      <td className="px-3 py-2 font-medium">{d.name}</td>
                      <td className="px-3 py-2">{d.specialization}</td>
                      <td className="px-3 py-2">{d.experience}</td>
                      <td className="px-3 py-2">{d.hospitalName || d.hospitalLocation}</td>
                      <td className="px-3 py-2">{d.phone}</td>
                      <td className="px-3 py-2">{d.accountStatus || "Active"}</td>
                      <td className="px-3 py-2 space-x-2">
                        <button onClick={() => toggleStatus(d)} className="rounded bg-indigo-600 px-2 py-1 text-white">Toggle</button>
                        <button onClick={() => remove(d._id)} className="rounded bg-rose-600 px-2 py-1 text-white">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="rounded border px-3 py-1.5 disabled:opacity-50">Prev</button>
              <span className="text-sm text-slate-600">{pagination.page} / {pagination.totalPages}</span>
              <button disabled={page >= pagination.totalPages} onClick={() => setPage((p) => p + 1)} className="rounded border px-3 py-1.5 disabled:opacity-50">Next</button>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default ManageDoctors;

