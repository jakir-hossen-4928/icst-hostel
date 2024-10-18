import React, { useState, useEffect, useRef } from "react";
import { Link, Outlet } from "react-router-dom";
import AdminHeader from "../../dashboard/adminheader/AdminHeader";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUser, faMap, faComments, faBell, faAddressBook, faMoneyBillWave } from '@fortawesome/free-solid-svg-icons';

const Dash = () => {
  const routes = [
    { path: "/dashboard", name: "Home", icon: faHome },
    { path: "/dashboard/searchStudentInfo", name: "Students", icon: faUser },
    { path: "/dashboard/roomsmap", name: "Rooms Map", icon: faMap },
    { path: "/dashboard/managementcost", name: "Management Costs", icon: faMoneyBillWave },
    { path: "/dashboard/adminfeadbeak", name: "Review Feedback", icon: faComments },
    { path: "/dashboard/editnotice", name: "Notice", icon: faBell },
    { path: "/dashboard/displaycontact", name: "Contact List", icon: faAddressBook },
  ];

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Toggle Dropdown on Name click
  const handleNameClick = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close mobile menu after link click
  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
    document.getElementById('dashboard-drawer').checked = false;
  };

  const menuItems = (
    <>
      {routes.map((route, index) => (
        <li key={index}>
          <Link
            className="flex items-center space-x-3 text-gray-800 text-lg font-semibold transition duration-300 hover:text-teal-600"
            to={route.path}
            onClick={handleLinkClick}
          >
            <FontAwesomeIcon icon={route.icon} className="text-lg" />
            <span>{route.name}</span>
          </Link>
        </li>
      ))}
    </>
  );

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 via-teal-500 to-purple-500">
      <AdminHeader />
      <div className="drawer drawer-mobile">
        <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" checked={isMobileMenuOpen} onChange={(e) => setIsMobileMenuOpen(e.target.checked)} />
        <div className="drawer-content flex flex-col">

          <Outlet />
        </div>
        <div className="drawer-side bg-gray-300">
          <label htmlFor="dashboard-drawer" className="drawer-overlay"></label>
          <ul className="menu gap-4 p-4 w-80 text-base-content">{menuItems}</ul>
        </div>
      </div>
    </div>
  );
};

export default Dash;
