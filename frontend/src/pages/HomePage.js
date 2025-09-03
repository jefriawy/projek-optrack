// frontend/src/pages/HomePage.js
import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import HeadOfSalesDashboard from "./HeadOfSalesDashboard";
import SalesDashboard from "./SalesDashboard";

const HomePage = () => {
  const { user } = useContext(AuthContext);

  // Head Sales → HeadOfSalesDashboard
  if (user?.role === "Head Sales") {
    return <HeadOfSalesDashboard />;
  }

  // Sales → SalesDashboard
  if (user?.role === "Sales") {
    return <SalesDashboard />;
  }

  // Role lain → welcome
  return (
    <div className="p-4 sm:p-6 md:p-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
        Welcome to the Home Page!
      </h1>
      <p className="text-gray-600 mt-4 text-base sm:text-lg">
        This is a blank home page. You can add your content here.
      </p>
    </div>
  );
};

export default HomePage;
