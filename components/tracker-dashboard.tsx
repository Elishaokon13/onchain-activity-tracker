"use client"

import { useState, useEffect } from "react"
import { useWalletStore } from "@/lib/stores/wallet-store"
import { ChainSelector } from "@/components/chain-selector"
import { ActivityHeatmap } from "@/components/activity-heatmap"
import { ActivityScore } from "@/components/activity-score"
import { ShareButton } from "@/components/share-button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { fetchTransactionCount } from "@/lib/api/alchemy"
import { type Chain, getChainConfig } from "@/lib/chains"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export function TrackerDashboard() {
  const { walletAddress } = useWalletStore()
  const [selectedChain, setSelectedChain] = useState<Chain>("ethereum")
  const [activityData, setActivityData] = useState<Record<string, number>>({})
  const [totalScore, setTotalScore] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadActivityData() {
      if (!walletAddress) return

      setIsLoading(true)
      setError(null)

      try {
        const chainConfig = getChainConfig(selectedChain)
        const data = await fetchTransactionCount(walletAddress, chainConfig.alchemyNetwork)

        setActivityData(data)
        setTotalScore(Object.values(data).reduce((sum, count) => sum + count, 0))
      } catch (err) {
        console.error("Error fetching activity data:", err)
        setError("Failed to load activity data. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    loadActivityData()
  }, [walletAddress, selectedChain])

  if (!walletAddress) {
    return (
      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle>Your Activity Dashboard</CardTitle>
          <CardDescription>Connect your wallet to view your onchain activity.</CardDescription>
        </CardHeader>
        <CardContent className="h-96 flex items-center justify-center text-muted-foreground">
          No wallet connected
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle>Your Activity Dashboard</CardTitle>
            <CardDescription>View your onchain activity across different chains</CardDescription>
          </div>
          <ChainSelector selectedChain={selectedChain} onSelectChain={setSelectedChain} />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-12 w-32" />
          </div>
        ) : (
          <>
            <ActivityHeatmap data={activityData} />
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <ActivityScore score={totalScore} chain={selectedChain} />
              <ShareButton score={totalScore} chain={selectedChain} address={walletAddress} />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
