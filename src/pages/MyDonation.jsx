import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../provider/AuthProvider';
import { Link } from 'react-router'; // ✅ Fixed import
import Swal from 'sweetalert2';

const MyDonation = () => {
  const { userr } = useContext(AuthContext);
  const [myDonations, setMyDonations] = useState([]);

  useEffect(() => {
    if (userr?.email) {
      axios.get(`http://localhost:5000/api/donation-requests?email=${userr.email}`)
        .then(res => {
          setMyDonations(res.data || []);
        })
        .catch(err => {
          console.error("Error fetching donations:", err);
        });
    }
  }, [userr]);

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
            setMyDonations(prev => prev.filter(r => r._id !== id)); // ✅ Fix here
            Swal.fire('Deleted!', 'Request has been deleted.', 'success');
          }).catch(error => {
            console.error('Delete error:', error.response?.data || error.message);
            Swal.fire('Error!', 'Failed to delete.', 'error');
          });
      }
    });
  };

  if (myDonations.length === 0) {
    return (
      <div className="w-12 text-red-600">
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
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">My Donation Requests</h2>
      <div className="grid gap-4">
        {myDonations.map((donation) => (
          <div key={donation._id} className="bg-white shadow-md p-4 rounded-lg border">
            <h3 className="text-lg font-semibold mb-1 text-red-600">{donation.recipientName}</h3>
            <p><strong>District:</strong> {donation.recipientDistrict}</p>
            <p><strong>Upazila:</strong> {donation.recipientUpazila}</p>
            <p><strong>Hospital:</strong> {donation.hospitalName}</p>
            <p><strong>Address:</strong> {donation.address}</p>
            <p><strong>Blood Group:</strong> {donation.bloodGroup}</p>
            <p><strong>Date:</strong> {donation.date} <strong>Time:</strong> {donation.time}</p>
            <p><strong>Message:</strong> {donation.message}</p>
            <p><strong>Status:</strong> <span className="capitalize">{donation.donationStatus}</span></p>
            <div className="mt-2">
              <Link to={`/dashboard/edit-request/${donation._id}`} className='bg-blue-500 px-6 py-2 rounded-lg mr-3 text-white'>Edit</Link>
              <button onClick={() => handleDelete(donation._id)} className='bg-red-500 px-6 py-2 rounded-lg text-white'>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyDonation;
