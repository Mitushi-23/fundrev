import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { StartupType } from "../startupContext";

const InvestorSignIn = () => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const { setInvestorId } = useContext(StartupType);
  const navigate = useNavigate();

  const handleSignIn = async () => {
    try {
      const response = await fetch("https://fundrev-backend-5plm.onrender.com/signin/investor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, password }),
      });
      const responseData = await response.json();
      if (response.ok) {
        const id = responseData.data._id;
        localStorage.setItem("investorId",id);
        setInvestorId(id);
        alert("Sign in successful!");
        navigate("/investordashboard");
        // Redirect or perform any other actions upon successful sign-in
      } else {
        const errorMessage = await response.text();
        alert(`Sign in failed: ${errorMessage}`);
      }
    } catch (error) {
      console.error("Error during sign-in:", error.message);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-semibold mb-4">Investor Sign In</h2>
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
        onClick={handleSignIn}
        className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue"
      >
        Sign In
      </button>
      <div className="flex justify-center pt-6">
        Create account for investor?
        <span
          className="cursor-pointer pl-2 text-blue-600"
          onClick={() => {
            navigate("/investorsignup");
          }}
        >
          Sign Up
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

export default InvestorSignIn;
