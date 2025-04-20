"use client"

import { useState, useEffect } from "react"
import { useWalletStore } from "@/lib/stores/wallet-store"
import { ChainSelector } from "@/components/chain-selector"
import { ActivityHeatmap } from "@/components/activity-heatmap"
import { ActivityScore } from "@/components/activity-score"
import { ShareButton } from "@/components/share-button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { fetchTransactionCount } from "@/lib/api/thirdweb-insight"
import { type Chain, getChainConfig } from "@/lib/chains"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

// Sample data for testing when API fails
function generateSampleData() {
  const sampleData: Record<string, number> = {}
  const today = new Date()
  
  for (let i = 0; i < 365; i++) {
    const date = new Date()
    date.setDate(today.getDate() - i)
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
    
    // Random activity count between 0-5, with more recent dates having higher probability of activity
    const probability = Math.max(0, 1 - (i / 100))
    sampleData[dateStr] = Math.random() < probability ? Math.floor(Math.random() * 5) + 1 : 0
  }
  
  return sampleData
}

export function TrackerDashboard() {
  const { walletAddress } = useWalletStore()
  const [selectedChain, setSelectedChain] = useState<Chain>("ethereum")
  const [activityData, setActivityData] = useState<Record<string, number>>({})
  const [totalScore, setTotalScore] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [usingSampleData, setUsingSampleData] = useState(false)

  useEffect(() => {
    async function loadActivityData() {
      if (!walletAddress) return

      setIsLoading(true)
      setError(null)
      setUsingSampleData(false)

      try {
        console.log("Loading activity data for wallet:", walletAddress);
        const chainConfig = getChainConfig(selectedChain)
        const data = await fetchTransactionCount(walletAddress, chainConfig.id)

        setActivityData(data)
        setTotalScore(Object.values(data).reduce((sum, count) => sum + count, 0))
        
        // The API now uses fallback data internally if there's an error,
        // so this doesn't necessarily mean we're using manually generated sample data
        const hasActivity = Object.values(data).some(count => count > 0);
        if (hasActivity) {
          console.log("Successfully loaded activity data with transactions");
        } else {
          console.log("No transaction activity found for this wallet on this chain");
        }
      } catch (err: any) {
        console.error("Error fetching activity data:", err)
        setError(`Failed to load activity data: ${err.message || "Unknown error"}. Try again or use sample data.`)
      } finally {
        setIsLoading(false)
      }
    }

    loadActivityData()
  }, [walletAddress, selectedChain])

  const handleUseSampleData = () => {
    const sampleData = generateSampleData()
    setActivityData(sampleData)
    setTotalScore(Object.values(sampleData).reduce((sum, count) => sum + count, 0))
    setUsingSampleData(true)
    setError(null)
  }

  const handleRefresh = () => {
    if (walletAddress) {
      setIsLoading(true)
      setError(null)
      setUsingSampleData(false)
      
      // Force clear cache by using setTimeout
      setTimeout(async () => {
        try {
          const chainConfig = getChainConfig(selectedChain)
          const data = await fetchTransactionCount(walletAddress, chainConfig.id)
          
          setActivityData(data)
          setTotalScore(Object.values(data).reduce((sum, count) => sum + count, 0))
        } catch (err: any) {
          console.error("Error refreshing activity data:", err)
          setError(`Failed to refresh data: ${err.message || "Unknown error"}`)
        } finally {
          setIsLoading(false)
        }
      }, 100)
    }
  }

  if (!walletAddress) {
    return (
      <Card className="border shadow-md hover:shadow-lg transition-all duration-300 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
        <CardHeader className="border-b border-slate-100 dark:border-slate-700">
          <CardTitle className="text-2xl font-bold">Your Activity Dashboard</CardTitle>
          <CardDescription className="text-slate-500 dark:text-slate-400">Connect your wallet to view your onchain activity.</CardDescription>
        </CardHeader>
        <CardContent className="h-96 flex items-center justify-center text-muted-foreground">
          <div className="flex flex-col items-center gap-4">
            <svg className="h-20 w-20 text-muted-foreground/30" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <p className="text-lg font-medium">No wallet connected</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border shadow-md hover:shadow-lg transition-all duration-300 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
      <CardHeader className="border-b border-slate-100 dark:border-slate-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-2xl font-bold">Your Activity Dashboard</CardTitle>
            <CardDescription className="text-slate-500 dark:text-slate-400">
              {usingSampleData ? "Viewing sample data for demonstration" : "View your onchain activity across different chains"}
            </CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <ChainSelector selectedChain={selectedChain} onSelectChain={setSelectedChain} />
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh} 
              disabled={isLoading}
              className="h-9 px-2"
            >
              {isLoading ? "Loading..." : "Refresh"}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-5">
        {error && (
          <Alert variant="destructive" className="border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-900/20 dark:text-red-300">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription className="flex flex-col gap-3">
              <p>{error}</p>
              <Button 
                onClick={handleUseSampleData} 
                variant="outline" 
                className="self-start"
              >
                Use Sample Data
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <ActivityHeatmap data={activityData} isLoading={isLoading} />
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <ActivityScore score={totalScore} chain={selectedChain} isLoading={isLoading} />
          <ShareButton score={totalScore} chain={selectedChain} address={walletAddress} />
        </div>
      </CardContent>
    </Card>
  )
}
