import React, { useState } from "react";
import Layout from "../../components/Layout";

const SearchDisease = () => {
  const [search, setSearch] = useState("");

  const diseaseDoctors = {
    diabetes: "Endocrinologist",
    fever: "General Physician",
    eye: "Ophthalmologist",
    heart: "Cardiologist",
    skin: "Dermatologist",
    bones: "Orthopedic",
    lungs: "Pulmonologist",
  };

  const suggestion =
    diseaseDoctors[search.toLowerCase()] || "General Physician";

  return (
    <Layout role="patient">
      <div className="p-8 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">Search Disease / Symptoms</h1>

        <input
          type="text"
          placeholder="Enter disease (e.g. diabetes)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-xl px-4 py-3 rounded-lg border"
        />

        {search && (
          <div className="mt-6 bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold">Suggested Doctor</h2>
            <p className="text-sky-600 text-lg mt-2">{suggestion}</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SearchDisease;




