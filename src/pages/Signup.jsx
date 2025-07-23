import { useState, useContext } from 'react';
import { Link, useLoaderData, useLocation, useNavigate } from 'react-router';
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaTint,
  FaMapMarkerAlt,
  FaEye,
  FaEyeSlash,
} from 'react-icons/fa';
import Swal from 'sweetalert2';
import { AuthContext } from '../provider/AuthProvider';

const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const Signup = () => {
  const { districts, upazilas } = useLoaderData();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bloodGroup: '',
    district: '',
    upazila: '',
    password: '',
    confirmPassword: '',
    avatar: null,
  });

  const { createUser, setUser, setLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'avatar') {
      const file = files[0];
      setFormData({ ...formData, avatar: file });

      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      return Swal.fire({
        icon: 'warning',
        title: 'Password Mismatch!',
        text: 'Please make sure both passwords match.',
      });
    }

    setLoading(true);

    try {
      const result = await createUser(formData.email, formData.password);
      const user = result.user;
      setUser(user);

      let avatarUrl = '';
      if (formData.avatar) {
        const imageData = new FormData();
        imageData.append('file', formData.avatar);
        imageData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

        const res = await fetch(CLOUDINARY_UPLOAD_URL, {
          method: 'POST',
          body: imageData,
        });

        const imgRes = await res.json();
        if (!imgRes.secure_url) throw new Error('Image upload failed');
        avatarUrl = imgRes.secure_url;
      }

      const userInfo = {
        name: formData.name,
        email: formData.email,
        bloodGroup: formData.bloodGroup,
        district: formData.district,
        upazila: formData.upazila,
        avatar: avatarUrl,
        role: 'donor',
        status: 'active',        // <-- Added default status here
        createdAt: new Date(),
      };

      await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userInfo),
      });

      Swal.fire({
        title: 'Sign Up Successfully!',
        icon: 'success',
      });

      navigate(location.state ? location.state : '/');
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Signup Failed',
        text: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const getUpazilasForSelectedDistrict = () => {
    const selectedDistrict = districts.find(d => d.name === formData.district);
    if (!selectedDistrict) return [];
    return upazilas
      .filter(u => u.district_id === selectedDistrict.id.toString())
      .map(u => u.name);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <FaTint className="h-10 w-10 text-red-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your LifeDrop account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/log/login" className="font-medium text-red-600 hover:text-red-500">
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Avatar Upload */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="h-24 w-24 rounded-full overflow-hidden border-2 border-gray-300">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar" className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                      <FaUser className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                </div>
                <label
                  htmlFor="avatar"
                  className="absolute bottom-0 right-0 bg-red-600 text-white p-1 rounded-full cursor-pointer hover:bg-red-700"
                >
                  <FaUser className="h-4 w-4" />
                  <input
                    id="avatar"
                    name="avatar"
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={handleChange}
                  />
                </label>
              </div>
            </div>

            {/* Input Fields */}
            <InputField id="name" name="name" type="text" placeholder="John Doe" icon={<FaUser />} value={formData.name} onChange={handleChange} />
            <InputField id="email" name="email" type="email" placeholder="example@email.com" icon={<FaEnvelope />} value={formData.email} onChange={handleChange} />
            <SelectField id="bloodGroup" name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} options={['', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']} placeholder="Select Blood Group" icon={<FaTint />} />
            <SelectField id="district" name="district" value={formData.district} onChange={handleChange} options={['', ...districts.map(d => d.name)]} placeholder="Select District" icon={<FaMapMarkerAlt />} />
            <SelectField id="upazila" name="upazila" value={formData.upazila} onChange={handleChange} options={['', ...getUpazilasForSelectedDistrict()]} placeholder="Select Upazila" icon={<FaMapMarkerAlt />} disabled={!formData.district} />
            <PasswordField id="password" name="password" value={formData.password} onChange={handleChange} show={showPassword} setShow={setShowPassword} />
            <PasswordField id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} show={showConfirmPassword} setShow={setShowConfirmPassword} />

            {/* Submit Button */}
            <button type="submit" className="w-full cursor-pointer flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700">
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// Input Field Component
const InputField = ({ id, name, type, placeholder, icon, value, onChange }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 capitalize">{name}</label>
    <div className="mt-1 relative rounded-md shadow-sm">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">{icon}</div>
      <input id={id} name={name} type={type} required className="focus:ring-red-500 focus:border-red-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border" placeholder={placeholder} value={value} onChange={onChange} />
    </div>
  </div>
);

// Select Field Component
const SelectField = ({ id, name, value, onChange, options, placeholder, icon, disabled = false }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 capitalize">{name}</label>
    <div className="mt-1 relative rounded-md shadow-sm">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">{icon}</div>
      <select id={id} name={name} required disabled={disabled} className="focus:ring-red-500 focus:border-red-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border appearance-none bg-white" value={value} onChange={onChange}>
        <option value="">{placeholder}</option>
        {options.map((opt, idx) => <option key={idx} value={opt}>{opt}</option>)}
      </select>
    </div>
  </div>
);

// Password Field Component
const PasswordField = ({ id, name, value, onChange, show, setShow }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 capitalize">{name}</label>
    <div className="mt-1 relative rounded-md shadow-sm">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><FaLock className="h-5 w-5 text-gray-400" /></div>
      <input id={id} name={name} type={show ? 'text' : 'password'} required className="focus:ring-red-500 focus:border-red-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border" placeholder="••••••••" value={value} onChange={onChange} />
      <div className="cursor-pointer absolute inset-y-0 right-0 pr-3 flex items-center">
        <button type="button" onClick={() => setShow(!show)} className="text-gray-400 hover:text-gray-500">
          {show ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
        </button>
      </div>
    </div>
  </div>
);

export default Signup;
