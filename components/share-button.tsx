"use client"

import { useState } from "react"
import { Share2, Check, Copy, Twitter, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { type Chain, getChainConfig } from "@/lib/chains"
import { toast } from "@/hooks/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { shortenAddress } from "@/lib/utils"

interface ShareButtonProps {
  score: number
  chain: Chain
  address: string
}

export function ShareButton({ score, chain, address }: ShareButtonProps) {
  const [copied, setCopied] = useState(false)
  const chainConfig = getChainConfig(chain)
  const shortAddress = shortenAddress(address)

  const shareText = `I have an onchain activity score of ${score} on ${chainConfig.label}! Check your score at Onchain Activity Tracker.`
  const shareUrl = `${window.location.origin}?address=${address}&chain=${chain}`
  
  // Complete message for sharing
  const fullShareText = `${shareText} ${shareUrl}`;

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
    navigator.clipboard.writeText(fullShareText)
    setCopied(true)
    toast({
      title: "Copied to clipboard",
      description: "Share link has been copied to your clipboard",
    })

    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  const shareToTwitter = () => {
    const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterShareUrl, '_blank', 'noopener,noreferrer');
  }

  const shareToWarpcast = () => {
    // Warpcast uses the "cast" action format
    const warpcastText = `I have an onchain activity score of ${score} on ${chainConfig.label} from wallet ${shortAddress}!\n\nCheck your score at Onchain Activity Tracker: ${shareUrl}`;
    const warpcastUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(warpcastText)}`;
    window.open(warpcastUrl, '_blank', 'noopener,noreferrer');
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="flex items-center gap-2">
          <Share2 className="h-4 w-4" />
          Share
          <MoreHorizontal className="h-4 w-4 opacity-70" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        <DropdownMenuItem onClick={copyToClipboard} className="flex items-center gap-2 cursor-pointer">
          <Copy className="h-4 w-4" />
          Copy Link
        </DropdownMenuItem>
        <DropdownMenuItem onClick={shareToTwitter} className="flex items-center gap-2 cursor-pointer">
          <Twitter className="h-4 w-4" />
          Share to Twitter
        </DropdownMenuItem>
        <DropdownMenuItem onClick={shareToWarpcast} className="flex items-center gap-2 cursor-pointer">
          <svg className="h-4 w-4" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 0L1 4v8l7 4 7-4V4L8 0zm0 2.5L12.25 5 8 7.5 3.75 5 8 2.5zM3 6.938l4 2.25v4.374l-4-2.25V6.938zm9.974 0v4.375l-4 2.25v-4.375l4-2.25z" />
          </svg>
          Share to Warpcast
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
