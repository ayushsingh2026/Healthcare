import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";
import Layout from "../../components/Layout";
import api from "../../services/api";
import { API_BASE_URL } from "../../utils/constants";

const STATUS_OPTIONS = ["Pending", "Sample Collected", "Processing", "Completed"];

const STATUS_STYLES = {
  Pending: "bg-amber-50 text-amber-700 border border-amber-200",
  "Sample Collected": "bg-sky-50 text-sky-700 border border-sky-200",
  Processing: "bg-pink-50 text-pink-700 border border-pink-200",
  Completed: "bg-emerald-50 text-emerald-700 border border-emerald-200",
};

const STATUS_DOT = {
  Pending: "bg-amber-400",
  "Sample Collected": "bg-sky-400",
  Processing: "bg-pink-400",
  Completed: "bg-emerald-400",
};

const AVATAR_COLORS = [
  "bg-sky-100 text-sky-700",
  "bg-pink-100 text-pink-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-violet-100 text-violet-700",
];

function getInitials(name = "") {
  return name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

function getAvatarColor(name = "") {
  const i = name.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[i];
}

function StatCard({ label, value, sub, valueColor = "text-slate-900" }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p>
      <p className={`mt-2 text-3xl font-bold ${valueColor}`}>{value}</p>
      {sub && <p className="mt-1 text-xs text-slate-400">{sub}</p>}
    </div>
  );
}

const TABS = [
  { key: "dashboard", label: "All Bookings", paths: ["/lab/dashboard"] },
  { key: "status", label: "Update Status", paths: ["/lab/status"] },
  { key: "upload", label: "Upload Reports", paths: ["/lab/upload-report"] },
];

