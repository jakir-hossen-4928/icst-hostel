import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../../backend/appwrite";
import { AuthContext } from "../../context/AuthProvider";

const StudentHeader = () => {
  const { user, clearUserState } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();

  // Toggle the mobile menu
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Toggle the profile dropdown menu
  const toggleProfileMenu = () => {
    setProfileMenuOpen(!profileMenuOpen);
  };

  // Handle logging out the user
  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logoutUser();
      clearUserState();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
      setIsLoggingOut(false);
    }
  };

  // Close the mobile menu when a link is clicked
  const handleMobileLinkClick = () => {
    setMenuOpen(false); // Automatically close the menu after clicking a link
  };

  // Close the profile menu when clicking outside or toggling the name again
  const handleClickOutside = (event) => {
    if (
      profileMenuOpen &&
      !event.target.closest(".profile-menu") && // Detect clicks outside the profile menu
      !event.target.closest(".profile-toggle")
    ) {
      setProfileMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [profileMenuOpen]);

  const navItems = [
    { name: "Home", path: "/studentdashboard" },
    { name: "Notice Board", path: "/studentdashboard/notice-board" },
    { name: "Feedback", path: "/studentdashboard/advice-complain" },
    { name: "Hostel & Meal Fee", path: "/studentdashboard/fees" },
  ];

  return (
    <header className="bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 shadow-lg w-full">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo / Title */}
          <div className="flex-1">
            <Link to="/studentdashboard" className="block py-5">
              <span className="font-bold text-2xl lg:text-3xl text-white">
                Student Dashboard
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav aria-label="Global" className="hidden md:flex">
            <ul className="flex items-center gap-6 text-lg">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link
                    className="text-white font-semibold transition duration-300 hover:text-gray-100"
                    to={item.path}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
              <li>
                <div className="relative inline-block text-left">
                  <button
                    onClick={toggleProfileMenu}
                    className="profile-toggle flex items-center text-white font-semibold transition duration-300 hover:text-gray-100"
                  >
                    {user?.name || "User"}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5 ml-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {/* Profile Dropdown Menu */}
                  {profileMenuOpen && (
                    <div className="profile-menu absolute right-0 z-10 mt-2 w-48 bg-white rounded-md shadow-lg">
                      <div className="py-2">
                      <Link to='/studentdashboard/profile' className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</Link>
                        <button
                          onClick={handleLogout}
                          disabled={isLoggingOut}
                          className={`block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${
                            isLoggingOut
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                        >
                          {isLoggingOut ? (
                            <>
                              <span className="loading-spinner"></span>{" "}
                              Logging out...
                            </>
                          ) : (
                            "Log out"
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </li>
            </ul>
          </nav>

          {/* Mobile Navigation Button */}
          <div className="md:hidden">
            <button
              className="rounded bg-white p-2 text-blue-600 transition hover:text-blue-800"
              onClick={toggleMenu}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <nav aria-label="Mobile" className="md:hidden mt-4">
            <ul className="flex flex-col items-center gap-6 text-lg">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link
                    className="text-white font-semibold transition hover:text-gray-200"
                    to={item.path}
                    onClick={handleMobileLinkClick} // Close the menu on link click
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
              <li>
                <button
                  disabled={isLoggingOut}
                  onClick={handleLogout}
                  className={`px-4 py-2 my-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition ${
                    isLoggingOut ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isLoggingOut ? (
                    <>
                      <span className="loading-spinner"></span> Logging out...
                    </>
                  ) : (
                    "Log out"
                  )}
                </button>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
};

export default StudentHeader;
