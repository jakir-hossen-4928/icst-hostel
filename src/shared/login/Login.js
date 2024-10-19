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
            const roles = await getUserRoleInTeam('6707cf82000f24efd40b');

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
        <section style={{ backgroundColor: "rgba(235, 241, 252)" }}>
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0 min-h-screen">
                <div className="p-7 bg-white border rounded-lg shadow-lg relative">
                    <h2 className="text-xl text-center mb-4">Login</h2>

                    <form onSubmit={handleSubmit(handleLogin)}>
                        <div className="form-control w-full max-w-xs">
                            <label className="label">
                                <span className="label-text">Email</span>
                            </label>
                            <input
                                type="email"
                                {...register("email", { required: "Email Address is required" })}
                                className="input input-bordered w-full max-w-xs"
                            />
                            {errors.email && <p className="text-red-600">{errors.email?.message}</p>}
                        </div>

                        <div className="form-control w-full max-w-xs relative">
                            <label className="label">
                                <span className="label-text">Password</span>
                            </label>
                            <input
                                type={showPassword ? "text" : "password"}
                                {...register("password", { required: "Password is required" })}
                                className="input input-bordered w-full max-w-xs"
                            />
                            <span
                                onClick={() => setShowPassword(prev => !prev)}
                                className="absolute right-4 top-10 cursor-pointer"
                            >
                                {showPassword ? '👁️' : '👁‍🗨'}
                            </span>
                            {errors.password && <p className="text-red-600">{errors.password?.message}</p>}
                        </div>

                        {/* Flex container for Remember Me and Forget Password */}
                        <div className="flex items-center justify-between w-full max-w-xs mt-4">
                            <label className="cursor-pointer label flex items-center">
                                <input
                                    type="checkbox"
                                    className="checkbox"
                                    checked={rememberMe}
                                    onChange={() => setRememberMe(prev => !prev)}
                                />
                                <span className="label-text ml-2">Remember Me</span>
                            </label>
                            <Link to="/forgetpassword" className="label-text text-blue-500 hover:underline">Forget Password?</Link>
                        </div>

                        <input
                            className={`btn text-white w-full bg-slate-700 ${isLoggingIn ? 'opacity-50 cursor-not-allowed' : ''}`}
                            value={isLoggingIn ? "Logging In..." : "Login"}
                            type="submit"
                            disabled={isLoggingIn}
                        />
                    </form>

                    <p>
                        New to Website?{" "}
                        <Link className="text-secondary" to="/signup">Create new Account</Link>
                    </p>
                </div>
            </div>
            <ToastContainer />
        </section>
    );
};

export default Login;
