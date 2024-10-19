import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Select from "react-select"; // Import React Select
import {
  storeStudentData,
  uploadPhoto,
  fetchRooms,
  account,
} from "../../backend/appwrite";
import useTitle from "../useTitle/useTitle";

const AdditionalStudentDataForm = () => {
  useTitle('Submit Student Data');
  const navigate = useNavigate();
  const [photo, setPhoto] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [userEmail, setUserEmail] = useState(null);
  const [userName, setUserName] = useState(null);
  const [userId, setUserId] = useState(null);
  const [formData, setFormData] = useState({
    institute: null,
    roomNumber: null,
    contactNumber: "",
    semester: null,
  });

  const institutes = [
    { value: "Feni Computer Institute", label: "Feni Computer Institute" },
    {
      value: "Feni Polytechnic Institute",
      label: "Feni Polytechnic Institute",
    },
    {
      value: "Institute Of Computer Science And Technology (ICST)",
      label: "Institute Of Computer Science And Technology (ICST)",
    },
    {
      value: "Compact Polytechnic Institute",
      label: "Compact Polytechnic Institute",
    },
    {
      value: "Feni Ideal Polytechnic Institute - FIPI",
      label: "Feni Ideal Polytechnic Institute - FIPI",
    },
    {
      value: "Feni Government Technical School and College",
      label: "Feni Government Technical School and College",
    },
  ];

  // Fetch available rooms when the form loads
  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        const rooms = await fetchRooms();
        setAvailableRooms(rooms || []); // Default to an empty array if no rooms are returned
      } catch (error) {
        setAvailableRooms([]); // Default to an empty array on error
        toast.error("Failed to load available rooms.");
      }
    };
    fetchRoomData();
  }, []);

  // Fetch logged-in user information
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await account.get(); // Get current logged-in user details
        setUserEmail(user.email);
        setUserName(user.name);
        setUserId(user.$id);
      } catch (error) {
        toast.error("Failed to fetch user data.");
      }
    };
    fetchUserData();
  }, []);

  // Generate a unique 6-character alphanumeric student ID
  const generateStudentId = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase(); // Generates a 6-char alphanumeric ID
  };

  // Handle form submit
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Client-side validation checks
    if (!formData.institute) {
      toast.error("Please select your institute.");
      setIsSubmitting(false);
      return;
    }

    if (!formData.semester) {
      toast.error("Please select your semester.");
      setIsSubmitting(false);
      return;
    }

    if (!formData.contactNumber || formData.contactNumber.length !== 10) {
      toast.error("Please enter a valid contact number (10 digits).");
      setIsSubmitting(false);
      return;
    }

    if (!formData.roomNumber) {
      toast.error("Please select a room number.");
      setIsSubmitting(false);
      return;
    }

    if (!photo) {
      toast.error("Please upload a photo.");
      setIsSubmitting(false);
      return;
    }

    try {
      // Generate unique student ID
      const studentId = generateStudentId();

      // Ensure the contact number is stored with the country code
      const contactNumberWithCountryCode = `+880${formData.contactNumber}`;

      // Upload photo
      let photoUrl = await uploadPhoto(photo);

      // Store student data
      const studentData = {
        name: userName,
        email: userEmail,
        studentId, // Use generated unique student ID
        institute: formData.institute,
        number: contactNumberWithCountryCode,
        semester: parseInt(formData.semester, 10),
        room: parseInt(formData.roomNumber, 10),
        photo: photoUrl,
        userId,
      };

      console.log("Submitting student data:", studentData);

      await storeStudentData(studentData);

      toast.success("Student data submitted successfully!");
      navigate("/studentdashboard");
    } catch (error) {
      toast.error("Failed to submit student data.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      className="max-w-md mx-auto lg:max-w-lg lg:mx-auto p-6 m-4 bg-gray-100 rounded-lg shadow-lg space-y-4"
    >
      <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">
        Additional Student Data
      </h2>

      {/* Room Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Room Number
        </label>
        <Select
          options={availableRooms.map((room) => ({
            value: room.room_number,
            label: `Room ${room.room_number}`,
          }))}
          onChange={(selectedOption) =>
            setFormData({ ...formData, roomNumber: selectedOption?.value })
          }
          className={`mt-1 ${
            !formData.roomNumber ? "border-red-600" : "border-gray-300"
          } rounded-md`}
          placeholder="Select Room"
          menuPortalTarget={document.body}
          menuPosition="fixed"
          styles={{
            control: (provided) => ({
              ...provided,
              borderColor: !formData.roomNumber ? "red" : provided.borderColor,
              maxWidth: "100%",
            }),
            menu: (provided) => ({
              ...provided,
              zIndex: 9999,
              maxHeight: "250px",
              overflowY: "auto",
            }),
            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
          }}
        />
      </div>

      {/* Institute Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Institute
        </label>
        <Select
          options={institutes}
          onChange={(selectedOption) =>
            setFormData({ ...formData, institute: selectedOption.value })
          }
          className={`mt-1 ${
            !formData.institute ? "border-red-600" : "border-gray-300"
          } rounded-md`}
          placeholder="Select your Institute"
        />
      </div>

      {/* Contact Number Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Number
        </label>
        <div className="flex items-center mt-1 w-full">
          <span className="bg-gray-200 rounded-l-md px-3 py-2 text-gray-700">
            +880
          </span>
          <input
            type="text"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleInputChange}
            placeholder="Enter Contact Number"
            className={`border ${
              !formData.contactNumber ? "border-red-600" : "border-gray-300"
            } rounded-r-md p-2 w-full`}
          />
        </div>
      </div>

      {/* Photo Upload */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Photo</label>
        <div className="mt-1 w-full">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPhoto(e.target.files[0])}
            className="file-input file-input-bordered w-full max-w-md rounded-md"
          />
        </div>
      </div>

      {/* Semester Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Semester
        </label>
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
          onChange={(selectedOption) =>
            setFormData({ ...formData, semester: selectedOption.value })
          }
          className={`mt-1 ${
            !formData.semester ? "border-red-600" : "border-gray-300"
          } rounded-md`}
          placeholder="Select Semester"
          menuPlacement="top" // Set dropdown to open upwards
        />
        {!formData.semester && (
          <p className="text-red-600 text-sm">Semester selection is required</p>
        )}
      </div>

      <button
        type="submit"
        className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 ${
          isSubmitting ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
};

export default AdditionalStudentDataForm;
