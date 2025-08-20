// frontend/src/components/Layout.js
import React from "react";
import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-64 bg-white h-screen fixed top-0 left-0 shadow-lg z-40">
        <Sidebar />
      </div>
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
