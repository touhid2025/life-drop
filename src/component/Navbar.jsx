import { useContext, useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router';
import { AuthContext } from '../provider/AuthProvider';
import axios from 'axios';
import {
  FaBars, FaTimes,
  FaSignInAlt, FaUserPlus,
  FaTachometerAlt, FaSignOutAlt
} from 'react-icons/fa';
import Loader from './Loader';

const Navbar = () => {
  const { userr, logOut } = useContext(AuthContext);
  console.log(userr)
  const [userData, setUserData] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Fetch user info
  useEffect(() => {
  if (userr?.email) {
    axios
      .get(`http://localhost:5000/api/users?email=${userr.email}`)
      .then(res => {
        setUserData(res.data);
      })
      .catch(err => console.error(err));
  } else {
    setUserData(null);
  }
}, [userr]);


  // Logout handler
  const handleLogout = () => {
    logOut().then(() => {
      setUserData(null);
      setDropdownOpen(false);
      navigate('/');
    });
  };

  // Close dropdown if click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = (
    <>
      <NavLink to="/" onClick={() => setMenuOpen(false)} className="block text-gray-700 hover:text-red-600 px-4 py-2">Home</NavLink>
      <NavLink to="/blog" onClick={() => setMenuOpen(false)} className="block text-gray-700 hover:text-red-600 px-4 py-2">Blog</NavLink>
      <NavLink to="/donation-requests" onClick={() => setMenuOpen(false)} className="block text-gray-700 hover:text-red-600 px-4 py-2">Donation Requests</NavLink>
    </>
  );

  

  return (
    <nav className="bg-white/70 backdrop-blur-lg shadow-sm px-4 py-3 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-red-600">LifeDrop</Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-4">
          {navLinks}
          {userData ? (
            <div className="relative" ref={dropdownRef}>
              <img
                src={userData.avatar}
                alt="avatar"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-10 h-10 rounded-full border-2 border-red-400 cursor-pointer"
              />
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 bg-white border rounded shadow-md min-w-[160px] z-50">
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <FaTachometerAlt /> Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    <FaSignOutAlt /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/log/login" className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                <FaSignInAlt /> Login
              </Link>
              <Link to="/log/signup" className="flex items-center gap-2 bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300">
                <FaUserPlus /> Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="md:hidden mt-2 p-4 space-y-2 ">
          {navLinks}
          {userData ? (
            <>
              <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 text-gray-700 hover:text-red-600 px-4 py-2">
                <FaTachometerAlt /> Dashboard
              </Link>
              <button onClick={() => { setMenuOpen(false); handleLogout(); }} className="flex items-center gap-2 text-gray-700 hover:text-red-600 px-4 py-2 w-full text-left">
                <FaSignOutAlt /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/log/login" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 text-gray-700 hover:text-red-600 px-4 py-2">
                <FaSignInAlt /> Login
              </Link>
              <Link to="/log/signup" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 text-gray-700 hover:text-red-600 px-4 py-2">
                <FaUserPlus /> Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
