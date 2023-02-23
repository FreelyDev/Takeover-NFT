import { Contract } from '@ethersproject/contracts'
import TAKEOVER_NFT_ABI from 'contracts/TAKEOVER_NFT.json'
import TAKEOVER_Token_ABI from 'contracts/TAKEOVER_Token.json'

export const Networks = {
  ETHMainNet: 1,
  GoerliTestNet: 5,
}

export const CONTRACTS_BY_NETWORK = {
  [Networks.ETHMainNet]: {
    TAKEOVER_NFT: {
      address: '0x890Fef874f6136d9648D0f9ab9Ed8b1273D7eDB3',
      abi: TAKEOVER_NFT_ABI,
    },
    TAKEOVER_Token: {
      address: '0xb41CC75E178c2393b4Ec98ED89fc0b2BAEB42D34',
      abi: TAKEOVER_Token_ABI,
    }
  },
  [Networks.GoerliTestNet]: {
    TAKEOVER_NFT: {
      address: '0xeB96765fFd2Eaa460350Dd8a5BFc5A971EF6080A',
      abi: TAKEOVER_NFT_ABI,
    },
    TAKEOVER_Token: {
      address: '0x63F26f7776b42a66D2d1e15D45772Ad1d6C3bE74',
      abi: TAKEOVER_Token_ABI,
    }
  }
}

export const currentNetwork = process.env.REACT_APP_NETWORK_ID;

export const baseApiUrl = process.env.REACT_APP_API_URL;

export function getContractInfo(name, chainId = null) {
  if (!chainId) chainId = currentNetwork;

  const contracts = CONTRACTS_BY_NETWORK?.[chainId];
  if (contracts) {
    return contracts?.[name];
  } else {
    return null;
  }
}

export function truncateWalletString(walletAddress) {
  if (!walletAddress) return walletAddress;
  const lengthStr = walletAddress.length;
  const startStr = walletAddress.substring(0, 7);
  const endStr = walletAddress.substring(lengthStr - 7, lengthStr);
  return startStr + '...' + endStr;
}

export function truncateHashString(txhash) {
  if (!txhash) return txhash;
  const lengthStr = txhash.length;
  const startStr = txhash.substring(0, 10);
  const endStr = txhash.substring(lengthStr - 10, lengthStr);
  return startStr + '...' + endStr;
}

export function getContractObj(name, chainId, provider) {
  const info = getContractInfo(name, chainId);
  return !!info && new Contract(info.address, info.abi, provider);
}

export function getContractObjWithAddress(name, chainId, provider, contractAddress) {
  const info = getContractInfo(name, chainId);
  return !!info && new Contract(contractAddress, info.abi, provider);
}

export const shorter = (str) =>
  str?.length > 8 ? str.slice(0, 6) + '...' + str.slice(-4) : str
