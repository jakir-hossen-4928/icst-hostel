import React, { useContext, useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import StudentHeader from "../../studentDeshboard/studenthedar/StudentHeader";
import { AuthContext } from "../../context/AuthProvider";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faComments, faBell, faMoneyBillWave,faUser } from '@fortawesome/free-solid-svg-icons';
import { getUserData } from '../../backend/appwrite';
import Loading from '../../shared/loading/Loading';


const StudentDash = () => {
  const { user } = useContext(AuthContext);  // Context for logged-in user
  const [userData, setUserData] = useState(null);  // State to store user data
  const [loading, setLoading] = useState(true);    // State for loading indicator

  // Define navigation items with icons
  const navItems = [
    { name: "Home", path: "/studentdashboard", icon: faHome },
    { name: "Notice Board", path: "/studentdashboard/notice-board", icon: faBell },
    { name: "Feedback", path: "/studentdashboard/advice-complain", icon: faComments },
    { name: "Hostel & Meal Fee", path: "/studentdashboard/fees", icon: faMoneyBillWave },
    { name: "Profile Settings", path: "/studentdashboard/profile", icon: faUser },
  ];

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

  if (loading) {
    return <Loading ></Loading>;
  }

  return (
    <div className="flex flex-col h-screen m-0 p-0 bg-gradient-to-r from-blue-600 to-purple-500">
      <StudentHeader />

      <div className="drawer drawer-mobile flex-grow m-0 p-0">
        <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />

        <div className="drawer-side bg-gradient-to-r from-blue-600 to-purple-500 text-white w-80 shadow-lg m-0 p-0 hidden md:block"> {/* Hide on mobile */}
          <label htmlFor="dashboard-drawer" className="drawer-overlay"></label>

          <div className="flex flex-col items-center pt-5 bg-gradient-to-r from-blue-600 to-purple-500">
            <img
              src={userData?.photo || "https://ln.run/xHwDq"}
              alt={userData?.name || "User Profile"}
              className="w-28 h-28 rounded-full border-4 border-white"
            />
            <h2 className="mt-4 font-semibold text-lg">
              {userData?.name || "User Name"}
            </h2>
            {/* <p className="text-sm text-gray-200">
              {userData?.email || "user@example.com"}
            </p> */}
            <ul className="menu gap-4 p-0 text-white">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link
                    className="bg-white text-blue-700 mt-3 rounded-md p-4 font-semibold hover:bg-gray-100 hover:text-blue-600 transition duration-300 ease-in-out w-full flex justify-center items-center"
                    to={item.path}
                  >
                    <FontAwesomeIcon icon={item.icon} className="mr-2" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="drawer-content p-0 m-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default StudentDash;
