import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import UsersManagement from './components/UsersManagement';

export default function App() {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <BrowserRouter>

      <Header />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />

        {/* Private Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />

          {/* Role-based access for UsersManagement */}
          {currentUser && (currentUser.role === 'admin' || currentUser.role === 'manager') && (
            <Route path="/users" element={<UsersManagement />} />
          )}
        </Route>

        {/* Fallback route for undefined paths */}
        <Route path="*" element={<div>Page Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}
