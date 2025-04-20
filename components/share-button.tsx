"use client"

import { useState } from "react"
import { Share2, Check, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { type Chain, getChainConfig } from "@/lib/chains"
import { toast } from "@/hooks/use-toast"

interface ShareButtonProps {
  score: number
  chain: Chain
  address: string
}

export function ShareButton({ score, chain, address }: ShareButtonProps) {
  const [copied, setCopied] = useState(false)
  const chainConfig = getChainConfig(chain)

  const shareText = `I have an onchain activity score of ${score} on ${chainConfig.label}! Check your score at Onchain Activity Tracker.`
  const shareUrl = `${window.location.origin}?address=${address}&chain=${chain}`

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Onchain Activity Tracker",
          text: shareText,
          url: shareUrl,
        })
      } catch (err) {
        console.error("Error sharing:", err)
        copyToClipboard()
      }
    } else {
      copyToClipboard()
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`${shareText} ${shareUrl}`)
    setCopied(true)
    toast({
      title: "Copied to clipboard",
      description: "Share link has been copied to your clipboard",
    })

    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  return (
    <Button onClick={handleShare} className="flex items-center gap-2">
      {copied ? (
        <>
          <Check className="h-4 w-4" />
          Copied
        </>
      ) : (
        <>
          {navigator.share ? <Share2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          Share My Score
        </>
      )}
    </Button>
  )
}
