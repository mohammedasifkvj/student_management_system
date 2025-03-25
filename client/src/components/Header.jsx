import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {signOut} from '../redux/user/userSlice.js';

export default function Header() {

  const dispatch = useDispatch();

  const handleSignOut = async () => {
    try {
      await fetch('/api/student/signout');
      dispatch(signOut())
    } catch (error) {
      console.log(error);
    }
  };

  const { currentUser } = useSelector((state) => state.user);
  return (
    <div className='bg-slate-200'>
      <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
        <Link to='/'>
          <h1 className='font-bold'>Student Management System</h1>
        </Link>
        <ul className='flex gap-4'>
          <Link to='/'>
            <li>Home</li>
          </Link>
          <Link to='/admin-signIn'>
            { !currentUser ? (
              <li>Admin Login</li>
            ) : (
              <li></li>
            )}
          </Link>
          <Link to='/list'>
            {currentUser && currentUser.isAdmin ? (
              <li>Students Table</li>
            ) : (
              <li></li>
            )}
          </Link>
          <Link to='/task'>
            {currentUser && currentUser.isStudent ? (
              <li>Tasks</li>
            ) : (
              <li></li>
            )}
          </Link>
          <Link to='/sign-in'>
            {currentUser ? (
              <span onClick={handleSignOut} className='text-red-700 cursor-pointer'>
              Sign out
            </span>
            ) : (
              <li>Student Login</li>
            )}
          </Link>
        </ul>
      </div>
    </div>
  );
}