import { Navigate, Outlet, useLocation } from 'react-router-dom'

function ProtectedRoute() {
  const token = localStorage.getItem('accessToken')
  const location = useLocation()

  if (!token) {
    // Redirect unauthenticated users to /login and preserve attempted path in location state
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <Outlet />
}

export default ProtectedRoute

