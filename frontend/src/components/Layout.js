// frontend/src/components/Layout.js
import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    handleResize(); // Set initial state
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isMobileView) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true); // Keep sidebar open on desktop by default
    }
  }, [isMobileView]);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`bg-white h-screen shadow-lg z-50 transition-all duration-300 ease-in-out fixed top-0
          ${isMobileView && (isSidebarOpen ? "translate-x-0" : "-translate-x-full")}
          ${!isMobileView && (isSidebarOpen ? "w-64" : "w-20")}`}
      >
        <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      </div>

      {/* Main content */}
      <main
        className={`relative flex-1 p-4 sm:p-6 md:p-8 min-w-0 transition-all duration-300 overflow-x-hidden
          ${!isMobileView && (isSidebarOpen ? "ml-64" : "ml-20")}`}
      >
        {/* Hamburger button for mobile */}
        {isMobileView && (
          <div className="flex justify-end mb-4 z-10">
            <button onClick={toggleSidebar}>
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                ></path>
              </svg>
            </button>
          </div>
        )}
        {children}
      </main>

      {/* Overlay for mobile */}
      {isSidebarOpen && isMobileView && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );
};

export default Layout;