import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from '../../components/Header';
import { useSocket } from '../../hooks/useSocket';

type Venue = {
  id: string;
  name: string;
  description?: string;
  capacity: number;
  price?: number;
  contactNumber?: string;
  occasion?: string;
  images?: string[];
  isPosted: boolean;
  owner?: {
    id: string;
    name: string;
    email?: string;
  };
};

type Availability = {
  id: string;
  date: string;
  status: 'AVAILABLE' | 'BOOKED' | 'BLOCKED';
};

export default function VenueDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [venue, setVenue] = useState<Venue | null>(null);
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [loading, setLoading] = useState(true);
  const { joinVenue, leaveVenue, onAvailabilityUpdate } = useSocket();

  useEffect(() => {
    if (id) {
      fetchVenueDetails();
      fetchAvailability();
      
      // Join the venue room for real-time updates
      joinVenue(id as string);

      // Listen for availability updates
      onAvailabilityUpdate((data) => {
        if (data.venueId === id) {
          console.log('Availability updated for venue:', data);
          // Update the availability state
          setAvailability(prev => 
            prev.map(item => 
              item.date === data.date 
                ? { ...item, status: data.status }
                : item
            )
          );
        }
      });

      // Cleanup
      return () => {
        leaveVenue(id as string);
      };
    }
  }, [id]);

  const fetchVenueDetails = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/venues/${id}`);
      if (response.ok) {
        const data = await response.json();
        setVenue(data.venue);
      } else {
        console.error('Failed to fetch venue details');
      }
    } catch (error) {
      console.error('Error fetching venue details:', error);
    }
  };

  const fetchAvailability = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/venues/${id}/availability`);
      if (response.ok) {
        const data = await response.json();
        setAvailability(data.availability);
      } else {
        console.error('Failed to fetch availability');
      }
    } catch (error) {
      console.error('Error fetching availability:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAvailabilityColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return 'bg-green-100 text-green-800';
      case 'BOOKED':
        return 'bg-red-100 text-red-800';
      case 'BLOCKED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleBookNow = () => {
    router.push(`/booking/${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200">
        <Header />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center">Loading venue details...</div>
        </div>
      </div>
    );
  }

  if (!venue) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200">
        <Header />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center">Venue not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Venue Details */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {venue.images && venue.images.length > 0 && (
              <img
                src={venue.images[0]}
                alt={venue.name}
                className="w-full h-64 object-cover"
              />
            )}
            <div className="p-6">
              <h1 className="text-3xl font-bold text-gray-800 mb-4">{venue.name}</h1>
              {venue.description && (
                <p className="text-gray-600 mb-4">{venue.description}</p>
              )}
              <div className="space-y-2 text-gray-600">
                <p><strong>Capacity:</strong> {venue.capacity} people</p>
                {venue.occasion && (
                  <p><strong>Perfect for:</strong> {venue.occasion}</p>
                )}
                {venue.price && (
                  <p><strong>Starting at:</strong> ${venue.price.toLocaleString()}</p>
                )}
                {venue.contactNumber && (
                  <p><strong>Contact:</strong> {venue.contactNumber}</p>
                )}
              </div>
              <button
                onClick={handleBookNow}
                className="mt-6 w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Book Now
              </button>
            </div>
          </div>

          {/* Real-time Availability */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Real-time Availability</h2>
            <div className="space-y-4">
              {availability.length === 0 ? (
                <p className="text-gray-500">No availability data available.</p>
              ) : (
                <div>
                  <div className="grid grid-cols-7 gap-2">
                    {availability.map((item, index) => (
                      <div
                        key={item.id || index}
                        className={`p-3 rounded-lg text-center text-xs font-medium border transition-colors
                          ${item.status === 'AVAILABLE' ? 'bg-green-100 text-green-800 border-green-200' : ''}
                          ${item.status === 'BOOKED' ? 'bg-red-100 text-red-800 border-red-200' : ''}
                          ${item.status === 'BLOCKED' ? 'bg-gray-100 text-gray-800 border-gray-200' : ''}
                        `}
                      >
                        <div className="font-bold">
                          {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                        <div className="mt-1">
                          {item.status.charAt(0) + item.status.slice(1).toLowerCase()}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 text-sm text-gray-600 flex gap-6">
                    <span><span className="inline-block w-3 h-3 bg-green-100 border border-green-400 rounded mr-2 align-middle"></span> Available</span>
                    <span><span className="inline-block w-3 h-3 bg-red-100 border border-red-400 rounded mr-2 align-middle"></span> Booked</span>
                    <span><span className="inline-block w-3 h-3 bg-gray-100 border border-gray-400 rounded mr-2 align-middle"></span> Blocked</span>
                  </div>
                </div>
              )}
            </div>
            <div className="mt-8">
              <h2 className="text-xl font-bold text-gray-800 mb-2">Vendor Information</h2>
              {venue.owner ? (
                <div className="text-gray-700 mb-4">
                  <p><strong>Name:</strong> {venue.owner.name}</p>
                  {venue.owner.email && <p><strong>Email:</strong> {venue.owner.email}</p>}
                </div>
              ) : (
                <p className="text-gray-500">No vendor information available.</p>
              )}
              <h2 className="text-xl font-bold text-gray-800 mb-2 mt-6">Booked Dates</h2>
              {availability.filter(a => a.status === 'BOOKED').length === 0 ? (
                <p className="text-gray-500">No bookings yet.</p>
              ) : (
                <ul className="list-disc pl-5 text-gray-700">
                  {availability.filter(a => a.status === 'BOOKED').map((item, idx) => (
                    <li key={item.id || idx}>
                      {new Date(item.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 