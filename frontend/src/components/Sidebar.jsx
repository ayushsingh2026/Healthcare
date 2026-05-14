import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = ({ role }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const isPatient = role === "patient";
  const isLab = role === "lab";
  const elevatedTheme = isPatient || isLab;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menus = {
    patient: [
      { name: "Dashboard", path: "/patient/dashboard" },
      { name: "Book Lab Test", path: "/patient/book-lab" },
      { name: "My Account", path: "/patient/account" },
    ],

    doctor: [
      { name: "Dashboard", path: "/doctor/dashboard" },
      { name: "Appointments", path: "/doctor/appointments" },
      { name: "Patients", path: "/doctor/patients" },
      { name: "Profile", path: "/doctor/profile" },
    ],

    lab: [
      { name: "Dashboard", path: "/lab/dashboard" },
      { name: "Manage Bookings", path: "/lab/bookings" },
      { name: "Status & Reports", path: "/lab/status" },
      { name: "Upload Report", path: "/lab/upload-report" },
    ],

    admin: [
      { name: "Dashboard", path: "/admin/dashboard" },
      { name: "Doctors", path: "/admin/doctors" },
      { name: "Patients", path: "/admin/patients" },
      { name: "Labs", path: "/admin/labs" },
      { name: "Appointments", path: "/admin/appointments" },
      { name: "Payments", path: "/admin/payments" },
      { name: "Reports", path: "/admin/reports" },
      { name: "Settings", path: "/admin/settings" },
    ],
  };

  return (
    <div
      className={`w-64 h-full min-h-screen text-white p-5 ${
        elevatedTheme ? "bg-transparent" : "bg-slate-800"
      }`}
      style={
        elevatedTheme
          ? {
              background:
            "radial-gradient(140% 80% at 0% 0%, #23365e 0%, transparent 52%), linear-gradient(180deg, #172644 0%, #111c35 100%)",
              borderRight: "1px solid rgba(255, 255, 255, .08)",
              boxShadow: "inset -1px 0 0 rgba(255, 255, 255, .03)",
              padding: "22px 16px",
              position: "sticky",
              top: 0,
              height: "100vh",
            }
          : undefined
      }
    >
      <h2
        className={`capitalize ${elevatedTheme ? "text-[2rem] leading-[1.05] tracking-[.02em] mb-5 text-[#f8fbff]" : "text-2xl font-bold mb-8"}`}
        style={elevatedTheme ? { fontFamily: "'Playfair Display', serif" } : undefined}
      >
        {role} Panel
      </h2>
      {elevatedTheme && (
        <div
          style={{
            width: "42px",
            height: "3px",
            borderRadius: "999px",
            marginTop: "-10px",
            marginBottom: "16px",
            background: "linear-gradient(90deg, #9ec1ff 0%, #6ba0ff 100%)",
            opacity: 0.95,
          }}
        />
      )}

      <div className={`flex flex-col ${elevatedTheme ? "gap-[10px]" : "gap-3"}`}>
        {menus[role].map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) =>
              elevatedTheme
                ? `px-[14px] py-[11px] rounded-xl border transition-all duration-200 ${
                    isActive
                      ? "text-white border-[#86b3ff]/70 bg-[#4b6ba4]/85"
                      : "text-[#e8f0ff] border-white/10 bg-white/10 hover:bg-[#78a5ff]/30 hover:border-[#b3ceff]/45 hover:translate-x-[2px]"
                  }`
                : `px-4 py-3 rounded-lg ${
                    isActive ? "bg-sky-600 text-white" : "bg-slate-700 hover:bg-sky-600"
                  }`
            }
          >
            {item.name}
          </NavLink>
        ))}

        <button
          onClick={handleLogout}
            className={
            elevatedTheme
              ? "px-4 py-3 rounded-xl mt-[14px] border border-white/15 bg-gradient-to-b from-rose-500 to-rose-600 hover:brightness-105 transition-all duration-200 font-semibold hover:-translate-y-px"
              : "bg-red-600 px-4 py-3 rounded-lg mt-6"
          }
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
