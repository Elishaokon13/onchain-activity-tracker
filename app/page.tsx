import { Suspense } from "react"
import { TrackerDashboard } from "@/components/tracker-dashboard"
import { WalletConnect } from "@/components/wallet-connect"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-8 lg:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Onchain Activity Tracker</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Track your onchain activity across multiple EVM chains and visualize your contributions over time.
          </p>
        </header>

        <Card className="border shadow-sm">
          <CardHeader>
            <CardTitle>Connect Your Wallet</CardTitle>
            <CardDescription>
              Connect your wallet to view your onchain activity across supported chains.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <WalletConnect />
          </CardContent>
        </Card>

        <Suspense fallback={<div className="h-96 flex items-center justify-center">Loading dashboard...</div>}>
          <TrackerDashboard />
        </Suspense>
      </div>
    </main>
  )
}
