import { useState } from 'react';
import { useRouter } from 'next/router';

export default function VendorRegister() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          name: username,
          password,
          role: 'VENUE_OWNER',
          // Note: phone, businessName, and businessAddress are not sent to backend
          // as the backend schema doesn't include these fields
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');
      
      // Clear any existing data
      localStorage.clear();
      sessionStorage.clear();
      
      // Set new user data
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.user.role);
      localStorage.setItem('username', data.user.name);
      
      // Force a complete page refresh to ensure fresh state
      window.location.href = '/admin';
    } catch (err: any) {
      alert(err.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200">
      <form onSubmit={handleRegister} className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-3xl font-extrabold text-purple-700 mb-4 text-center">EazyVenue</h1>
        <h2 className="text-2xl font-bold mb-6 text-center">Vendor Registration</h2>
        <input
          type="text"
          placeholder="Username"
          className="w-full mb-4 px-4 py-2 border rounded"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 px-4 py-2 border rounded"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="tel"
          placeholder="Phone Number (Optional)"
          className="w-full mb-4 px-4 py-2 border rounded"
          value={phone}
          onChange={e => setPhone(e.target.value)}
        />
        <input
          type="text"
          placeholder="Business Name (Optional)"
          className="w-full mb-4 px-4 py-2 border rounded"
          value={businessName}
          onChange={e => setBusinessName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Business Address (Optional)"
          className="w-full mb-4 px-4 py-2 border rounded"
          value={businessAddress}
          onChange={e => setBusinessAddress(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 px-4 py-2 border rounded"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <p className="text-xs text-gray-500 mb-4">Password should be minimum 6 letters.</p>
        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
        >
          Register
        </button>
        <p className="mt-4 text-center text-sm">
          Already have an account?{' '}
          <a href="/login/vendor" className="text-purple-600 underline">
            Login
          </a>
        </p>
        <p className="mt-4 text-sm text-center">
  Not a vendor?{' '}
  <a
    href="/register/customer"
    className="text-blue-600 hover:underline font-medium"
  >
    Register as a client
  </a>
</p>
      </form>
    </div>
  );
}