const LabDashboard = () => {
  const { pathname } = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [payload, setPayload] = useState({ lab: null, counts: {}, bookings: [] });
  const [updatingId, setUpdatingId] = useState("");

  const activeTab = TABS.find((t) => t.paths.includes(pathname))?.key || "dashboard";
  const isUploadPage = activeTab === "upload";
  const isStatusPage = activeTab === "status";

  const fetchDashboard = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/lab/bookings");
      setPayload(data);
    } catch (err) {
      const message = err.response?.data?.message || "Failed to load lab dashboard";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDashboard(); }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = payload.bookings || [];
    if (q) list = list.filter(
      (b) =>
        b.patientName?.toLowerCase().includes(q) ||
        b.testName?.toLowerCase().includes(q) ||
        b.status?.toLowerCase().includes(q)
    );
    if (statusFilter) list = list.filter((b) => b.status === statusFilter);
    return list;
  }, [payload.bookings, query, statusFilter]);

  const pageSize = 8;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const current = filtered.slice((page - 1) * pageSize, page * pageSize);

  const updateStatus = async (bookingId, status) => {
    setUpdatingId(bookingId);
    try {
      await api.patch(`/lab/bookings/${bookingId}/status`, { status });
      toast.success("Status updated");
      await fetchDashboard();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update status");
    } finally {
      setUpdatingId("");
    }
  };

  const uploadReport = async (bookingId, file) => {
    if (!file) return;
    const data = new FormData();
    data.append("reportFile", file);
    setUpdatingId(bookingId);
    try {
      await api.patch(`/lab/bookings/${bookingId}/report`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Report uploaded");
      await fetchDashboard();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to upload report");
    } finally {
      setUpdatingId("");
    }
  };

  const pendingToday = useMemo(
    () => (payload.bookings || []).filter((b) => b.status === "Pending" && b.appointmentDate?.slice(0, 10) === new Date().toISOString().slice(0, 10)),
    [payload.bookings]
  );

  return (
    <Layout role="lab">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50/20 to-slate-100 p-4 md:p-8">
        <div className="mx-auto max-w-7xl space-y-5">

          {/* Top bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-600 text-white shadow-md shadow-sky-200 shrink-0">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                    d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900">
                  {payload.lab?.name || "Lab Assistant Dashboard"}
                </h1>
                {payload.lab && (
                  <p className="text-sm text-slate-500">
                    {payload.lab.address} &nbsp;·&nbsp; {payload.lab.phone} &nbsp;·&nbsp; {payload.lab.workingHours}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live
              </span>
              <button
                onClick={fetchDashboard}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50 active:scale-95"
              >
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
                Refresh
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
              <p className="font-semibold text-amber-800">{error}</p>
              <p className="mt-1 text-sm text-amber-700">Ask admin to map this account to a lab, then retry.</p>
              <button onClick={fetchDashboard} className="mt-3 rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700">
                Retry
              </button>
            </div>
          )}

          {/* Alert: pending today */}
          {pendingToday.length > 0 && (
            <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
              <svg className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              <p className="text-sm text-amber-800">
                <span className="font-semibold">{pendingToday.length} pending booking{pendingToday.length > 1 ? "s" : ""} today</span>
                {" — "}{pendingToday.map((b) => b.patientName).join(", ")}
              </p>
            </div>
          )}

          {/* Stat cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Total Bookings" value={payload.counts?.total || 0} sub="All time" />
            <StatCard label="Pending" value={payload.counts?.pending || 0} sub="Needs action" valueColor="text-sky-600" />
            <StatCard label="Completed" value={payload.counts?.completed || 0} sub="This month" valueColor="text-emerald-600" />
            <StatCard label="Reports Uploaded" value={payload.counts?.reportsUploaded || 0} sub={`of ${payload.counts?.completed || 0} completed`} valueColor="text-amber-600" />
          </div>

          {/* Main table card */}
          <div className="rounded-3xl border border-slate-200/80 bg-white shadow-sm">
            {/* Tabs */}
            <div className="flex gap-1 border-b border-slate-100 px-6 pt-4">
              {TABS.map((tab) => (
                <a
                  key={tab.key}
                  href={tab.paths[0]}
                  className={`rounded-t-xl px-4 py-2.5 text-sm font-medium transition relative top-px border-b-2 ${
                    activeTab === tab.key
                      ? "border-sky-500 text-sky-600"
                      : "border-transparent text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {tab.label}
                </a>
              ))}
            </div>

            <div className="p-6">
              {/* Toolbar */}
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[200px]">
                  <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                  <input
                    value={query}
                    onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                    placeholder="Search patient, test, status…"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-4 text-sm outline-none transition focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-sky-400"
                >
                  <option value="">All statuses</option>
                  {STATUS_OPTIONS.map((s) => <option key={s}>{s}</option>)}
                </select>
                <span className="ml-auto text-xs text-slate-400">{filtered.length} result{filtered.length !== 1 ? "s" : ""}</span>
              </div>

              {/* Table */}
              {loading ? (
                <div className="space-y-3">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-14 animate-pulse rounded-xl bg-slate-100" />
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-slate-100">
                  <table className="min-w-full text-left text-sm">
                    <thead>
                      <tr className="bg-slate-50">
                        <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-slate-400">Patient</th>
                        <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-slate-400">Test</th>
                        <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-slate-400">Date</th>
                        <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-slate-400">Slot</th>
                        <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-slate-400">Status</th>
                        <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-slate-400">Report</th>
                        <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-slate-400">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {current.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="px-4 py-12 text-center text-slate-400">
                            <svg className="mx-auto mb-2 h-8 w-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                            </svg>
                            No bookings found
                          </td>
                        </tr>
                      ) : (
                        current.map((item) => (
                          <tr key={item._id} className="border-t border-slate-50 transition hover:bg-slate-50/60">
                            {/* Patient */}
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2.5">
                                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${getAvatarColor(item.patientName)}`}>
                                  {getInitials(item.patientName)}
                                </div>
                                <span className="font-medium text-slate-800">{item.patientName}</span>
                              </div>
                            </td>
                            {/* Test */}
                            <td className="px-4 py-3 text-slate-600">{item.testName}</td>
                            {/* Date */}
                            <td className="px-4 py-3 text-slate-500">{item.appointmentDate?.slice(0, 10)}</td>
                            {/* Slot */}
                            <td className="px-4 py-3 text-xs text-slate-500">{item.timeSlot}</td>
                            {/* Status */}
                            <td className="px-4 py-3">
                              {isUploadPage ? (
                                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[item.status] || "bg-slate-100 text-slate-600"}`}>
                                  <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[item.status] || "bg-slate-400"}`} />
                                  {item.status}
                                </span>
                              ) : (
                                <select
                                  value={item.status}
                                  onChange={(e) => updateStatus(item._id, e.target.value)}
                                  disabled={updatingId === item._id}
                                  className={`rounded-xl border px-2.5 py-1.5 text-xs font-medium outline-none transition disabled:opacity-60 ${STATUS_STYLES[item.status] || "border-slate-200 bg-slate-50 text-slate-600"}`}
                                >
                                  {STATUS_OPTIONS.map((s) => <option key={s}>{s}</option>)}
                                </select>
                              )}
                            </td>
                            {/* Upload */}
                            <td className="px-4 py-3">
                              {isStatusPage ? (
                                <span className="text-xs text-slate-400">—</span>
                              ) : (
                                <label className={`inline-flex cursor-pointer items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium transition ${updatingId === item._id ? "opacity-60 cursor-not-allowed" : "border-slate-200 text-slate-500 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-600"}`}>
                                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                                  </svg>
                                  Upload
                                  <input
                                    type="file"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    disabled={updatingId === item._id}
                                    onChange={(e) => uploadReport(item._id, e.target.files?.[0])}
                                    className="hidden"
                                  />
                                </label>
                              )}
                            </td>
                            {/* Actions */}
                            <td className="px-4 py-3">
                              {item.reportUrl ? (
                                <a
                                  href={`${API_BASE_URL.replace("/api", "")}${item.reportUrl}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1 text-xs font-medium text-sky-600 hover:text-sky-800"
                                >
                                  View report
                                  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                                  </svg>
                                </a>
                              ) : (
                                <span className="text-xs text-slate-300">Not uploaded</span>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Pagination */}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm">
                <p className="text-xs text-slate-400">
                  Showing {Math.min((page - 1) * pageSize + 1, filtered.length)}–{Math.min(page * pageSize, filtered.length)} of {filtered.length}
                </p>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-40"
                  >
                    ← Prev
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                        page === i + 1
                          ? "border-sky-500 bg-sky-500 text-white"
                          : "border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-40"
                  >
                    Next →
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
};

export default LabDashboard;