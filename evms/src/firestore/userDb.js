import { coreDb } from './coreDb';
import { notificationDb } from './notificationDb';

export const getAllUsers = () => coreDb.list('users');
export const addUser = (data) => coreDb.add('users', data);
export const deleteUser = (id) => coreDb.remove('users', id);
export const updateUserStatus = async (id, status) => {
  const result = await coreDb.update('users', id, { status });
  
  if (status === 'SUSPENDED') {
    await notificationDb.send({
      recipientId: id,
      title: 'Account Suspended',
      message: 'Your account has been suspended by an administrator. Please contact support.',
      type: 'error',
      actionUrl: '/contact'
    });
  } else if (status === 'ACTIVE') {
    await notificationDb.send({
      recipientId: id,
      title: 'Account Reactivated',
      message: 'Your account has been reactivated. Welcome back!',
      type: 'success',
      actionUrl: '/dashboard'
    });
  }
  
  return result;
};
