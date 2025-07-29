import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router';
import Swal from 'sweetalert2';
import { AuthContext } from '../provider/AuthProvider';
import {
  FaCheckCircle,
  FaTimesCircle,
  FaTrashAlt,
  FaHourglassStart,
  FaEye
} from 'react-icons/fa';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

const DashContent = () => {
  const { userr } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [requests, setRequests] = useState([]);
  const [statusData, setStatusData] = useState([]);

  useEffect(() => {
    if (userr?.email) {
      axios.get('https://assignment-twelve-server-side-eight.vercel.app/api/users')
        .then(res => {
          const found = res.data.users.find(u => u.email === userr.email);
          setUserData(found);
        });
    }
  }, [userr]);

  useEffect(() => {
    if (userr?.email) {
      axios
        .get(`https://assignment-twelve-server-side-eight.vercel.app/api/donation-requests?email=${userr.email}`)
        .then(res => {
          const sorted = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setRequests(sorted.slice(0, 3));

          // Chart data setup
          const statusMap = {};
          res.data.forEach(req => {
            const status = req.donationStatus || 'pending';
            statusMap[status] = (statusMap[status] || 0) + 1;
          });

          const chartData = Object.entries(statusMap).map(([status, count]) => ({
            status: status.charAt(0).toUpperCase() + status.slice(1),
            count
          }));

          setStatusData(chartData);
        });
    }
  }, [userr]);

  

  
  if (userData == null)
    return (
      <div className="w-12 text-red-600 mx-auto mt-10">
        <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <rect x="1" y="6" width="2.8" height="12" opacity="0">
            <animate attributeName="opacity" values="0;1;0" dur="1s" repeatCount="indefinite" begin="0.1" />
          </rect>
          <rect x="6" y="6" width="2.8" height="12" opacity="0">
            <animate attributeName="opacity" values="0;1;0" dur="1s" repeatCount="indefinite" begin="0.2" />
          </rect>
          <rect x="11" y="6" width="2.8" height="12" opacity="0">
            <animate attributeName="opacity" values="0;1;0" dur="1s" repeatCount="indefinite" begin="0.3" />
          </rect>
          <rect x="16" y="6" width="2.8" height="12" opacity="0">
            <animate attributeName="opacity" values="0;1;0" dur="1s" repeatCount="indefinite" begin="0.4" />
          </rect>
          <rect x="21" y="6" width="2.8" height="12" opacity="0">
            <animate attributeName="opacity" values="0;1;0" dur="1s" repeatCount="indefinite" begin="0.5" />
          </rect>
        </svg>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-4 text-red-600">
        Welcome, {userData?.name || userr?.email}
      </h2>

      <h3 className="text-xl font-semibold mb-2">Your Recent Donation Requests</h3>

      <div className="overflow-x-auto border rounded">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-red-100 text-gray-800">
            <tr>
              <th className="px-4 py-2">Recipient</th>
              <th className="px-4 py-2 hidden md:table-cell">Location</th>
              <th className="px-4 py-2">Blood Group</th>
              <th className="px-4 py-2 hidden lg:table-cell">Date & Time</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map(request => (
              <tr key={request._id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{request.recipientName}</td>
                <td className="px-4 py-2 hidden md:table-cell">
                  {request.recipientDistrict}, {request.recipientUpazila}
                </td>
                <td className="px-4 py-2">{request.bloodGroup}</td>
                <td className="px-4 py-2 hidden lg:table-cell">
                  {request.date} at {request.time}
                </td>
                <td className="px-4 py-2 capitalize">{request.donationStatus}</td>
                <td className="px-4 py-2 flex justify-end flex-wrap gap-1">
                  <Link
                    to={`/dashboard/view-details/${request._id}`}
                    title="View Details"
                    className="flex items-center rounded-sm shadow-md px-2 py-1 bg-indigo-600 text-white hover:bg-indigo-300"
                  >
                    View
                    <FaEye className='ml-1' />
                  </Link>
                </td>
              </tr>
            ))}
            {!requests.length && (
              <tr>
                <td colSpan="6" className="px-4 py-6 text-center text-gray-500">
                  You haven’t created any donation requests yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-6 text-right">
        <Link
          to="/dashboard/my-donation"
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
        >
          View My All Requests
        </Link>
      </div>

      {/* Bar Chart Section */}
      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-4">Donation Requests Summary</h3>
        <div className="bg-white shadow rounded p-4">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={statusData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="status" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#f43f5e" name="Total Requests" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashContent;
