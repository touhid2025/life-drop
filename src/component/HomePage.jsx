import { FaTint, FaHandsHelping, FaSearch, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { Link } from 'react-router';

const HomePage = () => {
  // Sample blood donation requests data
  const recentRequests = [
    {
      id: 1,
      recipientName: "Rahim Khan",
      bloodGroup: "B+",
      district: "Dhaka",
      upazila: "Mirpur",
      hospital: "Dhaka Medical College",
      date: "2023-06-15",
      time: "10:00 AM"
    },
    {
      id: 2,
      recipientName: "Fatima Begum",
      bloodGroup: "O-",
      district: "Chittagong",
      upazila: "Agrabad",
      hospital: "Chittagong Medical College",
      date: "2023-06-16",
      time: "02:00 PM"
    },
    {
      id: 3,
      recipientName: "Abdul Karim",
      bloodGroup: "AB+",
      district: "Sylhet",
      upazila: "Zindabazar",
      hospital: "Sylhet MAG Osmani Medical College",
      date: "2023-06-17",
      time: "11:30 AM"
    }
  ];

  // Featured stats data
  const stats = [
    { id: 1, name: 'Total Donors', value: '1,250+', icon: FaTint },
    { id: 2, name: 'Lives Saved', value: '3,500+', icon: FaHandsHelping },
    { id: 3, name: 'Active Requests', value: '85+', icon: FaSearch }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="relative bg-red-600 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <div className="pt-10 px-4 sm:px-6 lg:px-8">
              <div className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                <div className="sm:text-center lg:text-left">
                  <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
                    <span className="block">Donate Blood,</span>
                    <span className="block text-red-200">Save Lives</span>
                  </h1>
                  <p className="mt-3 text-base text-red-100 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                    Join LifeDrop community to connect blood donors with recipients in need. Your single donation can save up to three lives.
                  </p>
                  <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                    <div className="rounded-md shadow">
                      <Link
                        to="/log/signup"
                        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-red-700 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
                      >
                        Join as a Donor
                      </Link>
                    </div>
                    <div className="mt-3 sm:mt-0 sm:ml-3">
                      <Link
                        to="/search"
                        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-700 hover:bg-red-800 md:py-4 md:text-lg md:px-10"
                      >
                        <FaSearch className="mr-2" /> Search Donors
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <img
            className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
            src="https://images.unsplash.com/photo-1530026186672-2cd00ffc50fe?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
            alt="Blood donation"
          />
        </div>
      </div>

      {/* Featured Stats */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.id} className="bg-red-50 p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-red-600 rounded-md p-3">
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-5">
                    <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                    <dd className="mt-1 text-3xl font-semibold text-red-900">{stat.value}</dd>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Blood Requests */}
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-red-600 font-semibold tracking-wide uppercase">Urgent Needs</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Recent Blood Donation Requests
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              These patients urgently need your help. Your donation can save their lives.
            </p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {recentRequests.map((request) => (
                <div key={request.id} className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-red-100 rounded-md p-3">
                        <FaTint className="h-6 w-6 text-red-600" />
                      </div>
                      <div className="ml-5">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">{request.recipientName}</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Needs {request.bloodGroup} blood at {request.hospital}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Location</p>
                        <p className="text-sm text-gray-900">{request.district}, {request.upazila}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Date & Time</p>
                        <p className="text-sm text-gray-900">{request.date}, {request.time}</p>
                      </div>
                    </div>
                    <div className="mt-5">
                      <Link
                        to={`/donation-request/${request.id}`}
                        className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link
                to="/donation-requests"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700"
              >
                View All Requests
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-red-600 font-semibold tracking-wide uppercase">Process</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              How LifeDrop Works
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Simple steps to become a hero and save lives
            </p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {/* Step 1 */}
              <div className="text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-red-500 text-white mx-auto">
                  <span className="text-lg font-bold">1</span>
                </div>
                <div className="mt-5">
                  <h3 className="text-lg font-medium text-gray-900">Register</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Create your donor profile with basic information and blood type.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-red-500 text-white mx-auto">
                  <span className="text-lg font-bold">2</span>
                </div>
                <div className="mt-5">
                  <h3 className="text-lg font-medium text-gray-900">Get Notified</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Receive alerts when someone nearby needs your blood type.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-red-500 text-white mx-auto">
                  <span className="text-lg font-bold">3</span>
                </div>
                <div className="mt-5">
                  <h3 className="text-lg font-medium text-gray-900">Donate</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Visit the hospital or blood bank to donate and save lives.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-red-700">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Ready to save lives?</span>
            <span className="block text-red-200">Register as a donor today.</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-red-100">
            Join thousands of donors who are making a difference in their communities.
          </p>
          <Link
            to="/register"
            className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-red-600 bg-white hover:bg-red-50 sm:w-auto"
          >
            Sign up now
          </Link>
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-red-600 font-semibold tracking-wide uppercase">Contact</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Get in Touch
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Phone */}
            <div className="bg-gray-50 p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-red-600 rounded-md p-3">
                  <FaPhone className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5">
                  <h3 className="text-lg font-medium text-gray-900">Emergency Contact</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Available 24/7 for urgent blood needs
                  </p>
                  <p className="mt-2 text-lg font-medium text-red-600">+880 1234 567890</p>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="bg-gray-50 p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-red-600 rounded-md p-3">
                  <FaEnvelope className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5">
                  <h3 className="text-lg font-medium text-gray-900">Email Us</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    For general inquiries and support
                  </p>
                  <p className="mt-2 text-lg font-medium text-red-600">info@lifedrop.org</p>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="bg-gray-50 p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-red-600 rounded-md p-3">
                  <FaMapMarkerAlt className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5">
                  <h3 className="text-lg font-medium text-gray-900">Head Office</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Visit us during office hours
                  </p>
                  <p className="mt-2 text-lg font-medium text-red-600">
                    123 Blood Street, Dhaka 1212
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;