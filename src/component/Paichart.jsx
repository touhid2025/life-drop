import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";
import axios from "axios";

// Status অনুযায়ী কালার কোড
const COLORS = {
  pending: "#FFBB28",
  inprogress: "#00C49F",
  done: "#0088FE",
  canceled: "#FF4444",
};

const DonationStatusPieChart = () => {
  const [donationData, setDonationData] = useState([]);
  const [statusCount, setStatusCount] = useState([]);

  useEffect(() => {
    axios
      .get("https://assignment-twelve-server-side-eight.vercel.app/api/donation-requests")
      .then((res) => {
        setDonationData(res.data || []);
      })
      .catch((err) => {
        console.error("Error fetching donation requests:", err);
      });
  }, []);

  useEffect(() => {
    const statusMap = {};
    donationData.forEach((item) => {
      const status = item.donationStatus || "pending";
      statusMap[status] = (statusMap[status] || 0) + 1;
    });

    const chartData = Object.entries(statusMap).map(([status, count]) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: count,
      color: COLORS[status] || "#ccc",
    }));

    setStatusCount(chartData);
  }, [donationData]);

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white rounded-xl shadow p-6">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Donation Requests by Status
      </h2>
      {statusCount.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={statusCount}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {statusCount.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-center text-gray-600">Loading chart...</p>
      )}
    </div>
  );
};

export default DonationStatusPieChart;
