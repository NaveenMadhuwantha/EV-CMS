import { coreDb } from './coreDb';
export const registerStation = (data) => coreDb.add('stations', { ...data, status: 'LIVE' });
export const getAllStations = () => coreDb.list('stations');
