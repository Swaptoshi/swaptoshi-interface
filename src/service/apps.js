import { serviceGET } from './node';

export const getBlockchainApps = async () => {
  const apps = await serviceGET('/api/v3/blockchain/apps/meta?search=Swaptoshi');
  return apps;
};
