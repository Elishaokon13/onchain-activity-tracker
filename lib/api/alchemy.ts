import { formatDateToYYYYMMDD } from "@/lib/utils"

// Cache for API responses to minimize API calls
const cache: Record<string, any> = {}

/**
 * Fetches transaction count for each day in the last 365 days
 */
export async function fetchTransactionCount(address: string, network: string): Promise<Record<string, number>> {
  // Create a cache key
  const cacheKey = `${address}-${network}-txcount`

  // Check if we have cached data
  if (cache[cacheKey]) {
    return cache[cacheKey]
  }

  try {
    // Get the date range for the last 365 days
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(endDate.getDate() - 365)

    // Format dates for the API
    const fromBlock = "0x0" // Start from the beginning
    const toBlock = "latest" // Latest block

    // Fetch all transactions for the address
    const response = await fetch(
      `/api/transactions?address=${address}&network=${network}&fromBlock=${fromBlock}&toBlock=${toBlock}`,
    )

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`)
    }

    const data = await response.json()
    const transactions = data.transactions || []

    // Group transactions by day
    const activityByDay: Record<string, number> = {}

    // Initialize all days with 0 count
    for (let i = 0; i < 365; i++) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = formatDateToYYYYMMDD(date)
      activityByDay[dateStr] = 0
    }

    // Count transactions for each day
    transactions.forEach((tx: any) => {
      // Convert timestamp to date string
      const timestamp = Number.parseInt(tx.timeStamp || tx.timestamp, 16) * 1000
      const date = new Date(timestamp)
      const dateStr = formatDateToYYYYMMDD(date)

      // Only count if it's within our 365 day window
      if (activityByDay[dateStr] !== undefined) {
        activityByDay[dateStr] = (activityByDay[dateStr] || 0) + 1
      }
    })

    // Cache the result
    cache[cacheKey] = activityByDay

    return activityByDay
  } catch (error) {
    console.error("Error fetching transaction count:", error)
    throw error
  }
}
