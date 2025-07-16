import React, { useState, useEffect } from 'react';
import Header from '../components/Header';

const ProfilePage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setUsername(localStorage.getItem('username') || '');
    setEmail(localStorage.getItem('email') || '');
    setPhone(localStorage.getItem('phone') || '');
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200">
      <Header />
      <main className="max-w-3xl mx-auto p-6 mt-8 bg-white rounded-lg shadow-lg">
        <div className="flex items-center justify-between mb-8 border-b pb-4">
          <span className="text-sm text-gray-400 font-medium">Your Profile</span>
        </div>

        {/* Personal Info */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold mb-3 text-blue-700 border-b pb-2">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Full Name</label>
              <input type="text" className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Enter your full name" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Username</label>
              <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Enter your username" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Enter your email" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Phone Number</label>
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Enter your phone number" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-600 mb-1">Address</label>
              <input type="text" className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Enter your address" />
            </div>
          </div>
        </section>

        {/* Event Preferences */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold mb-3 text-blue-700 border-b pb-2">Event Preferences</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Preferred Event Types</label>
              <input type="text" className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="e.g. Wedding, Birthday, Corporate" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Typical Guest Count</label>
              <input type="text" className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="e.g. 100-200" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Dietary Preferences</label>
              <input type="text" className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="e.g. Vegetarian" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Special Requirements</label>
              <input type="text" className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="e.g. Wheelchair access" />
            </div>
          </div>
        </section>

        {/* Bookings */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold mb-3 text-blue-700 border-b pb-2">Bookings</h2>
          <div className="text-gray-500 italic">Your bookings will appear here.</div>
        </section>

        {/* Favorites */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold mb-3 text-blue-700 border-b pb-2">Favorite Venues</h2>
          <div className="text-gray-500 italic">Your favorite venues will appear here.</div>
        </section>

        {/* Communication Preferences */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold mb-3 text-blue-700 border-b pb-2">Communication Preferences</h2>
          <input type="text" className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="e.g. Email, SMS" />
        </section>

        {/* Account Management */}
        <section>
          <h2 className="text-lg font-semibold mb-3 text-blue-700 border-b pb-2">Account Management</h2>
          <div className="flex flex-col md:flex-row gap-4 mt-2">
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Save Changes</button>
            <button className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">Change Password</button>
            <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Logout</button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ProfilePage; 