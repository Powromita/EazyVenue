import Header from '../components/Header';
import VenueSearchBar from '../components/VenueSearchBar';
import VenueCard from '../components/VenueCard';
import { useState } from 'react';

const mockVenues = [
  {
    id: '1',
    name: 'Grand Hall',
    location: 'Downtown',
    capacity: 200,
    occasion: 'Wedding',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: '2',
    name: 'Sunset Gardens',
    location: 'Uptown',
    capacity: 120,
    occasion: 'Birthday',
    imageUrl: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80',
  },
  // Add more venues with different occasions
];

export default function Home() {
  const [venues, setVenues] = useState(mockVenues);

  // Updated search handler
  const handleSearch = (query: string, place: string, occasion: string, date: Date | null) => {
    setVenues(
      mockVenues.filter(
        v =>
          v.name.toLowerCase().includes(query.toLowerCase()) &&
          v.location.toLowerCase().includes(place.toLowerCase()) &&
          v.occasion.toLowerCase().includes(occasion.toLowerCase())
      )
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <VenueSearchBar onSearch={handleSearch} />
        <div className="overflow-x-auto">
          <div className="flex gap-6">
            {venues.map((venue) => (
              <VenueCard key={venue.id} venue={venue} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}