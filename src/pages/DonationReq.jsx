import React, { useEffect, useState } from 'react';
import { Link} from 'react-router';
import { FaTint } from 'react-icons/fa';
import axios from 'axios';
// import { AuthContext } from '../provider/AuthProvider';


const DonationRequests = () => {
  const [requests, setRequests] = useState([]);
  // const { userr } = useContext(AuthContext);
  // const navigate = useNavigate();
  // const location = useLocation(); 

  useEffect(() => {
    axios.get('http://localhost:5000/api/donation-requests')
      .then(res => {
        const pending = res.data.filter(req => req.donationStatus === 'pending');
        setRequests(pending);
      })
      .catch(err => {
        console.error('Failed to fetch requests:', err);
      });
  }, []);

  // const handleView = () => {
  //  navigate(location.state ? location.state : '/');
  // };

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {requests.map(req => (
        <div
          key={req._id}
          className="bg-white rounded-xl shadow p-4 flex flex-col justify-between hover:shadow-md transition"
        >
          <div className="flex items-center gap-3">
            <div className="bg-red-100 p-3 rounded-md">
              <FaTint className="text-red-500 text-xl" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">{req.recipientName}</h2>
              <p className="text-gray-500 text-sm">
                Needs {req.bloodGroup} blood at {req.hospitalName}
              </p>
            </div>
          </div>

          <div className="flex justify-between mt-4 text-sm text-gray-700">
            <div>
              <p className="font-medium">Location</p>
              <p>{req.recipientDistrict}, {req.recipientUpazila}</p>
            </div>
            <div>
              <p className="font-medium">Date & Time</p>
              <p>{req.date}, {req.time}</p>
            </div>
          </div>

          <Link
          to={`/donation-details/${req._id}`}
            
            className="bg-red-600 text-center text-white font-semibold py-2 rounded-md mt-4 hover:bg-red-700"
          >
            View Details
          </Link>
        </div>
      ))}
    </div>
  );
};

export default DonationRequests;
