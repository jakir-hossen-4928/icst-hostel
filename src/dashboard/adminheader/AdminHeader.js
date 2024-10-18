import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../../backend/appwrite";
import { AuthContext } from '../../context/AuthProvider';

const AdminHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();
  const { user, clearUserState } = useContext(AuthContext);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false); // Automatically close the menu after a link is clicked
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logoutUser();
      clearUserState();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const routes = [
    { path: "/dashboard", name: "Home" },
    { path: "/dashboard/searchStudentInfo", name: "Students" },
    { path: "/dashboard/roomsmap", name: "Rooms Map" },
    { path: "/dashboard/managementcost", name: "Management Costs" },
    { path: "/dashboard/adminfeadbeak", name: "Review Feedback" },
    { path: "/dashboard/editnotice", name: "Notice" },
    { path: "/dashboard/displaycontact", name: "Contact List" },
  ];

  const menuItems = (
    <>
      {routes.map((route, index) => (
        <li key={index}>
          <Link
            className="text-gray-800 text-lg font-semibold transition duration-300 hover:text-teal-600"
            to={route.path}
            onClick={closeMenu} // Close menu after clicking on a link
          >
            {route.name}
          </Link>
        </li>
      ))}
      {user && (
        <li>
  <button
    className={`px-4 py-2 lg:mb-0 sm:mb-5 mb-10 rounded-md transition duration-300 ${isLoggingOut ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-500'} text-white`}
    onClick={handleLogout}
    disabled={isLoggingOut}
  >
    {isLoggingOut ? 'Logging out...' : 'Log out'}
  </button>
</li>

      )}
    </>
  );

  return (
    <header className="bg-gradient-to-r from-blue-500 via-teal-500 to-purple-500 shadow-lg w-full">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo / Title */}
          <div className="flex-1 md:flex md:items-center md:gap-12">
            <Link to="/dashboard" className="block py-5 md:py-0">
              <span className="font-bold text-2xl lg:text-3xl text-white">
                Admin Dashboard
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav aria-label="Global" className="hidden md:flex">
            <ul className="flex items-center gap-6 text-lg">{menuItems}</ul>
          </nav>

          {/* Mobile Navigation Button */}
          <div className="md:hidden">
            <button
              aria-label="Toggle menu"
              className="rounded bg-white p-2 text-gray-800 transition hover:text-gray-600"
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
          <nav aria-label="Mobile" className="md:hidden">
            <ul className="flex flex-col items-center gap-6 text-lg mt-4 ">{menuItems}</ul>
          </nav>
        )}
      </div>
    </header>
  );
};

export default AdminHeader;
