import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux"; // Import useDispatch to dispatch Redux actions
import { setLoginData} from "../utils/authSlice"; // Import login action

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const dispatch = useDispatch(); // Set up Redux dispatch
  const navigate = useNavigate();

  // Handle form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);  // Clear previous errors
    setSuccess(null); // Clear previous success messages

    // Prepare login data for API request
    const loginData = { email, password };

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      // If login was successful
      if (response.ok) {
        const data = await response.json();
        setSuccess("Login successful!"); // Set success message

        // Dispatch user login data (token, name, email, role) to Redux store
        dispatch(
          setLoginData({
            token: data.token,
            name: data.user.name,
            email: data.user.email,
            role: data.user.role,
          })
        );

        // Redirect based on user's role after a short delay
        setTimeout(() => {
          navigate(data.user.role === "manager" ? "/admin-dashboard" : "/user-dashboard");
        }, 1500); // 1.5-second delay before redirecting
      } else {
        // Handle error response from the server
        const errorData = await response.json();
        setError(errorData.error);
      }
    } catch (err) {
      setError("An error occurred. Please try again."); // Handle network errors
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Login</h2>
        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email Input */}
          <div>
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Login Button */}
          <div>
            <button
              type="submit"
              className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:bg-indigo-700"
            >
              Login
            </button>
          </div>

          {/* Success Message */}
          {success && <p className="text-green-500 text-center">{success}</p>}

          {/* Error Message */}
          {error && <p className="text-red-500 text-center">{error}</p>}

          {/* Signup Link */}
          <p className="text-center text-gray-600">
            Don't have an account?{" "}
            <Link to="/signup" className="text-indigo-600 hover:underline">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
