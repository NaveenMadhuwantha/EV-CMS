import { coreDb } from './coreDb';
export const saveOwnerProfile = async (uid, data, newsChecked) => 
  coreDb.sync('users', uid, { 
    ...data, 
    role: 'owner', 
    isTermsAccepted: true, 
    isSubscribedToNews: newsChecked 
  });
