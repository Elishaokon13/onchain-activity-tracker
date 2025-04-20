"use client"

import { Badge } from "@/components/ui/badge"
import { type Chain, getChainConfig } from "@/lib/chains"

interface ActivityScoreProps {
  score: number
  chain: Chain
}

export function ActivityScore({ score, chain }: ActivityScoreProps) {
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
