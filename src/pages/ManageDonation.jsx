import { useContext, useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { AuthContext } from "../provider/AuthProvider";
import {
  FaHourglassStart,
  FaCheckCircle,
  FaTimesCircle,
  FaTrashAlt,
} from "react-icons/fa";

const AllDonationRequests = () => {
  const { userr } = useContext(AuthContext);
  const [currentUser, setCurrentUser] = useState(null);
  const [requests, setRequests] = useState([]);

  const fetchRequests = () => {
    axios
      .get("http://localhost:5000/api/donation-requests")
      .then((res) => setRequests(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  useEffect(() => {
    if (userr?.email) {
      axios
        .get(`http://localhost:5000/api/users?email=${userr.email}`)
        .then((res) => setCurrentUser(res.data))
        .catch((err) => console.error(err));
    }
  }, [userr]);

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.patch(`http://localhost:5000/api/donation-requests/${id}`, {
        status: newStatus,
      });
      Swal.fire("Success", `Status updated to ${newStatus}`, "success");
      fetchRequests();
    } catch (err) {
      Swal.fire("Error", "Could not update status", "error");
    }
  };

  const deleteRequest = async (id) => {
    const confirm = await Swal.fire({
      title: "Delete Request?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(
          `http://localhost:5000/api/donation-requests/${id}`
        );
        Swal.fire("Deleted!", "Request has been deleted.", "success");
        fetchRequests();
      } catch (err) {
        Swal.fire("Error", "Failed to delete request", "error");
      }
    }
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">🩸 All Blood Donation Requests</h2>
      <div className="overflow-x-auto">
        <table className="table w-full text-sm">
          <thead>
            <tr>
              <th>Recipient</th>
              <th className="hidden md:table-cell">Blood</th>
              <th className="hidden lg:table-cell">Date</th>
              <th>Location</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req._id}>
                <td>{req.recipientName}</td>
                <td className="hidden md:table-cell">{req.bloodGroup}</td>
                <td className="hidden lg:table-cell">
                  {req.date} {req.time}
                </td>
                <td>
                  {req.recipientDistrict}, {req.recipientUpazila}
                </td>
                <td>
                  <span
                    className={`badge badge-sm capitalize ${
                      req.donationStatus === "pending"
                        ? "badge-warning"
                        : req.donationStatus === "inprogress"
                        ? "badge-info"
                        : req.donationStatus === "done"
                        ? "badge-success"
                        : "badge-error"
                    }`}
                  >
                    {req.donationStatus}
                  </span>
                </td>
                <td className="text-right space-x-1 flex flex-wrap justify-end gap-1">
                  {currentUser?.role === "admin" &&
                    req.donationStatus === "pending" && (
                      <button
                        title="Mark In Progress"
                        className="btn btn-xs btn-outline cursor-pointer text-blue-600 border-blue-600 hover:bg-blue-100"
                        onClick={() => updateStatus(req._id, "inprogress")}
                      >
                        <FaHourglassStart />
                      </button>
                    )}

                  {currentUser?.role === "admin" &&
                    req.donationStatus === "inprogress" && (
                      <>
                        <button
                          title="Mark Done"
                          className="btn btn-xs btn-success cursor-pointer text-lime-500"
                          onClick={() => updateStatus(req._id, "done")}
                        >
                          <FaCheckCircle />
                        </button>
                        <button
                          title="Cancel"
                          className="btn btn-xs btn-error cursor-pointer text-red-500"
                          onClick={() => updateStatus(req._id, "canceled")}
                        >
                          <FaTimesCircle />
                        </button>
                      </>
                    )}

                  {currentUser?.role === "admin" && (
                    <button
                      title="Delete Request"
                      className="btn btn-xs btn-outline cursor-pointer btn-error"
                      onClick={() => deleteRequest(req._id)}
                    >
                      <FaTrashAlt />
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {requests.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-4">
                  No donation requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllDonationRequests;
