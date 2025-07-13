import { useRouter } from 'next/router';
import { useEffect, useState, ChangeEvent } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import AdminHeader from '../../../components/AdminHeader';

type Venue = {
  id: string;
  name: string;
  location: string;
  capacity: number;
  price: number;
  description?: string;
  contactNumber?: string;
  occasion?: string;
  unavailableDates: string[];
  images: string[];
  isPosted?: boolean;
};

export default function VenueManagement() {
  const router = useRouter();
  const { id } = router.query;
  const [venue, setVenue] = useState<Venue | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [capacity, setCapacity] = useState(0);
  const [occasion, setOccasion] = useState('');
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [isPosted, setIsPosted] = useState(false);
  const [blockDate, setBlockDate] = useState<Date | null>(null);
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:5000/api/vendor/venues/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      })
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data) {
            setVenue(data);
            setName(data.name);
            setLocation(data.location);
            setCapacity(data.capacity);
            setOccasion(data.occasion || '');
            setImages(data.images || []);
            setPrice(data.price || 0);
            setDescription(data.description || '');
            setContactNumber(data.contactNumber || '');
            setIsPosted(data.isPosted || false);
          }
        });
    }
  }, [id]);

  if (!venue) {
    return (
      <div className="min-h-screen bg-orange-50">
        <AdminHeader />
        <main className="max-w-3xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-orange-600 mb-6">Manage Venue</h1>
          <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center justify-center min-h-[300px]">
            <button
              className="bg-blue-600 text-white px-6 py-3 rounded text-lg hover:bg-blue-700 transition"
              onClick={() => {
                setVenue({
                  id: Date.now().toString(),
                  name: '',
                  location: '',
                  capacity: 0,
                  price: 0,
                  description: '',
                  contactNumber: '',
                  occasion: '',
                  unavailableDates: [],
                  images: [],
                  isPosted: false, // Ensure isPosted is false when adding
                });
                setIsPosted(false); // Reset isPosted
                setEditMode(true);
              }}
            >
              + Add Venue
            </button>
          </div>
        </main>
      </div>
    );
  }

  // Update venue details (mock)
  const handleSave = async () => {
    if (!venue) return;
    const venueData = {
      name,
      location,
      capacity,
      price,
      description,
      contactNumber,
      occasion,
      images,
      isPosted,
    };
    const res = await fetch(`http://localhost:5000/api/vendor/venues/${venue.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(venueData),
    });
    if (res.ok) {
      setVenue({ ...venue, ...venueData });
      setEditMode(false);
    } else {
      const error = await res.json();
      alert(error.error || 'Failed to update venue');
    }
  };

  // Block a date (add to unavailableDates)
  const handleBlockDate = () => {
    if (blockDate) {
      const dateStr = blockDate.toISOString().split('T')[0];
      if (!venue.unavailableDates.includes(dateStr)) {
        setVenue({
          ...venue,
          unavailableDates: [...venue.unavailableDates, dateStr],
        });
        setBlockDate(null);
        // TODO: Send update to backend
      }
    }
  };

  // Unblock a date (remove from unavailableDates)
  const handleUnblockDate = (dateStr: string) => {
    setVenue({
      ...venue,
      unavailableDates: venue.unavailableDates.filter(d => d !== dateStr),
    });
    // TODO: Send update to backend
  };

  // Handle image upload (local preview)
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      filesArray.forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setImages(prev => [...prev, event.target!.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  // Remove image
  const handleRemoveImage = (img: string) => {
    setImages(images.filter(i => i !== img));
  };

  const handlePostVenue = async () => {
    console.log('Posting venue...');
    // Validate required fields
    if (!name || !location || !capacity || !price) {
      alert('Please fill all required fields (name, location, capacity, price).');
      return;
    }
    const venueData = {
      name,
      location,
      capacity,
      price,
      description,
      contactNumber,
      occasion,
      images,
      isPosted: true,
    };
    const res = await fetch('http://localhost:5000/api/vendor/venues', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(venueData),
    });
    if (res.ok) {
      setIsPosted(true); // Only disable after successful post
      router.push('/admin');
    } else {
      const error = await res.json();
      alert(error.error || 'Failed to post venue');
    }
  };

  return (
    <div className="min-h-screen bg-orange-50">
      <AdminHeader />
      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-orange-600 mb-6">Manage Venue</h1>
        <div className="bg-white rounded-xl shadow-lg p-8">
          {editMode ? (
            <div className="space-y-4 mb-6">
              <input
                type="text"
                className="w-full px-4 py-2 border rounded"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Venue Name"
              />
              <input
                type="text"
                className="w-full px-4 py-2 border rounded"
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="Location"
              />
              {/* Capacity field */}
              <label className="block font-semibold mb-1" htmlFor="capacity">Capacity</label>
              <input
                id="capacity"
                type="number"
                className="w-full px-4 py-2 border rounded"
                value={capacity === 0 ? '' : capacity}
                onChange={e => setCapacity(Number(e.target.value))}
                placeholder="Enter capacity"
              />
              {/* Price field */}
              <label className="block font-semibold mb-1 mt-4" htmlFor="price">Price</label>
              <input
                id="price"
                type="number"
                className="w-full px-4 py-2 border rounded"
                value={price === 0 ? '' : price}
                onChange={e => setPrice(Number(e.target.value))}
                placeholder="Enter price"
              />
              <textarea
                className="w-full px-4 py-2 border rounded"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Description"
              />
              <input
                type="text"
                className="w-full px-4 py-2 border rounded"
                value={contactNumber}
                onChange={e => setContactNumber(e.target.value)}
                placeholder="Contact Number"
              />
              <input
                type="text"
                className="w-full px-4 py-2 border rounded"
                value={occasion}
                onChange={e => setOccasion(e.target.value)}
                placeholder="Occasion"
              />
              <div>
                <label className="block font-semibold mb-2">Venue Images</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="mb-2"
                />
                <div className="flex flex-wrap gap-2">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative">
                      <img src={img} alt={`Venue ${idx}`} className="w-24 h-24 object-cover rounded" />
                      <button
                        type="button"
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                        onClick={() => handleRemoveImage(img)}
                        title="Remove"
                      >×</button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900"
                  onClick={handleSave}
                >
                  Save
                </button>
                <button
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                  onClick={() => setEditMode(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">{venue.name}</h2>
              <p className="text-gray-500 mb-1">{venue.location}</p>
              <p className="text-gray-400 mb-1">Capacity: {venue.capacity}</p>
              <p className="text-gray-400 mb-1">Price: ₹{venue.price}</p>
              <p className="text-gray-400 mb-1">Description: {venue.description || 'N/A'}</p>
              <p className="text-gray-400 mb-1">Contact: {venue.contactNumber || 'N/A'}</p>
              <p className="text-gray-400 mb-1">Occasion: {venue.occasion}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {images.length === 0 && <span className="text-gray-400">No images uploaded</span>}
                {images.map((img, idx) => (
                  <img key={idx} src={img} alt={`Venue ${idx}`} className="w-24 h-24 object-cover rounded" />
                ))}
              </div>
            </div>
          )}
          {/* Unavailable Dates section moved between details and post button */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-orange-500 mb-2">Unavailable Dates</h3>
            <div className="flex flex-wrap gap-2 mb-2">
              {venue.unavailableDates.length === 0 && (
                <span className="text-gray-400">No blocked dates</span>
              )}
              {venue.unavailableDates.map(dateStr => (
                <span
                  key={dateStr}
                  className="bg-red-200 text-red-700 px-3 py-1 rounded flex items-center gap-2"
                >
                  {dateStr}
                  <button
                    className="ml-1 text-xs text-red-700 hover:underline"
                    onClick={() => handleUnblockDate(dateStr)}
                    title="Unblock date"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <DatePicker
                selected={blockDate}
                onChange={(d: Date | null) => setBlockDate(d)}
                placeholderText="Block a date"
                className="px-3 py-2 border rounded"
                dateFormat="yyyy-MM-dd"
              />
              <button
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                onClick={handleBlockDate}
                disabled={!blockDate}
              >
                Block Date
              </button>
            </div>
          </div>
          {/* Post Venue button at the bottom */}
          <div className="flex gap-4 mt-4">
            <button
              className={`px-4 py-2 rounded ${isPosted ? 'bg-green-500 text-white' : 'bg-blue-600 text-white hover:bg-blue-700 transition'}`}
              onClick={handlePostVenue}
              disabled={isPosted && !editMode} // Only disable if posted and not in edit mode
            >
              {isPosted ? 'Posted' : 'Post Venue'}
            </button>
            {/* Only show Edit and Cancel buttons after venue is added (in view mode) */}
            {!editMode && venue && (
              <>
                <button
                  className="px-4 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300"
                  onClick={() => setEditMode(true)}
                >
                  Edit Venue
                </button>
                <button
                  className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                  onClick={() => {
                    window.location.href = '/admin';
                  }}
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}