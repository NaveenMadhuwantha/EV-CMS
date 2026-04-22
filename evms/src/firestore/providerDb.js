import { coreDb } from './coreDb';
import { doc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { notificationDb } from './notificationDb';

export const submitProviderApplication = (uid, data) => coreDb.sync('providers', uid, { ...data, role: 'provider', status: 'PENDING' });
export const getAllProviders = () => coreDb.list('providers');
export const saveProviderProfile = (uid, data) => coreDb.sync('providers', uid, { ...data, role: 'provider', status: 'PENDING' });

export const requestProviderStatus = async (uid, userData) => {
  const result = await coreDb.sync('provider_requests', uid, {
    ...userData,
    status: 'PENDING',
    requestedAt: new Date()
  });

  // Notify Admins
  await notificationDb.send({
    recipientRole: 'admin',
    title: 'New Provider Request',
    message: `${userData.name} has requested to become a Service Provider.`,
    type: 'info',
    actionUrl: '/admin/providers'
  });

  return result;
};

export const getAllProviderRequests = () => coreDb.list('provider_requests');

export const approveProviderRequest = async (uid, requestData) => {
  // 1. Enable provider capabilities in 'users' collection without changing the primary role
  await updateDoc(doc(db, 'users', uid), {
    isProviderEnabled: true,
    providerStatus: 'ACTIVE'
  });

  // 2. Create entry in 'providers' collection to store business-specific data
  await setDoc(doc(db, 'providers', uid), {
    businessName: requestData.name,
    businessAddress: requestData.location || 'Private Home',
    contactEmail: requestData.email,
    role: 'owner', // Keep primary role as owner
    isHybrid: true,
    status: 'ACTIVE',
    approvedAt: new Date()
  });

  // 3. Update request status
  await updateDoc(doc(db, 'provider_requests', uid), {
    status: 'APPROVED',
    approvedAt: new Date()
  });

  // Notify the User
  await notificationDb.send({
    recipientId: uid,
    title: 'Application Approved!',
    message: 'Your request to become a Service Provider has been approved. You can now list your charging station.',
    type: 'success',
    actionUrl: '/provider/dashboard'
  });

  return { success: true };
};
