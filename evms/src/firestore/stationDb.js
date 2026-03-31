import { coreDb } from './coreDb';
export const registerStation = (data) => coreDb.add('stations', { ...data, status: 'LIVE' });
export const getAllStations = () => coreDb.list('stations');
export const getStationsByProvider = async (providerId) => {
  const stations = await coreDb.list('stations');
  return stations.filter(s => s.providerId === providerId);
};
