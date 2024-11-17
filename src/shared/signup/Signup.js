import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import useTitle from "../useTitle/useTitle";
import { createUserAccount } from "../../backend/appwrite";
import "react-toastify/dist/ReactToastify.css";
import validator from "validator"; // Importing validator for email validation

const Signup = () => {
  useTitle("SignUp");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [isSigningUp, setIsSigningUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const navigate = useNavigate();

  // Handle sign-up
  const handleSignUp = async (data) => {
    setIsSigningUp(true);

    try {
      const { name, email, password } = data;

      // Check email validity using validator
      if (!validator.isEmail(email)) {
        toast.error(
          "❌ Invalid email format. Please enter a valid email address."
        );
        setIsSigningUp(false);
        return;
      }

      // Create the user account using Appwrite
      await createUserAccount(email, password, name);

      // Reset the form
      reset();
      toast.success("🎉 You are Successfully Signed Up!");

      // Navigate to login page
      navigate("/login");
    } catch (error) {
      console.error("Sign-up failed:", error);

      // Specific error handling based on Appwrite error codes
      if (error.code === 409) {
        toast.error(
          "⚠️ Email already exists. Please log in or use another email."
        );
      } else if (error.code === 422) {
        toast.error(
          "❌ Invalid email format. Please enter a valid email address."
        );
      } else if (error.code === 400 && error.message.includes("Password")) {
        toast.error("🔐 Weak password! Ensure it meets all requirements.");
      } else if (error.message.includes("network")) {
        toast.error(
          "📶 Network error! Please check your internet connection and try again."
        );
      } else {
        toast.error("❗ Failed to sign up. Please try again.");
      }
    } finally {
      setIsSigningUp(false);
    }
  };

  return (
<section className="min-h-screen bg-gray-50">
  <div className="flex flex-col items-center justify-center px-4 py-8 mx-auto min-h-screen">
    <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg space-y-6">
      <h2 className="text-2xl font-bold text-center text-gray-800">Create Account</h2>

      <form onSubmit={handleSubmit(handleSignUp)} className="space-y-6">
        {/* Name Field */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            type="text"
            {...register("name", {
              required: "Name is required",
              validate: (value) => value.trim() !== "" || "Name cannot be empty",
            })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your full name"
          />
          {errors.name && (
            <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Email Address
          </label>
          <input
            type="email"
            {...register("email", {
              required: "Email Address is required",
              pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your email"
          />
          {errors.email && (
            <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be 6 characters or longer",
                },
                validate: {
                  hasUppercase: (value) =>
                    /[A-Z]/.test(value) ||
                    "Password must have at least one uppercase letter.",
                  hasNumber: (value) =>
                    /\d/.test(value) ||
                    "Password must have at least one number.",
                  hasSpecialChar: (value) =>
                    /[!@#$%^&*]/.test(value) ||
                    "Password must have at least one special character (!@#$%^&*).",
                },
              })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Create a strong password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(prev => !prev)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? '👁️' : '👁‍🗨'}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-amber-600 mt-1">{errors.password.message}</p>
          )}
        </div>

        {/* Password Requirements */}
        <div className="text-xs text-gray-600 space-y-1">
          <p>Password must contain:</p>
          <ul className="list-disc pl-4 space-y-1">
            <li>At least 6 characters</li>
            <li>One uppercase letter</li>
            <li>One number</li>
            <li>One special character (!@#$%^&*)</li>
          </ul>
        </div>

        <button
          type="submit"
          disabled={isSigningUp}
          className={`w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors
            ${isSigningUp ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isSigningUp ? "Creating Account..." : "Create Account"}
        </button>
      </form>

      <p className="text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-blue-600 hover:text-blue-800 hover:underline"
        >
          Log in
        </Link>
      </p>
    </div>
  </div>
  <ToastContainer />
</section>
  );
};

export default Signup;
