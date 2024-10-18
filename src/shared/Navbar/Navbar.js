import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthProvider";
import { logoutUser,getUserData } from "../../backend/appwrite";

const Navbar = () => {
  const { user, isAdmin, clearUserState } = useContext(AuthContext);
  const [showLogout, setShowLogout] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

   // Fetch user data from Appwrite on component mount
   useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await getUserData();
        setUserData(data);  // Store fetched user data
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true); // Set loading state to true
    try {
      await logoutUser();
      clearUserState();
      navigate("/"); // Redirect to the homepage
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false); // Reset loading state
    }
  };

  const toggleLogout = () => {
    setShowLogout(!showLogout);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowLogout(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Dynamically update the menu based on user
  const menuItems = (
    <React.Fragment>
      <li>
        <Link to="/">Home</Link>
      </li>
      <li>
        <Link to="/contact">Contact</Link>
      </li>
      {user ? (
        <li>
          <Link to={isAdmin ? "/dashboard" : "/studentdashboard"}>
            Dashboard
          </Link>
        </li>
      ) : (
        <li>
          <Link to="/login">Login</Link>
        </li>
      )}
    </React.Fragment>
  );

  return (
    <div className="navbar bg-gray-200">
      <div className="navbar-start">
        <div className="dropdown" ref={dropdownRef}>
          <label tabIndex={0} className="btn btn-ghost btn-round">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-black"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              onClick={toggleLogout}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h7"
              />
            </svg>
          </label>

          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
          >
            {menuItems}
          </ul>
        </div>
      </div>

      <div className="navbar-center flex flex-col">
        <Link to="/">
          <span className="btn btn-ghost normal-case text-xl text-black">
            ICST Hostel
          </span>
        </Link>
      </div>

      <div className="navbar-end">
        {user ? (
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-16 rounded-full bg-slate-600">
              <img
              src={userData?.photo || "https://ln.run/xHwDq"}
              alt={userData?.name || "User Profile"}
              className="w-28 h-28 rounded-full border-4 border-black"
            />
              </div>
            </label>
            <ul className="dropdown-content menu p-1 shadow  rounded-box">
              <li>
                {isLoggingOut ? (
                  // Show spinner when logging out
                  <button className="btn" disabled>
                    <span className="loading loading-spinner"></span> Logging Out...
                  </button>
                ) : (
                  // Show logout button when not logging out
                  <button className="bg-gray-800 text-white hover:bg-gray-700 transition" onClick={handleLogout}>
                    Signout
                  </button>
                )}
              </li>
            </ul>
          </div>
        ) : (
          <Link to="/login">
            <button className="btn">Login</button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;