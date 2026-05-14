import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import Layout from "../../components/Layout";
import api from "../../services/api";

const CITIES = ["Delhi", "Noida", "Ghaziabad", "Lucknow", "Kanpur"];
const TIME_SLOTS = [
  "09:00 AM – 09:30 AM",
  "10:00 AM – 10:30 AM",
  "11:00 AM – 11:30 AM",
  "12:00 PM – 12:30 PM",
  "02:00 PM – 02:30 PM",
  "03:00 PM – 03:30 PM",
  "04:00 PM – 04:30 PM",
];

const STEPS = ["City", "Lab & Test", "Schedule", "Confirm"];

const TEST_PRICES = {
  "Complete Blood Count (CBC)": "₹450",
  "Lipid Profile": "₹700",
  HbA1c: "₹550",
  "Thyroid Profile (T3/T4/TSH)": "₹800",
  "Vitamin D": "₹1,200",
  "Liver Function Test": "₹900",
};

function StepIndicator({ current }) {
  return (
    <div className="flex items-center gap-1 mb-8">
      {STEPS.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <React.Fragment key={label}>
            <div className="flex items-center gap-1.5">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold border transition-all duration-300 ${
                  done
                    ? "bg-emerald-500 border-emerald-500 text-white"
                    : active
                    ? "bg-sky-600 border-sky-600 text-white"
                    : "border-slate-300 text-slate-400"
                }`}
              >
                {done ? (
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  i + 1
                )}
              </div>
              <span
                className={`text-xs font-medium hidden sm:inline ${
                  done ? "text-emerald-600" : active ? "text-sky-600" : "text-slate-400"
                }`}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-px mx-1 ${done ? "bg-emerald-400" : "bg-slate-200"}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function FieldWrapper({ label, icon, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="flex items-center gap-1.5 text-sm font-medium text-slate-600">
        <span className="text-slate-400">{icon}</span>
        {label}
      </label>
      {children}
    </div>
  );
}

const inputCls =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100 disabled:opacity-50 disabled:cursor-not-allowed";

const BookLabTest = () => {
  const [city, setCity] = useState("");
  const [labId, setLabId] = useState("");
  const [testName, setTestName] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [labs, setLabs] = useState([]);
  const [tests, setTests] = useState([]);
  const [loadingLabs, setLoadingLabs] = useState(false);
  const [loadingTests, setLoadingTests] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const selectedLab = useMemo(() => labs.find((l) => l._id === labId), [labs, labId]);

  const currentStep = useMemo(() => {
    if (!city) return 0;
    if (!labId || !testName) return 1;
    if (!appointmentDate || !timeSlot) return 2;
    return 3;
  }, [city, labId, testName, appointmentDate, timeSlot]);

  useEffect(() => {
    if (!city) return;
    setLoadingLabs(true);
    setLabId("");
    setTestName("");
    setTests([]);
    api
      .get(`/lab/labs?city=${encodeURIComponent(city)}`)
      .then(({ data }) => setLabs(data))
      .catch((err) => toast.error(err.response?.data?.message || "Failed to load labs"))
      .finally(() => setLoadingLabs(false));
  }, [city]);

  useEffect(() => {
    if (!labId) return;
    setLoadingTests(true);
    setTestName("");
    api
      .get(`/lab/labs/${labId}/tests`)
      .then(({ data }) => setTests(data))
      .catch((err) => toast.error(err.response?.data?.message || "Failed to load tests"))
      .finally(() => setLoadingTests(false));
  }, [labId]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!city || !labId || !testName || !appointmentDate || !timeSlot) {
      toast.error("Please fill all booking details");
      return;
    }
    setSubmitting(true);
    try {
      await api.post("/lab/bookings", { city, labId, testName, appointmentDate, timeSlot });
      toast.success("Lab test booked successfully!");
      setLabId("");
      setTestName("");
      setAppointmentDate("");
      setTimeSlot("");
      setTests([]);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to book test");
    } finally {
      setSubmitting(false);
    }
  };

  const estimatedPrice = TEST_PRICES[testName] || null;

  return (
    <Layout role="patient">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50/30 to-slate-100 p-4 md:p-8">
        <div className="mx-auto max-w-2xl">
          {/* Header */}
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-600 text-white shadow-md shadow-sky-200">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                  d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Book a Lab Test</h1>
              <p className="text-sm text-slate-500">Select city, lab, test and your preferred slot</p>
            </div>
          </div>

          {/* Card */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm md:p-8">
            <StepIndicator current={currentStep} />

            <form className="grid gap-5 md:grid-cols-2" onSubmit={onSubmit}>
              {/* City */}
              <div className="md:col-span-2">
                <FieldWrapper
                  label="City"
                  icon={
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                  }
                >
                  <input
                    list="city-options"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Search or select city…"
                    className={inputCls}
                  />
                  <datalist id="city-options">
                    {CITIES.map((c) => <option value={c} key={c} />)}
                  </datalist>
                </FieldWrapper>
              </div>

              {/* Lab */}
              <FieldWrapper
                label="Select Lab"
                icon={
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
                  </svg>
                }
              >
                <select
                  value={labId}
                  onChange={(e) => setLabId(e.target.value)}
                  disabled={!city || loadingLabs}
                  className={inputCls}
                >
                  <option value="">{loadingLabs ? "Loading labs…" : "Choose lab"}</option>
                  {labs.map((lab) => (
                    <option value={lab._id} key={lab._id}>{lab.name}</option>
                  ))}
                </select>
              </FieldWrapper>

              {/* Test */}
              <FieldWrapper
                label="Select Test"
                icon={
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                  </svg>
                }
              >
                <select
                  value={testName}
                  onChange={(e) => setTestName(e.target.value)}
                  disabled={!labId || loadingTests}
                  className={inputCls}
                >
                  <option value="">{loadingTests ? "Loading tests…" : "Choose test"}</option>
                  {tests.map((test) => (
                    <option value={test} key={test}>{test}</option>
                  ))}
                </select>
              </FieldWrapper>

              {/* Lab Info Card */}
              {selectedLab && (
                <div className="md:col-span-2 rounded-2xl border border-sky-100 bg-sky-50/60 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-800">{selectedLab.name}</p>
                      <p className="mt-0.5 text-sm text-slate-500">{selectedLab.address}</p>
                    </div>
                    <div className="text-right text-sm text-slate-500 shrink-0">
                      <p>{selectedLab.phone}</p>
                      <p>{selectedLab.workingHours}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Date */}
              <FieldWrapper
                label="Appointment Date"
                icon={
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5" />
                  </svg>
                }
              >
                <input
                  type="date"
                  value={appointmentDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  className={inputCls}
                />
              </FieldWrapper>

              {/* Time Slot */}
              <FieldWrapper
                label="Time Slot"
                icon={
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              >
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className={inputCls}
                >
                  <option value="">Choose slot</option>
                  {TIME_SLOTS.map((slot) => (
                    <option value={slot} key={slot}>{slot}</option>
                  ))}
                </select>
              </FieldWrapper>

              {/* Estimated Price */}
              {estimatedPrice && (
                <div className="md:col-span-2 flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <span className="text-sm text-slate-500">Estimated cost</span>
                  <span className="text-lg font-bold text-slate-800">{estimatedPrice}</span>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="md:col-span-2 mt-1 flex items-center justify-center gap-2 rounded-2xl bg-sky-600 px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-sky-200 transition hover:bg-sky-700 active:scale-[0.98] disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Booking…
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Confirm Lab Booking
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BookLabTest;