import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { sendPasswordResetEmail } from '../../backend/appwrite';
import useTitle from '../useTitle/useTitle';

const ForgotPassword = () => {
  useTitle("Forgot Password");
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [resetError, setResetError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (data) => {
    setLoading(true);
    setResetError("");
    try {
      await sendPasswordResetEmail(data.email);
      toast.success("Password reset link sent! Check your email.");
    } catch (error) {
      setResetError("Failed to send password reset link. Please try again.");
      toast.error("Failed to send reset link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <section className="flex flex-col max-w-md w-full bg-white rounded-lg shadow-lg p-6 m-3">
        <div className="text-center mb-4">
          <h2 className="text-lg font-bold text-gray-900">
            Forgot your password?
          </h2>
        </div>

        <form onSubmit={handleSubmit(handleResetPassword)} className="w-full">
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col">
              <input
                className="px-4 py-2 text-black placeholder-gray-500 bg-white rounded-lg outline-none transition duration-200 focus:ring-2 focus:ring-blue-500 border"
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Invalid email format",
                  },
                })}
                placeholder="Enter your email"
                aria-label="Enter your email"
              />
              {errors.email && (
                <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            <button
              className={`px-4 py-3 text-sm font-medium tracking-wider text-white uppercase transition-colors duration-300 transform bg-slate-700 rounded-md hover:bg-gray-600 focus:bg-gray-600 focus:outline-none ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              type="submit"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </div>

          {resetError && (
            <p className="text-red-600 py-3">{resetError}</p>
          )}
        </form>
      </section>
    </div>
  );
};

export default ForgotPassword;