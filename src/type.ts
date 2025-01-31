export interface TokenInfo {
  chain: string;
  address: string;
  creator_address: string;
  symbol: string;
  name: string;
  decimals: number;
  logo: string;
  total_supply: number;
  launchpad: string;
  launchpad_status: string;
  creation_timestamp: number;
}

export interface SignalInfo {
  signal_count: number;
  first_time: number;
  first_price: number;
  max_price: number;
  max_price_gain: number;
  signal_tags: string[];
  token_level: string;
}

export interface MetricsInfo {
  pair: string;
  token_reserve: number;
  price: number;
  liquidity: number;
  volume_24h: number;
  market_cap: number;
  holder_count: number;
  top10_position: number;
}

export interface SafeInfo {
  solana: {
      is_mint_abandoned: number;
      is_block_address: number;
  };
}

export interface SocialInfo {
  uri: string;
  logo: string;
  telegram: string;
  discord: string;
  website: string;
  description: string;
  twitter: string;
}

export interface TokenTags {
  [tokenAddress: string]: string[];
}

export interface MetaData {
  tokens: {
      [tokenAddress: string]: TokenInfo;
  };
  signals: {
      [tokenAddress: string]: SignalInfo;
  };
  metrics: {
      [tokenAddress: string]: MetricsInfo;
  };
  safe_info: {
      [tokenAddress: string]: SafeInfo;
  };
  social_info: {
      [tokenAddress: string]: SocialInfo;
  };
  token_tags: TokenTags;
}

export interface WalletStats {
  alias: string;
  amount: string;
  amount_origin: number;
  last_trade_time: number;
  price: string;
  token: string;
  token_symbol: string;
  volume: string;
  wallet: string;
}

export interface TokenTradingStat {
  fdv: number;
  holders: number;
  lastUpdateTime: number;
  liquidity: number;
  mkt_cap: number;
  percent12h: number;
  percent1h: number;
  percent1m: number;
  percent24h: number;
  percent5m: number;
  volume_12h: number;
  volume_1h: number;
  volume_1minutes: number;
  volume_24h: number;
  volume_5minutes: number;
  volume_6h: number;
}

export interface RecordData {
  chain: string;
  last_price: null;
  strategy_id: number;
  swap: string;
  token: string;
  token_symbol: string;
  token_trading_stat: TokenTradingStat;
  user_id: number;
  wallet_stats: WalletStats[];
}

export interface MonitorData {
  monitor_type: string;
  record_data: RecordData;
  unix_time: number;
  version: string;
}

export interface StrategyInfo {
  group_id: number;
  group_name: string;
  group_type: string;
  strategy_id: number;
  user_id: number;
}

export interface Meta {
  create_time: number;
  deleted: boolean;
  id: string;
  read: boolean;
  strategy_info: StrategyInfo;
}

export interface Result {
  _id: string;
  meta: Meta;
  monitor_data: MonitorData;
}

export interface ResponseData {
  meta: MetaData;
  results: Result[];
  next: string;
  total: number;
}

export interface ApiResponse {
  code: number;
  description: string;
  data: ResponseData;
}


