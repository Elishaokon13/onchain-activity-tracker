"use client"

import { useEffect, useRef, useState } from "react"
import { generateDates, getMonthLabels } from "@/lib/date-utils"
import { Skeleton } from "@/components/ui/skeleton"

interface ActivityHeatmapProps {
  data: Record<string, number>
  isLoading?: boolean
}

export function ActivityHeatmapSkeleton() {
  const monthLabels = getMonthLabels()
  
  return (
    <div className="relative">
      <div className="flex items-center mb-2">
        <Skeleton className="h-4 w-20 mr-2" />
        <div className="flex items-center gap-1">
          <Skeleton className="w-3 h-3 rounded-sm" />
          <Skeleton className="w-3 h-3 rounded-sm" />
          <Skeleton className="w-3 h-3 rounded-sm" />
          <Skeleton className="w-3 h-3 rounded-sm" />
          <Skeleton className="w-3 h-3 rounded-sm" />
          <Skeleton className="h-3 w-8 ml-1" />
        </div>
      </div>

      <div className="relative overflow-x-auto pb-4">
        <div className="flex">
          <div className="flex flex-col h-[126px] justify-between pr-2 text-xs">
            <Skeleton className="h-3 w-6" />
            <Skeleton className="h-3 w-6" />
            <Skeleton className="h-3 w-6" />
            <Skeleton className="h-3 w-6" />
            <Skeleton className="h-3 w-6" />
            <Skeleton className="h-3 w-6" />
            <Skeleton className="h-3 w-6" />
          </div>

          <div>
            <div className="flex mb-1">
              {monthLabels.map((month, i) => (
                <Skeleton key={i} className="h-3" style={{ width: month.weeks * 18 + "px", marginRight: "2px" }} />
              ))}
            </div>

            <Skeleton className="h-[126px] w-full" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function ActivityHeatmap({ data, isLoading = false }: ActivityHeatmapProps) {
  // If loading, show the skeleton
  if (isLoading) {
    return <ActivityHeatmapSkeleton />
  }
  
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [tooltipData, setTooltipData] = useState<{ date: string; count: number; x: number; y: number } | null>(null)

  // Generate dates for the last 365 days
  const dates = generateDates(365)
  const monthLabels = getMonthLabels()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const cellSize = 14
    const cellGap = 4
    const totalGap = cellSize + cellGap
    const weekCount = Math.ceil(dates.length / 7)

    canvas.width = weekCount * totalGap
    canvas.height = 7 * totalGap

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw heatmap cells
    dates.forEach((date, index) => {
      const week = Math.floor(index / 7)
      const day = index % 7

      const x = week * totalGap
      const y = day * totalGap

      const dateStr = date.toISOString().split("T")[0]
      const count = data[dateStr] || 0

      // Determine color based on activity count
      let color = "#ebedf0"
      if (count > 0) {
        if (count < 3) color = "#c6cffc"
        else if (count < 6) color = "#a3b1fb"
        else if (count < 10) color = "#7d91fa"
        else color = "#5a72f8"
      }

      // Draw cell
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.roundRect(x, y, cellSize, cellSize, 2)
      ctx.fill()
    })

    // Add event listener for tooltip
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      const week = Math.floor(x / totalGap)
      const day = Math.floor(y / totalGap)

      const index = week * 7 + day
      if (index >= 0 && index < dates.length) {
        const date = dates[index]
        const dateStr = date.toISOString().split("T")[0]
        const count = data[dateStr] || 0

        const tooltipX = week * totalGap + cellSize / 2
        const tooltipY = day * totalGap

        setTooltipData({
          date: date.toLocaleDateString(),
          count,
          x: tooltipX,
          y: tooltipY,
        })
      } else {
        setTooltipData(null)
      }
    }

    const handleMouseLeave = () => {
      setTooltipData(null)
    }

    canvas.addEventListener("mousemove", handleMouseMove)
    canvas.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove)
      canvas.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [data, dates])

  return (
    <div className="relative">
      <div className="flex items-center mb-2">
        <div className="text-sm font-medium mr-2">Activity:</div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm bg-[#ebedf0]"></div>
          <div className="w-3 h-3 rounded-sm bg-[#c6cffc]"></div>
          <div className="w-3 h-3 rounded-sm bg-[#a3b1fb]"></div>
          <div className="w-3 h-3 rounded-sm bg-[#7d91fa]"></div>
          <div className="w-3 h-3 rounded-sm bg-[#5a72f8]"></div>
          <div className="text-xs text-muted-foreground ml-1">More</div>
        </div>
      </div>

      <div className="relative overflow-x-auto pb-4">
        <div className="flex">
          <div className="flex flex-col h-[126px] justify-between pr-2 text-xs text-muted-foreground">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          <div>
            <div className="flex mb-1">
              {monthLabels.map((month, i) => (
                <div key={i} className="text-xs text-muted-foreground" style={{ width: month.weeks * 18 + "px" }}>
                  {month.label}
                </div>
              ))}
            </div>

            <canvas ref={canvasRef} className="block" />
          </div>
        </div>

        {tooltipData && (
          <div
            className="absolute bg-popover text-popover-foreground text-xs p-2 rounded shadow-md z-10 pointer-events-none"
            style={{
              left: `${tooltipData.x + 30}px`,
              top: `${tooltipData.y - 10}px`,
              transform: "translateY(-100%)",
            }}
          >
            <div className="font-medium">{tooltipData.date}</div>
            <div>
              {tooltipData.count} {tooltipData.count === 1 ? "activity" : "activities"}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
