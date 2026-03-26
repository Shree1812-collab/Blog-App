import { NavLink, Outlet, useNavigate } from "react-router";
import { useAuth } from "../store/authStore";
import { toast } from "react-hot-toast";

import {
  pageWrapper,
  navLinkClass,
  navLinkActiveClass,
  divider,
  mutedText,
} from "../styles/common";

function AuthorProfile() {
  const currentUser = useAuth((state) => state.currentUser);
  const logout = useAuth((state) => state.logout);
  const navigate = useNavigate();

  const onLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <div className={pageWrapper}>

      {/* Profile header — populated from DB via check-auth on refresh */}
      <div className="flex items-center justify-between mb-8">

        {/* Left: avatar + name */}
        <div className="flex items-center gap-4">
          <img
            src={
              currentUser?.profileImageUrl ||
              `https://ui-avatars.com/api/?name=${currentUser?.firstName}&background=0066cc&color=fff`
            }
            alt="Profile"
            className="w-14 h-14 rounded-full object-cover border-2 border-blue-500"
            onError={(e) => {
              e.target.src = `https://ui-avatars.com/api/?name=${currentUser?.firstName}&background=0066cc&color=fff`;
            }}
          />
          <div>
            <p className="text-base font-semibold text-[#1d1d1f]">
              {currentUser?.firstName} {currentUser?.lastName}
            </p>
            <p className="text-xs text-[#6e6e73] uppercase font-semibold tracking-wide">
              {currentUser?.role}
            </p>
            <p className={`${mutedText}`}>{currentUser?.email}</p>
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

      {/* Nav tabs */}
      <div className="flex gap-6 mb-6">
        <NavLink
          to="articles"
          className={({ isActive }) => isActive ? navLinkActiveClass : navLinkClass}
        >
          My Articles
        </NavLink>
        <NavLink
          to="write-article"
          className={({ isActive }) => isActive ? navLinkActiveClass : navLinkClass}
        >
          Write Article
        </NavLink>
      </div>

      <div className={divider} />

      {/* Nested route renders here */}
      <Outlet />

    </div>
  );
}

export default AuthorProfile;

