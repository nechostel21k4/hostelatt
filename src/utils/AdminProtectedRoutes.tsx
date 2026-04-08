import { useAdminAuth } from './AdminAuth'
import { Navigate, Outlet } from 'react-router-dom';

function AdminProtectedRoutes() {
  const { adminExist } = useAdminAuth();

  return adminExist ? <Outlet /> : <Navigate to="/admins" />

}

export default AdminProtectedRoutes