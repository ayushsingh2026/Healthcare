import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Layout from "../../components/Layout";
import api from "../../services/api";

const emptyForm = {
  name: "",
  city: "",
  address: "",
  phone: "",
  workingHours: "9 AM - 8 PM",
  assistantId: "",
  assistantName: "",
  assistantEmail: "",
  assistantPassword: "",
  availableTestsRaw: "",
};

const ManageLabs = () => {
  const [labs, setLabs] = useState([]);
  const [assistants, setAssistants] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [labsRes, asstRes] = await Promise.all([
        api.get("/admin/labs"),
        api.get("/admin/lab-assistants"),
      ]);
      setLabs(labsRes.data);
      setAssistants(asstRes.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load labs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const createLab = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/admin/labs", {
        name: form.name,
        city: form.city,
        address: form.address,
        phone: form.phone,
        workingHours: form.workingHours,
        assistantId: form.assistantId || undefined,
        assistantName: form.assistantName || undefined,
        assistantEmail: form.assistantEmail || undefined,
        assistantPassword: form.assistantPassword || undefined,
        availableTests: form.availableTestsRaw
          .split(",")
          .map((x) => x.trim())
          .filter(Boolean),
      });
      toast.success("Lab created");
      setForm(emptyForm);
      await load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create lab");
    } finally {
      setSubmitting(false);
    }
  };

  const removeLab = async (id) => {
    try {
      await api.delete(`/admin/labs/${id}`);
      toast.success("Lab deleted");
      await load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete lab");
    }
  };

  return (
    <Layout role="admin">
      <div className="min-h-screen bg-slate-100 p-4 md:p-8">
        <div className="mx-auto max-w-6xl space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h1 className="text-2xl font-semibold text-slate-900">Manage Labs</h1>
            <form className="mt-5 grid gap-3 md:grid-cols-2" onSubmit={createLab}>
              <input className="rounded-lg border border-slate-300 px-3 py-2.5" placeholder="Lab name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required />
              <input className="rounded-lg border border-slate-300 px-3 py-2.5" placeholder="City" value={form.city} onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))} required />
              <input className="rounded-lg border border-slate-300 px-3 py-2.5" placeholder="Address" value={form.address} onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))} required />
              <input className="rounded-lg border border-slate-300 px-3 py-2.5" placeholder="Phone" value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} required />
              <input className="rounded-lg border border-slate-300 px-3 py-2.5" placeholder="Working hours" value={form.workingHours} onChange={(e) => setForm((p) => ({ ...p, workingHours: e.target.value }))} />
              <select className="rounded-lg border border-slate-300 px-3 py-2.5" value={form.assistantId} onChange={(e) => setForm((p) => ({ ...p, assistantId: e.target.value }))}>
                <option value="">Select lab assistant</option>
                {assistants.map((a) => <option key={a._id} value={a._id}>{a.name} ({a.email})</option>)}
              </select>
              <input className="rounded-lg border border-slate-300 px-3 py-2.5" placeholder="New assistant name (optional)" value={form.assistantName} onChange={(e) => setForm((p) => ({ ...p, assistantName: e.target.value }))} />
              <input className="rounded-lg border border-slate-300 px-3 py-2.5" type="email" placeholder="New assistant email (optional)" value={form.assistantEmail} onChange={(e) => setForm((p) => ({ ...p, assistantEmail: e.target.value }))} />
              <input className="rounded-lg border border-slate-300 px-3 py-2.5" type="password" placeholder="New assistant password (optional)" value={form.assistantPassword} onChange={(e) => setForm((p) => ({ ...p, assistantPassword: e.target.value }))} />
              <textarea className="rounded-lg border border-slate-300 px-3 py-2.5 md:col-span-2" placeholder="Available tests (comma separated)" value={form.availableTestsRaw} onChange={(e) => setForm((p) => ({ ...p, availableTestsRaw: e.target.value }))} />
              <button className="rounded-lg bg-sky-600 px-4 py-2.5 font-semibold text-white hover:bg-sky-700 disabled:opacity-60 md:col-span-2" disabled={submitting}>{submitting ? "Creating..." : "Create Lab"}</button>
            </form>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Existing Labs</h2>
            {loading ? (
              <p className="mt-4 text-slate-500">Loading...</p>
            ) : (
              <div className="mt-4 overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-600">
                    <tr>
                      <th className="px-3 py-2">Lab</th><th className="px-3 py-2">City</th><th className="px-3 py-2">Contact</th><th className="px-3 py-2">Tests</th><th className="px-3 py-2">Assistant</th><th className="px-3 py-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {labs.map((l) => (
                      <tr key={l._id} className="border-t border-slate-100">
                        <td className="px-3 py-2 font-medium">{l.name}</td>
                        <td className="px-3 py-2">{l.city}</td>
                        <td className="px-3 py-2">{l.phone}</td>
                        <td className="px-3 py-2">{(l.availableTests || []).length}</td>
                        <td className="px-3 py-2">{l.assistantId?.name || "-"}</td>
                        <td className="px-3 py-2"><button onClick={() => removeLab(l._id)} className="rounded bg-rose-600 px-3 py-1.5 text-white">Delete</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default ManageLabs;
