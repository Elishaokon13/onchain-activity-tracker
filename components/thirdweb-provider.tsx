"use client"

import { ThirdwebProvider as ThirdwebSDKProvider } from "@thirdweb-dev/react"
import { Ethereum, Optimism, Base, Arbitrum, Binance } from "@thirdweb-dev/chains"
import type { ReactNode } from "react"

export function ThirdwebProvider({ children }: { children: ReactNode }) {
  return (
    <ThirdwebSDKProvider 
      activeChain="ethereum"
      supportedChains={[Ethereum, Optimism, Base, Arbitrum, Binance]}
      clientId={process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || ""}
      autoConnect={false}
    >
      {children}
    </ThirdwebSDKProvider>
  )
}
