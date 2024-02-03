import React, { useContext, useEffect, useState } from "react";
import { StartupType } from "../startupContext";
import { useNavigate } from "react-router-dom";

const StartupDashboard = () => {
  const [file, setFile] = useState(null);
  const [chartImagePath, setChartImagePath] = useState(null);
  const { startupId, setStartupId } = useContext(StartupType);
  const navigate = useNavigate()
  const getChart = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/getstartupDetail/${startupId}`,
        {
          method: "GET",
        }
      );
      console.log(response);
      const responseData = await response.json();
      if (response.ok) {
        if (responseData.data.chart_image) {
          setChartImagePath(responseData.data.chart_image);
        }
      }
    } catch (error) {
      console.error("Error in getting chart", error.message);
    }
  };

  const handleFileUpload = async () => {
    try {
      if (!file) {
        alert("Please select a file for upload.");
        return;
      }

      const formData = new FormData();
      formData.append("salesFile", file);

      const response = await fetch(
        `http://127.0.0.1:5000/upload-sales/${startupId}`,
        {
          method: "POST",
          body: formData,
        }
      );
      const responseData = await response.json();
      console.log(responseData);
      if (response.ok) {
        alert("File uploaded successfully!");
        setChartImagePath(responseData.chart_image_path);
        // Implement chart generation logic on the server side
      } else {
        const errorMessage = await response.text();
        alert(`File upload failed: ${errorMessage}`);
      }
    } catch (error) {
      console.error("Error during file upload:", error.message);
    }
  };

  useEffect(() => {
    setStartupId(localStorage.getItem("startupId"));
    getChart();
  }, []);

  const handleLogout = ()=>{
    localStorage.removeItem("startupId");
    navigate("/startupsignin")
  }

  return (
    <>
      <div className="max-w-md mx-auto p-4 bg-white shadow-md rounded-md">
        <h2 className="text-2xl font-semibold mb-4">Startup Dashboard</h2>
        <button className="bg-blue-500 p-2 text-white rounded-md text-md font-semibold mb-4 absolute right-20 top-10"
        onClick={handleLogout}
        >
          Logout
        </button>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="w-full p-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:border-blue-500"
        />
        <button
          onClick={handleFileUpload}
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue"
        >
          Update Sales
        </button>
      </div>
      {chartImagePath && (
        <div className="mt-4 max-w-5xl mx-auto">
          <h3 className="text-lg font-semibold mb-2">Monthly Sales Chart</h3>
          <img
            src={`data:image/png;base64,${chartImagePath}`}
            alt="Monthly Sales Chart"
            className="w-full rounded-md"
          />
        </div>
      )}
    </>
  );
};

export default StartupDashboard;
