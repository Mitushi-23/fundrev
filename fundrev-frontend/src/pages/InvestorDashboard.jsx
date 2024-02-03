import React, { useState, useEffect, useContext } from "react";
import { StartupType } from "../startupContext";
import { useNavigate } from "react-router-dom";

const InvestorDashboard = () => {
  const [interested, setInterested] = useState(false);
  const [startupDetails, setStartupDetails] = useState(null);
  const [startupIds, setStartupIds] = useState([]);
  const { investorId, setInvestorId } = useContext(StartupType);

  const navigate = useNavigate();

  const handleInterest = async (startup_id) => {
    try {
      const response = await fetch(
        `https://fundrev-backend-5plm.onrender.com/interested/${investorId}/${startup_id}`,
        {
          method: "POST",
        }
      );

      if (response.ok) {
        alert("Interest registered successfully!");
        setInterested(true);
      } else {
        const errorMessage = await response.text();
        alert(`Interest registration failed: ${errorMessage}`);
      }
    } catch (error) {
      console.error("Error during interest registration:", error.message);
    }
  };

  const fetchInvestorInterest = async () => {
    try {
      const response = await fetch(
        `https://fundrev-backend-5plm.onrender.com/getinvestorDetail/${investorId}`,
        {
          method: "GET",
        }
      );
      const responseData = await response.json();
      if (responseData.data.interested_startups) {
        setStartupIds(responseData.data.interested_startups);
      }
    } catch (error) {
      console.error("Error during data fetching:", error.message);
    }
  };

  useEffect(() => {
    setInvestorId(localStorage.getItem("investorId"));
    const fetchStartups = async () => {
      try {
        const response = await fetch("https://fundrev-backend-5plm.onrender.com/getstartup", {
          method: "GET",
        });

        const responseData = await response.json();

        if (response.ok) {
          setStartupDetails(responseData.data);
        }
        console.log(response);
      } catch (error) {
        console.error("Error during data fetching:", error.message);
      }
    };

    fetchStartups();
    fetchInvestorInterest();
  }, []);

  const handleLogout = ()=>{
    localStorage.removeItem("investorId");
    navigate("/")
  }

  return (
    <>
      <div className="max-w-md mx-auto p-4 ">
        <h2 className="text-2xl font-semibold mb-4">Investor Dashboard</h2>
        <button className="bg-blue-500 p-2 text-white rounded-md text-md font-semibold mb-4 absolute right-20 top-10"
        onClick={handleLogout}
        >
          Logout
        </button>
      </div>
      {startupDetails &&
        startupDetails.map((item) => (
          <div
            className="mt-4 max-w-md mx-auto p-4  bg-white shadow-md rounded-md"
            key={item._id}
          >
            <h3 className="text-lg font-semibold mb-2">Startup Details</h3>
            <p>Company Name: {item.companyName}</p>
            <p>Business Description: {item.businessDescription}</p>

            {startupIds.includes(item._id) ? (
              <div>
                <p className="text-green-600">Interested in the startup!</p>

                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2">
                    Monthly Sales Chart
                  </h3>

                  <img src={`data:image/png;base64,${item.chart_image}`} />
                </div>
              </div>
            ) : (
              <button
                onClick={() => handleInterest(item._id)}
                className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue"
              >
                Interested
              </button>
            )}
          </div>
        ))}
    </>
  );
};

export default InvestorDashboard;
