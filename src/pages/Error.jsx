import { FaExclamationTriangle, FaHome, FaEnvelope } from "react-icons/fa";
import { IoMdRefresh } from "react-icons/io";

const ErrorPage = ({ errorCode = 404, errorMessage = "Page Not Found" }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Error Header */}
        <div className="bg-red-600 p-6 text-center">
          <div className="flex justify-center text-6xl text-red-200 mb-4">
            <FaExclamationTriangle />
          </div>
          <h1 className="text-3xl font-bold text-red-100">{errorCode}</h1>
          <p className="text-indigo-100 mt-2">{errorMessage}</p>
        </div>
        
        {/* Error Content */}
        <div className="p-8">
          <p className="text-gray-600 mb-6 text-center">
            Oops! Something went wrong. The page you're looking for might have been removed, 
            had its name changed, or is temporarily unavailable.
          </p>
          
          <div className="space-y-4">
            <button
              className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200"
              onClick={() => window.location.reload()}
            >
              <IoMdRefresh size={18} />
              Refresh Page
            </button>
            
            <button
              className="w-full flex items-center justify-center gap-2 border border-red-600 text-red-600 hover:bg-red-100 font-medium py-3 px-4 rounded-lg transition duration-200"
              onClick={() => window.location.href = "/"}
            >
              <FaHome size={16} />
              Return Home
            </button>
            
            
          </div>
        </div>
        
        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 text-center">
          <p className="text-sm text-gray-500">
            Project LifeDrop • {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;