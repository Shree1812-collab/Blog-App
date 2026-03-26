import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import { useAuth } from "../store/authStore";
import axiosInstance from "../utils/axiosInstance";

import {
  articleGrid,
  articleCardClass,
  articleTitle,
  tagClass,
  timestampClass,
  ghostBtn,
  primaryBtn,
  secondaryBtn,
  loadingClass,
  errorClass,
  emptyStateClass,
} from "../styles/common";

function AuthorArticles() {
  const currentUser = useAuth((state) => state.currentUser);
  const navigate = useNavigate();

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const formatDate = (date) =>
    new Date(date).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "medium",
      timeStyle: "short",
    });

  const fetchArticles = async () => {
    if (!currentUser?._id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.get(
        `/author-api/articles/${currentUser._id}`
      );
      setArticles(res.data.payload);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load articles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [currentUser]);

  const handleDelete = async (articleId) => {
    if (!window.confirm("Delete this article?")) return;
    try {
      await axiosInstance.patch("/author-api/articles/delete", { articleId });
      toast.success("Article deleted");
      // Remove from local state immediately — no need to refetch
      setArticles((prev) => prev.filter((a) => a._id !== articleId));
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to delete");
    }
  };

  const handleEdit = (article) => {
    navigate(`/edit-article/${article._id}`, { state: article });
  };

  const handleRead = (article) => {
    navigate(`/article/${article._id}`, { state: article });
  };

  if (loading) return <p className={loadingClass}>Loading articles...</p>;
  if (error) return <p className={errorClass}>{error}</p>;

  if (articles.length === 0) {
    return (
      <div className={emptyStateClass}>
        <p>No articles yet.</p>
        <button
          className={`${primaryBtn} mt-4`}
          onClick={() => navigate("/author-profile/write-article")}
        >
          Write your first article
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className={articleGrid}>
        {articles.map((article) => (
          <div className={articleCardClass} key={article._id}>
            <div className="flex flex-col h-full gap-2">

              {/* Category */}
              <p className={tagClass}>{article.category}</p>

              {/* Title */}
              <p className={articleTitle}>{article.title}</p>

              {/* Preview */}
              <p className="text-sm text-[#6e6e73] leading-relaxed">
                {article.content.slice(0, 80)}...
              </p>

              {/* Timestamp */}
              <p className={timestampClass}>{formatDate(article.createdAt)}</p>

              {/* Actions */}
              <div className="flex gap-3 mt-auto pt-3">
                <button
                  className={ghostBtn}
                  onClick={() => handleRead(article)}
                >
                  Read →
                </button>
                <button
                  className={primaryBtn}
                  onClick={() => handleEdit(article)}
                >
                  Edit
                </button>
                <button
                  className={secondaryBtn}
                  onClick={() => handleDelete(article._id)}
                >
                  Delete
                </button>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AuthorArticles;