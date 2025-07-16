import React, { useEffect, useState } from 'react';
import Header from '../components/Header';

const VendorProfilePage = () => {
  // State for all fields
  const [businessName, setBusinessName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [username, setUsername] = useState('');
  const [address, setAddress] = useState('');
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [businessType, setBusinessType] = useState('');
  const [yearsInBusiness, setYearsInBusiness] = useState('');
  const [description, setDescription] = useState('');
  const [website, setWebsite] = useState('');
  const [venueTypes, setVenueTypes] = useState('');
  const [capacityRange, setCapacityRange] = useState('');
  const [amenities, setAmenities] = useState('');
  const [bookingPolicies, setBookingPolicies] = useState('');
  const [availabilityStatus, setAvailabilityStatus] = useState('');
  const [media, setMedia] = useState<FileList | null>(null);
  const [gst, setGst] = useState('');
  const [paymentMethods, setPaymentMethods] = useState('');
  const [pricingPackages, setPricingPackages] = useState('');
  const [certifications, setCertifications] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setEmail(localStorage.getItem('email') || '');
      setPhone(localStorage.getItem('phone') || '');
      setUsername(localStorage.getItem('username') || '');
      setMounted(true);

      // Fetch vendor profile data from backend
      const fetchProfile = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;
        try {
          const res = await fetch('http://localhost:5000/api/vendor/profile', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          if (res.ok) {
            const data = await res.json();
            const user = data.user || data;
            setBusinessName(user.businessName || '');
            setContactPerson(user.contactPerson || '');
            setEmail(user.email || '');
            setPhone(user.phone || '');
            setUsername(user.name || user.username || '');
            setAddress(user.address || '');
            setBusinessType(user.businessType || '');
            setYearsInBusiness(user.yearsInBusiness || '');
            setDescription(user.description || '');
            setWebsite(user.website || '');
            setVenueTypes(user.venueTypes || '');
            setCapacityRange(user.capacityRange || '');
            setAmenities(user.amenities || '');
            setBookingPolicies(user.bookingPolicies || '');
            setAvailabilityStatus(user.availabilityStatus || '');
            setGst(user.gst || '');
            setPaymentMethods(user.paymentMethods || '');
            setPricingPackages(user.pricingPackages || '');
            setCertifications(user.certifications || '');
            setEmergencyContact(user.emergencyContact || '');
          }
        } catch (err) {
          // Optionally handle error
        }
      };
      fetchProfile();
    }
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Not authenticated');
      // Prepare form data
      const body = {
        businessName,
        contactPerson,
        email,
        phone,
        username,
        address,
        businessType,
        yearsInBusiness,
        description,
        website,
        venueTypes,
        capacityRange,
        amenities,
        bookingPolicies,
        availabilityStatus,
        gst,
        paymentMethods,
        pricingPackages,
        certifications,
        emergencyContact,
      };
      // Send API request
      const res = await fetch('http://localhost:5000/api/vendor/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setMessage('Profile saved successfully!');
        // Update localStorage and notify Header
        localStorage.setItem('username', username);
        window.dispatchEvent(new Event('usernameChanged'));
      } else {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save profile');
      }
    } catch (err: any) {
      setMessage(err.message || 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200">
      <Header />
      <main className="max-w-3xl mx-auto p-6 mt-8 bg-white rounded-lg shadow-lg">
        <div className="flex items-center justify-between mb-8 border-b pb-4">
          <span className="text-xl font-bold text-blue-700">Vendor Profile</span>
        </div>
        {message && (
          <div className={`mb-4 text-center font-medium ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>{message}</div>
        )}
        <form onSubmit={handleSave}>
          {/* Basic Information */}
          <section className="mb-10">
            <h2 className="text-lg font-semibold mb-3 text-blue-700 border-b pb-2">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Business Name</label>
                <input type="text" value={businessName} onChange={e => setBusinessName(e.target.value)} className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Enter business name" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Contact Person Name</label>
                <input type="text" value={contactPerson} onChange={e => setContactPerson(e.target.value)} className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Enter contact person name" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Enter email" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Phone Number</label>
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Enter phone number" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-600 mb-1">Username</label>
                <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Enter username" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-600 mb-1">Business Address</label>
                <input type="text" value={address} onChange={e => setAddress(e.target.value)} className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Enter business address" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-600 mb-1">Profile Picture / Logo</label>
                <input type="file" className="w-full" onChange={e => setProfilePic(e.target.files?.[0] || null)} />
              </div>
            </div>
          </section>
          {/* Business Details */}
          <section className="mb-10">
            <h2 className="text-lg font-semibold mb-3 text-blue-700 border-b pb-2">Business Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Business Type</label>
                <input type="text" value={businessType} onChange={e => setBusinessType(e.target.value)} className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="e.g. Venue Owner, Event Planner" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Years in Business</label>
                <input type="number" value={yearsInBusiness} onChange={e => setYearsInBusiness(e.target.value)} className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="e.g. 5" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-600 mb-1">Description / About</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" rows={3} placeholder="Describe your business" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-600 mb-1">Website / Social Media Links</label>
                <input type="text" value={website} onChange={e => setWebsite(e.target.value)} className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="e.g. https://yourwebsite.com, Instagram, Facebook" />
              </div>
            </div>
          </section>
          {/* Venue Information */}
          <section className="mb-10">
            <h2 className="text-lg font-semibold mb-3 text-blue-700 border-b pb-2">Venue Information</h2>
            <div className="mb-4 text-gray-500 italic">List of venues you own or manage will appear here.</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Venue Types</label>
                <input type="text" value={venueTypes} onChange={e => setVenueTypes(e.target.value)} className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="e.g. Banquet Hall, Lawn, Conference Room" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Capacity Range</label>
                <input type="text" value={capacityRange} onChange={e => setCapacityRange(e.target.value)} className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="e.g. 50-500" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-600 mb-1">Amenities / Facilities Provided</label>
                <input type="text" value={amenities} onChange={e => setAmenities(e.target.value)} className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="e.g. Parking, WiFi, Catering" />
              </div>
            </div>
          </section>
          {/* Booking & Availability */}
          <section className="mb-10">
            <h2 className="text-lg font-semibold mb-3 text-blue-700 border-b pb-2">Booking & Availability</h2>
            <div className="mb-4 text-gray-500 italic">Your booking calendar or upcoming bookings will appear here.</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Booking Policies</label>
                <input type="text" value={bookingPolicies} onChange={e => setBookingPolicies(e.target.value)} className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="e.g. Cancellation, Deposit" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Availability Status</label>
                <input type="text" value={availabilityStatus} onChange={e => setAvailabilityStatus(e.target.value)} className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="e.g. Available, Fully Booked" />
              </div>
            </div>
          </section>
          {/* Media & Gallery */}
          <section className="mb-10">
            <h2 className="text-lg font-semibold mb-3 text-blue-700 border-b pb-2">Media & Gallery</h2>
            <div className="mb-4 text-gray-500 italic">Upload photos or videos of your venues/events.</div>
            <input type="file" multiple className="w-full" onChange={e => setMedia(e.target.files)} />
          </section>
          {/* Ratings & Reviews */}
          <section className="mb-10">
            <h2 className="text-lg font-semibold mb-3 text-blue-700 border-b pb-2">Ratings & Reviews</h2>
            <div className="mb-4 text-gray-500 italic">Your average rating and customer reviews will appear here.</div>
          </section>
          {/* Optional/Advanced Fields */}
          <section className="mb-10">
            <h2 className="text-lg font-semibold mb-3 text-blue-700 border-b pb-2">Additional Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-600 mb-1">GST/Tax ID</label>
                <input type="text" value={gst} onChange={e => setGst(e.target.value)} className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Enter GST/Tax ID" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Payment Methods Accepted</label>
                <input type="text" value={paymentMethods} onChange={e => setPaymentMethods(e.target.value)} className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="e.g. Credit Card, UPI, Cash" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Pricing Packages / Offers</label>
                <input type="text" value={pricingPackages} onChange={e => setPricingPackages(e.target.value)} className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Describe your packages or offers" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Certifications / Awards</label>
                <input type="text" value={certifications} onChange={e => setCertifications(e.target.value)} className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="List certifications or awards" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-600 mb-1">Emergency Contact</label>
                <input type="text" value={emergencyContact} onChange={e => setEmergencyContact(e.target.value)} className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Enter emergency contact details" />
              </div>
            </div>
          </section>
          {/* Account Management */}
          <section>
            <h2 className="text-lg font-semibold mb-3 text-blue-700 border-b pb-2">Account Management</h2>
            <div className="flex flex-col md:flex-row gap-4 mt-2">
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">Change Password</button>
              <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Logout</button>
            </div>
          </section>
        </form>
      </main>
    </div>
  );
};

export default VendorProfilePage; 