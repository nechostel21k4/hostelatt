import { Navigate, Outlet } from 'react-router-dom';
import { useFacultyAuth } from './FacultyAuth';

function FacultyProtectedRoutes() {
  const { facultyExist } = useFacultyAuth();
  return facultyExist ? <Outlet /> : <Navigate to="/admins" />
}

export default FacultyProtectedRoutes