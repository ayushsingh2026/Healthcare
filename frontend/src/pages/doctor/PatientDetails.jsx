import React from "react";
import Layout from "../../components/Layout";

const PatientDetails = () => {
  return (
    <Layout role="doctor">
      <div className="p-8 min-h-screen">
        <h1 className="text-3xl font-bold mb-8">Patient Details</h1>

        <div className="bg-white p-8 rounded-xl shadow max-w-2xl">
          <p><strong>Name:</strong> Rahul Sharma</p>
          <p><strong>Age:</strong> 35</p>
          <p><strong>Disease:</strong> Diabetes</p>
          <p><strong>Phone:</strong> 9876543210</p>
          <p><strong>Address:</strong> Delhi, India</p>
        </div>
      </div>
    </Layout>
  );
};

export default PatientDetails;




