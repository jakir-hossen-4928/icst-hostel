import React from 'react';
import { useForm } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { storeContactData } from '../../../backend/appwrite';

const Contact = () => {
  const {
    register,
    handleSubmit,
    reset,  // Add reset here
    formState: { isSubmitting, errors },
  } = useForm();

  const onSubmit = async (data) => {
    const contactData = {
      fullName: data.fullName,
      email: data.email,
      phoneNumber: `+880${data.phoneNumber}`,
      message: data.message,
    };

    try {
      await storeContactData(contactData.fullName, contactData.email, contactData.phoneNumber, contactData.message);
      toast.success('Contact data submitted successfully!');

      // Reset the form fields after successful submission
      reset();
    } catch (error) {
      console.error('Error submitting contact data:', error);
      toast.error('Error submitting contact data.');
    }
  };

  return (
    <section className="py-6 bg-gradient-to-r from-indigo-500 to-blue-500 text-gray-900">
      <ToastContainer />
      <div className="grid max-w-6xl grid-cols-1 px-6 mx-auto lg:px-8 md:grid-cols-2 md:divide-x bg-white rounded-lg shadow-lg p-8">
        <div className="py-6 md:py-0 md:px-6">
          <h1 className="text-4xl font-bold text-gray-800">Get in Touch</h1>
          <p className="pt-2 pb-4 text-gray-600">Institute Of Computer Science & Technology, Feni.</p>
          <div className="space-y-4">
            <p className="flex items-center text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mr-2 sm:mr-6">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
              </svg>
              <span>Institute Of Computer Science & Technology, Sadar Hospital Road, Feni</span>
            </p>
            <p className="flex items-center text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mr-2 sm:mr-6">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
              </svg>
              <span>Phone: +8801711342064</span>
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col bg-white py-6 space-y-6 md:py-0 md:px-6 shadow-md rounded-lg">
          {/* Full Name */}
          <label className="block">
            <span className="mb-1 text-gray-700">Full Name</span>
            <input
              type="text"
              placeholder="Enter your full name"
              {...register('fullName', { required: 'Full name is required' })}
              className={`block w-full rounded-md shadow-sm h-10 bg-gray-100 p-2 focus:outline-none focus:ring focus:ring-blue-300 ${errors.fullName ? 'border-red-500' : ''}`}
            />
            {errors.fullName && <span className="text-red-500">{errors.fullName.message}</span>}
          </label>

          {/* Phone Number */}
          <label className="block">
            <span className="mb-1 text-gray-700">Phone Number</span>
            <div className="flex items-center">
              {/* Country Code Dropdown */}
              <select
                defaultValue="+880"
                className="mr-2 rounded-md shadow-sm bg-gray-100 h-full p-2 focus:outline-none focus:ring focus:ring-blue-300"
                disabled
              >
                {/* Flag and Country Code using Unicode */}
                <option value="+880"> 🇧🇩 +880</option>
              </select>

              <input
                type="tel"
                placeholder="1234567890"
                {...register('phoneNumber', {
                  required: 'Phone number is required',
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: 'Phone number must be exactly 10 digits',
                  },
                })}
                className={`block w-full rounded-md shadow-sm h-full bg-gray-100 p-2 focus:outline-none focus:ring focus:ring-blue-300 ${errors.phoneNumber ? 'border-red-500' : ''}`}
              />
            </div>
            {errors.phoneNumber && <span className="text-red-500">{errors.phoneNumber.message}</span>}
          </label>

          {/* Email Address */}
          <label className="block">
            <span className="mb-1 text-gray-700">Email Address</span>
            <input
              type="email"
              placeholder="you@example.com"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: 'Email format is invalid',
                },
              })}
              className={`block w-full h-full rounded-md shadow-sm p-2 bg-gray-100 focus:outline-none focus:ring focus:ring-blue-300 ${errors.email ? 'border-red-500' : ''}`}
            />
            {errors.email && <span className="text-red-500">{errors.email.message}</span>}
          </label>

          {/* Message */}
          <label className="block">
            <span className="mb-1 text-gray-700">Message</span>
            <textarea
              rows="5"
              placeholder="Type your message here..."
              {...register('message', { required: 'Message is required' })}
              className={`border w-full rounded-md bg-gray-100 p-2 focus:outline-none focus:ring focus:ring-blue-300 ${errors.message ? 'border-red-500' : ''}`}
            ></textarea>
            {errors.message && <span className="text-red-500">{errors.message.message}</span>}
          </label>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`self-center px-8 py-3 text-lg rounded focus:ring hover:ring focus:ring-opacity-75 bg-blue-600 text-white ${isSubmitting ? 'opacity-50' : ''}`}
          >
            {isSubmitting ? 'Submitting...' : 'Send Message'}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Contact;