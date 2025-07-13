type Venue = {
  id: string;
  name: string;
  location: string;
  capacity: number;
  imageUrl?: string;
  occasion?: string;
};

export default function VenueCard({ venue }: { venue: Venue }) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col hover:shadow-2xl transition-shadow min-w-[280px] max-w-xs">
      <img
        src={venue.imageUrl || '/placeholder.jpg'}
        alt={venue.name}
        className="w-full h-40 object-cover"
      />
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-xl font-bold text-gray-800 mb-1">{venue.name}</h3>
        <p className="text-gray-500 mb-1">{venue.location}</p>
        <p className="text-gray-400 mb-2">Capacity: {venue.capacity}</p>
        <a
          href={`/venues/${venue.id}`}
          className="mt-auto inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-center"
        >
          View Details
        </a>
      </div>
    </div>
  );
}