"use client"

import { Badge } from "@/components/ui/badge"
import { type Chain, getChainConfig } from "@/lib/chains"
import { Skeleton } from "@/components/ui/skeleton"

interface ActivityScoreProps {
  score: number
  chain: Chain
  isLoading?: boolean
}

export function ActivityScoreSkeleton() {
  return (
    <div className="flex flex-col gap-1">
      <Skeleton className="h-4 w-48" />
      <div className="flex items-center gap-2">
        <Skeleton className="h-8 w-12" />
        <Skeleton className="h-5 w-24 rounded-full" />
      </div>
    </div>
  )
}

export function ActivityScore({ score, chain, isLoading = false }: ActivityScoreProps) {
  if (isLoading) {
    return <ActivityScoreSkeleton />
  }
  
  const chainConfig = getChainConfig(chain)

  // Determine level based on score
  let level = "Beginner"
  if (score > 100) level = "Advanced"
  else if (score > 50) level = "Intermediate"
  else if (score > 10) level = "Active"

  return (
    <div className="flex flex-col gap-1">
      <div className="text-sm text-muted-foreground">Your activity score on {chainConfig.label}</div>
      <div className="flex items-center gap-2">
        <span className="text-3xl font-bold">{score}</span>
        <Badge variant="outline" className="text-xs font-medium">
          {level}
        </Badge>
      </div>
    </div>
  )
}
