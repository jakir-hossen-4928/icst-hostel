import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import Select from "react-select";
import "react-toastify/dist/ReactToastify.css";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import {
  getUserData,
  updateStudentProfile,
  changeUserPassword,
} from "../../backend/appwrite"; // Removed upload and delete functions
import useTitle from "../../shared/useTitle/useTitle";

const imageHostKey = process.env.REACT_APP_imgbb_key;

console.log('Image Host Key:', imageHostKey);


const StudentProfile = () => {
  useTitle("Profile");
  const [userData, setUserData] = useState({
    name: "",
    photo: "",
    number: "",
    fatherNumber: "",
    motherNumber: "",
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
  const [isUploading, setIsUploading] = useState(false);
  const [isPhotoUploading, setIsPhotoUploading] = useState(false); // For photo upload// For image upload

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
    { value: 601, label: " Room601" },
    { value: 602, label: " Room602" },
    { value: 603, label: " Room603" },
    { value: 604, label: " Room604" },
    // Add more rooms as needed
  ];

  // Fetch user data on component mount
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
    if (!originalData) return false;

    return (
      userData.name !== originalData.name ||
      userData.photo !== originalData.photo ||
      userData.number !== originalData.number ||
      userData.fatherNumber !== originalData.fatherNumber ||
      userData.motherNumber !== originalData.motherNumber ||
      userData.roomNumber !== originalData.roomNumber ||
      userData.semester !== originalData.semester
    );
  };

  const handleInputChange = (e) => {
    if (!e.target) return; // Prevent destructuring error
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

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) {
      toast.error("No file selected.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size exceeds the limit of 5 MB.");
      return;
    }

    setIsPhotoUploading(true); // Disable update profile button
    setIsUploading(true);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${imageHostKey}`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        const data = await response.json();
        const imageUrl = data.data.url;
        const imageId = data.data.id; // Get the image ID
        const deleteUrl = data.data.delete_url; // Get the delete URL

        // Store both old and new image URLs in localStorage
        const oldImageUrl = localStorage.getItem("studentImageUrl");
        localStorage.setItem("oldImageUrl", oldImageUrl); // Store old photo URL
        localStorage.setItem("studentImageUrl", imageUrl); // Store new photo URL

        setUserData({ ...userData, photo: imageUrl }); // Update photo URL in state
        toast.success("Image uploaded successfully!");
      } else {
        toast.error("Error uploading image to ImgBB.");
      }
    } catch (error) {
      toast.error("Error uploading image.");
    } finally {
      setIsUploading(false);
      // Re-enable update profile button after upload attempt
      setIsPhotoUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if any field has been updated
    if (!hasUpdates()) {
      toast.error("Please complete at least one field before updating.");
      return;
    }

    setIsLoading(true);

    try {
      // Retrieve image URL from localStorage if available
      const imgUrlFromStorage = localStorage.getItem("studentImageUrl");
      const oldImageUrl = localStorage.getItem("oldImageUrl"); // Get old photo URL
      if (imgUrlFromStorage) {
        setUserData({ ...userData, photo: imgUrlFromStorage });
      }

      // Validate that phone numbers are not the same
      if (
        userData.number === userData.fatherNumber ||
        userData.number === userData.motherNumber ||
        userData.fatherNumber === userData.motherNumber
      ) {
        toast.error("Phone numbers must be different.");
        return;
      }

      // Check for required fields
      if (
        !userData.name ||
        !userData.number ||
        !userData.room ||
        !userData.photo ||
        !userData.fatherNumber ||
        !userData.motherNumber
      ) {
        toast.error("Please complete all fields.");
        return;
      }

      // Update profile with new data; make sure the keys match your database attributes
      const updatedData = {
        name: userData.name,
        photo: userData.photo,
        number: userData.number,
        fatherNumber: userData.fatherNumber,
        motherNumber: userData.motherNumber,
        room: userData.room,
        semester: userData.semester,
      };

      await updateStudentProfile(userData.documentId, updatedData); // Ensure documentId is correctly set in userData
      toast.success("Profile updated successfully.");

      // If there was an old photo, delete it using the delete URL
      if (oldImageUrl) {
        const oldImageId = localStorage.getItem("oldImageId"); // Assuming you store the old image ID
        if (oldImageId) {
          const deleteResponse = await fetch(
            `https://api.imgbb.com/1/delete/${oldImageId}`,
            {
              method: "DELETE",
            }
          );

          if (!deleteResponse.ok) {
            toast.error("Old photo deletion failed.");
            console.log("not delted old phtoo");
          } else {
            toast.success("Old photo deleted successfully.");
          }
        }
      }

      localStorage.removeItem("studentImageUrl"); // Clear stored image URL after submission
      localStorage.removeItem("oldImageUrl"); // Clear stored old image URL
    } catch (error) {
      console.error("Error updating profile:", error.message);
      toast.error("Error updating profile.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen container mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gray-100 md:bg-transparent">
      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Profile Update Form */}
        <div className="bg-white p-6 md:p-10 rounded-2xl shadow-lg">
          <div className="flex flex-col md:flex-row items-center mb-6">
            <label htmlFor="photoInput" className="relative cursor-pointer">
              <div className="avatar">
                <div className="w-28 md:w-32 rounded-xl overflow-hidden transition-transform duration-300 ease-in-out hover:scale-110 hover:shadow-lg">
                  {userData.photo ? (
                    <img
                      src={userData.photo}
                      alt={userData.name || "User Profile"}
                      className="w-full h-full rounded-xl border-4 border-blue-400 transition-all duration-300 ease-in-out hover:border-blue-600"
                    />
                  ) : (
                    <div
                      className=" text-center inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                      role="status"
                    >
                      <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                        Loading...
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <input
                id="photoInput"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
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

          {/* Other input fields... */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-600 font-medium">
                Contact Number
              </label>
              <PhoneInput
                country={"bd"}
                type="text"
                name="number"
                value={userData.number}
                onChange={handleInputChange}
                inputClass="border-gray-300 rounded-md w-full h-[50px]"
                containerClass="rounded-md"
                buttonClass="bg-gray-200 rounded-l-md"
                dropdownClass="rounded-md"
              />
            </div>
            <div>
              <label className="block text-gray-600 font-medium">
                Room Number
              </label>
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

          {/* Father's and Mother's Numbers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <label className="block text-gray-600 font-medium">
                Father's Number
              </label>
              <PhoneInput
                country={"bd"}
                type="text"
                name="fatherNumber"
                value={userData.fatherNumber}
                onChange={handleInputChange}
                inputClass="border-gray-300 rounded-md w-full h-[50px]"
                containerClass="rounded-md"
                buttonClass="bg-gray-200 rounded-l-md"
                dropdownClass="rounded-md"
              />
            </div>
            <div>
              <label className="block text-gray-600 font-medium">
                Mother's Number
              </label>
              <PhoneInput
                country={"bd"}
                type="text"
                name="motherNumber"
                value={userData.motherNumber}
                onChange={handleInputChange}
                inputClass="border-gray-300 rounded-md w-full h-[50px]"
                containerClass="rounded-md"
                buttonClass="bg-gray-200 rounded-l-md"
                dropdownClass="rounded-md"
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
              value={
                userData.semester
                  ? {
                      value: userData.semester,
                      label: `Semester ${userData.semester}`,
                    }
                  : null
              } // Correctly set value
              onChange={(selectedOption) =>
                setUserData({ ...userData, semester: selectedOption.value })
              }
              placeholder={"Select Semester"}
              classNamePrefix={"select"}
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center md:justify-end mt-8">
            <button
              type="submit"
              className={`bg-blue-600 text-white px-6 py-3 rounded-lg transition duration-200 ease-in-out transform hover:bg-blue-700 hover:-translate-y-1 ${
                isLoading || isPhotoUploading
                  ? "opacity-50 cursor-not-allowed"
                  : ""
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
