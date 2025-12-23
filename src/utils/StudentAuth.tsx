import React, { createContext, useContext, useState, useEffect } from "react";

const StudentAuthContext = createContext<any>(null);

export const StudentAuthProvider = ({ children }:any) => {
  const [studentExist, setStudentExist] = useState(() => {
    const storedStudent = localStorage.getItem("studentExist");
    return storedStudent ? JSON.parse(storedStudent) : false;
  });

  const studentLogin = (token:any) => {
    setStudentExist(true);
    localStorage.setItem("studentExist", JSON.stringify(true));
    localStorage.setItem("studentToken",JSON.stringify(token));
  };

  const studentLogout = () => {
    setStudentExist(false);
    localStorage.removeItem("studentExist");
    localStorage.removeItem("studentToken");
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
