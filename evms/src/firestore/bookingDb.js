import { db } from '../config/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { coreDb } from './coreDb';
import { notificationDb } from './notificationDb';

export const createBooking = async (data) => {
  const result = await coreDb.add('bookings', { ...data, status: 'PENDING' });

  // Notify Provider
  if (data.providerId) {
    await notificationDb.send({
      recipientId: data.providerId,
      title: 'New Booking Request',
      message: `A new session has been booked for your station at ${data.timeSlot || 'scheduled time'}.`,
      type: 'info',
      actionUrl: '/provider/bookings'
    });
  }

  // Notify Owner (Confirmation)
  if (data.userId) {
     await notificationDb.send({
      recipientId: data.userId,
      title: 'Booking Confirmed!',
      message: `Your booking for ${data.stationName || 'the station'} has been received.`,
      type: 'success',
      actionUrl: '/owner/dashboard'
    });
  }

  return result;
};

export const getBookingsByProvider = async (providerId) => {
  try {
    const q = query(collection(db, 'bookings'), where('providerId', '==', providerId), orderBy('timestamp', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Fetch bookings error:", error);
    return [];
  }
};

export const updateBookingStatus = async (id, data) => {
  const result = await coreDb.update('bookings', id, data);
  
  if (data.status) {
    const booking = await coreDb.get('bookings', id);
    if (booking && booking.userId) {
      let title = 'Booking Update';
      let type = 'info';
      let message = `Your booking for ${booking.stationName || 'the station'} has been updated to ${data.status}.`;
      
      if (data.status === 'APPROVED' || data.status === 'CONFIRMED' || data.status === 'COMPLETED') {
        type = 'success';
        title = 'Booking ' + (data.status === 'COMPLETED' ? 'Completed' : 'Confirmed');
        message = `Your booking for ${booking.stationName || 'the station'} has been ${data.status.toLowerCase()}!`;
      } else if (data.status === 'REJECTED' || data.status === 'CANCELLED') {
        type = 'error';
        title = 'Booking ' + (data.status === 'REJECTED' ? 'Rejected' : 'Cancelled');
        message = `Your booking for ${booking.stationName || 'the station'} was ${data.status.toLowerCase()}.`;
      }
      
      await notificationDb.send({
        recipientId: booking.userId,
        title,
        message,
        type,
        actionUrl: '/owner/dashboard'
      });
    }
  }
  return result;
};

export const getAllBookings = () => coreDb.list('bookings');
