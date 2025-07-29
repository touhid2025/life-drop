// DashboardLayout.jsx
import { FaTachometerAlt, FaUser, FaTint, FaUsersCog, FaClipboardList, FaPlus, FaMicroblog } from 'react-icons/fa';
import { Link, NavLink, Outlet } from 'react-router';
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../provider/AuthProvider';
import axios from 'axios';
import { FaDashcube } from 'react-icons/fa6';
import { FiGrid } from 'react-icons/fi';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const { userr } = useContext(AuthContext); // contains only email

  useEffect(() => {
    if (userr?.email) {
      axios.get('https://assignment-twelve-server-side-eight.vercel.app/api/users')
        .then(res => {
          const foundUser = res.data.users.find(u => u.email === userr.email);
          setCurrentUser(foundUser);
        })
        .catch(error => console.error(error));
    }
  }, [userr]);

  const links = (
    <>
      <NavLink to="/dashboard" onClick={() => setSidebarOpen(false)} className="flex items-center gap-2 px-4 py-2 hover:bg-red-100 rounded">
        <FaTachometerAlt /> Dashboard
      </NavLink>
      <NavLink to="/dashboard/profile" onClick={() => setSidebarOpen(false)} className="flex items-center gap-2 px-4 py-2 hover:bg-red-100 rounded">
        <FaUser /> Profile
      </NavLink>
      <NavLink to="/dashboard/create" onClick={() => setSidebarOpen(false)} className="flex items-center gap-2 px-4 py-2 hover:bg-red-100 rounded">
        <FaPlus /> Create Donation
      </NavLink>
      <NavLink to="/dashboard/my-donation" onClick={() => setSidebarOpen(false)} className="flex items-center gap-2 px-4 py-2 hover:bg-red-100 rounded">
        <FaTint /> My Donations
      </NavLink>

      {/* Volunteer Routes */}
      {currentUser?.role === 'volunteer' && (
        <>
        
        <NavLink to="/dashboard/vol-dash" onClick={() => setSidebarOpen(false)} className="flex items-center gap-2 px-4 py-2 hover:bg-red-100 rounded">
          <FiGrid /> Volunteer Dashboard
        </NavLink>
        <NavLink to="/dashboard/all-donation-requests" onClick={() => setSidebarOpen(false)} className="flex items-center gap-2 px-4 py-2 hover:bg-red-100 rounded">
          <FaClipboardList /> All Donation Requests
        </NavLink>
        <NavLink to="/dashboard/vol-blogs" onClick={() => setSidebarOpen(false)} className="flex items-center gap-2 px-4 py-2 hover:bg-red-100 rounded">
          <FaMicroblog /> Blogs
        </NavLink>
        </>
      )}

      {/* Admin Routes */}
      {currentUser?.role === 'admin' && (
        <>
        <NavLink to="/dashboard/admin-dashboard" onClick={() => setSidebarOpen(false)} className="flex items-center gap-2 px-4 py-2 hover:bg-red-100 rounded">
            <FaDashcube /> Admin Dashboard
          </NavLink>
          <NavLink to="/dashboard/manage-users" onClick={() => setSidebarOpen(false)} className="flex items-center gap-2 px-4 py-2 hover:bg-red-100 rounded">
            <FaUsersCog /> Manage Users
          </NavLink>
          <NavLink to="/dashboard/manage-blogs" onClick={() => setSidebarOpen(false)} className="flex items-center gap-2 px-4 py-2 hover:bg-red-100 rounded">
            📝 Manage Blogs
          </NavLink>
          <NavLink to="/dashboard/add-blogs" onClick={() => setSidebarOpen(false)} className="flex items-center gap-2 px-4 py-2 hover:bg-red-100 rounded">
            <FaPlus /> Add Blogs
          </NavLink>
          <NavLink to="/dashboard/manage-donation" onClick={() => setSidebarOpen(false)} className="flex items-center gap-2 px-4 py-2 hover:bg-red-100 rounded">
            <FaTint /> Manage Donations
          </NavLink>
        </>
      )}
    </>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar for large screen */}
      <aside className="hidden md:flex md:flex-col w-64 bg-white shadow-lg p-4 sticky top-0 h-screen">
        <Link to="/" className="text-2xl font-bold text-red-600 mb-6">LifeDrop</Link>
        <nav className="flex flex-col space-y-2">{links}</nav>
      </aside>

      {/* Mobile Drawer */}
      <div className={`fixed inset-0 z-50 md:hidden transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="absolute inset-0 bg-black opacity-50" onClick={() => setSidebarOpen(false)} />
        <div className="relative w-64 h-full bg-white shadow-lg z-50 p-4">
          <Link to="/" className="text-2xl font-bold text-red-600 mb-4">LifeDrop</Link>
          <nav className="flex flex-col space-y-2">{links}</nav>
        </div>
      </div>

      {/* Page Content */}
      <div className="flex-1 p-4">
        <div className="md:hidden mb-4 sticky top-1.5">
          <button onClick={() => setSidebarOpen(true)} className="text-red-600 bg-white/75 backdrop-blur-md text-2xl">
            ☰
          </button>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
