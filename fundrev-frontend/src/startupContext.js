import { createContext, useState } from "react";

const StartupType = createContext({
  startupId: "",
  setStartupId: () => {},
  investorId:"",
  setInvestorId: ()=>{}
});

const StartupContext = ({ children }) => {
  const [startupId, setStartupId] = useState("");
  const [investorId, setInvestorId] = useState("");
  return (
    <StartupType.Provider value={{ startupId, setStartupId ,investorId,setInvestorId}}>
      {children}
    </StartupType.Provider>
  );
};

export { StartupContext, StartupType };