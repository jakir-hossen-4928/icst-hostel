import React, { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import useTitle from "../useTitle/useTitle";
import { loginUser, getUserRoleInTeam, checkUserProfileExists, account } from "../../backend/appwrite";
import { AuthContext } from '../../context/AuthProvider';

const Login = () => {
  useTitle("Log-In");
  const teamId = process.env.REACT_APP_TEAM_ID;
  const { register, formState: { errors }, handleSubmit, reset } = useForm();
  const { fetchUser } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false); // State for Remember Me checkbox

  const handleLogin = async (data) => {
    setIsLoggingIn(true);

    try {
      // Log in the user
      await loginUser(data.email, data.password);
      await fetchUser();

      // Get the current user's information
      const user = await account.get();

      // Check if user profile exists using user ID
      const userProfileExists = await checkUserProfileExists(user.$id);

      // Fetch roles for the team
      const roles = await getUserRoleInTeam(teamId);

      // Check user roles and navigate accordingly
      if (roles.includes("admin")) {
        navigate("/dashboard");
      } else if (userProfileExists) {
        navigate("/studentdashboard");
      } else {
        navigate(`/studentDataForm/${user.$id}`);
        toast.warning("Please complete your profile.");
      }

      reset();
      toast.success("Login successful!"); // Success message
    } catch (error) {
      // Handling specific error for invalid credentials
      if (error.message.includes("Invalid credentials")) {
        toast.error("Invalid email or password. Please try again."); // Error message
      } else {
        toast.error("An error occurred during login. Please try again."); // General error message
      }
      console.error("Login error:", error);
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <section className="min-h-screen bg-gray-50">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg space-y-6">
          <h2 className="text-2xl font-bold text-center text-gray-800">Welcome Back</h2>

          <form onSubmit={handleSubmit(handleLogin)} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                {...register("email", { required: "Email Address is required" })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your email"
              />
              {errors.email &&
                <p className="text-sm text-red-600 mt-1">{errors.email?.message}</p>
              }
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password", { required: "Password is required" })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? '👁️' : '👁‍🗨'}
                </button>
              </div>
              {errors.password &&
                <p className="text-sm text-red-600 mt-1">{errors.password?.message}</p>
              }
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(prev => !prev)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <Link
                to="/forgetpassword"
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className={`w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors
            ${isLoggingIn ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLoggingIn ? "Logging In..." : "Login"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600">
            New to Website?{" "}
            <Link
              to="/signup"
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              Create new Account
            </Link>
          </p>
        </div>
      </div>
      <ToastContainer />
    </section>
  );
};

export default Login;
