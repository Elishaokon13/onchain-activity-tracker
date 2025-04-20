export type Chain = "ethereum" | "optimism" | "base" | "arbitrum" | "bnbchain"

interface ChainConfig {
  id: number
  label: string
  explorerUrl: string
  logoUrl: string
  color: string
}

export const CHAIN_CONFIGS: Record<Chain, ChainConfig> = {
  ethereum: {
    id: 1,
    label: "Ethereum",
    explorerUrl: "https://etherscan.io",
    logoUrl: "/chain-logos/ethereum.svg",
    color: "from-blue-500 to-blue-600"
  },
  optimism: {
    id: 10,
    label: "Optimism",
    explorerUrl: "https://optimistic.etherscan.io",
    logoUrl: "/chain-logos/optimism.svg",
    color: "from-red-500 to-red-600"
  },
  base: {
    id: 8453,
    label: "Base",
    explorerUrl: "https://basescan.org",
    logoUrl: "/chain-logos/base.svg",
    color: "from-blue-600 to-blue-800"
  },
  arbitrum: {
    id: 42161,
    label: "Arbitrum",
    explorerUrl: "https://arbiscan.io",
    logoUrl: "/chain-logos/arbitrum.svg",
    color: "from-blue-400 to-blue-500"
  },
  bnbchain: {
    id: 56,
    label: "BNB Chain",
    explorerUrl: "https://bscscan.com",
    logoUrl: "/chain-logos/bnb.svg",
    color: "from-yellow-500 to-yellow-600"
  },
}

export const SUPPORTED_CHAINS: Chain[] = ["ethereum", "optimism", "base", "arbitrum", "bnbchain"]

export function getChainConfig(chain: Chain): ChainConfig {
  return CHAIN_CONFIGS[chain]
}
