import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { getManagementCosts } from "../../backend/appwrite";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const ManagementCosts = () => {
  const [selectedId, setSelectedId] = useState(null);
  const [managementData, setManagementData] = useState([]); // Initialize as an array
  const [allData, setAllData] = useState([]); // Store all fetched data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterMonth, setFilterMonth] = useState("");

  // Define currentMonth based on the current date
  const currentDate = new Date();
  const currentMonth = `${currentDate.toLocaleString("default", {
    month: "long",
  })}-${currentDate.getFullYear()}`;

  useEffect(() => {
    const fetchManagementCosts = async () => {
      try {
        const data = await getManagementCosts(); // Fetch all data

        // Ensure data is an array and parse JSON fields
        if (Array.isArray(data)) {
          const parsedData = data.map((item) => ({
            ...item,
            shoppingData: JSON.parse(item.shoppingData || "[]"), // Parse shoppingData
            teacherMealsData: JSON.parse(item.teacherMealsData || "[]"), // Parse teacherMealsData
          }));

          // Sort the data by accounted_month to ensure the latest data is at the top
          const sortedData = parsedData.sort(
            (a, b) => new Date(`1 ${b.accounted_month}`) - new Date(`1 ${a.accounted_month}`)
          );

          setAllData(sortedData); // Store all data

          // Filter to show current or latest month's data
          let filteredData = sortedData.filter(
            (item) => item.accounted_month === (filterMonth || currentMonth)
          );

          // If no data for current month, show the most recent previous month
          if (!filteredData.length) {
            filteredData = [sortedData[0]]; // Use the latest available data
          }

          setManagementData(filteredData);
        }

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchManagementCosts();
  }, [filterMonth]); // Refetch when filterMonth changes

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex items-center justify-center space-x-2">
          <div className="w-4 h-4 rounded-full animate-pulse bg-white"></div>
          <div className="w-4 h-4 rounded-full animate-pulse bg-white"></div>
          <div className="w-4 h-4 rounded-full animate-pulse bg-white"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!managementData.length) {
    return (
      <p>
        No management data found for the selected month. Please select a
        different month.
      </p>
    );
  }

  // Extract unique months from all data
  const uniqueMonths = [
    ...new Set(allData.map((item) => item.accounted_month)), // Get all unique months
  ].sort((a, b) => new Date(`1 ${b}`) - new Date(`1 ${a}`)); // Sort by date in descending order

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <Link
        to="/dashboard/googelsheetsupload"
        className="navbar bg-gradient-to-r from-blue-300 via-teal-500 to-purple-300 my-5 shadow-lg rounded-lg transition-transform transform hover:scale-105"
      >
        <div className="flex-1 p-4">
          <h1 className="text-xl text-white font-bold">Upload Sheets</h1>
        </div>
        <div className="flex-none p-4">
          <h1 className="text-white">
            <FontAwesomeIcon icon={faPlus} className="h-5 w-5" />
          </h1>
        </div>
      </Link>

      {/* Filter Section */}
      <div className="mb-6">
        <div className="flex flex-col">
          <label htmlFor="filter-month" className="font-medium mb-1">
            Filter by Month:
          </label>
          <select
            id="filter-month"
            value={filterMonth || currentMonth} // Set default to currentMonth
            onChange={(e) => {
              setFilterMonth(e.target.value); // Update filterMonth on change
            }}
            className="p-2 border border-gray-300 rounded-md"
          >
            <option value="">Select Month</option>
            {uniqueMonths.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <motion.div
          className="bg-white p-4 md:p-6 shadow-lg rounded-lg cursor-pointer"
          layoutId="summary"
          onClick={() =>
            setSelectedId(selectedId === "summary" ? null : "summary")
          }
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: "300" }}
        >
          <h2 className="text-xl md:text-2xl font-semibold text-gray-700 mb-4">
            Summary
          </h2>
          <div className="flex justify-between p-2 border-b">
            <span className="font-medium">Current Stock:</span>
            <span>{managementData[0]?.currentStock || 0} tk</span>
          </div>
          <div className="flex justify-between p-2 border-b">
            <span className="font-medium">Previous Stock:</span>
            <span>{managementData[0]?.previousStock || 0} tk</span>
          </div>
          <div className="flex justify-between p-2 border-b">
            <span className="font-medium">Standard  Collection: </span>
            <span>{managementData[0]?.stdTotalCollection || 0} tk</span>
          </div>
          <div className="flex justify-between p-2 border-b">
            <span className="font-medium">Teacher's Collection:</span>
            <span>{managementData[0]?.teacherCollection || 0} tk</span>
          </div>
          <div className="flex justify-between p-2 border-b">
            <span className="font-medium">Others Cost:</span>
            <span>{managementData[0]?.others || 0} tk</span>
          </div>
          <div className="flex justify-between p-2 border-b">
            <span className="font-medium">Total Cost:</span>
            <span>{managementData[0]?.totalCost || 0} tk</span>
          </div>
        </motion.div>

        {/* Summary for Meals Section */}
        <motion.div
          className="bg-white p-4 md:p-6 shadow-lg rounded-lg cursor-pointer"
          layoutId="mealSummary"
          onClick={() =>
            setSelectedId(selectedId === "mealSummary" ? null : "mealSummary")
          }
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: "300" }}
        >
          <h2 className="text-xl md:text-2xl font-semibold text-gray-700 mb-4">
            Summary for Meals
          </h2>
          <div className="flex flex-col space-y-3">
            <p>
              <strong>Total Meals Served:</strong>{" "}
              {managementData[0]?.totalMealsServed || 0}
            </p>
            <p>
              <strong>Guest Taka Collected:</strong>{" "}
              {managementData[0]?.guestTaka || 0} tk
            </p>
            <p>
              <strong>Per Meal Cost:</strong>{" "}
              {managementData[0]?.perMealCost !== undefined
                ? managementData[0].perMealCost.toFixed(2)
                : "N/A"}{" "}
              tk
            </p>
            <p>
              <strong>Accounted Month: </strong>
              {managementData[0]?.accounted_month || "N/A"}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Shopping Data Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div
          className="bg-white p-4 md:p-6 shadow-lg rounded-lg cursor-pointer"
          layoutId="shoppingData"
          onClick={() =>
            setSelectedId(selectedId === "shoppingData" ? null : "shoppingData")
          }
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: "300" }}
        >
          <h2 className="text-xl md:text-2xl font-semibold text-gray-700 mb-4">
            Shopping Data
          </h2>
          <div className="overflow-x-auto">
            <table className="table-auto w-full bg-white text-sm border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border-b">Items</th>
                  <th className="p-2 border-b">Cost (tk)</th>
                </tr>
              </thead>
              <tbody>
                {managementData[0]?.shoppingData.length ? (
                  managementData[0]?.shoppingData.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-2">{item.date}</td>
                      <td className="p-2">{item.amount} tk</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={2} className="p-2 text-center">
                      No shopping data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Teacher Meals Data Section */}
        <motion.div
          className="bg-white p-4 md:p-6 shadow-lg rounded-lg cursor-pointer"
          layoutId="teacherMealsData"
          onClick={() =>
            setSelectedId(
              selectedId === "teacherMealsData" ? null : "teacherMealsData"
            )
          }
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: "300" }}
        >
          <h2 className="text-xl md:text-2xl font-semibold text-gray-700 mb-4">
          ICST Teacher's & Stuffs
          </h2>
          <div className="overflow-x-auto">
            <table className="table-auto w-full bg-white text-sm border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border-b">Designation</th>
                  <th className="p-2 border-b">Name</th>
                  <th className="p-2 border-b">Total Meals</th>

                  <th className="p-2 border-b">Total Cost</th>
                </tr>
              </thead>
              <tbody>
                {managementData[0]?.teacherMealsData.length ? (
                  managementData[0]?.teacherMealsData.map((teacher, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-2">{teacher.designation}</td>
                      <td className="p-2">{teacher.name}</td>
                      <td className="p-2">{teacher.totalMeals}</td>

                      <td className="p-2">
                        {teacher.totalCost ? teacher.totalCost.toFixed(2) : 0} tk
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={2} className="p-2 text-center">
                      No teacher meal data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ManagementCosts;
