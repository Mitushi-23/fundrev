import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const StartupSignUp = () => {
  const [companyName, setCompanyName] = useState("");
  const [businessDescription, setBusinessDescription] = useState("");
  const [revenue, setRevenue] = useState("");
  const [password, setPassword] = useState("")
  const navigate = useNavigate();
  const handleSignUp = async () => {
    try {
      const response = await fetch(
        "https://fundrev-backend-5plm.onrender.com/signup/startup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ companyName, businessDescription, revenue, password }),
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
      <h2 className="text-2xl font-semibold mb-4">Startup Sign Up</h2>
      <label className="block text-sm font-medium text-gray-600 mb-1">
        Company Name:
      </label>
      <input
        type="text"
        value={companyName}
        onChange={(e) => setCompanyName(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-md mb-3 focus:outline-none focus:border-blue-500"
      />
      <label className="block text-sm font-medium text-gray-600 mb-1">
        Business Description:
      </label>
      <input
        type="text"
        value={businessDescription}
        onChange={(e) => setBusinessDescription(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-md mb-3 focus:outline-none focus:border-blue-500"
      />
      <label className="block text-sm font-medium text-gray-600 mb-1">
        Revenue:
      </label>
      <input
        type="text"
        value={revenue}
        onChange={(e) => setRevenue(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:border-blue-500"
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
      <div className="flex justify-center pt-3">
        Already user?
        <span
          className="cursor-pointer pl-2 text-blue-600"
          onClick={() => {
            navigate("/startupsignin");
          }}
        >
          Sign in
        </span>
      </div>
      <div className="flex justify-center pt-6">
        Already investor account?
        <span
          className="cursor-pointer pl-2 text-blue-600"
          onClick={() => {
            navigate("/");
          }}
        >
          Sign In
        </span>
      </div>
    </div>
  );
};

export default StartupSignUp;
