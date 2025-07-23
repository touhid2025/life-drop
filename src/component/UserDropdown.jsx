import { useState } from 'react';
import { Link } from 'react-router';
import { FaTachometerAlt, FaSignOutAlt } from 'react-icons/fa';

const UserDropdown = ({ userData, onLogout }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <img
        src={userData.avatar}
        alt="avatar"
        className="w-10 h-10 rounded-full border-2 border-red-400 cursor-pointer"
        onClick={() => setOpen(!open)}
      />
      {open && (
        <div className="absolute right-0 mt-2 bg-white border rounded shadow-md min-w-[160px] z-50">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100"
            onClick={() => setOpen(false)}
          >
            <FaTachometerAlt /> Dashboard
          </Link>
          <button
            onClick={() => {
              setOpen(false);
              onLogout();
            }}
            className="flex items-center gap-2 w-full px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
