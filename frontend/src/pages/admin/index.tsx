import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Header from '../../components/Header';

type Booking = {
  id: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
};

type Venue = {
  id: string;
};

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    totalVenues: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    if (!token || role !== 'VENUE_OWNER') {
      alert('Access denied. Please login as a vendor.');
      router.push('/login/vendor');
      return;
    }

    fetchStats();
  }, [router]);

  const fetchStats = async () => {
    try {
      // Fetch bookings
      const bookingsResponse = await fetch('http://localhost:5000/api/bookings');
      const bookingsData = await bookingsResponse.json();
      
      // Fetch venues
      const venuesResponse = await fetch('http://localhost:5000/api/venues');
      const venuesData = await venuesResponse.json();

      const bookings = bookingsData.bookings || [];
      const venues = venuesData.venues || [];

      const totalBookings = bookings.length;
      const pendingBookings = bookings.filter((booking: Booking) => booking.status === 'PENDING').length;
      const confirmedBookings = bookings.filter((booking: Booking) => booking.status === 'CONFIRMED').length;
      const totalVenues = venues.length;

      setStats({
        totalBookings,
        pendingBookings,
        confirmedBookings,
        totalVenues
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigateToBookings = () => {
    router.push('/admin/bookings');
  };

  const handleNavigateToVenues = () => {
    router.push('/admin/venues');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Booking Management Card */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
              <h2 className="text-xl font-semibold mb-4">Booking Management</h2>
              <p className="text-blue-100 mb-4">
                View and manage all booking requests. Confirm or cancel bookings and update venue availability in real-time.
              </p>
              <button
                onClick={handleNavigateToBookings}
                className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                Manage Bookings
              </button>
            </div>

            {/* Venue Management Card */}
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white">
              <h2 className="text-xl font-semibold mb-4">Venue Management</h2>
              <p className="text-purple-100 mb-4">
                Manage your venues, update availability, and view real-time booking status.
              </p>
              <button
                onClick={handleNavigateToVenues}
                className="bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold hover:bg-purple-50 transition-colors"
              >
                Manage Venues
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800">Total Bookings</h3>
              <p className="text-2xl font-bold text-blue-600">
                {loading ? '...' : stats.totalBookings}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800">Pending</h3>
              <p className="text-2xl font-bold text-yellow-600">
                {loading ? '...' : stats.pendingBookings}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800">Confirmed</h3>
              <p className="text-2xl font-bold text-green-600">
                {loading ? '...' : stats.confirmedBookings}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800">Venues</h3>
              <p className="text-2xl font-bold text-purple-600">
                {loading ? '...' : stats.totalVenues}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}