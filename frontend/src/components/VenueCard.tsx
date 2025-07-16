import { useRef, useEffect, useState } from 'react';

type Venue = {
  id: string;
  name: string;
  location?: string;
  capacity: number;
  imageUrl?: string;
  occasion?: string;
};

export default function VenueCard({ venue }: { venue: Venue }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`bg-white rounded-xl shadow-lg overflow-hidden flex flex-col hover:shadow-2xl transition-shadow min-w-[280px] max-w-xs transform transition-opacity duration-700 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
    >
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