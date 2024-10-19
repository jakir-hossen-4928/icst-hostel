  import React, { useState } from "react";
  import { createNotice } from "../../backend/appwrite"; // Import the createNotice function
  import { toast } from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import useTitle from '../../shared/useTitle/useTitle';

  const AddNotice = ({ onNoticePost }) => {
     useTitle('Add Notice');
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState(""); // Field for notice category
    const [date, setDate] = useState("");
    const [image, setImage] = useState(null); // Field for image upload
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    // List of allowed categories
    const categories = [
      "Hostel Rules and Guidelines",
      "Institute Policies",
      "Fee Payments",
      "Room Allocation",
      "Festivals",
      "Power Outages",
      "Water Supply Issues",
      "Safety Warnings",
      "Room Shifting Procedures",
      "Room Maintenance Schedules",
      "Fee Payment Deadlines",
      "Hostel Fee Changes",
      "Penalties for Late Payments",
      "Refund Policies",
      "Meal Timings and Menu Updates",
      "Wi-Fi Installation",
      "Water and Power Interruptions",
      "Semester Breaks and Holidays",
      "Hostel Security Guidelines",
      "Visitor Policies",
      "Disciplinary Actions"
    ];

    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsLoading(true); // Start loading

      try {
        // Create notice with title, description, category, date, and image file
        const newNotice = await createNotice(title, description, category, date, image);
        console.log("Notice created:", newNotice);

        // Clear the input fields
        resetForm();

        // Show a success message
        toast.success("Notice posted successfully!");
        navigate('/dashboard/editnotice');

        // Call the onNoticePost callback function if provided
        if (onNoticePost) {
          onNoticePost();
        }
      } catch (error) {
        console.error("Error creating notice:", error);
        toast.error("Failed to post notice. Please try again.");
      }

      setIsLoading(false); // End loading
    };

    const resetForm = () => {
      setTitle("");
      setDescription("");
      setCategory("");
      setDate("");
      setImage(null);
    };

    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-10">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Add a New Notice</h2>
        <form onSubmit={handleSubmit} noValidate className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-1">Notice Title</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300 transition duration-200"
              placeholder="Enter notice title"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-1">Notice Description</label>
            <textarea
              id="description"
              rows="3" // Initial height of the textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300 transition duration-200 resize-none" // Added resize-none to prevent manual resizing
              placeholder="Describe the notice..."
              style={{ minHeight: '100px', maxHeight: '300px' }} // Dynamic height range
              required
            ></textarea>
          </div>

          {/* Category selection moved back into the form */}
          <div className="md:col-span-full">
            <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-1">Notice Category</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300 transition duration-200"
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-semibold text-gray-700 mb-1">Notice Date</label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300 transition duration-200"
              required
            />
          </div>

          <div className="md:col-span-full">
            <label htmlFor="image" className="block text-sm font-semibold text-gray-700 mb-1">Upload Image</label>
            <input
              id="image"
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none transition duration-200"
            />
          </div>

          {isLoading && (
            <div className="flex justify-center col-span-full">
              <progress className="progress w-full max-w-xs" />
            </div>
          )}

          {/* Centering the button */}
          <div className="col-span-full flex justify-center">
            <button
              type="submit"
              className={`w-full max-w-xs p-3 text-sm font-bold tracking-wide uppercase rounded-md ${isLoading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} text-white transition duration-200`}
              disabled={isLoading}
            >
              {isLoading ? "Posting..." : "Post Notice"}
            </button>
          </div>
        </form>

        {/* Optional: Add a footer or additional information */}
        <p className="mt-4 text-center text-sm text-gray-500">
          All notices will be reviewed before being published.
        </p>
      </div>
    );
  };

  export default AddNotice;