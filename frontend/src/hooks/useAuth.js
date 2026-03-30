import { useSelector } from 'react-redux';

/**
 * Hook to access auth state conveniently.
 */
const useAuth = () => {
  const { user, accessToken, isLoading } = useSelector((state) => state.auth);

  return {
    user,
    accessToken,
    isLoading,
    isAuthenticated: !!accessToken,
    isAdmin: user?.role === 'admin',
  };
};

export default useAuth;
