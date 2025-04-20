import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const address = searchParams.get("address")
  const network = searchParams.get("network")
  const fromBlock = searchParams.get("fromBlock") || "0x0"
  const toBlock = searchParams.get("toBlock") || "latest"

  if (!address) {
    return NextResponse.json({ error: "Address is required" }, { status: 400 })
  }

  if (!network) {
    return NextResponse.json({ error: "Network is required" }, { status: 400 })
  }

  try {
    // Get Alchemy API key from environment variables
    const alchemyApiKey = process.env.ALCHEMY_API_KEY

    if (!alchemyApiKey) {
      return NextResponse.json({ error: "Alchemy API key is not configured" }, { status: 500 })
    }

    // Construct the Alchemy API URL based on the network
    const baseUrl = `https://${network}.g.alchemy.com/v2/${alchemyApiKey}`

    // Fetch normal transactions
    const normalTxResponse = await fetch(`${baseUrl}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "alchemy_getAssetTransfers",
        params: [
          {
            fromBlock,
            toBlock,
            fromAddress: address,
            category: ["external", "internal", "erc20", "erc721", "erc1155"],
            maxCount: "0x3e8", // Hex for 1000
          },
        ],
      }),
    })

    const normalTxData = await normalTxResponse.json()

    // Cache the results for 1 hour (in seconds)
    return NextResponse.json(
      {
        transactions: normalTxData.result?.transfers || [],
      },
      {
        headers: {
          "Cache-Control": "max-age=3600, s-maxage=3600",
        },
      },
    )
  } catch (error) {
    console.error("Error fetching transactions:", error)
    return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 })
  }
}
