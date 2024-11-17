import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { setNewPassword } from '../../backend/appwrite';
import { toast } from 'react-hot-toast';
import useTitle from '../useTitle/useTitle';
import { Eye, EyeOff } from 'lucide-react';

const SetNewPassword = () => {
  useTitle("Set New Password");
  const { register, handleSubmit, formState: { errors }, getValues } = useForm();
  const [resetError, setResetError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);
  const userId = params.get("userId");
  const secret = params.get("secret");

  const handleSetNewPassword = async (data) => {
    setLoading(true);
    setResetError("");
    try {
      await setNewPassword(userId, secret, data.newPassword, data.confirmPassword);
      toast.success("Password reset successfully!");
      navigate("/login");
    } catch (error) {
      setResetError("Failed to reset the password. Please try again.");
      toast.error("Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className=" bg-gray-50">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gray-800 px-8 py-6">
            <h2 className="text-xl font-bold text-white">
              Set New Password
            </h2>
            <p className="text-gray-300 text-sm mt-2">
              Choose a strong password for your account
            </p>
          </div>

          <div className="p-8 space-y-6">
            <form onSubmit={handleSubmit(handleSetNewPassword)} className="space-y-6">
              {/* New Password Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <div className="relative">
                  <input
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                    type={showNewPassword ? "text" : "password"}
                    {...register("newPassword", {
                      required: "New password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters"
                      },
                      pattern: {
                        value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/,
                        message: "Password must contain at least one letter, one number and one special character"
                      }
                    })}
                    placeholder="Enter your new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(prev => !prev)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    aria-label={showNewPassword ? "Hide password" : "Show password"}
                  >
                    {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="text-sm text-red-600">{errors.newPassword.message}</p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                    type={showConfirmPassword ? "text" : "password"}
                    {...register("confirmPassword", {
                      required: "Please confirm your password",
                      validate: (value) => value === getValues('newPassword') || "Passwords do not match"
                    })}
                    placeholder="Confirm your new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(prev => !prev)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>
                )}
              </div>

              {/* Password Requirements */}
              <div className="space-y-2 text-sm text-gray-600">
                <p className="font-medium">Password requirements:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>At least 6 characters long</li>
                  <li>Contains at least one letter</li>
                  <li>Contains at least one number</li>
                  <li>Contains at least one special character (@$!%*#?&)</li>
                </ul>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full px-4 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors
                  ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Setting New Password...
                  </span>
                ) : (
                  'Set New Password'
                )}
              </button>
            </form>

            {resetError && (
              <div className="p-4 text-sm text-red-600 bg-red-50 rounded-lg">
                {resetError}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SetNewPassword;