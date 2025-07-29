import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { MdDelete, MdEditNote } from "react-icons/md";
import { FaToggleOn, FaToggleOff } from "react-icons/fa";

const VolBlog = () => {
  const [blogs, setBlogs] = useState([]);

  const fetchBlogs = async () => {
    const res = await axios.get("https://assignment-twelve-server-side-eight.vercel.app/api/blogs");
    setBlogs(res.data);
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleStatusToggle = async (id, currentStatus) => {
    const newStatus = currentStatus === "published" ? "draft" : "published";
    try {
      await axios.patch(`https://assignment-twelve-server-side-eight.vercel.app/api/blogs/${id}`, { status: newStatus });
      Swal.fire("Updated", `Blog status set to ${newStatus}`, "success");
      fetchBlogs();
    } catch {
      Swal.fire("Error", "Could not update status", "error");
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This blog will be permanently deleted",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`https://assignment-twelve-server-side-eight.vercel.app/api/blogs/${id}`);
        Swal.fire("Deleted!", "The blog has been deleted.", "success");
        fetchBlogs();
      } catch {
        Swal.fire("Error", "Failed to delete blog", "error");
      }
    }
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center text-red-600">📚 Manage Blogs</h2>
      <div className="overflow-x-auto rounded shadow">
        <table className="min-w-full bg-white text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">Thumbnail</th>
              <th className="px-4 py-2 text-left hidden md:table-cell">Title</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left hidden md:table-cell">Date</th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((blog) => (
              <tr key={blog._id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">
                  <img
                    src={blog.thumbnail}
                    alt={blog.title}
                    className="w-16 h-16 rounded object-cover"
                  />
                </td>
                <td className="px-4 py-2 hidden md:table-cell font-medium">{blog.title}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      blog.status === "published"
                        ? "bg-green-100 text-green-600"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {blog.status}
                  </span>
                </td>
                <td className="px-4 py-2 hidden md:table-cell">
                  {new Date(blog.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-2 text-right space-y-1 md:space-x-2 md:space-y-0">
                  <button
                  disabled
                    onClick={() => handleStatusToggle(blog._id, blog.status)}
                    className={`w-full disabled:cursor-not-allowed md:w-auto px-3 py-1 rounded text-white text-xs font-medium transition ${
                      blog.status === "published"
                        ? "bg-yellow-500 hover:bg-yellow-600"
                        : "bg-green-500 hover:bg-green-600"
                    }`}
                  >
                    <span className="flex items-center justify-center gap-1">
                      {blog.status === "published" ? <FaToggleOff /> : <FaToggleOn />}
                      {blog.status === "published" ? "Unpublish" : "Publish"}
                    </span>
                  </button>
                  <button
                  disabled
                    onClick={() => handleDelete(blog._id)}
                    className="w-full disabled:cursor-not-allowed md:w-auto bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs font-medium transition"
                  >
                    <span className="flex items-center justify-center gap-1">
                      <MdDelete /> Delete
                    </span>
                  </button>
                </td>
              </tr>
            ))}
            {blogs.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">
                  No blogs available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VolBlog;
