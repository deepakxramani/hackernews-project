import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-[60vh]'>
        <div className='flex flex-col items-center gap-4'>
          <div className='w-8 h-8 border-2 border-accent-orange/30 border-t-accent-orange rounded-full animate-spin' />
          <p className='text-text-muted text-sm'>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to='/login' />;
  }

  return children;
};

export default ProtectedRoute;
