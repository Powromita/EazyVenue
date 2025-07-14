import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io('http://localhost:5000', {
      withCredentials: true,
    });

    // Connection event handlers
    socketRef.current.on('connect', () => {
      console.log('Connected to server');
    });

    socketRef.current.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const joinVenue = (venueId: string) => {
    if (socketRef.current) {
      socketRef.current.emit('join-venue', venueId);
    }
  };

  const leaveVenue = (venueId: string) => {
    if (socketRef.current) {
      socketRef.current.emit('leave-venue', venueId);
    }
  };

  const onAvailabilityUpdate = (callback: (data: any) => void) => {
    if (socketRef.current) {
      socketRef.current.on('availability-updated', callback);
    }
  };

  return {
    socket: socketRef.current,
    joinVenue,
    leaveVenue,
    onAvailabilityUpdate,
  };
}; 