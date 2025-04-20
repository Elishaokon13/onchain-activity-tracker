"use client"

import { Check, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { type Chain, SUPPORTED_CHAINS, getChainConfig } from "@/lib/chains"
import Image from "next/image"

interface ChainSelectorProps {
  selectedChain: Chain
  onSelectChain: (chain: Chain) => void
}

export function ChainSelector({ selectedChain, onSelectChain }: ChainSelectorProps) {
  const selectedChainConfig = getChainConfig(selectedChain)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <div className="relative w-5 h-5 overflow-hidden rounded-full">
            <Image 
              src={selectedChainConfig.logoUrl}
              alt={selectedChainConfig.label}
              width={20}
              height={20}
              className="object-cover"
            />
          </div>
          <span>{selectedChainConfig.label}</span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        {SUPPORTED_CHAINS.map((chain) => {
          const chainConfig = getChainConfig(chain)
          return (
            <DropdownMenuItem
              key={chain}
              onClick={() => onSelectChain(chain)}
              className="flex items-center gap-2 cursor-pointer"
            >
              <div className="relative w-4 h-4 overflow-hidden rounded-full">
                <Image 
                  src={chainConfig.logoUrl}
                  alt={chainConfig.label}
                  width={16}
                  height={16}
                  className="object-cover"
                />
              </div>
              <span>{chainConfig.label}</span>
              {selectedChain === chain && <Check className="h-4 w-4 ml-auto" />}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
