"use client"

import { useAddress, ConnectWallet } from "@thirdweb-dev/react"
import { useEffect } from "react"
import { useWalletStore } from "@/lib/stores/wallet-store"

export function WalletConnect() {
  const address = useAddress()
  const { setWalletAddress, clearWalletAddress } = useWalletStore()

  useEffect(() => {
    // When address changes, update the wallet store
    if (address) {
      setWalletAddress(address)
    } else {
      // Clear wallet address when disconnected
      clearWalletAddress()
    }
  }, [address, setWalletAddress, clearWalletAddress])

  return (
    <div className="flex justify-center">
      <ConnectWallet
        theme="dark"
        btnTitle="Connect Wallet"
        modalTitle="Connect Your Wallet"
        modalSize="wide"
        welcomeScreen={{
          title: "Onchain Activity Tracker",
          subtitle: "Connect your wallet to view your onchain activity",
        }}
        modalTitleIconUrl="/placeholder.svg?height=32&width=32"
      />
    </div>
  )
}
