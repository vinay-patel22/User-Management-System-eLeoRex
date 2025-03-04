import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <div className='bg-slate-200'>
      <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
        <Link to='/'>
          <h1 className='font-bold'>Auth App</h1>
        </Link>
        <ul className='flex gap-4'>
          <Link to='/'>
            <li>Home</li>
          </Link>
          {/* Conditionally render the Profile link based on whether the user is logged in */}
          {currentUser ? (
            <Link to='/profile'>
              <img
                src={currentUser.profilePicture || '/default-profile.jpg'}
                alt='profile'
                className='h-7 w-7 rounded-full object-cover'
              />
            </Link>
          ) : (
            <Link to='/sign-in'>
              <li>Sign In</li>
            </Link>
          )}

          {/* Show "Manage Users" link only for Admin and Manager roles */}
          {currentUser && (currentUser.role === 'admin' || currentUser.role === 'manager') && (
            <Link to='/users'>
              <li>Manage Users</li>
            </Link>
          )}
        </ul>
      </div>
    </div>
  );
}
