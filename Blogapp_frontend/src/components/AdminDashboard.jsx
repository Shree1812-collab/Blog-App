import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import axiosInstance from "../utils/axiosInstance";

import {
  pageWrapper,
  headingClass,
  loadingClass,
  errorClass,
  emptyStateClass,
  primaryBtn,
  secondaryBtn,
  tagClass,
  mutedText,
  timestampClass,
} from "../styles/common";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("ALL"); // ALL | USER | AUTHOR

  const formatDate = (date) =>
    new Date(date).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "medium",
    });

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.get("/admin-api/admin/users");
      setUsers(res.data.payload);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleBlock = async (userId) => {
    try {
      await axiosInstance.post(`/admin-api/admin/block-user/${userId}`);
      toast.success("User blocked");
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, isActive: false } : u))
      );
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to block user");
    }
  };

  const handleUnblock = async (userId) => {
    try {
      await axiosInstance.post(`/admin-api/admin/unblock-user/${userId}`);
      toast.success("User unblocked");
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, isActive: true } : u))
      );
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to unblock user");
    }
  };

  const filteredUsers = users.filter((u) =>
    filter === "ALL" ? true : u.role === filter
  );

  if (loading) return <p className={loadingClass}>Loading users...</p>;
  if (error) return <p className={errorClass}>{error}</p>;

  return (
    <div className={pageWrapper}>

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className={headingClass}>Admin Dashboard</h2>
        <p className={mutedText}>{users.length} total users</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-3 mb-6">
        {["ALL", "USER", "AUTHOR"].map((role) => (
          <button
            key={role}
            onClick={() => setFilter(role)}
            className={
              filter === role
                ? `${primaryBtn}`
                : `${secondaryBtn}`
            }
          >
            {role}
          </button>
        ))}
      </div>

      {filteredUsers.length === 0 ? (
        <p className={emptyStateClass}>No users found.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {filteredUsers.map((user) => (
            <div
              key={user._id}
              className="bg-[#f5f5f7] rounded-2xl px-6 py-4 flex items-center justify-between gap-4"
            >
              {/* User info */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-[#1d1d1f]">
                    {user.firstName} {user.lastName}
                  </span>
                  <span className={tagClass}>{user.role}</span>
                  {!user.isActive && (
                    <span className="text-[0.65rem] font-semibold text-[#cc2f26] uppercase tracking-widest">
                      Blocked
                    </span>
                  )}
                </div>
                <span className={timestampClass}>{user.email}</span>
                <span className={mutedText}>
                  Joined {formatDate(user.createdAt)}
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-2 shrink-0">
                {user.isActive ? (
                  <button
                    className={secondaryBtn}
                    onClick={() => handleBlock(user._id)}
                  >
                    Block
                  </button>
                ) : (
                  <button
                    className={primaryBtn}
                    onClick={() => handleUnblock(user._id)}
                  >
                    Unblock
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

export default AdminDashboard;