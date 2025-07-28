import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router";
import axios from "axios";
import Swal from "sweetalert2";
import { AuthContext } from "../provider/AuthProvider";


const DonationDetails = () => {
  const { id } = useParams();
  const [donation, setDonation] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { userr } = useContext(AuthContext); // email only
  const [userData, setUserData] = useState(null);

  // Fetch full user info
  useEffect(() => {
    axios.get("https://assignment-twelve-server-side-eight.vercel.app/api/users")
      .then(res => {
        const foundUser = res.data.users.find(u => u.email === userr?.email);
        setUserData(foundUser);
      });
  }, [userr?.email]);

  // Fetch donation request
  useEffect(() => {
    axios.get(`https://assignment-twelve-server-side-eight.vercel.app/api/donation-requests/${id}`)
      .then(res => setDonation(res.data));
  }, [id]);

  const handleConfirmDonate = () => {
    axios.patch(`https://assignment-twelve-server-side-eight.vercel.app/api/donation-requests/${id}/donate`, {
      donorName: userData?.name,
      donorEmail: userData?.email,
    })
    .then(() => {
      Swal.fire("Success", "You have confirmed the donation!", "success");
      setDonation({ ...donation, donationStatus: "inprogress", donorName: userData?.name, donorEmail: userData?.email });
      setShowModal(false);
    })
    .catch(() => {
      Swal.fire("Error", "Something went wrong. Try again.", "error");
    });
  };


  if (!donation) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Donation Request Details</h1>
      <div className="space-y-3 bg-white p-6 shadow rounded-xl">
        <p><strong>Recipient:</strong> {donation.recipientName}</p>
        <p><strong>Blood Group:</strong> {donation.bloodGroup}</p>
        <p><strong>Hospital:</strong> {donation.hospitalName}</p>
        <p><strong>Location:</strong> {donation.recipientDistrict}, {donation.recipientUpazila}</p>
        <p><strong>Time:</strong> {donation.date} at {donation.time}</p>
        <p><strong>Status:</strong> {donation.donationStatus}</p>

        {donation.donationStatus === "inprogress" && (
          <p className="text-green-600">
            Donor: {donation.donorName} ({donation.donorEmail})
          </p>
        )}

        {donation.donationStatus === "pending" && (
          <button
            className="bg-red-600 text-white px-4 py-2 rounded mt-4"
            onClick={() => setShowModal(true)}
          >
            Donate
          </button>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Confirm Donation</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium">Name</label>
                <input type="text" value={userData?.name} readOnly className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium">Email</label>
                <input type="email" value={userData?.email} readOnly className="w-full border rounded px-3 py-2" />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 border rounded">Cancel</button>
              <button onClick={handleConfirmDonate} className="bg-red-600 text-white px-4 py-2 rounded">
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonationDetails;
