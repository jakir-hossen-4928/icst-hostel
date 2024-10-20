import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Select from "react-select";
import PhoneInput from "react-phone-input-2";
import 'react-phone-input-2/lib/style.css'; // Import the CSS for react-phone-input-2
import { storeStudentData, fetchRooms, account } from "../../backend/appwrite";
import useTitle from "../useTitle/useTitle";

const imageHostKey = '8214c397d8d128581e7bb4f84f230a86';

const AdditionalStudentDataForm = () => {
  useTitle('Submit Student Data');
  const navigate = useNavigate();
  const [photo, setPhoto] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [userEmail, setUserEmail] = useState(null);
  const [userName, setUserName] = useState(null);
  const [userId, setUserId] = useState(null);
  const [formData, setFormData] = useState({
    institute: null,
    roomNumber: null,
    contactNumber: "",
    fatherNumber: "",
    motherNumber: "",
    semester: null,
    imgUrl: "",
  });

  const institutes = [
    { value: "Feni Computer Institute", label: "Feni Computer Institute" },
    { value: "Feni Polytechnic Institute", label: "Feni Polytechnic Institute" },
    { value: "Institute Of Computer Science And Technology (ICST)", label: "Institute Of Computer Science And Technology (ICST)" },
    { value: "Compact Polytechnic Institute", label: "Compact Polytechnic Institute" },
    { value: "Feni Ideal Polytechnic Institute - FIPI", label: "Feni Ideal Polytechnic Institute - FIPI" },
    { value: "Feni Government Technical School and College", label: "Feni Government Technical School and College" },
  ];

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        const rooms = await fetchRooms();
        setAvailableRooms(rooms || []);
      } catch (error) {
        setAvailableRooms([]);
        toast.error("Failed to load available rooms.");
      }
    };
    fetchRoomData();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await account.get();
        setUserEmail(user.email);
        setUserName(user.name);
        setUserId(user.$id);
      } catch (error) {
        toast.error("Failed to fetch user data.");
      }
    };
    fetchUserData();
  }, []);

  const generateStudentId = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) {
      toast.error("No file selected.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5 MB limit
      toast.error("File size exceeds 5 MB. Please upload a smaller image.");
      return;
    }

    setPhoto(file);
    setIsUploading(true); // Start uploading

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
        setFormData({ ...formData, imgUrl: imageUrl });
        localStorage.setItem("studentImageUrl", imageUrl); // Store image URL in localStorage
        toast.success("Image uploaded successfully!");
      } else {
        toast.error("Error uploading image to ImgBB.");
      }
    } catch (error) {
      toast.error("Error uploading image.");
    } finally {
      setIsUploading(false); // End uploading
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Retrieve image URL from localStorage if available
    const imgUrlFromStorage = localStorage.getItem("studentImageUrl");
    if (imgUrlFromStorage) {
      setFormData({ ...formData, imgUrl: imgUrlFromStorage });
    }

    // Validate that phone numbers are not the same
    if (
      formData.contactNumber === formData.fatherNumber ||
      formData.contactNumber === formData.motherNumber ||
      formData.fatherNumber === formData.motherNumber
    ) {
      toast.error("Phone numbers must be different.");
      setIsSubmitting(false);
      return;
    }

    if (!formData.institute || !formData.semester || !formData.contactNumber || !formData.roomNumber || !formData.imgUrl || !formData.fatherNumber || !formData.motherNumber) {
      toast.error("Please complete all fields.");
      setIsSubmitting(false);
      return;
    }

    try {
      const studentId = generateStudentId();

      const studentData = {
        name: userName,
        email: userEmail,
        studentId,
        institute: formData.institute,
        number: formData.contactNumber,
        fatherNumber: formData.fatherNumber,
        motherNumber: formData.motherNumber,
        semester: parseInt(formData.semester, 10),
        room: parseInt(formData.roomNumber, 10),
        photo: formData.imgUrl,
        userId,
      };

      await storeStudentData(studentData);
      toast.success("Student data submitted successfully!");
      localStorage.removeItem("studentImageUrl"); // Remove image URL from localStorage after successful submission
      navigate("/studentdashboard");
    } catch (error) {
      toast.error("Failed to submit student data.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <form onSubmit={handleFormSubmit} className="max-w-md mx-auto lg:max-w-lg lg:mx-auto p-6 m-4 bg-gray-100 rounded-lg shadow-lg space-y-4">
      <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">Additional Student Data</h2>

      {/* Room Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Room Number</label>
        <Select
          options={availableRooms.map((room) => ({
            value: room.room_number,
            label: `Room ${room.room_number}`,
          }))}
          onChange={(selectedOption) =>
            setFormData({ ...formData, roomNumber: selectedOption?.value })
          }
          className="mt-1 rounded-md"
          placeholder="Select Room"
        />
      </div>

      {/* Institute Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Institute</label>
        <Select
          options={institutes}
          onChange={(selectedOption) =>
            setFormData({ ...formData, institute: selectedOption.value })
          }
          className="mt-1 rounded-md"
          placeholder="Select your Institute"
        />
      </div>

      {/* Contact Number Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Contact Number</label>
        <PhoneInput
          country={'bd'} // Default country code for Bangladesh
          value={formData.contactNumber}
          onChange={contactNumber => setFormData({ ...formData, contactNumber })}
          inputClass="border-gray-300 rounded-md w-full h-[50px]"
          containerClass="rounded-md"
          buttonClass="bg-gray-200 rounded-l-md"
          dropdownClass="rounded-md"
        />
      </div>

      {/* Father Number Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Father's Number</label>
        <PhoneInput
          country={'bd'} // Default country code for Bangladesh
          value={formData.fatherNumber}
          onChange={fatherNumber => setFormData({ ...formData, fatherNumber })}
          inputClass="border-gray-300 rounded-md w-full h-[50px]"
          containerClass="rounded-md"
          buttonClass="bg-gray-200 rounded-l-md"
          dropdownClass="rounded-md"
        />
      </div>

      {/* Mother Number Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Mother's Number</label>
        <PhoneInput
          country={'bd'} // Default country code for Bangladesh
          value={formData.motherNumber}
          onChange={motherNumber => setFormData({ ...formData, motherNumber })}
          inputClass="border-gray-300 rounded-md w-full h-[50px]"
          containerClass="rounded-md"
          buttonClass="bg-gray-200 rounded-l-md"
          dropdownClass="rounded-md"
        />
      </div>

      {/* Photo Upload */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Photo (Max 5MB)</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="file-input file-input-bordered w-full max-w-md rounded-md h-[50px]"
        />
      </div>

      {/* Semester Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Semester</label>
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
          className="mt-1 rounded-md w-full"
          placeholder="Select Semester"
          menuPlacement="top"
        />
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