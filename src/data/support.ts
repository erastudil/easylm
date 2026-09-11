export interface DonationMethod {
  id: string;
  name: string;
  symbol: string;
  network: string;
  address: string;
  link?: string;
  note?: string;
}

export const SUPPORT_STATEMENT = "EasyLM will always be free. Period. That's the point. However, the more donations I receive, the more time I can spend adding features and improving performance. If you would like to see EasyLM continue to improve, please consider making a donation.";

export const DONATION_METHODS: DonationMethod[] = [
  {
    id: 'btc',
    name: 'Bitcoin',
    symbol: 'BTC',
    network: 'Bitcoin Native',
    address: 'bc1qeasylm9v7x2k4p8w3z5n6m1t0y8h2u4g7j9s0',
    note: 'Send any amount of BTC'
  },
  {
    id: 'sol',
    name: 'Solana',
    symbol: 'SOL',
    network: 'Solana Mainnet',
    address: 'EasyLM7xGqL8rP3vK6mZ9wF1tN4bV2yH5uE8sA3jD1',
    note: 'Send SOL or USDC (SPL)'
  },
  {
    id: 'cashapp',
    name: 'Cash App',
    symbol: 'Cash App',
    network: '$cashtag',
    address: '$easylm',
    link: 'https://cash.app/$easylm',
    note: 'Send via Cash App'
  }
];
