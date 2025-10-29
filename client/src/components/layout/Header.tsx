import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "../ui/button";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, [location.pathname]); // Re-check on route change

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/");
  };

  const handleLogin = () => {
    navigate("/");
  };

  const handleHome = () => {
    navigate("/home");
  };

  const isAuthPage = location.pathname === "/" || location.pathname === "/auth";

  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1
          className="text-2xl font-bold cursor-pointer hover:text-blue-100 transition-colors"
          onClick={() => (isLoggedIn ? handleHome() : navigate("/"))}
        >
          EV Charging Station
        </h1>
        <nav>
          {isLoggedIn ? (
            <div className="flex items-center space-x-4">
              {!isAuthPage && location.pathname !== "/home" && (
                <Button
                  onClick={handleHome}
                  variant="ghost"
                  className="text-white hover:bg-blue-700 hover:text-white"
                >
                  Home
                </Button>
              )}
              <Button
                onClick={handleLogout}
                variant="outline"
                className="bg-white text-blue-600 hover:bg-blue-50 border-white"
              >
                Logout
              </Button>
            </div>
          ) : (
            !isAuthPage && (
              <Button
                onClick={handleLogin}
                variant="outline"
                className="bg-white text-blue-600 hover:bg-blue-50 border-white"
              >
                Login / Signup
              </Button>
            )
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
