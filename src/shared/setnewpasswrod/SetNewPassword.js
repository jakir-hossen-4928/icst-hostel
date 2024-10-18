import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { setNewPassword } from '../../backend/appwrite';
import { toast } from 'react-hot-toast';
import useTitle from '../useTitle/useTitle';

const SetNewPassword = () => {
  useTitle("Set New Password");
  const { register, handleSubmit, formState: { errors }, getValues } = useForm();
  const [resetError, setResetError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false); // State for new password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State for confirm password visibility
  const location = useLocation();
  const navigate = useNavigate();

  // Extract userId and secret from the URL
  const params = new URLSearchParams(location.search);
  const userId = params.get("userId");
  const secret = params.get("secret");

  const handleSetNewPassword = async (data) => {
    setLoading(true);
    setResetError("");
    try {
      await setNewPassword(userId, secret, data.newPassword, data.confirmPassword);
      toast.success("Password reset successfully!");
      navigate("/login"); // Redirect to login after successful reset
    } catch (error) {
      setResetError("Failed to reset the password. Please try again.");
      toast.error("Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: "rgba(235, 241, 252)" }} className="py-20 min-h-screen">
      <section className="flex flex-col max-w-4xl mx-auto overflow-hidden md:rounded-lg md:shadow-lg md:flex-row md:h-48">
        <div className="md:flex md:items-center md:justify-center md:w-1/2 md:bg-gray-700">
          <div className="px-6 py-6 md:px-8 md:py-0">
            <h2 className="text-lg font-bold text-white">
              <span className="text-gray-300">Set your new password</span>
            </h2>
          </div>
        </div>

        <div className="flex items-center justify-center pb-6 md:py-0 md:w-1/2 md:bg-white">
          <form onSubmit={handleSubmit(handleSetNewPassword)} className="w-full px-4 py-6">
            <div className="flex flex-col space-y-4">
              {/* New Password Field */}
              <div className="flex flex-col relative">
                <input
                  className="px-6 py-2 text-black placeholder-gray-500 bg-white rounded-lg outline-none transition duration-200 focus:ring-2 focus:ring-blue-500 border"
                  type={showNewPassword ? "text" : "password"}
                  {...register("newPassword", {
                    required: "New password is required",
                    minLength: { value: 6, message: "Password must be at least 6 characters" },
                  })}
                  placeholder="Enter your new password"
                />
                <span
                  onClick={() => setShowNewPassword(prev => !prev)}
                  className="absolute right-4 top-2 cursor-pointer"
                >
                  {showNewPassword ? '👁️' : '👁‍🗨'} {/* Eye icon */}
                </span>
                {errors.newPassword && (
                  <p className="text-red-600 text-sm mt-1">{errors.newPassword.message}</p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="flex flex-col relative">
                <input
                  className="px-6 py-2 text-black placeholder-gray-500 bg-white rounded-lg outline-none transition duration-200 focus:ring-2 focus:ring-blue-500 border"
                  type={showConfirmPassword ? "text" : "password"}
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) => value === getValues('newPassword') || "Passwords do not match",
                  })}
                  placeholder="Confirm your new password"
                />
                <span
                  onClick={() => setShowConfirmPassword(prev => !prev)}
                  className="absolute right-4 top-2 cursor-pointer"
                >
                  {showConfirmPassword ? '👁️' : '👁‍🗨'} {/* Eye icon */}
                </span>
                {errors.confirmPassword && (
                  <p className="text-red-600 text-sm mt-1">{errors.confirmPassword.message}</p>
                )}
              </div>

              <button
                className={`px-4 py-3 text-sm font-medium tracking-wider text-white uppercase transition-colors duration-300 transform bg-slate-700 rounded-md hover:bg-gray-600 focus:bg-gray-600 focus:outline-none ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                type="submit"
                disabled={loading}
              >
                {loading ? 'Setting Password...' : 'Set Password'}
              </button>
            </div>

            {resetError && (
              <p className="text-red-600 py-3">{resetError}</p>
            )}
          </form>
        </div>
      </section>
    </div>
  );
};

export default SetNewPassword;
