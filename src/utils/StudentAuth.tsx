import React, { createContext, useContext, useState } from "react";

const StudentAuthContext = createContext<any>(null);

export const StudentAuthProvider = ({ children }: any) => {
  const [studentExist, setStudentExist] = useState(() => {
    const storedStudent = localStorage.getItem("studentExist");
    return storedStudent ? JSON.parse(storedStudent) : false;
  });

  const studentLogin = (token: any) => {
    setStudentExist(true);
    localStorage.setItem("studentExist", JSON.stringify(true));
    localStorage.setItem("studentToken", JSON.stringify(token));
  };

  const studentLogout = () => {
    setStudentExist(false);
    localStorage.removeItem("studentExist");
    localStorage.removeItem("studentToken");

    // OneSignal Logout
    if ((window as any).OneSignalDeferred) {
      (window as any).OneSignalDeferred.push(async function (OneSignal: any) {
        try {
          await OneSignal.Logout();
          console.log("OneSignal Logout Successful");
        } catch (e) {
          console.error("OneSignal Logout Failed", e);
        }
      });
    }
  };

  return (
    <StudentAuthContext.Provider value={{ studentExist, studentLogin, studentLogout }}>
      {children}
    </StudentAuthContext.Provider>
  );
};

export const useStudentAuth = () => {
  return useContext(StudentAuthContext);
};
