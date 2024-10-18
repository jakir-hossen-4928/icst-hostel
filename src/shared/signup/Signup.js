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
    <section style={{ backgroundColor: "rgba(235, 241, 252)" }}>
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0 min-h-screen">
        <div className="p-7 bg-white border rounded-lg shadow-lg">
          <h2 className="text-xl text-center">Sign Up</h2>
          <form onSubmit={handleSubmit(handleSignUp)}>
            {/* Name Field */}
            <div className="form-control w-full max-w-xs md:max-w-full">
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <input
                type="text"
                {...register("name", {
                  required: "Name is required",
                  validate: (value) =>
                    value.trim() !== "" || "Name cannot be empty",
                })}
                className="input input-bordered w-full"
              />
              {errors.name && (
                <p className="text-red-500">{errors.name.message}</p>
              )}
            </div>

            {/* Email Field */}
            <div className="form-control w-full max-w-xs md:max-w-full">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                className="input input-bordered w-full"
                type="email"
                {...register("email", {
                  required: "Email Address is required",
                  pattern:
                    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                })}
              />
              {errors.email && (
                <p className="text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="form-control w-full max-w-xs md:max-w-full relative">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
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
                className="input input-bordered w-full"
              />
              <span
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-4 top-10 cursor-pointer"
              >
                {showPassword ? "👁️" : "👁‍🗨"} {/* Eye icon */}
              </span>
              {errors.password && (
                <p className="text-green-600 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <input
              className={`btn text-white bg-slate-700 w-full mt-4 ${
                isSigningUp ? "opacity-50 cursor-not-allowed" : ""
              }`}
              value={isSigningUp ? "Processing..." : "Next ➡ "}
              type="submit"
              disabled={isSigningUp}
            />
          </form>

          <p>
            Already have an Account?
            <Link className="text-secondary p-2" to="/login">
              Please Login
            </Link>
          </p>
        </div>
      </div>
      <ToastContainer /> {/* ToastContainer for toast notifications */}
    </section>
  );
};

export default Signup;
