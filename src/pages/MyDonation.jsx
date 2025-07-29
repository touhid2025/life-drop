import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../provider/AuthProvider';
import { Link } from 'react-router'; // Fixed: should use 'react-router-dom'
import { FaEye } from 'react-icons/fa';

const MyDonation = () => {
  const { userr } = useContext(AuthContext);
  const [myDonations, setMyDonations] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const donationsPerPage = 5;

  useEffect(() => {
    if (userr?.email) {
      axios.get(`https://assignment-twelve-server-side-eight.vercel.app/api/donation-requests?email=${userr.email}`)
        .then(res => setMyDonations(res.data || []))
        .catch(err => console.error("Error fetching donations:", err));
    }
  }, [userr]);

  // Pagination Logic
  const indexOfLast = currentPage * donationsPerPage;
  const indexOfFirst = indexOfLast - donationsPerPage;
  const currentDonations = myDonations.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(myDonations.length / donationsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (myDonations.length === 0) {
    return (
      <div className='flex items-center justify-center mt-10'>
        <p className='text-red-500 text-lg'>No donation requests found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-4 text-red-600">
        Welcome, {userr?.name || userr?.email}
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
            {currentDonations.map(request => (
              <tr key={request._id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{request?.recipientName}</td>
                <td className="px-4 py-2 hidden md:table-cell">
                  {request?.recipientDistrict}, {request?.recipientUpazila}
                </td>
                <td className="px-4 py-2">{request?.bloodGroup}</td>
                <td className="px-4 py-2 hidden lg:table-cell">
                  {request.date} at {request?.time}
                </td>
                <td className="px-4 py-2 capitalize">{request?.donationStatus}</td>
                <td className="px-4 py-2 text-right">
                  <Link
                    to={`/dashboard/view-details/${request?._id}`}
                    title="View Details"
                    className="px-2 rounded-sm shadow-md p-1 text-white bg-indigo-600 hover:bg-indigo-300"
                  >
                    <FaEye className="inline mr-1" />
                    View
                    
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-6 gap-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="bg-indigo-600 px-3 py-1 cursor-pointer text-white rounded-sm shadow-lg"
        >
          Prev
        </button>
        {[...Array(totalPages)].map((_, idx) => (
          <button
            key={idx}
            onClick={() => handlePageChange(idx + 1)}
            className={`btn btn-sm ${currentPage === idx + 1 ? 'btn-primary' : 'btn-outline'}`}
          >
            {idx + 1}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="bg-indigo-600 px-3 py-1 cursor-pointer text-white rounded-sm shadow-lg"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default MyDonation;
