import { create } from "zustand"
import { persist } from "zustand/middleware"

interface WalletState {
  walletAddress: string | null
  setWalletAddress: (address: string) => void
  clearWalletAddress: () => void
}

export const useWalletStore = create<WalletState>()(
  persist(
    (set) => ({
      walletAddress: null,
      setWalletAddress: (address) => set({ walletAddress: address }),
      clearWalletAddress: () => set({ walletAddress: null }),
    }),
    {
      name: "wallet-storage",
    },
  ),
)
