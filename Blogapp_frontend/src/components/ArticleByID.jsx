import { useParams, useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../store/authStore";

import {
  loadingClass,
  errorClass,
  pageWrapper,
  tagClass,
  pageTitleClass,
  mutedText,
  articleBody,
  primaryBtn,
  secondaryBtn,
} from "../styles/common.js";

function ArticleByID() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const user = useAuth((state) => state.currentUser);

  const [article, setArticle] = useState(location.state || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [comment, setComment] = useState(""); 

  useEffect(() => {
    if (article && article.comments) return; 

    const getArticle = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `http://localhost:4000/user-api/articles/${id}`,
          { withCredentials: true }
        );
        setArticle(res.data.payload);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load article");
      } finally {
        setLoading(false);
      }
    };
    getArticle();
  }, [id]);

  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      const commentPayload = {
        user: user._id, 
        articleId: id,
        comment: comment,
      };

      const res = await axios.put(
        "http://localhost:4000/user-api/articles",
        commentPayload,
        { withCredentials: true }
      );

      setArticle(res.data.payload);
      setComment("");
    } catch (err) {
      console.error("Error posting comment:", err);
      alert("Could not post comment.");
    }
  };

  const deleteArticle = async () => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await axios.patch(
        "http://localhost:4000/author-api/articles/delete",
        { articleId: id },
        { withCredentials: true }
      );
      navigate("/author-profile/articles");
    } catch (err) {
      setError("Failed to delete article");
    }
  };

  const editArticle = () => {
    navigate(`/edit-article/${id}`, { state: article });
  };

  if (loading) return <p className={loadingClass}>Loading article...</p>;
  if (error) return <p className={errorClass}>{error}</p>;
  if (!article) return null;

  return (
    <div className={pageWrapper}>
      <p className={tagClass}>{article.category}</p>
      <h1 className={`${pageTitleClass} mt-3 mb-4`}>{article.title}</h1>

      <div className={`${mutedText} flex gap-4 mb-8`}>
        <span>✍️ {article.author?.firstName || "Author"}</span>
        <span>{formatDate(article.createdAt)}</span>
      </div>

      <div className={articleBody}>{article.content}</div>

      {/* comment display section */}
      <div className="mt-10 border-t pt-6">
        <h3 className="text-xl font-bold mb-4">Comments</h3>
        <div className="space-y-4 mb-6">
          {article.comments?.map((c, index) => (
            <div key={index} className="p-3 bg-gray-50 rounded border">
              <p className="text-sm font-bold text-blue-600">{c.user?.firstName || "User"}</p>
              <p className="text-gray-700">{c.comment}</p>
            </div>
          ))}
        </div>

        {/* comment form */}
        {user && (
          <form onSubmit={handleAddComment} className="flex flex-col gap-2">
            <textarea
              className="border p-2 rounded"
              placeholder="Add a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button type="submit" className={`${primaryBtn} w-max`}>Post Comment</button>
          </form>
        )}
      </div>

      {user?.role === "AUTHOR" && (
        <div className="flex gap-3 mt-10">
          <button className={primaryBtn} onClick={editArticle}>Edit</button>
          <button className={secondaryBtn} onClick={deleteArticle}>Delete</button>
        </div>
      )}

      <p className={`${mutedText} mt-10`}>
        Last updated: {formatDate(article.updatedAt)}
      </p>
    </div>
  );
}

export default ArticleByID;