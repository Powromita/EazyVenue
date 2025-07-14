import { useEffect } from 'react';
import { useRouter } from 'next/router';

export const useAuth = (requiredRole: 'VENUE_OWNER' | 'USER' = 'VENUE_OWNER') => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    if (!token || role !== requiredRole) {
      alert(`Access denied. Please login as a ${requiredRole === 'VENUE_OWNER' ? 'vendor' : 'customer'}.`);
      router.push(requiredRole === 'VENUE_OWNER' ? '/login/vendor' : '/login/customer');
      return;
    }
  }, [router, requiredRole]);

  return {
    isAuthenticated: !!localStorage.getItem('token'),
    role: localStorage.getItem('role'),
    token: localStorage.getItem('token'),
  };
}; 