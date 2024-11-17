import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Select from "react-select";
import PhoneInput from "react-phone-input-2";
import 'react-phone-input-2/lib/style.css'; // Import the CSS for react-phone-input-2
import { storeStudentData, fetchRooms, account } from "../../backend/appwrite";
import useTitle from "../useTitle/useTitle";

const imageHostKey = '8214c397d8d128581e7bb4f84f230a86';

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


const AdditionalStudentDataForm = () => {
  useTitle('Submit Student Data');
  const navigate = useNavigate();
  useTitle('Submit Student Data');
  const [photo, setPhoto] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
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
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto sm:max-w-lg lg:max-w-xl">
        <div className="bg-white px-6 py-8 rounded-xl shadow-lg space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Student Registration</h2>
            <p className="mt-2 text-sm text-gray-600">Please fill in all required information</p>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-6">
            {/* Room Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Room Number <span className="text-red-500">*</span>
              </label>
              <Select
                options={roomOptions}
                onChange={(selectedOption) =>
                  setFormData({ ...formData, roomNumber: selectedOption.value })
                }
                className="basic-select"
                classNamePrefix="select"
                placeholder="Select Room"
                isSearchable
                menuPortalTarget={document.body}
                styles={{
                  menuPortal: base => ({ ...base, zIndex: 9999 })
                }}
              />
            </div>

            {/* Institute Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Institute <span className="text-red-500">*</span>
              </label>
              <Select
                options={institutes}
                onChange={(selectedOption) =>
                  setFormData({ ...formData, institute: selectedOption.value })
                }
                className="basic-select"
                classNamePrefix="select"
                placeholder="Select your Institute"
                isSearchable
                menuPortalTarget={document.body}
                styles={{
                  menuPortal: base => ({ ...base, zIndex: 9999 })
                }}
              />
            </div>

            {/* Contact Numbers Section */}
            <div className="space-y-6">
              {/* Student Contact */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Your Contact Number <span className="text-red-500">*</span>
                </label>
                <PhoneInput
                  country={'bd'}
                  value={formData.contactNumber}
                  onChange={contactNumber => setFormData({ ...formData, contactNumber })}
                  containerClass="!w-full"
                  inputStyle={{
                    width: '100%',
                    height: '42px',
                    fontSize: '16px',
                    borderRadius: '0.375rem'
                  }}
                  buttonStyle={{
                    borderTopLeftRadius: '0.375rem',
                    borderBottomLeftRadius: '0.375rem'
                  }}
                />
              </div>

              {/* Father's Contact */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Father's Number <span className="text-red-500">*</span>
                </label>
                <PhoneInput
                  country={'bd'}
                  value={formData.fatherNumber}
                  onChange={fatherNumber => setFormData({ ...formData, fatherNumber })}
                  containerClass="!w-full"
                  inputStyle={{
                    width: '100%',
                    height: '42px',
                    fontSize: '16px',
                    borderRadius: '0.375rem'
                  }}
                  buttonStyle={{
                    borderTopLeftRadius: '0.375rem',
                    borderBottomLeftRadius: '0.375rem'
                  }}
                />
              </div>

              {/* Mother's Contact */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Mother's Number <span className="text-red-500">*</span>
                </label>
                <PhoneInput
                  country={'bd'}
                  value={formData.motherNumber}
                  onChange={motherNumber => setFormData({ ...formData, motherNumber })}
                  containerClass="!w-full"
                  inputStyle={{
                    width: '100%',
                    height: '42px',
                    fontSize: '16px',
                    borderRadius: '0.375rem'
                  }}
                  buttonStyle={{
                    borderTopLeftRadius: '0.375rem',
                    borderBottomLeftRadius: '0.375rem'
                  }}
                />
              </div>
            </div>

            {/* Photo Upload */}
            {/* Photo Upload */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Photo <span className="text-red-500">*</span>
                <span className="text-xs text-gray-500 ml-2">(Max 5MB)</span>
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                <div className="space-y-1 text-center">
                  {!formData.imgUrl ? (
                    <>
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                        >
                          <span>Upload a file</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            onChange={handleImageUpload}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                    </>
                  ) : (
                    <img
                      src={formData.imgUrl}
                      alt="Uploaded preview"
                      className="mx-auto h-32 w-32 rounded-full object-cover"
                    />
                  )}
                </div>
              </div>
            </div>


            {/* Semester Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Semester <span className="text-red-500">*</span>
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
                className="basic-select"
                classNamePrefix="select"
                placeholder="Select Semester"
                isSearchable
                menuPortalTarget={document.body}
                styles={{
                  menuPortal: base => ({ ...base, zIndex: 9999 })
                }}
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  "Submit Registration"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdditionalStudentDataForm;