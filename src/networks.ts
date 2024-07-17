export interface Network {
  endpoint: string;
  decimals: number;
}

// Find network endpoints: https://github.com/polkadot-js/apps/tree/master/packages/apps-config/src/endpoints
export const POLKADOT: Network = {
  endpoint: 'wss://rpc.polkadot.io',
  decimals: 10,
};

export const ROCOCO: Network = {
  endpoint: 'wss://rococo-rpc.polkadot.io',
  decimals: 12,
};

export const WESTEND: Network = {
  endpoint: 'wss://westend-rpc.dwellir.com',
  decimals: 12,
};

export const WESTEND_PEOPLE: Network = {
  endpoint: 'wss://people-westend-rpc.dwellir.com',
  decimals: 12,
};
