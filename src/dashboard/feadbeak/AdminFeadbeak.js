import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faPaperPlane, faCheckCircle, faTrash } from '@fortawesome/free-solid-svg-icons';
import { fetchFeedback, resolveFeedback, deleteFeedback } from '../../backend/appwrite';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminFeedback = () => {
  const [activeTab, setActiveTab] = useState('advice');
  const [feedbackData, setFeedbackData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch feedback data on component mount
  useEffect(() => {
    const loadFeedback = async () => {
      setLoading(true);
      try {
        const feedback = await fetchFeedback(); // Fetch feedback from Appwrite
        setFeedbackData(feedback);
      } catch (error) {
        console.error("Error fetching feedback:", error);
      } finally {
        setLoading(false);
      }
    };
    loadFeedback();
  }, []);

  const handleResolve = async (id) => {
    if (!id) return;
    setLoading(true);
    try {
      await resolveFeedback(id);
      setFeedbackData(feedbackData.map(f =>
        f.$id === id ? { ...f, status: 'resolved' } : f
      ));
      toast.success("Feedback resolved successfully!");
    } catch (error) {
      console.error("Error resolving feedback:", error);
      toast.error("Failed to resolve feedback.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id) => {
    if (!id) return;
    setLoading(true);
    try {
      await deleteFeedback(id);
      setFeedbackData(feedbackData.filter(f => f.$id !== id));
      toast.success("Feedback removed successfully!");
    } catch (error) {
      console.error("Error removing feedback:", error);
      toast.error("Failed to remove feedback.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 ">
      <ToastContainer />

      {/* Responsive tab buttons */}
      <div className="grid grid-cols-2 gap-4 sm:flex sm:justify-between items-center overflow-x-auto mb-4 sm:flex-nowrap bg-white shadow-lg rounded-md p-2">
        {/* Advice Tab */}
        <button
          onClick={() => setActiveTab('advice')}
          className={`flex items-center px-5 py-3 text-white ${activeTab === 'advice' ? 'bg-blue-600' : 'bg-gray-500 hover:bg-blue-500'} transition-colors duration-300 rounded-lg`}
        >
          <FontAwesomeIcon icon={faPaperPlane} className="w-5 h-5 mr-2" />
          <span className="text-lg font-semibold">Advice</span>
        </button>
        {/* Complaint Tab */}
        <button
          onClick={() => setActiveTab('complaint')}
          className={`flex items-center px-5 py-3 text-white ${activeTab === 'complaint' ? 'bg-blue-600' : 'bg-gray-500 hover:bg-blue-500'} transition-colors duration-300 rounded-lg`}
        >
          <FontAwesomeIcon icon={faClock} className="w-5 h-5 mr-2" />
          <span className="text-lg font-semibold">Complaint</span>
        </button>
        {/* Resolve Tab */}
        <button
          onClick={() => setActiveTab('resolve')}
          className={`flex items-center px-5 py-3 text-white ${activeTab === 'resolve' ? 'bg-blue-600' : 'bg-gray-500 hover:bg-blue-500'} transition-colors duration-300 rounded-lg`}
        >
          <FontAwesomeIcon icon={faCheckCircle} className="w-5 h-5 mr-2" />
          <span className="text-lg font-semibold">Resolve</span>
        </button>
        {/* Remove Tab */}
        <button
          onClick={() => setActiveTab('remove')}
          className={`flex items-center px-5 py-3 text-white ${activeTab === 'remove' ? 'bg-blue-600' : 'bg-gray-500 hover:bg-blue-500'} transition-colors duration-300 rounded-lg`}
        >
          <FontAwesomeIcon icon={faTrash} className="w-5 h-5 mr-2" />
          <span className="text-lg font-semibold">Remove</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="w-full max-w-screen-md bg-white rounded-lg shadow-md p-4" style={{ minHeight: '400px', maxHeight: '400px', overflowY: 'auto' }}>
        {loading && (
          <div className="flex justify-center items-center h-full">
            <div className="loader"></div> {/* Simple loader */}
          </div>
        )}

        {!loading && (
          <>
            {activeTab === 'advice' && (
              <div>
                <h3 className="text-xl font-semibold mb-2 text-teal-700">Advice Feedback</h3>
                {feedbackData.filter(f => f.category === 'advice').map((feedback) => (
                  <div key={feedback.$id} className="mb-4 p-4 border rounded-md shadow-sm bg-gray-100">
                    <p><strong>Description:</strong> {feedback.description}</p>
                    <p><strong>Email:</strong> {feedback.email}</p>
                    <p><strong>Date:</strong> {new Date(feedback.date).toLocaleString()}</p>
                    <button onClick={() => handleRemove(feedback.$id)} className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300">Remove</button>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'complaint' && (
              <div>
                <h3 className="text-xl font-semibold mb-2 text-teal-700">Complaint Feedback</h3>
                {feedbackData.filter(f => f.category === 'complaint').map((feedback) => (
                  <div key={feedback.$id} className="mb-4 p-4 border rounded-md shadow-sm bg-gray-100">
                    <p><strong>Description:</strong> {feedback.description}</p>
                    <p><strong>Email:</strong> {feedback.email}</p>
                    <p><strong>Date:</strong> {new Date(feedback.date).toLocaleString()}</p>
                    <button onClick={() => handleRemove(feedback.$id)} className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300">Remove</button>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'resolve' && (
              <div>
                <h3 className="text-xl font-semibold mb-2 text-teal-700">Resolve Feedback</h3>
                {feedbackData.filter(f => f.status === 'pending').map((feedback) => (
                  <div key={feedback.$id} className="mb-4 p-4 border rounded-md shadow-sm bg-gray-100">
                    <p><strong>Description:</strong> {feedback.description}</p>
                    <p><strong>Email:</strong> {feedback.email}</p>
                    <p><strong>Date:</strong> {new Date(feedback.date).toLocaleString()}</p>
                    <button onClick={() => handleResolve(feedback.$id)} className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300">Resolve</button>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'remove' && (
              <div>
                <h3 className="text-xl font-semibold mb-2 text-teal-700">Remove Feedback</h3>
                {feedbackData.map((feedback) => (
                  <div key={feedback.$id} className="mb-4 p-4 border rounded-md shadow-sm bg-gray-100">
                    <p><strong>Description:</strong> {feedback.description}</p>
                    <p><strong>Email:</strong> {feedback.email}</p>
                    <p><strong>Date:</strong> {new Date(feedback.date).toLocaleString()}</p>
                    <button onClick={() => handleRemove(feedback.$id)} className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300">Remove</button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Spinner CSS */}
      <style jsx>{`
        .loader {
          border: 8px solid #f3f3f3; /* Light grey */
          border-top: 8px solid #3498db; /* Blue */
          border-radius: 50%;
          width: 50px;
          height: 50px;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AdminFeedback;
