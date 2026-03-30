import { coreDb } from './coreDb';
export const getAllUsers = () => coreDb.list('users');
export const addUser = (data) => coreDb.add('users', data);
export const deleteUser = (id) => coreDb.remove('users', id);
