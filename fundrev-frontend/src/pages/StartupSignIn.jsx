import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { StartupType } from "../startupContext";

const StartupSignIn = () => {
  const [companyName, setCompanyName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const {startupId, setStartupId} = useContext(StartupType);
  const handleSignIn = async () => {
    try {
      const response = await fetch(
        "https://fundrev-backend-5plm.onrender.com/signin/startup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ companyName, password }),
        }
      );

      if (response.ok) {
        const responseData = await response.json();
        console.log(responseData.data)
        const id = responseData.data._id;
        localStorage.setItem("startupId",id);
        setStartupId(id);
        alert("Sign in successful!");
        navigate("/startupdashboard")
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
      <h2 className="text-2xl font-semibold mb-4">Startup Sign In</h2>
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
      <div className="flex justify-center pt-3">
        Create account for startup company?
        <span
          className="cursor-pointer pl-2 text-blue-600"
          onClick={() => {
            navigate("/startupsignup");
          }}
        >
          Sign up
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

export default StartupSignIn;
