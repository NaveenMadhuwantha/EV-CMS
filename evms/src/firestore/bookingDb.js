import { coreDb } from './coreDb';
export const createBooking = (data) => coreDb.add('bookings', { ...data, status: 'PENDING' });
export const updateBookingStatus = (id, data) => coreDb.update('bookings', id, data);
export const getAllBookings = () => coreDb.list('bookings');
