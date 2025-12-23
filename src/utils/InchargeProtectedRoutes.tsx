import React, { useContext } from 'react'
import { useInchargeAuth } from './InchargeAuth'
import { Navigate, Outlet } from 'react-router-dom';

function InchargeProtectedRoutes() {
  const { inchargeExist } = useInchargeAuth();

  return inchargeExist ? <Outlet /> : <Navigate to="/admins" />

}

export default InchargeProtectedRoutes