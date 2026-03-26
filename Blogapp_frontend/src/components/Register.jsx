import { useForm } from "react-hook-form";
import {
  pageBackground,
  formCard,
  formTitle,
  formGroup,
  labelClass,
  inputClass,
  submitBtn,
  errorClass,
  mutedText,
  divider,
  loadingClass,
} from "../styles/common";
import { NavLink, useNavigate } from "react-router";
import { useState } from "react";
import { toast } from "react-hot-toast";
import axiosInstance from "../utils/axiosInstance";

function Register() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Watch the "profilePic" field from the form to create a live preview
  const profilePicFile = watch("profilePic");
  let previewUrl = null;
  if (profilePicFile && profilePicFile.length > 0) {
    previewUrl = URL.createObjectURL(profilePicFile[0]);
  }

  const onUserRegister = async (newUser) => {
    setLoading(true);
    setError(null);

    try {
      // 1. Initialize FormData (Required for file uploads)
      const formData = new FormData();
      
      // 2. Destructure the data from react-hook-form
      // profilePic contains the FileList from the input
      let { role, profilePic, ...userObj } = newUser;

      // 3. Append text fields (username, email, password, etc.)
      Object.keys(userObj).forEach((key) => {
        formData.append(key, userObj[key]);
      });

      // 4. Append the File using the key "profileImageUrl" 
      // This MUST match upload.single("profileImageUrl") in your backend!
      if (profilePic && profilePic[0]) {
        formData.append("profileImageUrl", profilePic[0]);
      }

      // 5. Determine the correct API endpoint based on role
      const endpoint =
        role === "author" ? "/author-api/users" : "/user-api/users";

      // 6. Send the FormData to the backend
      const resObj = await axiosInstance.post(endpoint, formData);

      if (resObj.status === 201) {
        toast.success("Account created! Please sign in.");
        navigate("/login");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p className={loadingClass}>Creating your account...</p>;
  }

  return (
    <div className={`${pageBackground} flex items-center justify-center py-16 px-4`}>
      <div className={formCard}>
        <h2 className={formTitle}>Create an Account</h2>

        {error && <p className={errorClass}>{error}</p>}

        <form onSubmit={handleSubmit(onUserRegister)}>
          {/* Role Selection */}
          <div className="mb-5">
            <p className={labelClass}>Register as</p>
            <div className="flex gap-6 mt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  {...register("role", { required: "Please select a role" })}
                  value="user"
                  className="accent-violet-600 w-4 h-4"
                />
                <span className="text-sm text-stone-700 font-medium">User</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  {...register("role", { required: "Please select a role" })}
                  value="author"
                  className="accent-violet-600 w-4 h-4"
                />
                <span className="text-sm text-stone-700 font-medium">Author</span>
              </label>
            </div>
            {errors.role && <p className={errorClass}>{errors.role.message}</p>}
          </div>

          <div className={divider} />

          {/* Name Fields */}
          <div className="sm:flex gap-4 mb-4">
            <div className="flex-1">
              <label className={labelClass}>First Name</label>
              <input
                type="text"
                {...register("firstName", { required: "First name is required" })}
                placeholder="First name"
                className={inputClass}
              />
              {errors.firstName && <p className={errorClass}>{errors.firstName.message}</p>}
            </div>
            <div className="flex-1">
              <label className={labelClass}>Last Name</label>
              <input
                type="text"
                {...register("lastName")}
                placeholder="Last name"
                className={inputClass}
              />
            </div>
          </div>

          {/* Email */}
          <div className={formGroup}>
            <label className={labelClass}>Email</label>
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              placeholder="you@example.com"
              className={inputClass}
            />
            {errors.email && <p className={errorClass}>{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div className={formGroup}>
            <label className={labelClass}>Password</label>
            <input
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 8, message: "Password must be at least 8 characters" },
              })}
              placeholder="Min. 8 characters"
              className={inputClass}
            />
            {errors.password && <p className={errorClass}>{errors.password.message}</p>}
          </div>

          {/* Profile Image Input */}
          <div className={formGroup}>
            <label className={labelClass}>Profile Image (optional)</label>
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              {...register("profilePic")} 
              className={inputClass}
            />
            {/* Image Preview */}
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Preview"
                className="mt-3 w-16 h-16 rounded-full object-cover border border-[#d2d2d7]"
              />
            )}
          </div>

          <button type="submit" className={submitBtn}>
            Create Account
          </button>
        </form>

        <p className={`${mutedText} text-center mt-5`}>
          Already have an account?{" "}
          <NavLink to="/login" className="text-violet-600 hover:text-violet-500 font-medium">
            Sign in
          </NavLink>
        </p>
      </div>
    </div>
  );
}

export default Register;