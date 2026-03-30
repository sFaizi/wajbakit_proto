import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getMe } from './features/auth/authSlice';
import useAuth from './hooks/useAuth';
import Navbar from './components/Navbar';
import AppRoutes from './routes/AppRoutes';

const App = () => {
  const dispatch = useDispatch();
  const { accessToken } = useAuth();

  // On mount, fetch user profile if token exists
  useEffect(() => {
    if (accessToken) {
      dispatch(getMe());
    }
  }, [dispatch, accessToken]);

  return (
    <div className='min-h-screen flex flex-col'>
      <Navbar />
      <main className='flex-1'>
        <AppRoutes />
      </main>
    </div>
  );
};

export default App;
