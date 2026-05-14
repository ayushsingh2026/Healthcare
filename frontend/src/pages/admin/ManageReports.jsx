import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Layout from "../../components/Layout";
import { API_SERVER_URL } from "../../utils/constants";
import api from "../../services/api";

const ManageReports = () => {
  const [items, setItems] = useState([]);

  const load = async () => {
    try {
      const { data } = await api.get("/admin/reports");
      setItems(data || []);
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to load reports");
    }
  };

  useEffect(() => { load(); }, []);

  const remove = async (id) => {
    try {
      await api.delete(`/admin/reports/${id}`);
      toast.success("Report deleted");
      load();
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to delete report");
    }
  };

  return (
    <Layout role="admin">
      <div className="min-h-screen bg-slate-100 p-4 md:p-8">
        <div className="mx-auto max-w-7xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold">Reports</h1>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr><th className="px-3 py-2">Type</th><th className="px-3 py-2">Patient</th><th className="px-3 py-2">Doctor/Lab</th><th className="px-3 py-2">Date</th><th className="px-3 py-2">Download</th><th className="px-3 py-2">Action</th></tr>
              </thead>
              <tbody>
                {items.map((r) => (
                  <tr key={r._id} className="border-t border-slate-100">
                    <td className="px-3 py-2">{r.reportType}</td>
                    <td className="px-3 py-2">{r.patientId?.name || "-"}</td>
                    <td className="px-3 py-2">{r.doctorId?.name || r.labId?.name || "-"}</td>
                    <td className="px-3 py-2">{r.createdAt?.slice(0, 10)}</td>
                    <td className="px-3 py-2"><a className="text-sky-600" href={`${API_SERVER_URL}${r.filePath.startsWith("/") ? r.filePath : `/${r.filePath}`}`} target="_blank" rel="noreferrer">Download</a></td>
                    <td className="px-3 py-2"><button onClick={() => remove(r._id)} className="rounded bg-rose-600 px-2 py-1 text-white">Delete</button></td>
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

export default ManageReports;

