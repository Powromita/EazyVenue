import Header from '../components/Header';
import VenueSearchBar from '../components/VenueSearchBar';
import VenueCard from '../components/VenueCard';
import BookingCard from '../components/BookingCard';
import { useState, useEffect } from 'react';
import Footer from '../components/Footer';
import { API_ENDPOINTS } from '../utils/config';

type Venue = {
  id: string;
  name: string;
  location?: string;
  capacity: number;
  occasion?: string;
  imageUrl?: string;
  price?: number;
  description?: string;
};

type Booking = {
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
};

export default function Home() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  useEffect(() => {
    fetchVenues();
  }, []);

  const fetchVenues = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.VENUES);
      if (response.ok) {
        const data = await response.json();
        // Transform the data to match our frontend structure
        const transformedVenues = data.venues.map((venue: any) => ({
          id: venue.id,
          name: venue.name,
          location: venue.location || 'Location not specified', // Use default if location is missing
          capacity: venue.capacity,
          occasion: venue.occasion,
          imageUrl: venue.images?.[0] || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
          price: venue.price,
          description: venue.description
        }));
        setVenues(transformedVenues);
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

  const enableLocation = () => {
    setLocationLoading(true);
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      setLocationLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        setLocationEnabled(true);
        setLocationLoading(false);
        alert('Location enabled! We\'ll use this to show you nearby venues.');
      },
      (error) => {
        console.error('Error getting location:', error);
        setLocationLoading(false);
        let errorMessage = 'Unable to get your location';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location permission denied. Please enable location services in your browser settings.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out.';
            break;
        }
        alert(errorMessage);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  };

  // Updated search handler
  const handleSearch = (query: string, place: string, occasion: string, date: Date | null) => {
    // For now, we'll do client-side filtering
    // In a real app, you'd send these parameters to the backend
    const filteredVenues = venues.filter(
      v =>
        v.name.toLowerCase().includes(query.toLowerCase()) &&
        v.location?.toLowerCase().includes(place.toLowerCase()) &&
        (v.occasion?.toLowerCase().includes(occasion.toLowerCase()) || occasion === '')
    );
    setVenues(filteredVenues);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200">
        <Header />
        <main className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center">Loading venues...</div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200">
        <Header />
        <main className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center text-red-600">{error}</div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-100 to-purple-200">
      <Header />
      <main className="flex-1 max-w-6xl mx-auto px-4 py-8 w-full">
        {/* Venues Section */}
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Available Venues</h2>
        {/* Search Bar with Location Button */}
        <div className="mb-4">
          <VenueSearchBar onSearch={handleSearch} />
        </div>
        {/* Location Button and Message */}
        <div className="flex items-center gap-4 mb-6">
          {locationEnabled ? (
            <div className="flex items-center gap-2 text-green-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="font-medium">Location Enabled</span>
            </div>
          ) : (
            <button
              onClick={enableLocation}
              disabled={locationLoading}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {locationLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Getting Location...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Turn On Location
                </>
              )}
            </button>
          )}
          <p className="text-sm text-gray-600">
            Enable location to find venues near you and get personalized recommendations
          </p>
        </div>
        {/* Responsive Grid for Venue Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 w-full">
          {venues.map((venue) => (
            <VenueCard key={venue.id} venue={venue} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}