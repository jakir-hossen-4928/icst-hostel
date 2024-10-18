import axios from "axios";
import React, { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";

const Apply = () => {
  const signatureRef = useRef(null);
  const [formData, setFormData] = useState({
    firstname: "",
    email: "",
    address: "",
    languages: false,
    gender: "",
    birthDay: "",
    birthMonth: "",
    birthYear: "",
    highSchool: "",
    graduationDate: "",
    schoolAddress: "",
    paymentMethod: "",
    signatureData: "",
  });

  const handleClearSignature = () => {
    signatureRef.current.clear();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const signatureData = signatureRef.current.toDataURL();

    // Prepare form data for submission
    const formDataToSubmit = {
      firstname: formData.firstname,
      email: formData.email,
      address: formData.address,
      languages: formData.languages,
      gender: formData.gender,
      birthDay: formData.birthDay,
      birthMonth: formData.birthMonth,
      birthYear: formData.birthYear,
      highSchool: formData.highSchool,
      graduationDate: formData.graduationDate,
      schoolAddress: formData.schoolAddress,
      paymentMethod: formData.paymentMethod,
      signatureData: signatureData,
    };

    try {
      // Send form data to server endpoint using Axios
      const response = await axios.post(
        "http://localhost:4000/submit-application",
        formDataToSubmit
      );

      if (response.status === 200) {
        // Form submission successful
        console.log("Application submitted successfully!");

        // Clear form data
        setFormData({
          firstname: "",
          email: "",
          address: "",
          languages: false,
          gender: "",
          birthDay: "",
          birthMonth: "",
          birthYear: "",
          highSchool: "",
          graduationDate: "",
          schoolAddress: "",
          paymentMethod: "",
          signatureData: "",
        });

        // Clear signature canvas
        signatureRef.current.clear();
      } else {
        // Form submission failed
        console.error("Failed to submit application.");
      }
    } catch (error) {
      console.error("Error submitting application:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "payment-method") {
      // Handle payment method change
      setFormData((prevFormData) => ({
        ...prevFormData,
        paymentMethod: value,
      }));
    } else if (
      name === "birth-day" ||
      name === "birth-month" ||
      name === "birth-year"
    ) {
      // Handle birth date change
      const birthDay = name === "birth-day" ? value : formData.birthDay;
      const birthMonth = name === "birth-month" ? value : formData.birthMonth;
      const birthYear = name === "birth-year" ? value : formData.birthYear;

      setFormData((prevFormData) => ({
        ...prevFormData,
        birthDay,
        birthMonth,
        birthYear,
      }));
    } else {
      // Handle other form field changes
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  return (
    <section className="p-6 bg-gray-400 text-gray-900">
      <form
        novalidate=""
        action=""
        onSubmit={handleSubmit}
        className="container flex flex-col mx-auto space-y-12 ng-untouched ng-pristine ng-valid"
      >
        <fieldset className="grid grid-cols-4 gap-6 p-6 rounded-md shadow-sm bg-gray-20">
          <div className="space-y-2 col-span-full lg:col-span-1">
            <p className="font-8xl font-extrabold">COLLEGE ADMISSIONS FORM</p>
            <p className="text-xs">Enter your admission information below</p>
          </div>
          <div className="grid grid-cols-6 gap-4 col-span-full lg:col-span-3">
            <div className="col-span-full sm:col-span-3">
              <label htmlFor="firstname" className="text-sm">
                Your Full Name
              </label>
              <input
                name="firstname"
                type="text"
                placeholder="full name"
                value={formData.firstname}
                onChange={handleChange}
                className="w-full h-12 rounded-md focus:ring focus:ring-opacity-75 focus:ring-lime-600 border-gray-300 text-gray-900"
              />
            </div>

            <div className="col-span-full sm:col-span-3">
              <label htmlFor="email" className="text-sm">
                Email
              </label>
              <input
                name="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full h-12 rounded-md focus:ring focus:ring-opacity-75 focus:ring-lime-600 border-gray-300 text-gray-900"
              />
            </div>

            <div className="col-span-full">
              <label htmlFor="address" className="text-sm">
                Address
              </label>
              <input
                name="address"
                type="text"
                placeholder="your current address"
                value={formData.address}
                onChange={handleChange}
                className="w-full h-12 rounded-md focus:ring focus:ring-opacity-75 focus:ring-lime-600 border-gray-300 text-gray-900"
              />
            </div>

            <div className="col-span-full sm:col-span-2">
              <label htmlFor="languages" className="text-sm">
                Do you speak any languages other than English?
              </label>
              <div className="flex items-center justify-center mt-2">
                <input
                  id="languages"
                  type="checkbox"
                  checked={formData.languages === true}
                  onChange={handleChange}
                  className="rounded-md focus:ring focus:ring-opacity-75 focus:ring-lime-600 border-gray-300 text-gray-900"
                />
                <label htmlFor="languages" className="ml-2">
                  Yes
                </label>
                <input
                  id="languages-no"
                  type="checkbox"
                  checked={formData.languages === false}
                  onChange={handleChange}
                  className="rounded-2xl  focus:ring focus:ring-opacity-75 focus:ring-lime-600 border-gray-300 text-gray-900 ml-4"
                />
                <label htmlFor="languages-no" className="ml-2">
                  No
                </label>
              </div>
            </div>

            <div className="col-span-full sm:col-span-2">
              <label htmlFor="gender" className="text-sm">
                Gender
              </label>
              <div className="flex items-center justify-center mt-2">
                <input
                  id="gender-male"
                  type="radio"
                  name="gender"
                  value="male"
                  className="rounded-md focus:ring focus:ring-opacity-75 focus:ring-lime-600 border-gray-300 text-gray-900"
                  checked={formData.gender === "male"}
                  onChange={handleChange}
                />
                <label htmlFor="gender-male" className="ml-2">
                  Male
                </label>
                <input
                  id="gender-female"
                  type="radio"
                  name="gender"
                  value="female"
                  className="rounded-md focus:ring focus:ring-opacity-75 focus:ring-lime-600 border-gray-300 text-gray-900 ml-4"
                  checked={formData.gender === "female"}
                  onChange={handleChange}
                />
                <label htmlFor="gender-female" className="ml-2">
                  Female
                </label>
              </div>
            </div>

            <div className="col-span-full sm:col-span-2">
              <label htmlFor="birth-day" className="text-sm">
                Birth Date
              </label>
              <div className="flex items-center mt-2">
                <select
                  id="birth-day"
                  className="w-1/3 h-12 rounded-md focus:ring focus:ring-opacity-75 focus:ring-lime-600 border-gray-300 text-gray-900 mr-2"
                  name="birth-day"
                  value={formData.birthDay}
                  onChange={handleChange}
                  required
                >
                  <option value="">Day</option>
                  {Array.from({ length: 31 }, (_, index) => (
                    <option key={index + 1} value={(index + 1).toString()}>
                      {index + 1}
                    </option>
                  ))}
                </select>
                <select
                  id="birth-month"
                  className="w-1/3 h-12 rounded-md focus:ring focus:ring-opacity-75 focus:ring-lime-600 border-gray-300 text-gray-900 mx-2"
                  name="birth-month"
                  value={formData.birthMonth}
                  onChange={handleChange}
                  required
                >
                  <option value="">Month</option>
                  {[
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July",
                    "August",
                    "September",
                    "October",
                    "November",
                    "December",
                  ].map((month, index) => (
                    <option key={index} value={(index + 1).toString()}>
                      {month}
                    </option>
                  ))}
                </select>
                <select
                  id="birth-year"
                  className="w-1/3 h-12 rounded-md focus:ring focus:ring-opacity-75 focus:ring-lime-600 border-gray-300 text-gray-900 ml-2"
                  name="birth-year"
                  value={formData.birthYear}
                  onChange={handleChange}
                  required
                >
                  <option value="">Year</option>
                  {Array.from({ length: 104 }, (_, index) => (
                    <option
                      key={index + 1920}
                      value={(index + 1920).toString()}
                    >
                      {2023 - index}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="col-span-full sm:col-span-3">
              <label htmlFor="high-school" className="text-sm">
                High School or Equivalent Name
              </label>
              <input
                id="high-school"
                name="highSchool" // Add the name attribute for the handleChange function to update the corresponding form data
                type="text"
                placeholder="High School Name"
                value={formData.highSchool}
                onChange={handleChange}
                className="w-full h-12 rounded-md focus:ring focus:ring-opacity-75 focus:ring-lime-600 border-gray-300 text-gray-900"
              />
            </div>

            <div className="col-span-full sm:col-span-3">
              <label htmlFor="graduation-date" className="text-sm">
                Graduation Date
              </label>
              <div className="flex items-center mt-2">
                <input
                  id="graduation-date"
                  name="graduationDate" // Add the name attribute for the handleChange function to update the corresponding form data
                  type="date"
                  className="w-full h-12 rounded-md focus:ring focus:ring-opacity-75 focus:ring-lime-600 border-gray-300 text-gray-900"
                  value={formData.graduationDate}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="col-span-full sm:col-span-3">
              <label htmlFor="school-address" className="text-sm">
                School Address
              </label>
              <input
                id="school-address"
                name="schoolAddress" // Add the name attribute for the handleChange function to update the corresponding form data
                type="text"
                placeholder="School Address"
                value={formData.schoolAddress}
                onChange={handleChange}
                className="w-full h-12 rounded-md focus:ring focus:ring-opacity-75 focus:ring-lime-600 border-gray-300 text-gray-900"
              />
            </div>

            <div className="col-span-full sm:col-span-2">
              <label htmlFor="payment-method" className="text-sm">
                Payment Method
              </label>
              <div className="flex items-center mt-2">
                <input
                  id="payment-method-inperson"
                  type="radio"
                  name="payment-method"
                  value="inperson"
                  className="rounded-md focus:ring focus:ring-opacity-75 focus:ring-lime-600 border-gray-300 text-gray-900"
                  checked={formData.paymentMethod === "inperson"}
                  onChange={handleChange}
                />
                <label htmlFor="payment-method-inperson" className="ml-2">
                  In Person at College
                </label>
                <input
                  id="payment-method-visa"
                  type="radio"
                  name="payment-method"
                  value="visa"
                  className="rounded-md focus:ring focus:ring-opacity-75 focus:ring-lime-600 border-gray-300 text-gray-900 ml-4"
                  checked={formData.paymentMethod === "visa"}
                  onChange={handleChange}
                />
                <label htmlFor="payment-method-visa" className="ml-2">
                  Visa via Mail
                </label>
              </div>
            </div>

            <div className="col-span-full">
              <label htmlFor="signature" className="text-sm">
                Signature
              </label>
              <div className="border border-gray-300 p-2">
                <SignatureCanvas
                  ref={signatureRef}
                  canvasProps={{
                    className: "w-full h-20 border border-gray-400",
                    // Add any additional styles or props to the canvas element
                  }}
                />
              </div>
              <button
                className="mt-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
                onClick={handleClearSignature}
              >
                Clear Signature
              </button>
            </div>
          </div>
        </fieldset>
        <div className="text-center">
          <button type="submit" className="btn btn-wide btn-primary">
            Submit Application
          </button>
        </div>
      </form>
    </section>
  );
};

export default Apply;
