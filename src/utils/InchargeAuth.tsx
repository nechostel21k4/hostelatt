import React, { useContext, useState } from "react";

const InchargeAuthContext = React.createContext<any>(null);

export const InchargeAuthProvider = ({ children }: any) => {
  const [inchargeExist, setInchargeExist] = useState(() => {
    const storedIncharge = localStorage.getItem("inchargeExist");
    return storedIncharge ? JSON.parse(storedIncharge) : false;
  });

  const inchargeLogin = (token: any) => {
    setInchargeExist(true);
    localStorage.setItem("inchargeExist", JSON.stringify(true));
    localStorage.setItem("inchargeToken", JSON.stringify(token));
  };

  const inchargeLogout = () => {
    setInchargeExist(false);
    localStorage.removeItem("inchargeExist");
    localStorage.removeItem("inchargeToken");
  };

  return (
    <>
      <InchargeAuthContext.Provider
        value={{ inchargeExist, inchargeLogin, inchargeLogout }}
      >
        {children}
      </InchargeAuthContext.Provider>
    </>
  );
};

export const useInchargeAuth = () => {
  return useContext(InchargeAuthContext);
};

export default InchargeAuthProvider;
