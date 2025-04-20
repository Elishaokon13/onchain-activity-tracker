export type Chain = "ethereum" | "optimism" | "base" | "arbitrum" | "bnbchain" | "sonic" | "unichain"

interface ChainConfig {
  id: number
  label: string
  alchemyNetwork: string
  explorerUrl: string
}

export const CHAIN_CONFIGS: Record<Chain, ChainConfig> = {
  ethereum: {
    id: 1,
    label: "Ethereum",
    alchemyNetwork: "eth-mainnet",
    explorerUrl: "https://etherscan.io",
  },
  optimism: {
    id: 10,
    label: "Optimism",
    alchemyNetwork: "opt-mainnet",
    explorerUrl: "https://optimistic.etherscan.io",
  },
  base: {
    id: 8453,
    label: "Base",
    alchemyNetwork: "base-mainnet",
    explorerUrl: "https://basescan.org",
  },
  arbitrum: {
    id: 42161,
    label: "Arbitrum",
    alchemyNetwork: "arb-mainnet",
    explorerUrl: "https://arbiscan.io",
  },
  bnbchain: {
    id: 56,
    label: "BNB Chain",
    alchemyNetwork: "bsc-mainnet",
    explorerUrl: "https://bscscan.com",
  },
  sonic: {
    id: 64165,
    label: "Sonic",
    alchemyNetwork: "sonic-mainnet",
    explorerUrl: "https://explorer.sonic.org",
  },
  unichain: {
    id: 1337,
    label: "Unichain",
    alchemyNetwork: "unichain-mainnet",
    explorerUrl: "https://explorer.unichain.network",
  },
}

export const SUPPORTED_CHAINS: Chain[] = ["ethereum", "optimism", "base", "arbitrum", "bnbchain", "sonic", "unichain"]

export function getChainConfig(chain: Chain): ChainConfig {
  return CHAIN_CONFIGS[chain]
}
