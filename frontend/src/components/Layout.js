// frontend/src/componenets/Layout.js
import React from "react";
import Sidebar from "./Sidebar";

const Layout = ({ children }) => (
  <div className="flex min-h-screen bg-gray-100">
    <Sidebar />
    <main className="flex-1 ml-64 p-4 transition-all duration-300">
      {children}
    </main>
  </div>
);

export default Layout;
