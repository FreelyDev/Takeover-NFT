import { InjectedConnector } from "@web3-react/injected-connector";
import { NetworkConnector } from "@web3-react/network-connector";
import { currentNetwork } from "./index"
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { WalletLinkConnector } from "@web3-react/walletlink-connector";

export const RPC_URLS = {
  1: "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
  3: "https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
  4: "https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
  5: "https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
  42: "https://kovan.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
  56: "https://bsc-dataseed.binance.org/",
  250: "https://rpc.ftm.tools",
  137: "https://polygon-rpc.com",
  43113: "https://api.avax-test.network/ext/bc/C/rpc",
  43114: "https://api.avax.network/ext/bc/C/rpc",
  25: "https://evm.cronos.org",
};

export const networkConnector = new NetworkConnector({
  urls: RPC_URLS,
  defaultChainId: parseInt(currentNetwork)
})

export const injectedConnector = new InjectedConnector({
  supportedChainIds: [parseInt(currentNetwork)],
});

export const walletConnector = new WalletConnectConnector({
  rpc: RPC_URLS,
  chainId: parseInt(currentNetwork),
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true
})

export const CoinbaseWallet = new WalletLinkConnector({
  url: RPC_URLS[currentNetwork],
  appName: "Coinbase Wallet",
  appLogoUrl: "https://images.ctfassets.net/q5ulk4bp65r7/1rFQCqoq8hipvVJSKdU3fQ/21ab733af7a8ab404e29b873ffb28348/coinbase-icon2.svg",
  supportedChainIds: [parseInt(currentNetwork)],
});

