import React, { useState } from "react";
import { updateNotice, deleteNotice } from "../../backend/appwrite"; // Import update and delete functions
import { toast } from 'react-hot-toast';

const EditnoticeCard = ({ notice, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(notice.notice_title);
  const [editedContent, setEditedContent] = useState(notice.notice_description);
  const [editedCategory, setEditedCategory] = useState(notice.notice_category);
  const [loading, setLoading] = useState(false);



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
    "Hostel Fee Increases or Changes",
    "Penalties for Late Payments",
    "Refund Policies",
    "Meal Timings and Menu Updates",
    "Wi-Fi Installation",
    "Water and Power Supply Interruptions",
    "Semester Breaks and Holidays",
    "Hostel Security Guidelines",
    "Visitor and Guest Policies",
    "Disciplinary Actions or Warnings"
  ];
  
  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    setLoading(true);
    try {
      const updatedNotice = await updateNotice(
        notice.$id,
        editedTitle,
        editedContent,
        editedCategory
      );
      setIsEditing(false);
      onUpdate(updatedNotice);
      toast.success("Notice updated successfully!");
    } catch (error) {
      console.error("Error updating notice:", error);
      toast.error("Failed to update notice.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setEditedTitle(notice.notice_title);
    setEditedContent(notice.notice_description);
    setEditedCategory(notice.notice_category);
  };

  const handleDeleteClick = async () => {
    if (window.confirm("Are you sure you want to delete this notice?")) {
      try {
        await deleteNotice(notice.$id);
        onDelete(notice.$id);
        toast.success("Notice deleted successfully!");
      } catch (error) {
        console.error("Error deleting notice:", error);
        toast.error("Failed to delete notice.");
      }
    }
  };

  return (
    <div className="max-w-sm mx-auto group bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105">
      <img
        role="presentation"
        className="object-cover w-full h-44 bg-gray-500"
        src={notice.image || "https://source.unsplash.com/random/480x360?3"}
        alt="Notice Image"
      />
      <div className="p-6 space-y-2">
        {!isEditing ? (
          <>
            <h3 className="text-2xl font-semibold text-blue-600 group-hover:underline">
              {notice.notice_title}
            </h3>
            <span className="text-xs text-gray-600">{notice.date}</span>
            <div className="p-4 bg-gray-100 rounded-md overflow-hidden" style={{ maxHeight: '6em' }}>
              <p className="line-clamp-6">{notice.notice_description}</p>
            </div>
            <div>
              <button
                onClick={handleEditClick}
                className="btn btn-secondary mx-3 bg-yellow-500 hover:bg-yellow-600 text-white"
              >
                Edit
              </button>
              <button
                onClick={handleDeleteClick}
                className="btn btn-error bg-red-500 hover:bg-red-600 text-white"
              >
                Delete
              </button>
            </div>
          </>
        ) : (
          <>
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="w-full p-3 rounded bg-gray-200 border border-gray-300 focus:outline-none focus:ring focus:ring-blue-300"
            />
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="w-full h-40 p-3 rounded bg-gray-200 border border-gray-300 focus:outline-none focus:ring focus:ring-blue-300 resize-none"
            ></textarea>

            <div>
              <label htmlFor="category" className="text-sm">Notice Category</label>
              <select
                id="category"
                value={editedCategory}
                onChange={(e) => setEditedCategory(e.target.value)}
                className="w-full p-3 rounded bg-gray-200 border border-gray-300 focus:outline-none focus:ring focus:ring-blue-300"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="flex justify-between mt-4">
              <button
                onClick={handleSaveClick}
                className={`btn btn-primary ${loading ? 'bg-blue-300' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={handleCancelClick}
                className="btn btn-secondary bg-gray-400 hover:bg-gray-500 text-white ml-2"
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EditnoticeCard;