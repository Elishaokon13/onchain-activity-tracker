import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThirdwebProvider } from "@/components/thirdweb-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Onchain Activity Tracker",
  description: "Track your onchain activity across multiple EVM chains",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThirdwebProvider>{children}</ThirdwebProvider>
      </body>
    </html>
  )
}
