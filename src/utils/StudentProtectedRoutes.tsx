import React, { useEffect, useState } from 'react'
import { Navigate , Outlet } from 'react-router-dom';
import { useStudentAuth } from './StudentAuth';

function StudentProtectedRoutes() {
  const {studentExist} = useStudentAuth();
  return studentExist?<Outlet/>:<Navigate to="/"/> 
}

export default StudentProtectedRoutes