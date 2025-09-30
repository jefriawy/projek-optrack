// frontend/src/components/HeadOfSalesDetailModal.js
import React, { useEffect } from 'react';
import MonthlyPerformanceChart from './MonthlyPerformanceChart';

const HeadOfSalesDetailModal = ({ isOpen, onClose, salesData, selectedSales, isLoading }) => {
  // Scroll lock effect
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to reset scroll on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);


  if (!isOpen) return null;

  const { monthlyPerformance, totalCustomers, totalOpportunities } = salesData || {};
  const salesName = selectedSales?.name || (salesData?.salesName || '');


  // Data for the chart is already in the correct format from the API
  const performanceData = salesData ? salesData.monthlyPerformance : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl border border-gray-200 animate-[fadeIn_.16s_ease]">
        <div className="flex items-center justify-between px-5 py-3 border-b">
          <h3 className="font-semibold text-gray-800">
            {`Sales Performance: ${salesName}`}
          </h3>
          <button
            onClick={onClose}
            className="inline-flex items-center gap-2 text-xs px-2.5 py-1.5 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
          >
            Close
          </button>
        </div>
        <div className="p-5">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <p>Loading sales details...</p>
            </div>
          ) : salesData ? (
            <div>
.
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-center">
                <div className="p-4 bg-gray-100 rounded-lg">
                  <h4 className="text-sm font-semibold text-gray-500">Sales Name</h4>
                  <p className="text-xl font-bold">{salesName}</p>
                </div>

                <div className="p-4 bg-gray-100 rounded-lg">
                  <h4 className="text-sm font-semibold text-gray-500">PO Received</h4>
                  <p className="text-xl font-bold">{totalOpportunities}</p>
                </div>
              </div>
              <div className="h-80">
                <MonthlyPerformanceChart data={performanceData} />
              </div>
            </div>
          ) : (
            <p>No details available for this sales representative.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeadOfSalesDetailModal;