import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Layout from "../../components/Layout";
import api from "../../services/api";

const defaultSettings = {
  adminName: "",
  adminEmail: "",
  adminPhone: "",
  hospitalName: "",
  brandLogo: "",
  contactDetails: "",
  emailConfig: "",
  paymentConfig: "",
};

const AdminSettings = () => {
  const [form, setForm] = useState(defaultSettings);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/admin/settings");
        setForm({ ...defaultSettings, ...(data || {}) });
      } catch (e) {
        toast.error(e.response?.data?.message || "Failed to load settings");
      }
    })();
  }, []);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.patch("/admin/settings", form);
      toast.success("Settings updated");
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout role="admin">
      <div className="min-h-screen bg-slate-100 p-4 md:p-8">
        <div className="mx-auto max-w-5xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold">Settings</h1>
          <form onSubmit={save} className="mt-4 grid gap-3 md:grid-cols-2">
            {Object.keys(defaultSettings).map((k) => (
              <input key={k} value={form[k] || ""} onChange={(e) => setForm((s) => ({ ...s, [k]: e.target.value }))} placeholder={k} className="rounded-lg border border-slate-300 px-3 py-2.5" />
            ))}
            <button disabled={saving} className="rounded-lg bg-sky-600 px-4 py-2.5 font-semibold text-white md:col-span-2">{saving ? "Saving..." : "Save Settings"}</button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default AdminSettings;

