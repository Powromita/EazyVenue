import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from '../../../components/Header';
import { useAuth } from '../../../hooks/useAuth';

type Venue = {
  id: string;
  name: string;
  description?: string;
  capacity: number;
  price: number;
  contactNumber?: string;
  occasion?: string;
  images?: string[];
  isPosted: boolean;
  createdAt: string;
  owner: {
    id: string;
    name: string;
  };
};

export default function VenuesList() {
  const router = useRouter();
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  
  // Check authentication
  useAuth('VENUE_OWNER');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setToken(localStorage.getItem('token'));
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchVenues();
    }
  }, [token]);

  const fetchVenues = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/vendor/venues', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setVenues(data);
      } else {
        setError('Failed to fetch venues');
      }
    } catch (error) {
      console.error('Error fetching venues:', error);
      setError('Failed to fetch venues');
    } finally {
      setLoading(false);
    }
  };

  const handleViewVenue = (venueId: string) => {
    router.push(`/admin/venues/${venueId}/edit`);
  };

  const handleAddVenue = () => {
    router.push('/admin/venues/add');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
            <h1 className="text-3xl font-bold text-gray-800">Venue Management</h1>
            <div className="flex gap-4">
              <button
                onClick={handleAddVenue}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Venue
              </button>
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
          </div>

          {loading ? (
            <div className="text-center py-12 text-lg text-gray-500">Loading venues...</div>
          ) : error ? (
            <div className="text-center py-12 text-lg text-red-600">{error}</div>
          ) : venues.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No venues found</h3>
              <p className="text-gray-500">Get started by adding your first venue.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {venues.map((venue) => (
                <div key={venue.id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-t-lg">
                    {venue.images && venue.images.length > 0 ? (
                      <img
                        src={venue.images[0]}
                        alt={venue.name}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-200 rounded-t-lg flex items-center justify-center">
                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{venue.name}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        venue.isPosted 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {venue.isPosted ? 'Posted' : 'Draft'}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {venue.description || 'No description available'}
                    </p>
                    <div className="space-y-1 text-sm text-gray-600 mb-4">
                      <div><strong>Capacity:</strong> {venue.capacity} people</div>
                      <div><strong>Price:</strong> ${venue.price?.toLocaleString() || 'N/A'}</div>
                      {venue.occasion && (
                        <div><strong>Perfect for:</strong> {venue.occasion}</div>
                      )}
                      <div><strong>Owner:</strong> {venue.owner ? venue.owner.name : 'Unknown'}</div>
                      <div><strong>Added:</strong> {formatDate(venue.createdAt)}</div>
                    </div>
                    <button
                      onClick={() => handleViewVenue(venue.id)}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}