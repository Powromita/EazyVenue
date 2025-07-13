import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AdminHeader from '../../components/AdminHeader';

type Venue = {
  id: string;
  name: string;
  location: string;
  capacity: number;
  occasion?: string;
  unavailableDates?: string[];
  images?: string[];
};

export default function AdminDashboard() {
  const router = useRouter();
  const [venues, setVenues] = useState<Venue[]>([]);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/vendor/venues', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(res => res.json())
      .then(data => setVenues(data))
      .catch(() => setVenues([]));
  }, []);

  return (
    <div className="min-h-screen bg-orange-50">
      <AdminHeader />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Profile Section */}
          <aside className="w-full md:w-1/4 bg-white rounded-xl shadow p-6 mb-8 md:mb-0">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-orange-500 flex items-center justify-center text-3xl text-white font-bold mb-2">
                {username ? username.charAt(0).toUpperCase() : 'V'}
              </div>
              <div className="text-lg font-semibold text-orange-600">
                {username || ''}
              </div>
              <div className="text-orange-400 text-sm">Venue Owner</div>
            </div>
          </aside>
          {/* Venues Management Section */}
          <section className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-orange-600">Your Venues</h2>
              {venues.length > 0 && (
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  onClick={() => {
                    setVenues([
                      ...venues,
                      {
                        id: Date.now().toString(),
                        name: 'Grand Hall',
                        location: 'Downtown',
                        capacity: 200,
                        occasion: 'Wedding',
                        unavailableDates: ['2025-07-20', '2025-07-21'],
                        images: [
                          'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
                        ],
                      },
                    ]);
                  }}
                >
                  + Add Venue
                </button>
              )}
            </div>
            {venues.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-[400px]">
                {/* Illustration/Icon */}
                <svg className="w-32 h-32 mb-6 text-orange-200" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 48 48"><rect x="8" y="20" width="32" height="20" rx="3" className="fill-orange-50 stroke-orange-300"/><rect x="16" y="28" width="8" height="12" rx="1" className="fill-orange-100 stroke-orange-300"/><rect x="28" y="28" width="8" height="6" rx="1" className="fill-orange-100 stroke-orange-300"/><rect x="12" y="12" width="24" height="8" rx="2" className="fill-orange-100 stroke-orange-300"/></svg>
                <h2 className="text-2xl font-bold text-orange-600 mb-2">Welcome, {username || 'Vendor'}!</h2>
                <p className="text-gray-500 mb-6 text-center max-w-md">You haven’t added any venues yet. Click below to add your first venue and start receiving bookings.</p>
                <button
                  className="bg-blue-600 text-white px-6 py-3 rounded text-lg hover:bg-blue-700 transition mb-8"
                  onClick={() => {
                    const newVenueId = Date.now().toString();
                    router.push(`/admin/venues/${newVenueId}`);
                  }}
                >
                  + Add Venue
                </button>
                <div className="mt-4 text-sm text-gray-400">
                  <ul className="list-disc list-inside text-left">
                    <li>List your venue for free</li>
                    <li>Manage bookings easily</li>
                    <li>Reach more customers</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {venues.map((venue) => (
                  <div key={venue.id} className="border rounded-lg p-4 shadow flex flex-col md:flex-row md:items-center md:justify-between bg-white/60 backdrop-blur">
                    <div className="flex items-center gap-4">
                      {/* Venue Image */}
                      <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
                        {(!venue.images || venue.images.length === 0 || !venue.images[0]) ? (
                          <span className="text-gray-500 font-medium text-base select-none">Photo</span>
                        ) : (
                          <img src={venue.images[0]} alt={venue.name} className="object-cover w-full h-full" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-orange-600">{venue.name}</h3>
                        <p className="text-orange-500">{venue.location}</p>
                        <p className="text-gray-500">Capacity: {venue.capacity}</p>
                        <p className="text-gray-500">Occasion: {venue.occasion}</p>
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0">
                      <button
                        className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
                        onClick={() => router.push(`/admin/venues/${venue.id}`)}
                      >
                        Manage
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}