import { useAuth } from "../store/authStore";
import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import { useEffect, useState } from "react";
import axios from "axios";

import {
  articleGrid,
  articleCardClass,
  articleTitle,
  ghostBtn,
  loadingClass,
  errorClass,
  timestampClass,
  tagClass,
} from "../styles/common.js";

function UserProfile() {
  const currentUser = useAuth((state) => state.currentUser);
  const logout = useAuth((state) => state.logout);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [articles, setArticles] = useState([]);

  const formatDate = (date) =>
    new Date(date).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "medium",
      timeStyle: "short",
    });

  useEffect(() => {
    const getArticles = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          "http://localhost:4000/user-api/articles",
          { withCredentials: true }
        );
        setArticles(res.data.payload);
      } catch (err) {
        setError(err.response?.data?.error || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    getArticles();
  }, []);

  const onLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  if (loading) return <p className={loadingClass}>Loading articles...</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 mt-6">

      {error && <p className={errorClass}>{error}</p>}

      {/* Profile header — always shows because currentUser comes from DB via check-auth */}
      <div className="flex items-center justify-between mb-8">

        {/* Left: avatar + name */}
        <div className="flex items-center gap-4">
          <img
            src={currentUser?.profileImageUrl || `https://ui-avatars.com/api/?name=${currentUser?.firstName}&background=7c3aed&color=fff`}
            alt="Profile"
            className="w-14 h-14 rounded-full object-cover border-2 border-violet-500"
            onError={(e) => {
              e.target.src = `https://ui-avatars.com/api/?name=${currentUser?.firstName}&background=7c3aed&color=fff`;
            }}
          />
          <div>
            <p className="text-base font-bold text-stone-800">
              {currentUser?.firstName} {currentUser?.lastName}
            </p>
            <p className="text-xs text-stone-500 uppercase font-semibold tracking-wide">
              {currentUser?.role}
            </p>
            <p className="text-xs text-stone-400">{currentUser?.email}</p>
          </div>
        </div>

        {/* Right: logout */}
        <button
          className="bg-red-500 text-white px-5 py-1.5 rounded-md text-sm font-semibold hover:bg-red-600 transition-colors"
          onClick={onLogout}
        >
          Logout
        </button>
      </div>

      <h2 className="text-2xl font-bold mb-6 text-stone-800 border-b pb-2">
        Your Feed
      </h2>

      {articles.length === 0 && !loading && (
        <p className="text-center text-stone-400 py-16 text-sm">No articles yet.</p>
      )}

      <div className={articleGrid}>
        {articles.map((articleObj) => (
          <div className={articleCardClass} key={articleObj._id}>
            <div className="flex flex-col h-full gap-2">
              <p className={tagClass}>{articleObj.category}</p>
              <p className={articleTitle}>{articleObj.title}</p>
              <p className="text-sm text-gray-600">
                {articleObj.content.slice(0, 100)}...
              </p>
              <p className={timestampClass}>{formatDate(articleObj.createdAt)}</p>
              <button
                className={`${ghostBtn} mt-auto pt-3`}
                onClick={() =>
                  navigate(`/article/${articleObj._id}`, { state: articleObj })
                }
              >
                Read Article →
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

export default UserProfile;