import { FaFacebook, FaTwitter,FaTint, FaInstagram, FaLinkedin, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { Link } from 'react-router';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between">
          {/* About Section */}
          <div className="mb-8 md:mb-0 md:w-1/4">
            <div className="flex items-center mb-4">
              <FaTint className="h-6 w-6 text-red-500" />
              <h3 className="text-xl font-bold ml-2">LifeDrop</h3>
            </div>
            <p className="text-gray-400 mb-4">
              Connecting blood donors with recipients to save lives. One drop can make a difference.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="mb-8 md:mb-0">
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/donation-requests" className="text-gray-400 hover:text-white">
                  Donation Requests
                </Link>
              </li>
              <li>
                <Link to="/blogs" className="text-gray-400 hover:text-white">
                  Blogs
                </Link>
              </li>
              <li>
                <Link to="/funding" className="text-gray-400 hover:text-white">
                  Funding
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <FaPhone className="text-red-500 mr-3" />
                <span className="text-gray-400">+880 1234 567890</span>
              </div>
              <div className="flex items-center">
                <FaEnvelope className="text-red-500 mr-3" />
                <span className="text-gray-400">info@lifedrop.org</span>
              </div>
              <div className="flex items-start">
                <FaMapMarkerAlt className="text-red-500 mr-3 mt-1" />
                <span className="text-gray-400">
                  123 Blood Street, Donor City
                  <br />
                  Dhaka, Bangladesh
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} LifeDrop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;