import { useContext, useEffect, useState } from 'react';
import { useLoaderData } from 'react-router';
import { AuthContext } from '../provider/AuthProvider';
import Swal from 'sweetalert2';
import axios from 'axios';

const Profile = () => {
  const { districts, upazilas } = useLoaderData();
  const { userr } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [editing, setEditing] = useState(false);
  const [newAvatarFile, setNewAvatarFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  useEffect(() => {
    if (userr?.email) {
      axios
        .get(`https://assignment-twelve-server-side-eight.vercel.app/api/users?email=${userr.email}`)
        .then((res) => {
          setUserData(res.data);
          setPreviewUrl(res.data.avatar);
        })
        .catch((err) => {
          console.error('Error loading user:', err);
        });
    }
  }, [userr]);

  // Filter upazilas based on selected district
  const filteredUpazilas = userData?.district
    ? upazilas.filter(
        (u) =>
          Number(u.district_id) ===
          Number(districts.find((d) => d.name === userData.district)?.id)
      )
    : [];

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'district') {
      setUserData((prev) => ({ ...prev, district: value, upazila: '' }));
    } else {
      setUserData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setNewAvatarFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let updatedUser = { ...userData };
    delete updatedUser._id;

    if (newAvatarFile) {
      const formData = new FormData();
      formData.append('file', newAvatarFile);
      formData.append('upload_preset', uploadPreset);

      try {
        const res = await axios.post(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          formData
        );
        updatedUser.avatar = res.data.secure_url;
      } catch (error) {
        Swal.fire('Error', 'Image upload failed', 'error');
        return;
      }
    }

    try {
      const response = await fetch(
        `https://assignment-twelve-server-side-eight.vercel.app/api/users/${userData._id.$oid || userData._id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedUser),
        }
      );

      if (!response.ok) throw new Error('Update failed');

      // আবার নতুন তথ্য নিয়ে আসা
      const updatedRes = await axios.get(
        `https://assignment-twelve-server-side-eight.vercel.app/api/users?email=${userr.email}`
      );
      setUserData(updatedRes.data);
      setEditing(false);
      setNewAvatarFile(null);
      Swal.fire('Success', 'Profile updated successfully', 'success');
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Failed to update profile', 'error');
    }
  };

  if (!userData) return <div className="text-center py-6">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 text-center">My Profile</h2>

      <div className="flex justify-center mb-6">
        <img
          src={previewUrl}
          alt="Avatar"
          className="w-28 h-28 rounded-full border object-cover"
        />
      </div>

      {editing ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={userData.name || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Blood Group</label>
            <select
              name="bloodGroup"
              value={userData.bloodGroup || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            >
              <option value="">Select Blood Group</option>
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                <option key={bg} value={bg}>
                  {bg}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium mb-1">District</label>
            <select
              name="district"
              value={userData.district || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            >
              <option value="">Select District</option>
              {districts.map((d) => (
                <option key={d.id} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium mb-1">Upazila</label>
            <select
              name="upazila"
              value={userData.upazila || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
              disabled={!userData.district}
            >
              <option value="">Select Upazila</option>
              {filteredUpazilas.map((u) => (
                <option key={u.id} value={u.name}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium mb-1">Upload New Avatar</label>
            <input type="file" accept="image/*" onChange={handleAvatarChange} />
          </div>

          <div className="flex justify-between mt-6">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => {
                setEditing(false);
                setPreviewUrl(userData.avatar);
              }}
              className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-2 text-lg text-gray-700">
          <p>
            <strong>Name:</strong> {userData.name}
          </p>
          <p>
            <strong>Email:</strong> {userData.email}
          </p>
          <p>
            <strong>Blood Group:</strong> {userData.bloodGroup}
          </p>
          <p>
            <strong>District:</strong> {userData.district}
          </p>
          <p>
            <strong>Upazila:</strong> {userData.upazila}
          </p>
          <button
            onClick={() => setEditing(true)}
            className="mt-4 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            Edit
          </button>
        </div>
      )}
    </div>
  );
};

export default Profile;
