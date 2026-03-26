import { NavLink, useNavigate } from "react-router";
import { useAuth } from "../store/authStore";
import {
  navbarClass,
  navContainerClass,
  navBrandClass,
  navLinksClass,
  navLinkClass,
  navLinkActiveClass,
} from "../styles/common";

function Header() {
  const isAuthenticated = useAuth((state) => state.isAuthenticated);
  const user = useAuth((state) => state.currentUser);
  const logout = useAuth((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const getProfilePath = () => {
    if (!user) return "/";
    switch (user.role) {
      case "AUTHOR": return "/author-profile";
      case "ADMIN":  return "/admin-dashboard";
      default:       return "/user-profile";
    }
  };

  const getAvatarUrl = () => {
    if (user?.profileImageUrl) return user.profileImageUrl;
    const name = user?.firstName ? encodeURIComponent(user.firstName) : "U";
    return `https://ui-avatars.com/api/?name=${name}&background=0066cc&color=fff&size=64`;
  };

  return (
    <nav className={navbarClass}>
      <div className={navContainerClass}>

        {/* --- LOGO SECTION --- */}
        <NavLink to="/" className={`${navBrandClass} flex items-center gap-2`}>
          <img 
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6CYZhBeflEDwUE4IHtFynkqo_bBAIue8AKg&s" 
            alt="Logo" 
            className="w-10 h-10 rounded-md object-contain" // You can adjust w-10 (width) and h-10 (height)
          />
          <span>PenPal</span>
        </NavLink>

        <ul className={navLinksClass}>
          {/* Always visible */}
          <li>
            <NavLink
              to="/"
              end
              className={({ isActive }) => isActive ? navLinkActiveClass : navLinkClass}
            >
              Home
            </NavLink>
          </li>

          {/* Not logged in */}
          {!isAuthenticated && (
            <>
              <li>
                <NavLink
                  to="/register"
                  className={({ isActive }) => isActive ? navLinkActiveClass : navLinkClass}
                >
                  Register
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/login"
                  className={({ isActive }) => isActive ? navLinkActiveClass : navLinkClass}
                >
                  Login
                </NavLink>
              </li>
            </>
          )}

          {/* Logged in */}
          {isAuthenticated && (
            <>
              <li>
                <NavLink
                  to={getProfilePath()}
                  className={({ isActive }) => isActive ? navLinkActiveClass : navLinkClass}
                >
                  <span className="flex items-center gap-2">
                    <img
                      src={getAvatarUrl()}
                      alt="avatar"
                      className="w-6 h-6 rounded-full object-cover"
                      onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${user?.firstName || "U"}&background=0066cc&color=fff&size=64`;
                      }}
                    />
                    <span>Profile</span>
                  </span>
                </NavLink>
              </li>

              <li>
                <button className={navLinkClass} onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Header;