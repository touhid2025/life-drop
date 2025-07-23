import { useEffect, useState } from "react";
import axios from "axios";

const BloodDonationRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/donation-requests");
        setRequests(res.data);
      } catch (err) {
        setError("Failed to load donation requests.");
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading donation requests...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;

  if (requests.length === 0)
    return <p className="text-center mt-10">No donation requests found.</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded shadow mt-10">
      <h2 className="text-3xl font-bold text-red-600 mb-6">Blood Donation Requests</h2>

      <div className="grid gap-6">
        {requests.map((req) => (
          <div key={req._id} className="border border-red-300 rounded p-4 shadow hover:shadow-md transition">
            <h3 className="text-xl font-semibold text-red-700 mb-2">{req.recipientName}</h3>
            <p>
              <strong>Blood Group:</strong> {req.bloodGroup}
            </p>
            <p>
              <strong>District:</strong> {req.recipientDistrict} | <strong>Upazila:</strong> {req.recipientUpazila}
            </p>
            <p>
              <strong>Hospital:</strong> {req.hospitalName}
            </p>
            <p>
              <strong>Address:</strong> {req.address}
            </p>
            <p>
              <strong>Date & Time:</strong> {req.date} at {req.time}
            </p>
            <p className="italic mt-2">
              <strong>Message:</strong> {req.message}
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Requested by: {req.requesterName} ({req.requesterEmail})
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BloodDonationRequests;
