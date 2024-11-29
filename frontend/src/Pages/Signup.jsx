import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setLoginData } from "../utils/authSlice"; // Import the login action

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Prepare the signup data
    const signupData = { name, email, password };

    try {
      // Make the POST request to the backend API
      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signupData),
      });

      // Check if signup was successful
      if (response.ok) {
        const data = await response.json();
        setSuccess(data.message);

        // Store the registered user info (token, name, email, role)
        const { token, user } = data;

        // Dispatch login action with the user credentials (to store in Redux and localStorage)
        dispatch(setLoginData({ token, ...user }));

        // Redirect to user dashboard based on role
        setTimeout(() => {
          if (user.role === "manager") {
            navigate("/admin-dashboard"); // Navigate to admin dashboard for manager role
          } else {
            navigate("/user-dashboard"); // Navigate to user dashboard for other roles
          }
        }, 2000); // Wait for 2 seconds before redirecting
      } else {
        const errorData = await response.json();
        setError(errorData.error);
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Sign Up</h2>
        <form onSubmit={handleSignup} className="space-y-6">
          {/* Name Input */}
          <div>
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

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

          {/* Signup Button */}
          <div>
            <button
              type="submit"
              className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:bg-indigo-700"
            >
              Sign Up
            </button>
          </div>

          {/* Success Message */}
          {success && <p className="text-green-500 text-center">{success}</p>}

          {/* Error Message */}
          {error && <p className="text-red-500 text-center">{error}</p>}

          {/* Login Link */}
          <p className="text-center text-gray-600">
            Already have an account?{" "}
            <a href="/login" className="text-indigo-600 hover:underline">
              Login
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
