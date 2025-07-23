import { useContext, useEffect, useState } from 'react';

import axios from 'axios';
import { AuthContext } from '../provider/AuthProvider';

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

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">My Donation Requests</h2>
      {myDonations.length === 0 ? (
        <p>No donation requests found.</p>
      ) : (
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyDonation;
