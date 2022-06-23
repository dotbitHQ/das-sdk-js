import {
  DasSupportedNetwork,
  RequestArguments,
} from '.';

export type DasSupportedNetworks = typeof DasSupportedNetwork.type

export type NamingServiceSource = {
  // data source，either provider or url
  url?: string,
  provider?: Provider,
  avatarResolver?: string, // the base of the service resolving avatar, default is https://display.did.id/avatar/resolve
};

export type DasSource = NamingServiceSource & {
  network?: DasSupportedNetworks,
}

export enum NamingServiceName {
  DAS = 'DAS',
}

export type ResolutionMethod = NamingServiceName

/**
 * @see https://eips.ethereum.org/EIPS/eip-1193
 */
export interface Provider {
  request: (request: RequestArguments) => Promise<unknown>;
}
export type CryptoRecords = Record<string, string>;

export interface KeyDescriptor {
  type: 'blockchain',
  key_info: {
    // The coin_type from https://github.com/satoshilabs/slips/blob/master/slip-0044.md
    // It currently support ETH/TRX/BNB/MATIC
    coin_type: string,
    // The chain_id from https://chainlist.org/
    // Used to identify different EVM-compatible chains such as ETH/BSC/MATIC
    chain_id?: string,
    key?: string
  }
}

export enum CoinType {
  ETH = '60',
  TRX = '195',
  BNB = '714',
  MATIC = '966',
}

export enum ChainId {
  ETH = '1',
  BSC = '56',
  Polygon = '137',
}
