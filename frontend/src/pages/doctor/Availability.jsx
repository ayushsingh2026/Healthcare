import React from "react";
import Layout from "../../components/Layout";

const Availability = () => {
  return (
    <Layout role="doctor">
      <div className="p-8 min-h-screen">
        <h1 className="text-3xl font-bold mb-8">Set Availability</h1>

        <form className="bg-white p-8 rounded-xl shadow max-w-xl grid gap-4">
          <input type="date" className="border px-4 py-3 rounded-lg" />
          <input type="time" className="border px-4 py-3 rounded-lg" />

          <button className="bg-teal-600 text-white py-3 rounded-lg">
            Save Availability
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default Availability;




