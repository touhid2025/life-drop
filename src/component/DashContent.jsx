import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router';
import Swal from 'sweetalert2';
import { AuthContext } from '../provider/AuthProvider';

const Dashboard = () => {
  const { userr } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    // Fetch user info
    if (userr?.email) {
      axios.get('http://localhost:5000/api/users')
        .then(res => {
          const found = res.data.users.find(u => u.email === userr.email);
          setUserData(found);
        });
    }
  }, [userr]);

  useEffect(() => {
    // Fetch donation requests by requesterEmail
    if (userr?.email) {
      axios
        .get(`http://localhost:5000/api/donation-requests?email=${userr.email}`)
        .then(res => {
          const sorted = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setRequests(sorted.slice(0, 3)); // latest 3
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
          .patch(`http://localhost:5000/api/donation-requests/${id}/status`, { status: newStatus })
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
  console.log('Deleting ID:', id); // Add this
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



   if(userData==null) return <div className="w-12  text-red-600"><svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect x="1" y="6" width="2.8" height="12" opacity="0"><animate attributeName="opacity" values="0;1;0" dur="1s" repeatCount="indefinite" begin="0.1"></animate></rect><rect x="6" y="6" width="2.8" height="12" opacity="0"><animate attributeName="opacity" values="0;1;0" dur="1s" repeatCount="indefinite" begin="0.2"></animate></rect><rect x="11" y="6" width="2.8" height="12" opacity="0"><animate attributeName="opacity" values="0;1;0" dur="1s" repeatCount="indefinite" begin="0.3"></animate></rect><rect x="16" y="6" width="2.8" height="12" opacity="0"><animate attributeName="opacity" values="0;1;0" dur="1s" repeatCount="indefinite" begin="0.4"></animate></rect><rect x="21" y="6" width="2.8" height="12" opacity="0"><animate attributeName="opacity" values="0;1;0" dur="1s" repeatCount="indefinite" begin="0.5"></animate></rect></svg></div>
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
              <th className="px-4 py-2">Location</th>
              <th className="px-4 py-2">Blood Group</th>
              <th className="px-4 py-2">Date & Time</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map(request => (
              <tr key={request._id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{request.recipientName}</td>
                <td className="px-4 py-2">
                  {request.recipientDistrict}, {request.recipientUpazila}
                </td>
                <td className="px-4 py-2">{request.bloodGroup}</td>
                <td className="px-4 py-2">
                  {request.date} at {request.time}
                </td>
                <td className="px-4 py-2 capitalize">{request.donationStatus}</td>
                <td className="px-4 py-2 space-x-2">
                  {/* Status buttons */}
                  {request.donationStatus === 'inprogress' && (
                    <>
                      <button
                        onClick={() => handleStatusUpdate(request._id, 'done')}
                        className="bg-green-500 text-white px-2 py-1 rounded"
                      >
                        Done
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(request._id, 'canceled')}
                        className="bg-yellow-500 text-white px-2 py-1 rounded"
                      >
                        Cancel
                      </button>
                    </>
                  )}

                  {/* Edit, Delete, View buttons */}
                  <Link
                    to={`/dashboard/edit-request/${request._id}`}
                    className="bg-blue-500 text-white px-2 py-1 rounded"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(request._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                  <Link
                    to={`/dashboard/view-request/${request._id}`}
                    className="bg-gray-500 text-white px-2 py-1 rounded"
                  >
                    View
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

      {/* View All button */}
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
