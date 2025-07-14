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

interface BookingCardProps {
  booking: Booking;
  onCancel?: (bookingId: string) => void;
}

export default function BookingCard({ booking, onCancel }: BookingCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (timeString: string) => {
    return timeString;
  };

  const handleCancel = async () => {
    if (!onCancel) return;
    
    if (confirm('Are you sure you want to cancel this booking?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/bookings/${booking.id}/status`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: 'CANCELLED' }),
        });

        if (response.ok) {
          onCancel(booking.id);
          alert('Booking cancelled successfully!');
        } else {
          const errorData = await response.json();
          alert(errorData.error || 'Failed to cancel booking');
        }
      } catch (error) {
        console.error('Error cancelling booking:', error);
        alert('An error occurred while cancelling the booking');
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {booking.venueName}
          </h3>
          <p className="text-gray-600 mb-1">
            <span className="font-medium">Event:</span> {booking.eventType}
          </p>
          <p className="text-gray-600 mb-1">
            <span className="font-medium">Date:</span> {formatDate(booking.eventDate)}
          </p>
          <p className="text-gray-600 mb-1">
            <span className="font-medium">Time:</span> {formatTime(booking.eventTime)}
          </p>
          <p className="text-gray-600 mb-1">
            <span className="font-medium">Guests:</span> {booking.guestCount} people
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
          {booking.status}
        </span>
      </div>
      
      <div className="border-t pt-4">
        <p className="text-sm text-gray-500 mb-3">
          <span className="font-medium">Contact:</span> {booking.contactName} ({booking.contactEmail})
        </p>
        <p className="text-sm text-gray-500 mb-4">
          <span className="font-medium">Booked on:</span> {formatDate(booking.createdAt)}
        </p>
        
        {/* Cancel Button - only show for PENDING and CONFIRMED bookings */}
        {booking.status !== 'CANCELLED' && (
  <button
    onClick={handleCancel}
    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
  >
    Cancel Booking
  </button>
)}
      </div>
    </div>
  );
} 