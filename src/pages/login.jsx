import { useState } from "react";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

// import { baseUrl } from "../../utils/endpoints";
const baseUrl = "https://scriptiqserver-ugp0.onrender.com";

import { useNavigate } from "react-router-dom";
const Auth = () => {
  const [mode, setMode] = useState("login"); // "login" or "signup"
  const [userId, setUserId] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  // ============ Username/Password Login ============
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(baseUrl + "/login", {
        userId,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setError("");
      alert("Login successful!");
      navigate("/");
    } catch (err) {
      console.error("Login error", err);
      setError(err.response?.data?.message || "Login failed");
    }
  };

  // ============ Username/Password Signup ============
  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(baseUrl + "/signup", {
        userId,
        username,
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setError("");
      alert("Signup successful!");
    } catch (err) {
      console.error("Signup error", err);
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const googleUser = jwtDecode(credentialResponse.credential);

      const res = await axios.post(baseUrl + "/auth/google", {
        email: googleUser.email,
        username: googleUser.name,
        img: googleUser.picture,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      alert("Google login successful!");
      navigate("/");
    } catch (err) {
      console.error("Google login error", err);
      setError("Google login failed");
    }
  };

  return (
    <div className="flex flex-col capitalize  items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        {/* Toggle Buttons */}
        <div className="flex justify-center mb-4">
          <button
            onClick={() => setMode("login")}
            className={`px-4 py-2 rounded-l-lg ${
              mode === "login"
                ? "bg-blue-600 text-white"
                : "bg-gray-900 opacity-80 text-white"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setMode("signup")}
            className={`px-4 py-2 rounded-r-lg ${
              mode === "signup"
                ? "bg-blue-600 text-white"
                : "bg-gray-900 opacity-80 text-white"
            }`}
          >
            Signup
          </button>
        </div>

        {/* <h2 className="text-2xl font-bold mb-4 text-center">
          {mode === "login" ? "Login" : "Signup"}
        </h2> */}

        {/* Login Form */}
        {mode === "login" && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-lg font-medium">User ID</label>
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="Enter your user ID"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-400"
                required
              />
            </div>

            <div>
              <label className="block text-lg font-medium">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-400"
                required
              />
            </div>

            {error && <p className="text-red-500 text-lg">{error}</p>}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              Login
            </button>
          </form>
        )}

        {/* Signup Form */}
        {mode === "signup" && (
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-lg font-medium">User ID</label>
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="Choose a unique user ID"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-400"
                required
              />
            </div>

            <div>
              <label className="block text-lg font-medium">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your full name"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-400"
                required
              />
            </div>

            <div>
              <label className="block text-lg font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-400"
                required
              />
            </div>

            <div>
              <label className="block text-lg font-medium">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a strong password"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-400"
                required
              />
            </div>

            {error && <p className="text-red-500 text-lg">{error}</p>}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-900"
            >
              Signup
            </button>
          </form>
        )}

        {/* Divider */}
        <div className="my-4 flex items-center">
          <div className="flex-grow h-px bg-gray-300"></div>
          <span className="px-2 text-gray-500 text-lg">OR</span>
          <div className="flex-grow h-px bg-gray-300"></div>
        </div>

        {/* Google Login */}
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError("Google login failed")}
          />
        </div>
      </div>
    </div>
  );
};

export default Auth;
