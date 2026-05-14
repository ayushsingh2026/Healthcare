import React from "react";
import Layout from "../../components/Layout";

const Prescription = () => {
  return (
    <Layout role="doctor">
      <div className="p-8 min-h-screen">
        <h1 className="text-3xl font-bold mb-8">Add Prescription</h1>

        <form className="bg-white p-8 rounded-xl shadow max-w-2xl grid gap-4">
          <input
            type="text"
            placeholder="Patient Name"
            className="border px-4 py-3 rounded-lg"
          />

          <textarea
            rows="6"
            placeholder="Write prescription..."
            className="border px-4 py-3 rounded-lg"
          />

          <button className="bg-sky-600 text-white py-3 rounded-lg">
            Save Prescription
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default Prescription;




