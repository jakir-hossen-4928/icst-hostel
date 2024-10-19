import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import Select from "react-select";
import "react-toastify/dist/ReactToastify.css";
import {
  getUserData,
  updateStudentProfile,
  changeUserPassword,
  uploadPhoto,
  deletePhoto,
} from "../../backend/appwrite";
import useTitle from '../../shared/useTitle/useTitle';

const StudentProfile = () => {
   useTitle('Profile')
  const [userData, setUserData] = useState({
    name: "",
    photo: "",
    number: "",
    roomNumber: "",
    semester: "",
  });
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordUpdating, setIsPasswordUpdating] = useState(false);
  const [originalData, setOriginalData] = useState(null);
  const [isPhotoUploading, setIsPhotoUploading] = useState(false); // For photo upload
  const [isProfileUpdating, setIsProfileUpdating] = useState(false); // For profile update

  // Room number options
  const roomOptions = [
    { value: 202, label: "Room 202" },
    { value: 203, label: "Room 203" },
    { value: 204, label: "Room 204" },
    { value: 205, label: "Room 205" },
    { value: 206, label: "Room 206" },
    { value: 207, label: "Room 207" },
    { value: 302, label: "Room 302" },
    { value: 303, label: "Room 303" },
    { value: 304, label: "Room 304" },
    { value: 305, label: "Room 305" },
    { value: 306, label: "Room 306" },
    { value: 307, label: "Room 307" },
    { value: 402, label: "Room 402" },
    { value: 403, label: "Room 403" },
    { value: 404, label: "Room 404" },
    { value: 405, label: "Room 405" },
    { value: 406, label: "Room 406" },
    { value: 407, label: "Room 407" },
    { value: 501, label: "Room 501" },
    { value: 502, label: "Room 502" },
    { value: 503, label: "Room 503" },
    { value: 504, label: "Room 504" },
    { value: 505, label: "Room 505" },
    { value: 506, label: "Room 506" },
    { value: 507, label: "Room 507" },
    { value: 508, label: "Room 508" },
    { value: 509, label: "Room 509" },
    { value: 601, label: "Room 601" },
    { value: 602, label: "Room 602" },
    { value: 603, label: "Room 603" },
    { value: 604, label: "Room 604" },
];

  // Fetch user data and sessions on component mount
  useEffect(() => {
    async function fetchData() {
      try {
        const fetchedData = await getUserData();
        setUserData(fetchedData);
        setOriginalData(fetchedData);
      } catch (error) {
        console.error("Error fetching data:", error.message);
        toast.error("Error fetching data.");
      }
    }
    fetchData();
  }, []);

  const hasUpdates = () => {
    if (!originalData) return false; // Prevent checking if original data is not loaded

    // Check if any field is different from the original data
    return (
      userData.name !== originalData.name ||
      userData.photo !== originalData.photo ||
      userData.number !== originalData.number ||
      userData.roomNumber !== originalData.roomNumber ||
      userData.semester !== originalData.semester
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    if (name === "currentPassword") {
      setCurrentPassword(value);
    } else {
      setNewPassword(value);
    }
  };

  const handlePasswordUpdate = async () => {
    setIsPasswordUpdating(true);
    try {
      await changeUserPassword(currentPassword, newPassword);
      toast.success("Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
    } catch (error) {
      toast.error("Error updating password.");
    } finally {
      setIsPasswordUpdating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure that some data has changed before submitting
    if (!hasUpdates()) {
      toast.error("No changes made to update.");
      return;
    }

    setIsLoading(true);

    try {
      // Retrieve the photo URL from localStorage
      const photoUrl = localStorage.getItem("uploadedPhotoUrl") || userData.photo;

      const updatedData = {
        name: userData.name,
        photo: photoUrl, // Use photo URL from localStorage
        number: userData.number,
        room: userData.roomNumber,
        semester: userData.semester,
      };

      await updateStudentProfile(userData.documentId, updatedData);
      toast.success("Profile updated successfully.");

      // Clear localStorage after successful update
      localStorage.removeItem("uploadedPhotoUrl");
    } catch (error) {
      console.error("Error updating profile:", error.message);
      toast.error("Error updating profile.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        setIsPhotoUploading(true); // Set uploading state

        // Delete the previous photo if it exists
        if (userData.photo) {
          const photoId = userData.photo.split("/").slice(-2, -1)[0]; // Extract photoId from URL

          if (photoId) {
            try {
              await deletePhoto(photoId);
              console.log(`Deleted previous photo with ID: ${photoId}`);
            } catch (deleteError) {
              if (deleteError.message.includes("404")) {
                console.warn("Photo not found, skipping deletion.");
              } else {
                console.error(
                  "Error deleting previous photo:",
                  deleteError.message
                );
              }
            }
          }
        }

        // Upload the new photo and get the file URL
        const uploadedPhoto = await uploadPhoto(file);

        // Store the new photo URL in localStorage
        localStorage.setItem("uploadedPhotoUrl", uploadedPhoto.url);

        // Update UI to reflect the new photo but not trigger a profile update
        setUserData({
          ...userData,
          photo: uploadedPhoto.url, // Update photo URL for display
        });

        // Notify the user to click the "Update Profile" button to save changes
        toast.warning("Photo uploaded. Please click 'Update Profile' to save changes.");
      } catch (error) {
        console.error("Error uploading or deleting photo:", error.message);
        toast.error("Error uploading photo.");
      } finally {
        setIsPhotoUploading(false); // Reset uploading state
      }
    }
  };

  return (
    <div className="min-h-screen container mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gray-100 md:bg-transparent">
      <ToastContainer />
      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Profile Update Form */}
        <div className="bg-white p-6 md:p-10 rounded-2xl shadow-lg">
          <div className="flex flex-col md:flex-row items-center mb-6">
            <label htmlFor="photoInput" className="relative cursor-pointer">
              <div className="avatar">
                <div className="w-28 md:w-32 rounded-xl overflow-hidden transition-transform duration-300 ease-in-out hover:scale-110 hover:shadow-lg">
                  <img
                    src={userData.photo}
                    alt={userData.name || "User Profile"}
                    className="w-full h-full rounded-xl border-4 border-blue-400 transition-all duration-300 ease-in-out hover:border-blue-600"
                  />
                </div>
              </div>
              <input
                id="photoInput"
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
              <span className="absolute inset-0 bg-blue-600 opacity-0 hover:opacity-50 transition-opacity duration-300 ease-in-out rounded-xl"></span>
            </label>
            <div className="w-full md:ml-6 mt-4 md:mt-0">
              <label className="block text-gray-600 font-medium">Name</label>
              <input
                type="text"
                name="name"
                value={userData.name}
                onChange={handleInputChange}
                className="border-2 rounded-lg p-3 w-full mt-2 focus:outline-none focus:ring focus:ring-blue-300 transition duration-200 ease-in-out hover:shadow-md"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-600 font-medium">Number</label>
              <input
                type="text"
                name="number"
                value={userData.number}
                onChange={handleInputChange}
                className="border-2 rounded-lg p-3 w-full mt-2 focus:outline-none focus:ring focus:ring-blue-300 transition duration-200 ease-in-out hover:shadow-md"
              />
            </div>
            <div>
              <label className="block text-gray-600 font-medium">Room Number</label>
              <Select
                options={roomOptions}
                value={roomOptions.find(
                  (option) => option.value === userData.room
                )}
                onChange={(selectedOption) =>
                  setUserData({ ...userData, roomNumber: selectedOption.value })
                }
                placeholder="Select Room"
                classNamePrefix="select"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-gray-600 font-medium">Semester</label>
            <Select
              options={[
                { value: 1, label: "Semester 1" },
                { value: 2, label: "Semester 2" },
                { value: 3, label: "Semester 3" },
                { value: 4, label: "Semester 4" },
                { value: 5, label: "Semester 5" },
                { value: 6, label: "Semester 6" },
                { value: 7, label: "Semester 7" },
                { value: 8, label: "Semester 8" },
              ]}
              value={[
                { value: userData.semester, label: `Semester ${userData.semester}` },
              ]}
              onChange={(selectedOption) =>
                setUserData({ ...userData, semester: selectedOption.value })
              }
              menuPlacement="top"
              placeholder="Select Semester"
              classNamePrefix="select"
            />
          </div>

          <div className="flex justify-center md:justify-end mt-8">
  <button
    type="submit"
    className={`bg-blue-600 text-white px-6 py-3 rounded-lg transition duration-200 ease-in-out transform hover:bg-blue-700 hover:-translate-y-1 ${
      isLoading || isPhotoUploading ? "opacity-50 cursor-not-allowed" : ""
    }`}
    disabled={isLoading || isPhotoUploading} // Disable while photo uploading or profile updating
  >
    {isLoading ? "Processing..." : "Update Profile"}
  </button>
</div>



        </div>

        {/* Password Update Section */}
        <div className="bg-white p-6 md:p-10 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">
            Update Password
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <label className="block text-gray-600 font-medium">
                Current Password
              </label>
              <input
                type={showCurrentPassword ? "text" : "password"}
                name="currentPassword"
                value={currentPassword}
                onChange={handlePasswordChange}
                className="border-2 rounded-lg p-3 w-full mt-2 pr-10"
                placeholder="Enter current password"
              />
              <span
                onClick={() => setShowCurrentPassword((prev) => !prev)}
                className="absolute right-4 top-10 cursor-pointer"
              >
                {showCurrentPassword ? "👁️" : "👁‍🗨"}
              </span>
            </div>

            <div className="relative">
              <label className="block text-gray-600 font-medium">
                New Password
              </label>
              <input
                type={showNewPassword ? "text" : "password"}
                name="newPassword"
                value={newPassword}
                onChange={handlePasswordChange}
                className="border-2 rounded-lg p-3 w-full mt-2 pr-10"
                placeholder="Enter new password"
              />
              <span
                onClick={() => setShowNewPassword((prev) => !prev)}
                className="absolute right-4 top-10 cursor-pointer"
              >
                {showNewPassword ? "👁️" : "👁‍🗨"}
              </span>
            </div>
          </div>

          <div className="flex justify-end mt-8">
            <button
              onClick={handlePasswordUpdate}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg"
              disabled={isPasswordUpdating}
            >
              {isPasswordUpdating ? "Updating..." : "Update Password"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default StudentProfile;
