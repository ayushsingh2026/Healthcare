import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Layout from "../../components/Layout";
import api from "../../services/api";

const DoctorProfile = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    age: "",
    specialization: "",
    experience: "",
    hospitalName: "",
    hospitalLocation: "",
    availabilityTime: "",
    phone: "",
    email: "",
    qualification: "",
    bio: "",
    profilePhoto: "",
  });

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/doctor/profile");
      setForm({
        name: data.name || "",
        age: data.age || "",
        specialization: data.specialization || "",
        experience: data.experience || "",
        hospitalName: data.hospitalName || "",
        hospitalLocation: data.hospitalLocation || "",
        availabilityTime: data.availabilityTime || "",
        phone: data.phone || "",
        email: data.email || "",
        qualification: data.qualification || "",
        bio: data.bio || "",
        profilePhoto: data.profilePhoto || "",
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.patch("/doctor/profile", {
        ...form,
        age: form.age ? Number(form.age) : undefined,
        experience: form.experience ? Number(form.experience) : undefined,
      });
      toast.success("Profile updated");
      await load();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const onPhoto = async (file) => {
    if (!file) return;
    const data = new FormData();
    data.append("profilePhoto", file);
    try {
      await api.post("/doctor/profile/photo", data, { headers: { "Content-Type": "multipart/form-data" } });
      toast.success("Profile photo updated");
      await load();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to upload photo");
    }
  };

  return (
    <Layout role="doctor">
      <div className="min-h-screen bg-slate-100 p-4 md:p-8">
        <div className="mx-auto max-w-5xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">Doctor Profile</h1>
          {loading ? (
            <div className="mt-6 h-72 animate-pulse rounded-2xl bg-slate-100" />
          ) : (
            <form onSubmit={onSave} className="mt-6 grid gap-3 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-1 block text-sm text-slate-600">Profile photo</label>
                <input type="file" accept=".jpg,.jpeg,.png" onChange={(e) => onPhoto(e.target.files?.[0])} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
              </div>
              {[
                ["name", "Name"], ["age", "Age"], ["specialization", "Specialization"], ["experience", "Experience"],
                ["hospitalName", "Hospital Name"], ["hospitalLocation", "Hospital Location"], ["availabilityTime", "Availability Time"],
                ["phone", "Phone"], ["email", "Email"], ["qualification", "Qualification"],
              ].map(([key, label]) => (
                <div key={key}>
                  <label className="mb-1 block text-sm text-slate-600">{label}</label>
                  <input value={form[key]} onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
                </div>
              ))}
              <div className="md:col-span-2">
                <label className="mb-1 block text-sm text-slate-600">Bio / About</label>
                <textarea value={form.bio} onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))} rows={4} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
              </div>
              <button disabled={saving} className="md:col-span-2 rounded-lg bg-sky-600 px-4 py-2.5 font-semibold text-white disabled:opacity-60">
                {saving ? "Saving..." : "Save Profile"}
              </button>
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default DoctorProfile;

