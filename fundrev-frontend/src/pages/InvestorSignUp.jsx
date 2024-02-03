import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const InvestorSignUp = () => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleSignUp = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:5000/signup/investor",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId, password }),
        }
      );

      if (response.ok) {
        alert("Sign up successful!");
        // Redirect or perform any other actions upon successful sign-up
      } else {
        const errorMessage = await response.text();
        alert(`Sign up failed: ${errorMessage}`);
      }
    } catch (error) {
      console.error("Error during sign-up:", error.message);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-semibold mb-4">Investor Sign Up</h2>
      <label className="block text-sm font-medium text-gray-600 mb-1">
        User ID:
      </label>
      <input
        type="text"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-md mb-3 focus:outline-none focus:border-blue-500"
      />
      <label className="block text-sm font-medium text-gray-600 mb-1">
        Password:
      </label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:border-blue-500"
      />
      <button
        onClick={handleSignUp}
        className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue"
      >
        Sign Up
      </button>

      <div className="flex justify-center pt-6">
        Already register?
        <span
          className="cursor-pointer pl-2 text-blue-600"
          onClick={() => {
            navigate("/");
          }}
        >
          Sign In
        </span>
      </div>
      <div className="flex justify-center pt-3">
        Create account for startup company?
        <span
          className="cursor-pointer pl-2 text-blue-600"
          onClick={() => {
            navigate("/startupsignin");
          }}
        >
          Sign In
        </span>
      </div>
    </div>
  );
};

export default InvestorSignUp;
