import { ethers } from 'ethers';
import AdminABI from '../abis/Admin.json';

export const getAdminContract = async () => {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const network = await provider.getNetwork();
  const address = AdminABI.networks?.[network.chainId]?.address;
  if (!address) throw new Error("Contract address not found for network");
  return new ethers.Contract(address, AdminABI.abi, signer);
};
