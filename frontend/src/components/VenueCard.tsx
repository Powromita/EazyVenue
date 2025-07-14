type Venue = {
  id: string;
  name: string;
  location?: string;
  capacity: number;
  imageUrl?: string;
  occasion?: string;
};

export default function VenueCard({ venue }: { venue: Venue }) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col hover:shadow-2xl transition-shadow min-w-[280px] max-w-xs">
      <img
        src={venue.imageUrl || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80'}
        alt={venue.name}
        className="w-full h-40 object-cover"
      />
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-xl font-bold text-gray-800 mb-1">{venue.name}</h3>
        {venue.location && (
          <p className="text-gray-500 mb-1">{venue.location}</p>
        )}
        <p className="text-gray-400 mb-2">Capacity: {venue.capacity}</p>
        <div className="mt-auto space-y-2">
          <a
            href={`/venue/${venue.id}`}
            className="block bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 text-center transition-colors"
          >
            View Details
          </a>
          <a
            href={`/booking/${venue.id}`}
            className="block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-center transition-colors"
          >
            Book Now
          </a>
        </div>
      </div>
    </div>
  );
}