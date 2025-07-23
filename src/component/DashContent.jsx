// src/pages/dashboard/DashboardHome.jsx
import React from 'react';
import { FaHeartbeat } from 'react-icons/fa';

const DashboardHome = () => {
  return (
    <div className="bg-white p-6 rounded shadow-md">
      <h2 className="text-2xl font-bold text-red-600 mb-4 flex items-center gap-2">
        <FaHeartbeat /> Welcome to Your Dashboard
      </h2>
      <p className="text-gray-700">
        Thank you for being a blood donor! You can view and manage your profile and donation history from the dashboard.
      </p>
    </div>
  );
};

export default DashboardHome;
