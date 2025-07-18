import { useState } from 'react';
import { useRouter } from 'next/router';

export default function VendorLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      
      // Clear any existing data
      localStorage.clear();
      sessionStorage.clear();
      
      // Set new user data
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.user.role);
      localStorage.setItem('username', data.user.name);
      localStorage.setItem('email', data.user.email);
      localStorage.setItem('phone', data.user.phone || '');
      
      // Force a complete page refresh to ensure fresh state
      window.location.href = '/admin';
    } catch (err: any) {
      alert(err.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md w-full max-w-md">
         <h1 className="text-3xl font-extrabold text-purple-700 mb-4 text-center">venue booking</h1>
        <h2 className="text-2xl font-bold mb-6 text-center">Vendor Login</h2>
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 px-4 py-2 border rounded"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-6 px-4 py-2 border rounded"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
        >
          Login
        </button>
        <p className="mt-4 text-center text-sm">
  Don't have an account?{' '}
  <a href="/register/vendor" className="text-purple-600 underline">
    Register
  </a>
</p>
<p className="mt-4 text-sm text-center">
  Not a vendor?{' '}
  <a
    href="/login/customer"
    className="text-blue-600 hover:underline font-medium"
  >
    Login as a client
  </a>
</p>
      </form>
    </div>
  );
}