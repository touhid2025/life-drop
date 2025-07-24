import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FaUserShield, FaBan, FaUnlock, FaUserPlus } from "react-icons/fa";

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const limit = 10;

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users", {
        params: {
          status: statusFilter,
          page: currentPage,
          limit,
        },
      });
      setUsers(res.data.users || res.data || []);
      setTotalUsers(res.data.total || 0);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      Swal.fire("Error", "Failed to load users", "error");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [statusFilter, currentPage]);

  const updateUser = async (id, payload) => {
    try {
      await axios.patch(`http://localhost:5000/api/users/${id}`, payload);
      Swal.fire("Success", "User updated", "success");
      fetchUsers();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to update user", "error");
    }
  };

  const totalPages = Math.ceil(totalUsers / limit);

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
        <h2 className="text-2xl font-bold">👥 All Users</h2>
        <select
          className="select select-bordered max-w-xs"
          value={statusFilter}
          onChange={(e) => {
            setCurrentPage(1);
            setStatusFilter(e.target.value);
          }}
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="blocked">Blocked</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Avatar</th>
              <th className="hidden sm:table-cell">Email</th>
              <th className="hidden sm:table-cell">Name</th>
              <th>Role</th>
              <th>Blood</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((u) => (
                <tr key={u._id}>
                  <td>
                    <img
                      src={u.avatar || "https://i.ibb.co/2nP7Fqb/default-avatar.png"}
                      alt="avatar"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </td>
                  <td className="hidden sm:table-cell">{u.email}</td>
                  <td className="hidden sm:table-cell">{u.name}</td>
                  <td className="capitalize">{u.role}</td>
                  <td>{u.bloodGroup || "-"}</td>
                  <td>
                    <span
                      className={`badge ${
                        u.status === "active" ? "badge-success" : "badge-error"
                      } capitalize`}
                    >
                      {u.status || "active"}
                    </span>
                  </td>
                  <td className="text-right space-x-1">
                    <button
                      title="Make Admin"
                      className="btn btn-xs btn-outline"
                      onClick={() => updateUser(u._id, { role: "admin" })}
                    >
                      <FaUserShield className="text-blue-500" />
                    </button>
                    <button
                      title="Make Volunteer"
                      className="btn btn-xs btn-outline"
                      onClick={() => updateUser(u._id, { role: "volunteer" })}
                    >
                      <FaUserPlus className="text-green-600" />
                    </button>
                    {u.status === "active" ? (
                      <button
                        title="Block User"
                        className="btn btn-xs btn-outline"
                        onClick={() => updateUser(u._id, { status: "blocked" })}
                      >
                        <FaBan className="text-red-500" />
                      </button>
                    ) : (
                      <button
                        title="Unblock User"
                        className="btn btn-xs btn-outline"
                        onClick={() => updateUser(u._id, { status: "active" })}
                      >
                        <FaUnlock className="text-yellow-500" />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-4">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="mt-4 flex justify-center gap-2 flex-wrap">
          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentPage(idx + 1)}
              className={`btn btn-sm ${
                currentPage === idx + 1 ? "btn-primary" : "btn-outline"
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllUsers;
