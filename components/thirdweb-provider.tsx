"use client"

import { ThirdwebProvider as ThirdwebSDKProvider } from "@thirdweb-dev/react"
import type { ReactNode } from "react"

// Supported chains
const activeChain = {
  ethereum: "ethereum",
  optimism: "optimism",
  base: "base",
  arbitrum: "arbitrum",
  bnbchain: "binance",
  sonic: "sonic",
  unichain: "unichain",
}

export function ThirdwebProvider({ children }: { children: ReactNode }) {
  return (
    <ThirdwebSDKProvider activeChain={activeChain} clientId={process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || ""}>
      {children}
    </ThirdwebSDKProvider>
  )
}
