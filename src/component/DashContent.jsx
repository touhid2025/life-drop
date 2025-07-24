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
} from 'react-icons/fa';

const Dashboard = () => {
  const { userr } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    if (userr?.email) {
      axios.get('http://localhost:5000/api/users')
        .then(res => {
          const found = res.data.users.find(u => u.email === userr.email);
          setUserData(found);
        });
    }
  }, [userr]);

  useEffect(() => {
    if (userr?.email) {
      axios
        .get(`http://localhost:5000/api/donation-requests?email=${userr.email}`)
        .then(res => {
          const sorted = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setRequests(sorted.slice(0, 3));
        });
    }
  }, [userr]);

  const handleStatusUpdate = (id, newStatus) => {
    Swal.fire({
      title: `Are you sure to mark as ${newStatus}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: `Yes, ${newStatus}`,
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .patch(`http://localhost:5000/api/donation-requests/${id}`, { status: newStatus })
          .then(() => {
            setRequests(prev =>
              prev.map(r => (r._id === id ? { ...r, donationStatus: newStatus } : r))
            );
            Swal.fire('Success', `Marked as ${newStatus}`, 'success');
          });
      }
    });
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This will permanently delete the request.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete',
    }).then(result => {
      if (result.isConfirmed) {
        axios.delete(`http://localhost:5000/api/donation-requests/${id}`)
          .then(() => {
            setRequests(prev => prev.filter(r => r._id !== id));
            Swal.fire('Deleted!', 'Request has been deleted.', 'success');
          }).catch(error => {
            console.error('Delete error:', error.response?.data || error.message);
            Swal.fire('Error!', 'Failed to delete.', 'error');
          });
      }
    });
  };

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
                  {request.donationStatus === 'pending' && (
                    <button
                      title="Mark In Progress"
                      className="btn btn-xs btn-outline cursor-pointer text-blue-600 border-blue-600 hover:bg-blue-100"
                      onClick={() => handleStatusUpdate(request._id, 'inprogress')}
                    >
                      <FaHourglassStart />
                    </button>
                  )}
                  {request.donationStatus === 'inprogress' && (
                    <>
                      <button
                        title="Mark Done"
                        className="btn btn-xs btn-success cursor-pointer text-lime-500"
                        onClick={() => handleStatusUpdate(request._id, 'done')}
                      >
                        <FaCheckCircle />
                      </button>
                      <button
                        title="Cancel"
                        className="btn btn-xs btn-error cursor-pointer text-red-500"
                        onClick={() => handleStatusUpdate(request._id, 'canceled')}
                      >
                        <FaTimesCircle />
                      </button>
                    </>
                  )}
                  <button
                    title="Delete Request"
                    className="btn btn-xs btn-outline cursor-pointer btn-error"
                    onClick={() => handleDelete(request._id)}
                  >
                    <FaTrashAlt />
                  </button>
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
    </div>
  );
};

export default Dashboard;
