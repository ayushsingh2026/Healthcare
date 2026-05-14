import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "../pages/common/Home";
import About from "../pages/common/About";
import Contact from "../pages/common/Contact";
import Login from "../pages/common/Login";
import Register from "../pages/common/Register";

import PatientDashboard from "../pages/patient/PatientDashboard";
import DoctorDashboard from "../pages/doctor/DoctorDashboard";
import LabDashboard from "../pages/lab/LabDashboard";
import AdminDashboard from "../pages/admin/AdminDashboard";
import SearchDisease from "../pages/patient/SearchDisease";
import BookDoctor from "../pages/patient/BookDoctor";
import BookLabTest from "../pages/patient/BookLabTest";
import PaymentPage from "../pages/patient/PaymentPage";
import AppointmentHistory from "../pages/patient/AppointmentHistory";
import DoctorDetails from "../pages/patient/DoctorDetails";
import BookAppointmentForm from "../pages/patient/BookAppointmentForm";
import Appointments from "../pages/doctor/Appointments";
import DoctorPatients from "../pages/doctor/DoctorPatients";
import DoctorPatientDetail from "../pages/doctor/DoctorPatientDetail";
import DoctorProfile from "../pages/doctor/DoctorProfile";
import TestBookings from "../pages/lab/TestBookings";
import UploadReport from "../pages/lab/UploadReport";
import TestStatus from "../pages/lab/TestStatus";
import ManageDoctors from "../pages/admin/ManageDoctors";
import ManagePatients from "../pages/admin/ManagePatients";
import ManageLabs from "../pages/admin/ManageLabs";
import ManageAppointments from "../pages/admin/ManageAppointments";
import ManagePayments from "../pages/admin/ManagePayments";
import ManageReports from "../pages/admin/ManageReports";
import AdminSettings from "../pages/admin/AdminSettings";
import ProtectedRoute from "../components/ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/patient/dashboard"
        element={
          <ProtectedRoute allowedRole="patient">
            <PatientDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient/account"
        element={
          <ProtectedRoute allowedRole="patient">
            <AppointmentHistory />
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient/doctors/:id"
        element={
          <ProtectedRoute allowedRole="patient">
            <DoctorDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient/book-appointment/:id"
        element={
          <ProtectedRoute allowedRole="patient">
            <BookAppointmentForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient/book-lab"
        element={
          <ProtectedRoute allowedRole="patient">
            <BookLabTest />
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient/payment"
        element={
          <ProtectedRoute allowedRole="patient">
            <PaymentPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/doctor/dashboard"
        element={
          <ProtectedRoute allowedRole="doctor">
            <DoctorDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/appointments"
        element={
          <ProtectedRoute allowedRole="doctor">
            <Appointments />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/patients"
        element={
          <ProtectedRoute allowedRole="doctor">
            <DoctorPatients />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/patients/:id"
        element={
          <ProtectedRoute allowedRole="doctor">
            <DoctorPatientDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/profile"
        element={
          <ProtectedRoute allowedRole="doctor">
            <DoctorProfile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/lab/dashboard"
        element={
          <ProtectedRoute allowedRole="lab">
            <LabDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/lab/bookings"
        element={
          <ProtectedRoute allowedRole="lab">
            <TestBookings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/lab/upload-report"
        element={
          <ProtectedRoute allowedRole="lab">
            <UploadReport />
          </ProtectedRoute>
        }
      />
      <Route
        path="/lab/status"
        element={
          <ProtectedRoute allowedRole="lab">
            <TestStatus />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/doctors"
        element={
          <ProtectedRoute allowedRole="admin">
            <ManageDoctors />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/patients"
        element={
          <ProtectedRoute allowedRole="admin">
            <ManagePatients />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/labs"
        element={
          <ProtectedRoute allowedRole="admin">
            <ManageLabs />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/appointments"
        element={
          <ProtectedRoute allowedRole="admin">
            <ManageAppointments />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/payments"
        element={
          <ProtectedRoute allowedRole="admin">
            <ManagePayments />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/reports"
        element={
          <ProtectedRoute allowedRole="admin">
            <ManageReports />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/settings"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminSettings />
          </ProtectedRoute>
        }
      />

      <Route path="/patient/search" element={<SearchDisease />} />
      <Route path="/patient/book-doctor" element={<BookDoctor />} />
    </Routes>
  );
};

export default AppRoutes;
