import { useState, useEffect, useContext } from 'react';
import { useLoaderData } from 'react-router';
import Swal from 'sweetalert2';
import {
  FaUser,
  FaEnvelope,
  FaTint,
  FaMapMarkerAlt,
  FaEdit,
  FaSave,
  FaTimes,
} from 'react-icons/fa';
import { AuthContext } from '../provider/AuthProvider';

const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const Profile = () => {
  const { districts, upazilas } = useLoaderData();
  const { userr } = useContext(AuthContext);

  const [userData, setUserData] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bloodGroup: '',
    district: '',
    upazila: '',
    avatar: '',
  });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [newAvatarFile, setNewAvatarFile] = useState(null);

  useEffect(() => {
    if (!userr?.email) return;

    fetch('http://localhost:5000/api/users')
      .then(res => res.json())
      .then(data => {
        const foundUser = data.find(u => u.email === userr.email);
        if (foundUser) {
          setUserData(foundUser);
          setFormData({
            name: foundUser.name || '',
            email: foundUser.email || '',
            bloodGroup: foundUser.bloodGroup || '',
            district: foundUser.district || '',
            upazila: foundUser.upazila || '',
            avatar: foundUser.avatar || '',
          });
          setAvatarPreview(foundUser.avatar || null);
        }
      });
  }, [userr]);

  const filteredUpazilas = formData.district
    ? upazilas
        .filter(
          u =>
            Number(u.district_id) ===
            Number(districts.find(d => d.name === formData.district)?.id)
        )
        .map(u => u.name)
    : [];

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'avatar' && files && files[0]) {
      setNewAvatarFile(files[0]);
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result);
      reader.readAsDataURL(files[0]);
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
      if (name === 'district') {
        setFormData(prev => ({ ...prev, upazila: '' }));
      }
    }
  };

  const handleEditToggle = () => setEditing(true);

  const handleCancel = () => {
    setFormData({
      name: userData.name || '',
      email: userData.email || '',
      bloodGroup: userData.bloodGroup || '',
      district: userData.district || '',
      upazila: userData.upazila || '',
      avatar: userData.avatar || '',
    });
    setAvatarPreview(userData.avatar || null);
    setNewAvatarFile(null);
    setEditing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let avatarUrl = userData.avatar || '';

    if (newAvatarFile) {
      const imageData = new FormData();
      imageData.append('file', newAvatarFile);
      imageData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

      try {
        const res = await fetch(CLOUDINARY_UPLOAD_URL, {
          method: 'POST',
          body: imageData,
        });
        const imgRes = await res.json();
        if (imgRes.secure_url) avatarUrl = imgRes.secure_url;
        else throw new Error('Avatar upload failed');
      } catch (error) {
        Swal.fire('Error', 'Avatar upload failed', 'error');
        return;
      }
    }

    const updatedUser = {
      ...userData,
      name: formData.name,
      bloodGroup: formData.bloodGroup,
      district: formData.district,
      upazila: formData.upazila,
      avatar: avatarUrl,
    };

    try {
      const response = await fetch(`http://localhost:5000/api/users/${userData._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser),
      });

      if (!response.ok) throw new Error('Failed to update profile');

      const data = await response.json();
      setUserData(data);
      setEditing(false);
      setNewAvatarFile(null);

      Swal.fire('Success', 'Profile updated successfully', 'success');
    } catch (error) {
      Swal.fire('Error', error.message || 'Failed to update profile', 'error');
    }
  };

  if (!userData) return <p className="text-center mt-10 text-gray-500">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow mt-10">
      <h2 className="text-3xl font-bold text-red-600 mb-6 flex items-center gap-2">
        <FaUser /> My Profile
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center gap-6">
          <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-red-600 shadow-md">
            <img src={avatarPreview || '/default-avatar.png'} alt="Avatar" className="object-cover w-full h-full" />
            {editing && (
              <label htmlFor="avatar" className="absolute bottom-0 right-0 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 cursor-pointer" title="Change Avatar">
                <FaEdit />
                <input type="file" id="avatar" name="avatar" accept="image/*" className="hidden" onChange={handleChange} />
              </label>
            )}
          </div>
          {!editing && (
            <button type="button" onClick={handleEditToggle} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded flex items-center gap-2">
              <FaEdit /> Edit Profile
            </button>
          )}
        </div>

        <InputField label="Name" name="name" icon={<FaUser />} value={formData.name} onChange={handleChange} disabled={!editing} />

        <InputField label="Email" name="email" icon={<FaEnvelope />} value={formData.email} disabled={true} />

        <SelectField label="Blood Group" name="bloodGroup" icon={<FaTint />} value={formData.bloodGroup} onChange={handleChange} options={['', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']} disabled={!editing} />

        <SelectField label="District" name="district" icon={<FaMapMarkerAlt />} value={formData.district} onChange={handleChange} options={['', ...districts.map(d => d.name)]} disabled={!editing} />

        <SelectField label="Upazila" name="upazila" icon={<FaMapMarkerAlt />} value={formData.upazila} onChange={handleChange} options={['', ...filteredUpazilas]} disabled={!editing || !formData.district} />

        {editing && (
          <div className="flex gap-4">
            <button type="submit" className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded">
              <FaSave /> Save
            </button>
            <button type="button" onClick={handleCancel} className="flex items-center gap-2 bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded">
              <FaTimes /> Cancel
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

const InputField = ({ label, name, icon, value, onChange, disabled }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{label}</label>
    <div className="flex items-center border border-gray-300 rounded-md px-3 py-2">
      <div className="text-gray-400 mr-2">{icon}</div>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full bg-transparent focus:outline-none text-gray-900 ${disabled ? 'cursor-not-allowed' : ''}`}
      />
    </div>
  </div>
);

const SelectField = ({ label, name, icon, value, onChange, options, disabled }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{label}</label>
    <div className="flex items-center border border-gray-300 rounded-md px-3 py-2">
      <div className="text-gray-400 mr-2">{icon}</div>
      <select
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full bg-transparent focus:outline-none text-gray-900 appearance-none ${disabled ? 'cursor-not-allowed' : ''}`}
      >
        {options.map((opt, idx) => (
          <option key={idx} value={opt}>
            {opt === '' ? `Select ${label}` : opt}
          </option>
        ))}
      </select>
    </div>
  </div>
);

export default Profile;
