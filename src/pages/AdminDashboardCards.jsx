import { useEffect, useState } from "react";
import axios from "axios";
import { FaUsers, FaDonate, FaHandHoldingMedical } from "react-icons/fa";
import DonationChart from "../component/DonationChart";
import RolePieChart from "../component/RolePieChart";

const AdminDashboardCards = () => {
  const [summary, setSummary] = useState({
    totalDonors: 0,
    totalFunding: 0,
    totalDonationRequests: 0,
  });

  useEffect(() => {
    axios.get("http://localhost:5000/api/dashboard-summary")
      .then(res => setSummary(res.data))
      .catch(err => console.error("Dashboard summary fetch failed", err));
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
      <div className="bg-white p-6 rounded-xl shadow-md flex items-center gap-4 border-l-4 border-blue-500">
        <FaUsers className="text-3xl text-blue-500" />
        <div>
          <h2 className="text-xl font-semibold">Total Donors</h2>
          <p className="text-2xl text-gray-700">{summary.totalDonors}</p>
        </div>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-md flex items-center gap-4 border-l-4 border-green-500">
        <FaDonate className="text-3xl text-green-500" />
        <div>
          <h2 className="text-xl font-semibold">Total Funding</h2>
          <p className="text-2xl text-gray-700">${summary.totalFunding}</p>
        </div>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-md flex items-center gap-4 border-l-4 border-red-500">
        <FaHandHoldingMedical className="text-3xl text-red-500" />
        <div>
          <h2 className="text-xl font-semibold">Donation Requests</h2>
          <p className="text-2xl text-gray-700">{summary.totalDonationRequests}</p>
        </div>
      </div>
      <DonationChart></DonationChart>
      <RolePieChart></RolePieChart>
    </div>
  );
};

export default AdminDashboardCards;
