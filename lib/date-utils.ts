export function generateDates(days: number): Date[] {
  const dates: Date[] = []
  const today = new Date()

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date()
    date.setDate(today.getDate() - i)
    dates.push(date)
  }

  return dates
}

export function getMonthLabels(): { label: string; weeks: number }[] {
  const months: { label: string; weeks: number }[] = []
  const dates = generateDates(365)

  let currentMonth = -1
  let weekCount = 0

  dates.forEach((date, index) => {
    const month = date.getMonth()
    const dayOfWeek = date.getDay()

    // Start of a new week (Sunday)
    if (dayOfWeek === 0) {
      weekCount++
    }

    // First day of a new month
    if (month !== currentMonth) {
      if (currentMonth !== -1) {
        // Save the previous month
        months.push({
          label: new Date(date.getFullYear(), currentMonth).toLocaleString("default", { month: "short" }),
          weeks: weekCount,
        })
      }

      currentMonth = month
      weekCount = 0
    }
  })

  // Add the last month
  if (currentMonth !== -1) {
    months.push({
      label: new Date(new Date().getFullYear(), currentMonth).toLocaleString("default", { month: "short" }),
      weeks: weekCount + 1,
    })
  }

  return months
}
