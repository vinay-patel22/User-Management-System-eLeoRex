import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';

export default function PrivateRoute() {
  const { currentUser } = useSelector((state) => state.user);

  // Check if the user is logged in
  if (!currentUser) {
    return <Navigate to='/sign-in' />;
  }

  // If user is logged in, check for specific route requirements
  return (
    <Outlet
      context={{
        role: currentUser.role, // Pass role to child routes if needed
      }}
    />
  );
}
