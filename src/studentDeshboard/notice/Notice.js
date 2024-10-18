import React, { useEffect, useState } from "react";
import { fetchNotices, fetchNoticeImage } from "../../backend/appwrite";
import Noticecard from "./Noticecard";
import NoticeModal from "./NoticeModal";
import Loading from "../../shared/loading/Loading";


const Notice = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNotice, setSelectedNotice] = useState(null); // State to track the selected notice

  useEffect(() => {
    const fetchAllNotices = async () => {
      try {
        // Fetch notices from Appwrite
        const fetchedNotices = await fetchNotices();

        // Fetch image URLs for notices and attach them to the notice data
        const noticesWithImages = await Promise.all(
          fetchedNotices.map(async (notice) => {
            if (notice.image) {
              const imageUrl = await fetchNoticeImage(notice.image);
              return { ...notice, imageUrl };
            }
            return notice;
          })
        );

        // Sort notices by date in descending order
        const sortedNotices = noticesWithImages.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        setNotices(sortedNotices);
      } catch (error) {
        console.error("Failed to fetch notices:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllNotices();
  }, []);

  const handleNoticeClick = (notice) => {
    setSelectedNotice(notice); // Set the clicked notice as selected
  };

  const closeModal = () => {
    setSelectedNotice(null); // Close the modal
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <section className="py-6 sm:py-12 min-h-screen bg-gray-100 text-gray-800">
      <div className="container p-6 mx-auto space-y-8">
        <div className="space-y-2 text-center">
          <h2 className="text-3xl font-extrabold underline">Notice Board</h2>
          <p className="font-serif text-1xl text-gray-600">All notices here</p>
        </div>
        <div className="grid grid-cols-1 gap-x-4 gap-y-8 md:grid-cols-2 lg:grid-cols-4">
          {notices.map((notice) => (
            <div key={notice.$id} onClick={() => handleNoticeClick(notice)}>
              <Noticecard notice={notice} />
            </div>
          ))}
        </div>
      </div>

      {/* Modal for displaying full notice */}
      {selectedNotice && (
        <NoticeModal notice={selectedNotice} onClose={closeModal} />
      )}
    </section>
  );
};

export default Notice;