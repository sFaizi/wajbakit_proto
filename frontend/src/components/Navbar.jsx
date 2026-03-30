import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../features/auth/authSlice';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(logoutUser());
    toast.success('Logged out');
    navigate('/login');
  };

  return (
    <nav className='bg-white shadow-sm border-b'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between h-16 items-center'>
          {/* Logo */}
          <Link to='/' className='text-xl font-bold text-primary-600'>
            wajbakit_proto
          </Link>

          {/* Navigation Links */}
          <div className='flex items-center gap-6'>
            <Link
              to='/products'
              className='text-gray-600 hover:text-primary-600 transition'
            >
              Products
            </Link>

            {user ? (
              <>
                <Link
                  to='/orders'
                  className='text-gray-600 hover:text-primary-600 transition'
                >
                  My Orders
                </Link>

                {user.role === 'admin' && (
                  <Link
                    to='/admin'
                    className='text-gray-600 hover:text-primary-600 transition'
                  >
                    Admin
                  </Link>
                )}

                <div className='flex items-center gap-3'>
                  <span className='text-sm text-gray-500'>{user.name}</span>
                  <button
                    onClick={handleLogout}
                    className='text-sm text-red-600 hover:text-red-700 font-medium'
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className='flex items-center gap-3'>
                <Link
                  to='/login'
                  className='text-gray-600 hover:text-primary-600 transition'
                >
                  Login
                </Link>
                <Link
                  to='/signup'
                  className='bg-primary-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-primary-700 transition'
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
