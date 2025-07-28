import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import axios from "axios";

const DonationChart = () => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    axios.get("https://assignment-twelve-server-side-eight.vercel.app/api/donations")
      .then(res => {
        const donations = res.data;

        // Group donations by date
        const grouped = {};
        donations.forEach(donation => {
          const date = new Date(donation.date).toLocaleDateString();
          if (!grouped[date]) grouped[date] = 0;
          grouped[date] += 1;
        });

        // Convert to array for chart
        const formatted = Object.entries(grouped).map(([date, count]) => ({
          date,
          count,
        }));

        // Sort by date
        formatted.sort((a, b) => new Date(a.date) - new Date(b.date));
        setChartData(formatted);
      })
      .catch(err => console.error("Failed to load chart data", err));
  }, []);

  return (
    <div className="bg-white rounded-xl p-4 shadow-md mt-6">
      <h2 className="text-lg font-semibold mb-4">📈 Donations Over Time</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#ef4444"
            strokeWidth={2}
            dot={{ r: 5 }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DonationChart;
