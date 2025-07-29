import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { AuthContext } from '../provider/AuthProvider';
// import { Link } from 'react-router';
import {
  HiOutlinePencilAlt,
  HiOutlineTrash,
  HiOutlineCheckCircle,
  HiOutlineBan,
  HiOutlineEye,
  HiOutlineClock
} from 'react-icons/hi';
import { useNavigate, useParams } from 'react-router';
import Loader from '../component/Loader';

const ViewDetails = () => {
    const {id}=useParams();
    const navigate = useNavigate();

  const { userr } = useContext(AuthContext);
  const [myDonations, setMyDonations] = useState([]);
  console.log(myDonations)
  useEffect(() => {
    if (userr?.email) {
      axios.get(`https://assignment-twelve-server-side-eight.vercel.app/api/donation-requests/${id}`)
        .then(res => setMyDonations(res.data || []))
        .catch(err => console.error("Error fetching donations:", err));
    }
  }, [userr]);

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This will permanently delete the request.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    }).then(result => {
      if (result.isConfirmed) {
        axios.delete(`https://assignment-twelve-server-side-eight.vercel.app/api/donation-requests/${id}`)
          .then(() => {
            
            Swal.fire('Deleted!', 'Request has been deleted.', 'success');
            // Navigate away after delete (optional)
            navigate('/dashboard/my-donation');

          })
          .catch(error => {
            console.error('Delete error:', error);
            Swal.fire('Error!', 'Failed to delete.', 'error');
          });
      }
    });
  };

  const handleStatusUpdate = (id, status) => {
    Swal.fire({
      title: `Change status to ${status}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, update',
    }).then(result => {
      if (result.isConfirmed) {
        axios.patch(`https://assignment-twelve-server-side-eight.vercel.app/api/donation-requests/${id}`, { status })
          .then(() => {
            
            setMyDonations(prev => ({ ...prev, donationStatus: status }));
            Swal.fire('Updated!', `Status changed to ${status}.`, 'success');
          })
          .catch(() => Swal.fire('Error', 'Failed to update status.', 'error'));
      }
    });
  };

  

  if (myDonations?.length === 0) {
    return <Loader></Loader>
  }

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">My Donation Requests</h2>
      <div className="grid gap-4">
        {/* {myDonations?.map((donation) => ( */}
          <div key={myDonations?._id} className="bg-white shadow border rounded-lg p-4 space-y-2">
            <h3 className="text-xl font-semibold text-red-600">{myDonations?.recipientName}</h3>
            <p><strong>District:</strong> {myDonations?.recipientDistrict}</p>
            <p><strong>Upazila:</strong> {myDonations?.recipientUpazila}</p>
            <p><strong>Hospital:</strong> {myDonations?.hospitalName}</p>
            <p><strong>Address:</strong> {myDonations?.address}</p>
            <p><strong>Blood Group:</strong> {myDonations?.bloodGroup}</p>
            <p><strong>Date:</strong> {myDonations?.date} <strong>Time:</strong> {myDonations?.time}</p>
            <p><strong>Message:</strong> {myDonations?.message}</p>
            <p><strong>Status:</strong> <span className="capitalize">{myDonations?.donationStatus}</span></p>

            <div className="flex flex-wrap gap-2 mt-3">
              {/* View */}
              {/* <Link
                to={`/dashboard/view-donation/${donation._id}`}
                className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
              >
                <HiOutlineEye className="text-lg" />
                View
              </Link> */}

              {/* Edit */}
              {/* <Link
                to={`/dashboard/edit-donation/${donation._id}`}
                className="flex items-center gap-1 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
              >
                <HiOutlinePencilAlt className="text-lg" />
                Edit
              </Link> */}

              {/* Delete */}
              <button
                onClick={() => handleDelete(myDonations?._id)}
                className="flex cursor-pointer items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
              >
                <HiOutlineTrash className="text-lg" />
                Delete
              </button>

              {/* Mark In Progress */}
              {myDonations?.donationStatus === 'pending' && (
                <button
                  onClick={() => handleStatusUpdate(myDonations?._id, 'inprogress')}
                  className="flex cursor-pointer items-center gap-1 bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded text-sm"
                >
                  <HiOutlineClock className="text-lg" />
                  In Progress
                </button>
              )}

              {/* Mark Done */}
              {myDonations?.donationStatus === 'inprogress' && (
                <button
                  onClick={() => handleStatusUpdate(myDonations?._id, 'done')}
                  className="flex cursor-pointer items-center gap-1 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                >
                  <HiOutlineCheckCircle className="text-lg" />
                  Done
                </button>
              )}

              {/* Cancel */}
              {myDonations?.donationStatus === 'inprogress' && (
                <button
                  onClick={() => handleStatusUpdate(myDonations?._id, 'canceled')}
                  className="flex cursor-pointer items-center gap-1 bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm"
                >
                  <HiOutlineBan className="text-lg" />
                  Cancel
                </button>
              )}
            </div>
          </div>
        {/* ))} */}
      </div>
    </div>
  );
};

export default ViewDetails;
