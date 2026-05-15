import { useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-hot-toast";

import {
  formCard,
  formTitle,
  formGroup,
  labelClass,
  inputClass,
  submitBtn,
  errorClass,
  loadingClass,
} from "../styles/common";

function EditArticlePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  const article = location.state;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (!article) return;
    setValue("title", article.title);
    setValue("category", article.category);
    setValue("content", article.content);
  }, [article]);

  const updateArticle = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const articleId = id || article?._id;

      await axiosInstance.put(
        `${import.meta.env.VITE_API_URL}/author-api/articles`,
        { articleId, ...data }
      );

      toast.success("Article updated successfully!");
      navigate(`/article/${articleId}`);

    } catch (err) {
      const msg = err.response?.data?.error || "Failed to update article";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className={loadingClass}>Updating article...</p>;

  return (
    <div className={`${formCard} mt-10`}>
      <h2 className={formTitle}>Edit Article</h2>

      {error && <p className={errorClass}>{error}</p>}

      <form onSubmit={handleSubmit(updateArticle)}>

        <div className={formGroup}>
          <label className={labelClass}>Title</label>
          <input
            className={inputClass}
            {...register("title", {
              required: "Title required",
              minLength: { value: 5, message: "Title must be at least 5 characters" },
            })}
          />
          {errors.title && <p className={errorClass}>{errors.title.message}</p>}
        </div>

        <div className={formGroup}>
          <label className={labelClass}>Category</label>
          <select
            className={inputClass}
            {...register("category", { required: "Category required" })}
          >
            <option value="">Select category</option>
            <option value="technology">Technology</option>
            <option value="programming">Programming</option>
            <option value="ai">AI</option>
            <option value="web-development">Web Development</option>
          </select>
          {errors.category && <p className={errorClass}>{errors.category.message}</p>}
        </div>

        <div className={formGroup}>
          <label className={labelClass}>Content</label>
          <textarea
            rows="14"
            className={inputClass}
            {...register("content", {
              required: "Content required",
              minLength: { value: 50, message: "Content must be at least 50 characters" },
            })}
          />
          {errors.content && <p className={errorClass}>{errors.content.message}</p>}
        </div>

        <button className={submitBtn} type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update Article"}
        </button>

      </form>
    </div>
  );
}

export default EditArticlePage;
