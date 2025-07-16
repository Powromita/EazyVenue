import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export const useAuth = (requiredRole: 'VENUE_OWNER' | 'USER' = 'VENUE_OWNER') => {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setToken(localStorage.getItem('token'));
      setRole(localStorage.getItem('role'));
      setChecked(true);
    }
  }, [requiredRole]);

  useEffect(() => {
    if (checked) {
      if (!token || role !== requiredRole) {
        alert(`Access denied. Please login as a ${requiredRole === 'VENUE_OWNER' ? 'vendor' : 'customer'}.`);
        router.push(requiredRole === 'VENUE_OWNER' ? '/login/vendor' : '/login/customer');
      }
    }
  }, [checked, token, role, requiredRole, router]);

  return {
    isAuthenticated: !!token,
    role,
    token,
  };
}; 