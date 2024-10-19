import React, { useState, useEffect } from 'react';
import { fetchNotices } from "../../backend/appwrite"; // Import fetchNotices function from Appwrite
import EditnoticeCard from './EditnoticeCard';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import { toast } from 'react-hot-toast';
import useTitle from '../../shared/useTitle/useTitle';

const EditNotice = () => {
  useTitle('Edit Notice')
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const navigate = useNavigate(); // Initialize navigate for navigation

  useEffect(() => {
    fetchNoticesData();
  }, []);

  const fetchNoticesData = async () => {
    setLoading(true); // Set loading to true before fetching
    try {
      const notices = await fetchNotices(); // Fetch notices from Appwrite
      const sortedNotices = notices.sort((a, b) => new Date(b.date) - new Date(a.date));
      setNotices(sortedNotices);
    } catch (error) {
      console.error('Error fetching notices:', error);
      toast.error("Failed to load notices.");
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  const handleNoticeUpdate = (updatedNotice) => {
    setNotices((prevNotices) =>
      prevNotices.map((notice) =>
        notice.$id === updatedNotice.$id ? updatedNotice : notice
      )
    );
  };

  const handleNoticeDelete = (deletedNoticeId) => {
    setNotices((prevNotices) =>
      prevNotices.filter((notice) => notice.$id !== deletedNoticeId)
    );
  };

  const handleAddNoticeClick = () => {
    navigate('/dashboard/addnotice');
  };

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

  return (
    <div className='m-5'>
      <Link to='/dashboard/addnotice' className="navbar bg-gradient-to-r from-blue-300 via-teal-500 to-purple-300  my-5">
        <div className="flex-1">
          <button onClick={handleAddNoticeClick} className="btn btn-ghost text-xl text-white">Add new Notice</button>
        </div>
        <div className="flex-none">
          <button onClick={handleAddNoticeClick} className="btn btn-square btn-ghost">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block h-5 w-5 stroke-current">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v16m8-8H4"></path> {/* Plus icon path */}
            </svg>
          </button>
        </div>
      </Link>

      <div className="grid grid-cols-1 gap-x-4 gap-y-8 md:grid-cols-2 lg:grid-cols-4">
        {notices.map((notice) => (
          <EditnoticeCard
            key={notice.$id}
            notice={notice}
            onUpdate={handleNoticeUpdate}
            onDelete={handleNoticeDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default EditNotice;
