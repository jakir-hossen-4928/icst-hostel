import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import FileUploadComponent from '../managmentcosts/FileUploadComponent';

const DashboardHome = () => {
    const teacherMealsData = [
        { name: "Arif Al Mahmud", totalMeals: 4, perMealCost: 29.96 },
        { name: "Md. Kalam", totalMeals: 0, perMealCost: 29.96 },
        { name: "Saikat Dev", totalMeals: 52, perMealCost: 29.96 },
        { name: "Ashraf Uddin Miraz", totalMeals: 38, perMealCost: 29.96 },
        { name: "Md. Rasel Hossain", totalMeals: 33, perMealCost: 29.96 },
        { name: "Abdur Razzak", totalMeals: 28, perMealCost: 29.96 },
        { name: "Ibrahim Khalil", totalMeals: 32, perMealCost: 29.96 },
        { name: "Nur Mohammed Shakil", totalMeals: 51, perMealCost: 29.96 },
        { name: "Asif Hossen Nipun", totalMeals: 21, perMealCost: 29.96 },
        { name: "Forhad Hossain Patwary", totalMeals: 0, perMealCost: 29.96 },
        { name: "Soriful Islam", totalMeals: 10, perMealCost: 29.96 },
        { name: "OFFICE", totalMeals: 636, perMealCost: 29.96 },
        { name: "Security Kalam", totalMeals: 25, perMealCost: 29.96 },
        { name: "Security Jashim", totalMeals: 36, perMealCost: 29.96 },
        { name: "Mazharul Islam", totalMeals: 0, perMealCost: 29.96 },
        { name: "MLSS", totalMeals: 0, perMealCost: 29.96 }
    ];

    const studentMealsData = [
        { roomNo: "202", deptName: "CST-8", totalMeals: 75 },
        { roomNo: "203", deptName: "CT-4", totalMeals: 70 },
        // Add more student meal data as needed
    ];

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h1 className="text-3xl font-extrabold text-center mb-8 text-gray-800">Dashboard Overview</h1>
            

            {/* Bar Chart for Total Meals Served by Teachers */}
            <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Total Meals Served by Teachers</h2>
                <BarChart width={600} height={300} data={teacherMealsData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="totalMeals" fill="#8884d8" />
                </BarChart>
            </div>

            {/* Bar Chart for Total Cost by Teacher */}
            <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Total Cost by Teacher</h2>
                <BarChart width={600} height={300} data={teacherMealsData.map(teacher => ({ ...teacher, totalCost: teacher.totalMeals * teacher.perMealCost }))} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="totalCost" fill="#82ca9d" />
                </BarChart>
            </div>

            {/* Bar Chart for Student Meals */}
            <div>
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Total Meals Served to Students</h2>
                <BarChart width={600} height={300} data={studentMealsData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="roomNo" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="totalMeals" fill="#ff7300" />
                </BarChart>
            </div>
        </div>
    );
}

export default DashboardHome;