import { useState } from 'react';
import { Link, NavLink } from 'react-router';
import { FaBars, FaTimes, FaUser, FaHandsHelping, FaTint } from 'react-icons/fa';
import { MdDashboard, MdLogout } from 'react-icons/md';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Mock user data - replace with actual authentication logic
  const isLoggedIn = false;
  const user = {
    name: "John Doe",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    role: "donor"
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  return (
    <nav className="bg-red-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <FaTint className="h-8 w-8 text-white" />
            <Link to="/" className="ml-2 text-xl font-bold">
              LifeDrop
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <NavLink
              to="/donation-requests"
              className={({ isActive }) => 
                `px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-red-700' : 'hover:bg-red-500'}`
              }
            >
              Donation Requests
            </NavLink>
            <NavLink
              to="/blogs"
              className={({ isActive }) => 
                `px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-red-700' : 'hover:bg-red-500'}`
              }
            >
              Blogs
            </NavLink>
            <NavLink
              to="/funding"
              className={({ isActive }) => 
                `px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-red-700' : 'hover:bg-red-500'}`
              }
            >
              Funding
            </NavLink>

            {isLoggedIn ? (
              <div className="relative ml-4">
                <button
                  onClick={toggleProfile}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  <img
                    className="h-8 w-8 rounded-full"
                    src={user.avatar}
                    alt={user.name}
                  />
                  <span className="hidden lg:inline">{user.name}</span>
                </button>

                {isProfileOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white py-1 z-50">
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <MdDashboard className="inline mr-2" />
                      Dashboard
                    </Link>
                    <Link
                      to="/logout"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <MdLogout className="inline mr-2" />
                      Logout
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="ml-4 px-4 py-2 bg-white text-red-600 rounded-md text-sm font-medium hover:bg-gray-100"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            {isLoggedIn && (
              <div className="mr-4 relative">
                <button
                  onClick={toggleProfile}
                  className="flex items-center focus:outline-none"
                >
                  <img
                    className="h-8 w-8 rounded-full"
                    src={user.avatar}
                    alt={user.name}
                  />
                </button>
              </div>
            )}
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-white hover:bg-red-500 focus:outline-none"
            >
              {isMenuOpen ? (
                <FaTimes className="h-6 w-6" />
              ) : (
                <FaBars className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-red-600 pb-3">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <NavLink
              to="/donation-requests"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-red-500"
              onClick={toggleMenu}
            >
              Donation Requests
            </NavLink>
            <NavLink
              to="/blogs"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-red-500"
              onClick={toggleMenu}
            >
              Blogs
            </NavLink>
            <NavLink
              to="/funding"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-red-500"
              onClick={toggleMenu}
            >
              Funding
            </NavLink>
          </div>
          {!isLoggedIn && (
            <div className="px-5">
              <Link
                to="/login"
                className="block w-full px-4 py-2 text-center bg-white text-red-600 rounded-md text-base font-medium hover:bg-gray-100"
                onClick={toggleMenu}
              >
                Login
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;