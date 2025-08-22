// frontend/src/components/Layout.js
import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(() => {
    const savedState = localStorage.getItem('isSidebarOpen');
    return savedState !== null ? JSON.parse(savedState) : true;
  });

  useEffect(() => {
    localStorage.setItem('isSidebarOpen', JSON.stringify(isSidebarOpen));
  }, [isSidebarOpen]);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className={`bg-white h-screen fixed top-0 left-0 shadow-lg z-40 transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
        <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      </div>
      <main className={`flex-1 p-8 min-w-0 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
