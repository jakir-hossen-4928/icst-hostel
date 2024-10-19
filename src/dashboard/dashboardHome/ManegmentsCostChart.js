import React, { useEffect, useState, useRef } from 'react';
import { getManagementCosts } from '../../backend/appwrite'; // Adjust the import path according to your structure
import ApexCharts from 'apexcharts'; // Ensure you have apexcharts installed

const ManagementCostChart = () => {
    const [managementData, setManagementData] = useState([]);
    const [allData, setAllData] = useState([]); // To store all data
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterMonth, setFilterMonth] = useState(""); // To store the selected month
    const chartRef = useRef(null); // Ref to hold the chart instance

    // Define current month based on the current date
    const currentDate = new Date();
    const currentMonth = `${currentDate.toLocaleString('default', { month: 'long' })}-${currentDate.getFullYear()}`;

    useEffect(() => {
        const fetchManagementCosts = async () => {
            try {
                const data = await getManagementCosts();
                if (Array.isArray(data)) {
                    const parsedData = data.map(item => ({
                        ...item,
                        accounted_month: item.accounted_month, // Ensure month is available for filtering
                        previousStock: item.previousStock,
                        stdTotalCollection: item.stdTotalCollection,
                        teacherCollection: item.teacherCollection,
                        totalCost: item.totalCost,
                        totalMealsServed: item.totalMealsServed,
                        guestTaka: item.guestTaka,
                        perMealCost: item.perMealCost,
                        currentStock: item.currentStock,
                        others: item.others,
                    }));

                    const sortedData = parsedData.sort((a, b) => new Date(`1 ${b.accounted_month}`) - new Date(`1 ${a.accounted_month}`));
                    setAllData(sortedData); // Store all data

                    // Filter to show the current or latest month's data
                    const filteredData = sortedData.filter(item => item.accounted_month === (filterMonth || currentMonth));
                    setManagementData(filteredData.length ? filteredData : [sortedData[0]]); // Default to the latest month if no match

                    setLoading(false);
                }
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchManagementCosts();
    }, [filterMonth]);

    useEffect(() => {
        if (!loading && managementData.length > 0) {
            renderChart();
        }
    }, [loading, managementData]);

    const renderChart = () => {
        if (chartRef.current) {
            chartRef.current.destroy(); // Destroy existing chart instance
        }

        const pieChartData = [
            managementData.reduce((acc, item) => acc + item.previousStock, 0),
            managementData.reduce((acc, item) => acc + item.stdTotalCollection, 0),
            managementData.reduce((acc, item) => acc + item.teacherCollection, 0),
            managementData.reduce((acc, item) => acc + item.totalCost, 0),
            managementData.reduce((acc, item) => acc + item.totalMealsServed, 0),
            managementData.reduce((acc, item) => acc + item.guestTaka, 0),
            managementData.reduce((acc, item) => acc + item.perMealCost, 0),
            managementData.reduce((acc, item) => acc + item.currentStock, 0),
            managementData.reduce((acc, item) => acc + item.others, 0),
        ];

        const labels = ['Previous Stock', 'Standard Collection', 'Teacher Collection', 'Total Cost', 'Total Meals Served', 'Guest Taka', 'Per Meal Cost', 'Current Stock', 'Others'];

        const chartOptions = {
            series: pieChartData,
            colors: ["#1C64F2", "#16BDCA", "#9061F9", "#FFBB28", "#FF8042", "#FF637D", "#6A5ACD", "#FF4500", "#32CD32"],
            chart: {
                height: 420,
                width: "100%",
                type: "pie",
                events: {
                    dataPointSelection(event, chartContext, config) {
                        const selectedIndex = config.dataPointIndex;
                        alert(`You clicked on ${labels[selectedIndex]} with value ${pieChartData[selectedIndex]}`);
                    },
                },
            },
            stroke: {
                colors: ["white"],
            },
            plotOptions: {
                pie: {
                    labels: {
                        show: true,
                    },
                    dataLabels: {
                        offset: -25,
                    },
                },
            },
            labels,
            dataLabels: {
                enabled: true,
                style: {
                    fontFamily: "Inter, sans-serif",
                },
            },
            legend: {
                position: "bottom",
                fontFamily: "Inter, sans-serif",
            },
        };

        chartRef.current = new ApexCharts(document.getElementById("pie-chart"), chartOptions);
        chartRef.current.render();
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 rounded-full animate-pulse bg-gray-600"></div>
                    <div className="w-4 h-4 rounded-full animate-pulse bg-gray-600"></div>
                    <div className="w-4 h-4 rounded-full animate-pulse bg-gray-600"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return <p className="text-center text-red-500">Error: {error}</p>;
    }

    // Extract unique months from allData for the filter
    const uniqueMonths = [...new Set(allData.map(item => item.accounted_month))].sort((a, b) => new Date(`1 ${b}`) - new Date(`1 ${a}`));

    return (
        <div className="flex justify-center items-center min-h-screen p-6">
            <div className="bg-white shadow-lg rounded-lg p-8 max-w-4xl w-full">
                <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">
                    Management Costs Overview
                </h1>

                {/* Month Filter Dropdown */}
                <div className="mb-6">
                    <div className="flex flex-col">
                        <label htmlFor="filter-month" className="font-medium mb-1">Filter by Month:</label>
                        <select
                            id="filter-month"
                            value={filterMonth || currentMonth}
                            onChange={(e) => setFilterMonth(e.target.value)}
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

                {/* Pie Chart Section */}
                <div id="pie-chart" className="flex flex-col items-center" />
            </div>
        </div>
    );
};

export default ManagementCostChart;
