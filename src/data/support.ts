export interface DonationMethod {
  id: string;
  name: string;
  symbol: string;
  network: string;
  address: string;
  link?: string;
  note?: string;
}

export const SUPPORT_STATEMENT = "EasyLM will always be free. Period. That's the point. However, the more support we receive, the more time we can spend adding capabilities, optimizing models, and refining the experience. If you would like to see EasyLM continue to thrive, please consider supporting our work.";

export const DONATION_METHODS: DonationMethod[] = [
  {
    id: 'btc',
    name: 'Bitcoin',
    symbol: 'BTC',
    network: 'Bitcoin Native (SegWit)',
    address: 'bc1q89c5mgtv9avlaadsh0504mvxl6znm2fl2yn99a',
    note: 'Send any amount of BTC'
  },
  {
    id: 'sol',
    name: 'Solana',
    symbol: 'SOL',
    network: 'Solana Mainnet',
    address: '8cpaA3wz7q4iesZfioCieCKXE1fsnBKLh9R9CoH4tEKN',
    note: 'Send SOL or USDC (SPL)'
  },
  {
    id: 'cashapp',
    name: 'Cash App',
    symbol: 'Cash App',
    network: '$cashtag',
    address: '$bluebarrels',
    link: 'https://cash.app/$bluebarrels',
    note: 'Send via Cash App'
  }
];
