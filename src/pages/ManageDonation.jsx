import { useContext, useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { AuthContext } from "../provider/AuthProvider";
import {
  FaHourglassStart,
  FaCheckCircle,
  FaTimesCircle,
  FaTrashAlt,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

const AllDonationRequests = () => {
  const { userr } = useContext(AuthContext);
  const [currentUser, setCurrentUser] = useState(null);
  const [requests, setRequests] = useState([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const requestsPerPage = 10;

  const fetchRequests = () => {
    axios
      .get("https://assignment-twelve-server-side-eight.vercel.app/api/donation-requests")
      .then((res) => setRequests(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  useEffect(() => {
    if (userr?.email) {
      axios
        .get(`https://assignment-twelve-server-side-eight.vercel.app/api/users?email=${userr.email}`)
        .then((res) => setCurrentUser(res.data))
        .catch((err) => console.error(err));
    }
  }, [userr]);

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.patch(`https://assignment-twelve-server-side-eight.vercel.app/api/donation-requests/${id}`, {
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
        await axios.delete(`https://assignment-twelve-server-side-eight.vercel.app/api/donation-requests/${id}`);
        Swal.fire("Deleted!", "Request has been deleted.", "success");
        fetchRequests();
      } catch (err) {
        Swal.fire("Error", "Failed to delete request", "error");
      }
    }
  };

  // Pagination calculations
  const indexOfLastRequest = currentPage * requestsPerPage;
  const indexOfFirstRequest = indexOfLastRequest - requestsPerPage;
  const currentRequests = requests.slice(indexOfFirstRequest, indexOfLastRequest);
  const totalPages = Math.ceil(requests.length / requestsPerPage);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
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
            {currentRequests.length > 0 ? (
              currentRequests.map((req) => (
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
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-4">
                  No donation requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-4">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="btn btn-sm btn-outline"
            title="Previous Page"
          >
            <FaChevronLeft />
          </button>

          {/* Page Numbers */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              onClick={() => goToPage(num)}
              className={`btn btn-sm ${
                num === currentPage ? "btn-primary" : "btn-outline"
              }`}
            >
              {num}
            </button>
          ))}

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="btn btn-sm btn-outline"
            title="Next Page"
          >
            <FaChevronRight />
          </button>
        </div>
      )}
    </div>
  );
};

export default AllDonationRequests;
