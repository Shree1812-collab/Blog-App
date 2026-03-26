import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router";
import { useEffect } from "react";
import { useAuth } from "../store/authStore";

function RootLayout() {
  const checkAuth = useAuth((state) => state.checkAuth);
  const isCheckingAuth = useAuth((state) => state.isCheckingAuth);

  useEffect(() => {
    checkAuth();
  }, []);

  // Only blocks render during the initial startup cookie check
  // Does NOT block on login / logout actions
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-[#a1a1a6] animate-pulse">Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="min-h-screen mx-4 sm:mx-36">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export default RootLayout;