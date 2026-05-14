import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Layout from "../../components/Layout";
import api from "../../services/api";

const ManagePayments = () => {
  const [status, setStatus] = useState("");
  const [items, setItems] = useState([]);
  const [summary, setSummary] = useState({ revenue: 0, pending: 0 });

  const load = async () => {
    try {
      const { data } = await api.get(`/admin/payments?status=${encodeURIComponent(status)}`);
      setItems(data.items || []);
      setSummary(data.summary || { revenue: 0, pending: 0 });
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to load payments");
    }
  };

  useEffect(() => { load(); }, [status]);

  const update = async (id, value) => {
    try {
      await api.patch(`/admin/payments/${id}`, { status: value });
      toast.success("Payment updated");
      load();
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to update payment");
    }
  };

  return (
    <Layout role="admin">
      <div className="min-h-screen bg-slate-100 p-4 md:p-8">
        <div className="mx-auto max-w-7xl space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-slate-500">Revenue</p><p className="text-3xl font-bold">₹{summary.revenue}</p></div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-slate-500">Pending Dues</p><p className="text-3xl font-bold">{summary.pending}</p></div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h1 className="text-2xl font-semibold">Payments</h1>
              <select className="rounded-lg border border-slate-300 px-3 py-2" value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="">All</option><option>Pending</option><option>Paid</option><option>Failed</option><option>Refunded</option>
              </select>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600">
                  <tr><th className="px-3 py-2">Transaction ID</th><th className="px-3 py-2">Patient</th><th className="px-3 py-2">Amount</th><th className="px-3 py-2">Date</th><th className="px-3 py-2">Method</th><th className="px-3 py-2">Status</th></tr>
                </thead>
                <tbody>
                  {items.map((p) => (
                    <tr key={p._id} className="border-t border-slate-100">
                      <td className="px-3 py-2 font-medium">{p._id.slice(-8).toUpperCase()}</td>
                      <td className="px-3 py-2">{p.patientId?.name || "-"}</td>
                      <td className="px-3 py-2">₹{p.amount}</td>
                      <td className="px-3 py-2">{p.createdAt?.slice(0, 10)}</td>
                      <td className="px-3 py-2">{p.paymentMethod}</td>
                      <td className="px-3 py-2">
                        <select value={p.status} onChange={(e) => update(p._id, e.target.value)} className="rounded border border-slate-300 px-2 py-1">
                          {["Pending", "Paid", "Failed", "Refunded"].map((s) => <option key={s}>{s}</option>)}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ManagePayments;

