import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faPaperPlane,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import {
  account,
  submitFeedback,
  fetchFeedbackByUserId,
} from "../../backend/appwrite";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdviceOrComplain = () => {
  const [activeTab, setActiveTab] = useState("pending");
  const [description, setDescription] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [category, setCategory] = useState("advice");
  const [user, setUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingFeedbackData, setPendingFeedbackData] = useState([]);
  const [resolvedFeedbackData, setResolvedFeedbackData] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch the current logged-in user when component loads
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await account.get();
        setUser(currentUser);
        console.log("User fetched:", currentUser);

        // Fetch user's pending and resolved feedback
        await loadFeedback(currentUser.$id);
      } catch (error) {
        toast.error("Failed to load user data.");
      }
    };
    fetchUser();
  }, []);

  // Function to load feedback data
  const loadFeedback = async (userId) => {
    setLoading(true);
    try {
      const feedbackData = await fetchFeedbackByUserId(userId, "pending");
      const resolvedData = await fetchFeedbackByUserId(userId, "resolved");

      setPendingFeedbackData(feedbackData);
      setResolvedFeedbackData(resolvedData);
    } catch (error) {
      toast.error("Failed to load feedback data.");
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission for feedback
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("User not found. Please log in.");
      return;
    }

    setIsSubmitting(true);

    try {
      await submitFeedback(description, category, dateTime, user);
      toast.success("Feedback submitted successfully!");

      // Reset form fields
      setDescription("");
      setDateTime("");
      setCategory("advice");

      // Reload feedback data
      await loadFeedback(user.$id);
    } catch (error) {
      toast.error("Failed to submit feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <ToastContainer />

      <div className="flex items-center overflow-x-auto mb-4 sm:flex-nowrap">
        <button
          onClick={() => setActiveTab("pending")}
          className={`flex items-center flex-shrink-0 px-5 py-3 space-x-2 border-b-2 border-transparent ${
            activeTab === "pending"
              ? "border-blue-500"
              : "hover:border-blue-500"
          } transition-colors duration-300 ease-in-out`}
        >
          <FontAwesomeIcon icon={faClock} className="w-5 h-5 text-blue-600" />
          <span className="text-lg font-semibold hidden sm:inline">
            Pending Feedback
          </span>
          <span className="text-sm font-semibold sm:hidden">Pending</span>
        </button>
        <button
          onClick={() => setActiveTab("resolve")}
          className={`flex items-center flex-shrink-0 px-5 py-3 space-x-2 border-b-2 border-transparent ${
            activeTab === "resolve"
              ? "border-blue-500"
              : "hover:border-blue-500"
          } transition-colors duration-300 ease-in-out`}
        >
          <FontAwesomeIcon
            icon={faInfoCircle}
            className="w-5 h-5 text-blue-600"
          />
          <span className="text-lg font-semibold hidden sm:inline">
            Resolved Feedback
          </span>
          <span className="text-sm font-semibold sm:hidden">Resolved</span>
        </button>
        <button
          onClick={() => setActiveTab("submit")}
          className={`flex items-center flex-shrink-0 px-5 py-3 space-x-2 border-b-2 border-transparent ${
            activeTab === "submit" ? "border-blue-500" : "hover:border-blue-500"
          } transition-colors duration-300 ease-in-out`}
        >
          <FontAwesomeIcon
            icon={faPaperPlane}
            className="w-5 h-5 text-blue-600"
          />
          <span className="text-lg font-semibold hidden sm:inline">
            Submit Feedback
          </span>
          <span className="text-sm font-semibold sm:hidden">Submit</span>
        </button>
      </div>

      {/* Tab Content */}
      <div
        className="w-full max-w-screen-md bg-white rounded-lg shadow-md p-4"
        style={{ minHeight: "400px", maxHeight: "400px", overflowY: "auto" }}
      >
        {loading && (
          <div className="flex justify-center items-center h-full">
            <div className="loader"></div>
          </div>
        )}

        {!loading && activeTab === "pending" && (
          <>
            <h3 className="text-xl font-semibold mb-2">Pending Feedback</h3>
            {pendingFeedbackData.length > 0 ? (
              pendingFeedbackData.map((feedback) => (
                <div
                  key={feedback.$id}
                  className="mb-4 p-4 border rounded-md shadow-sm"
                >
                  <p>
                    <strong>Description:</strong> {feedback.description}
                  </p>
                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(feedback.date).toLocaleString()}
                  </p>
                  <p>
                    <strong>Category:</strong> {feedback.category}
                  </p>
                </div>
              ))
            ) : (
              <p>No pending feedback available.</p>
            )}
          </>
        )}

        {!loading && activeTab === "resolve" && (
          <>
            <h3 className="text-xl font-semibold mb-2">Resolved Feedback</h3>
            {resolvedFeedbackData.length > 0 ? (
              resolvedFeedbackData.map((feedback) => (
                <div
                  key={feedback.$id}
                  className="mb-4 p-4 border rounded-md shadow-sm"
                >
                  <p>
                    <strong>Description:</strong> {feedback.description}
                  </p>
                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(feedback.date).toLocaleString()}
                  </p>
                  <p>
                    <strong>Category:</strong> {feedback.category}
                  </p>
                </div>
              ))
            ) : (
              <p>No resolved feedback available.</p>
            )}
          </>
        )}

        {!loading && activeTab === "submit" && (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
            <div className="mb-4 col-span-1">
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="description"
              >
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="textarea textarea-bordered w-full h-24 md:h-32"
                placeholder="Enter your advice or complaint here..."
                required
              />
            </div>

            <div className="mb-4 col-span-1">
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="datetime"
              >
                Date & Time
              </label>
              <input
                type="datetime-local"
                id="datetime"
                value={dateTime}
                onChange={(e) => setDateTime(e.target.value)}
                className="input input-bordered w-full"
                required
              />
            </div>

            <div className="mb-4 col-span-1 md:col-span-2">
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="category"
              >
                Category
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="select select-bordered w-full"
              >
                <option value="advice">Advice</option>
                <option value="complaint">Complaint</option>
              </select>
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className={`btn btn-primary btn-wide ${
                  isSubmitting ? "loading" : ""
                }`}
                disabled={isSubmitting}
              >
                Submit Feedback
              </button>
            </div>
          </form>
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
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .flex {
          display: flex;
        }

        .justify-center {
          justify-content: center;
        }

        .items-center {
          align-items: center;
        }

        .h-full {
          height: 100%;
        }
      `}</style>
    </div>
  );
};

export default AdviceOrComplain;