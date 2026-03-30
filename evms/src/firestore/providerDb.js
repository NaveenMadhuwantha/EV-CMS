import { coreDb } from './coreDb';
export const submitProviderApplication = (uid, data) => coreDb.sync('providers', uid, { ...data, role: 'provider', status: 'PENDING' });
export const getAllProviders = () => coreDb.list('providers');
export const saveProviderProfile = (uid, data) => coreDb.sync('providers', uid, { ...data, role: 'provider', status: 'PENDING' });
