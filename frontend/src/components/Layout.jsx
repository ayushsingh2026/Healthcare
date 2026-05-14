import React, { createContext, useContext, useMemo, useState } from "react";
import Sidebar from "./Sidebar";

export const SidebarContext = createContext({ open: true });
export const useSidebar = () => useContext(SidebarContext);

const Layout = ({ role = "patient", children }) => {
  const [open, setOpen] = useState(true);
  const isPatient = role === "patient";
  const isLab = role === "lab";
  const hasGlassSidebar = isPatient || isLab;
  const sidebarWidth = isPatient ? 260 : 256;

  const ctxValue = useMemo(() => ({ open, setOpen }), [open]);

  return (
    <SidebarContext.Provider value={ctxValue}>
      <div className="min-h-screen bg-slate-100">
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
          className={`fixed top-4 z-[200] h-10 w-10 rounded-full shadow-lg transition-all ${
            hasGlassSidebar
              ? "bg-white text-slate-700 border border-slate-300 hover:bg-slate-900 hover:text-white"
              : "bg-white text-indigo-700 hover:bg-indigo-50"
          }`}
          style={{ left: open ? `${sidebarWidth + 14}px` : "12px" }}
        >
          {open ? (
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" className="h-4 w-4 mx-auto">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          ) : (
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" className="h-4 w-4 mx-auto">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>

        <div className="flex min-h-screen">
          <div
            className="overflow-hidden transition-all duration-300 self-stretch sticky top-0 h-screen"
            style={{ width: open ? `${sidebarWidth}px` : "0px" }}
          >
            <Sidebar role={role} />
          </div>

          <div className={`flex-1 min-w-0 transition-all duration-300 ${open ? "" : "pl-12"}`}>
            {children}
          </div>
        </div>
      </div>
    </SidebarContext.Provider>
  );
};

export default Layout;
