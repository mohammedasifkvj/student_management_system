import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function Header() {
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
          <Link to='/profile'>
            {currentUser ? (
              // <img src={currentUser.profilePicture} alt='profile' className='h-7 w-7 rounded-full object-cover' />
              <li>Profile</li>
            ) : (
              <li>Stdent Login</li>
            )}
          </Link>
        </ul>
      </div>
    </div>
  );
}