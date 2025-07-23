import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import axios from 'axios';
import Swal from 'sweetalert2';

const EditMyDonation = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    recipientName: '',
    bloodGroup: '',
    district: '',
    upazila: '',
    donationDate: '',
    donationTime: '',
    hospital: '',
    phone: '',
    message: '',
  });

  useEffect(() => {
    axios.get(`http://localhost:5000/api/donation-requests/${id}`)
      .then(res => setFormData(res.data))
      .catch(err => {
        console.error(err);
        Swal.fire('Error', 'Failed to load donation request.', 'error');
      });
  }, [id]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.patch(`http://localhost:5000/api/donation-requests/${id}`, formData);
      Swal.fire('Updated!', 'Donation request updated successfully.', 'success');
      navigate('/dashboard/my-donation-requests');
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Update failed.', 'error');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow mt-6">
      <h2 className="text-2xl font-bold mb-4">Edit Donation Request</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="recipientName"
          value={formData.recipientName}
          onChange={handleChange}
          placeholder="Recipient Name"
          className="input input-bordered w-full"
        />
        <select
          name="bloodGroup"
          value={formData.bloodGroup}
          onChange={handleChange}
          className="select select-bordered w-full"
        >
          <option disabled value="">Select Blood Group</option>
          <option>A+</option><option>A-</option><option>B+</option><option>B-</option>
          <option>AB+</option><option>AB-</option><option>O+</option><option>O-</option>
        </select>
        <input
          name="district"
          value={formData.district}
          onChange={handleChange}
          placeholder="District"
          className="input input-bordered w-full"
        />
        <input
          name="upazila"
          value={formData.upazila}
          onChange={handleChange}
          placeholder="Upazila"
          className="input input-bordered w-full"
        />
        <input
          type="date"
          name="donationDate"
          value={formData.donationDate}
          onChange={handleChange}
          className="input input-bordered w-full"
        />
        <input
          type="time"
          name="donationTime"
          value={formData.donationTime}
          onChange={handleChange}
          className="input input-bordered w-full"
        />
        <input
          name="hospital"
          value={formData.hospital}
          onChange={handleChange}
          placeholder="Hospital Name"
          className="input input-bordered w-full"
        />
        <input
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Phone Number"
          className="input input-bordered w-full"
        />
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Message (Optional)"
          className="textarea textarea-bordered w-full"
        />
        <button type="submit" className="btn btn-primary w-full">Update Request</button>
      </form>
    </div>
  );
};

export default EditMyDonation;
