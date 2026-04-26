import { coreDb } from './coreDb';
import { notificationDb } from './notificationDb';

export const registerStation = async (data) => {
  const result = await coreDb.add('stations', { ...data, status: 'LIVE' });
  
  await notificationDb.send({
    recipientRole: 'admin',
    title: 'New Charging Node Deployed',
    message: `Station ${data.stationName || 'Unknown'} has been registered and is now LIVE on the network.`,
    type: 'info',
    actionUrl: '/admin/dashboard'
  });
  
  return result;
};

export const getAllStations = () => coreDb.list('stations');
export const getStationsByProvider = async (providerId) => {
  const stations = await coreDb.list('stations');
  return stations.filter(s => s.providerId === providerId);
};

export const deleteStation = (id) => coreDb.remove('stations', id);

export const updateStationStatus = (id, status) => coreDb.update('stations', id, { status });

export const verifyStation = (id, isVerified) => coreDb.update('stations', id, { isVerified });
