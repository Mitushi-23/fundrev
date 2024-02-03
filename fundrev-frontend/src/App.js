import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import InvestorSignUp from "./pages/InvestorSignUp";
import InvestorSignIn from "./pages/InvestorSignIn";
import StartupSignUp from "./pages/StartupSignUp";
import StartupSignIn from "./pages/StartupSignIn";
import InvestorDashboard from "./pages/InvestorDashboard";
import StartupDashboard from "./pages/StartupDashboard";
import { StartupContext } from "./startupContext";
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/investorsignup" element={<InvestorSignUp />} />
        <Route path="/" element={<InvestorSignIn />} />
        <Route path="/startupsignup" element={<StartupSignUp />} />
        <Route path="/startupsignin" element={<StartupSignIn />} />
        <Route path="/investordashboard" element={<InvestorDashboard />} />
        <Route path="/startupdashboard" element={<StartupDashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
