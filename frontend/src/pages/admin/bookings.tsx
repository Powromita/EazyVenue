import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from '../../components/Header';
import { useSocket } from '../../hooks/useSocket';

type Booking = {
  id: string;
  venueId: string;
  venue: {
    id: string;
    name: string;
  };
  eventDate: string;
  eventTime: string;
  guestCount: number;
  eventType: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  specialRequests?: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  createdAt: string;
};

export default function BookingsManagement() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const { onAvailabilityUpdate } = useSocket();

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    if (!token || role !== 'VENUE_OWNER') {
      alert('Access denied. Please login as a vendor.');
      router.push('/login/vendor');
      return;
    }

    fetchBookings();
    
    // Listen for real-time availability updates
    onAvailabilityUpdate((data) => {
      console.log('Availability updated:', data);
      // Show notification for availability update
      alert(`Venue availability updated for ${new Date(data.date).toLocaleDateString()}`);
    });
  }, [router]);

  const fetchBookings = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/bookings');
      if (response.ok) {
        const data = await response.json();
        setBookings(data.bookings);
      } else {
        console.error('Failed to fetch bookings');
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmBooking = async (bookingId: string, status: 'CONFIRMED' | 'CANCELLED') => {
    setUpdating(bookingId);
    try {
      const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}/confirm`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(`Booking ${status.toLowerCase()} successfully!`);
        fetchBookings(); // Refresh the list
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to update booking status');
      }
    } catch (error) {
      console.error('Error updating booking:', error);
      alert('An error occurred while updating the booking');
    } finally {
      setUpdating(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatTime = (timeString: string) => {
    return timeString;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">Loading bookings...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Dashboard Button */}
        <div className="mb-6">
          <button
            onClick={() => router.push('/admin')}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Dashboard
          </button>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Booking Management</h1>
          
          {bookings.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No bookings found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Venue
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Event Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact Info
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {booking.venue.name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          <div><strong>Date:</strong> {formatDate(booking.eventDate)}</div>
                          <div><strong>Time:</strong> {formatTime(booking.eventTime)}</div>
                          <div><strong>Type:</strong> {booking.eventType}</div>
                          <div><strong>Guests:</strong> {booking.guestCount}</div>
                          {booking.specialRequests && (
                            <div><strong>Requests:</strong> {booking.specialRequests}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          <div><strong>Name:</strong> {booking.contactName}</div>
                          <div><strong>Email:</strong> {booking.contactEmail}</div>
                          <div><strong>Phone:</strong> {booking.contactPhone}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {booking.status === 'PENDING' && (
                          <div className="space-x-2">
                            <button
                              onClick={() => handleConfirmBooking(booking.id, 'CONFIRMED')}
                              disabled={updating === booking.id}
                              className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700 disabled:opacity-50"
                            >
                              {updating === booking.id ? 'Confirming...' : 'Confirm'}
                            </button>
                            <button
                              onClick={() => handleConfirmBooking(booking.id, 'CANCELLED')}
                              disabled={updating === booking.id}
                              className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700 disabled:opacity-50"
                            >
                              {updating === booking.id ? 'Cancelling...' : 'Cancel'}
                            </button>
                          </div>
                        )}
                        {booking.status !== 'PENDING' && (
                          <span className="text-gray-500">No actions available</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 