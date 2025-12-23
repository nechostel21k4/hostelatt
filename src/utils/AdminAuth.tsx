import React, { useContext, useState } from "react";

const AdminAuthContext = React.createContext<any>(null);

export const AdminAuthProvider = ({ children }: any) => {
  const [adminExist, setAdminExist] = useState(() => {
    const storedAdmin = localStorage.getItem("adminExist");
    return storedAdmin ? JSON.parse(storedAdmin) : false;
  });

  const adminLogin = (token: any) => {
    setAdminExist(true);
    localStorage.setItem("adminExist", JSON.stringify(true));
    localStorage.setItem("adminToken", JSON.stringify(token));
  };

  const adminLogout = () => {
    setAdminExist(false);
    localStorage.removeItem("adminExist");
    localStorage.removeItem("adminToken");
  };

  return (
    <>
      <AdminAuthContext.Provider
        value={{ adminExist, adminLogin, adminLogout }}
      >
        {children}
      </AdminAuthContext.Provider>
    </>
  );
};

export const useAdminAuth = () => {
  return useContext(AdminAuthContext);
};

export default AdminAuthProvider;
