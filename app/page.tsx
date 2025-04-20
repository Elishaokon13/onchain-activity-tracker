import { Suspense } from "react"
import { TrackerDashboard } from "@/components/tracker-dashboard"
import { WalletConnect } from "@/components/wallet-connect"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GradientHeading } from "@/components/ui/gradient-heading"

export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-8 lg:p-12 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="text-center space-y-4">
          <GradientHeading text="Onchain Activity Tracker" className="mb-2" />
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Track your onchain activity across multiple EVM chains and visualize your contributions over time.
          </p>
        </header>

        <Card className="border shadow-md hover:shadow-lg transition-all duration-300 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
          <CardHeader className="border-b border-slate-100 dark:border-slate-700">
            <CardTitle className="text-2xl font-bold">Connect Your Wallet</CardTitle>
            <CardDescription className="text-slate-500 dark:text-slate-400">
              Connect your wallet to view your onchain activity across supported chains.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-5">
            <WalletConnect />
          </CardContent>
        </Card>

        <Suspense fallback={
          <div className="h-96 flex items-center justify-center bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-lg border shadow-md">
            <div className="flex flex-col items-center gap-4">
              <div className="h-8 w-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-muted-foreground">Loading dashboard...</p>
            </div>
          </div>
        }>
          <TrackerDashboard />
        </Suspense>
      </div>
    </main>
  )
}
