import React, { useEffect, useState } from "react";
import axios from "axios";
import RolePieChart from "./RolePieChart";


const RolePieChartContainer = () => {
  const [roleData, setRoleData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users");
        const users = res.data.users;

        // Count users per role
        const counts = users.reduce((acc, user) => {
          acc[user.role] = (acc[user.role] || 0) + 1;
          return acc;
        }, {});

        // Transform counts object to array of {name, value}
        const chartData = Object.entries(counts).map(([role, count]) => ({
          name: role.charAt(0).toUpperCase() + role.slice(1), // Capitalize
          value: count,
        }));

        setRoleData(chartData);
      } catch (error) {
        console.error("Failed to fetch users", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <p>Loading chart data...</p>;
  if (!roleData.length) return <p>No users found.</p>;

  return (
    <div style={{ width: "400px", margin: "auto" }}>
      <h2>User Roles Distribution</h2>
      <RolePieChart data={roleData} />
    </div>
  );
};

export default RolePieChartContainer;
