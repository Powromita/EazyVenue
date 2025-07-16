import { useEffect, useState } from 'react';
import Header from '../../components/Header';
import BookingCard from '../../components/BookingCard';
import { useRouter } from 'next/router';

interface Booking {
  id: string;
  venueName: string;
  eventDate: string;
  eventTime: string;
  guestCount: number;
  eventType: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  contactName: string;
  contactEmail: string;
  createdAt: string;
}

export default function MyBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Only allow logged-in customers
    const role = typeof window !== 'undefined' ? localStorage.getItem('role') : null;
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (role !== 'customer' || !token) {
      router.replace('/login/customer');
      return;
    }
    fetchBookings(token);
  }, [router]);

  const fetchBookings = async (token: string) => {
    try {
      const res = await fetch('http://localhost:5000/api/bookings/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error('Failed to fetch bookings');
      const data = await res.json();
      setBookings(data.bookings || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = (bookingId: string) => {
    setBookings((prev) => prev.filter((b) => b.id !== bookingId));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">My Bookings</h1>
        {loading ? (
          <div className="text-center">Loading your bookings...</div>
        ) : error ? (
          <div className="text-center text-red-600">{error}</div>
        ) : bookings.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <div className="text-2xl font-semibold mb-2">No bookings yet</div>
            <div className="mb-4">You haven't booked any venues with us yet.</div>
            <div className="mb-2">Book your first venue for any occasion—weddings, birthdays, parties, and more!</div>
            <div>Browse our venues and make your event memorable with venue booking.</div>
          </div>
        ) : (
          <div className="grid gap-4">
            {bookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} onCancel={handleCancel} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
} 