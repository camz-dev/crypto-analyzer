// =============================================
// API DE PREÇOS DE CRIPTOMOEDAS
// =============================================

import { NextResponse } from "next/server"

const COIN_IDS = ["bitcoin", "ethereum", "solana", "ripple", "dogecoin"]

const COIN_SYMBOLS: Record<string, string> = {
  bitcoin: "BTC",
  ethereum: "ETH",
  solana: "SOL",
  ripple: "XRP",
  dogecoin: "DOGE"
}

const COIN_NAMES: Record<string, string> = {
  bitcoin: "Bitcoin",
  ethereum: "Ethereum",
  solana: "Solana",
  ripple: "XRP",
  dogecoin: "Dogecoin"
}

const BASE_PRICES: Record<string, number> = {
  bitcoin: 97000,
  ethereum: 3400,
  solana: 195,
  ripple: 2.40,
  dogecoin: 0.38
}

interface CoinPrice {
  id: string
  symbol: string
  name: string
  price: number
  priceChange24h: number
  priceChangePercent24h: number
  high24h: number
  low24h: number
  volume24h: number
  marketCap: number
  timestamp: number
}

function generateMockPrices(): CoinPrice[] {
  const baseTime = Date.now()

  return COIN_IDS.map((id) => {
    const randomChange = (Math.random() - 0.5) * 6
    const basePrice = BASE_PRICES[id]
    const price = basePrice * (1 + randomChange / 100)

    return {
      id,
      symbol: COIN_SYMBOLS[id],
      name: COIN_NAMES[id],
      price: Math.round(price * 100) / 100,
      priceChange24h: price * randomChange / 100,
      priceChangePercent24h: Math.round(randomChange * 100) / 100,
      high24h: price * 1.04,
      low24h: price * 0.96,
      volume24h: Math.random() * 50000000000 + 1000000000,
      marketCap: price * (1000000000 + Math.random() * 20000000000),
      timestamp: baseTime
    }
  })
}

export async function GET() {
  try {
    // Tenta buscar da CoinGecko
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 3000)

    try {
      const url = new URL("https://api.coingecko.com/api/v3/coins/markets")
      url.searchParams.set("vs_currency", "usd")
      url.searchParams.set("ids", COIN_IDS.join(","))
      url.searchParams.set("order", "market_cap_desc")

      const response = await fetch(url.toString(), {
        signal: controller.signal,
        cache: "no-store"
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error("API error")
      }

      const data = await response.json()

      const prices: CoinPrice[] = data.map((coin: any) => ({
        id: coin.id,
        symbol: COIN_SYMBOLS[coin.id] || coin.symbol.toUpperCase(),
        name: COIN_NAMES[coin.id] || coin.name,
        price: coin.current_price,
        priceChange24h: coin.price_change_24h,
        priceChangePercent24h: coin.price_change_percentage_24h,
        high24h: coin.high_24h,
        low24h: coin.low_24h,
        volume24h: coin.total_volume,
        marketCap: coin.market_cap,
        timestamp: Date.now()
      }))

      return NextResponse.json(prices)
    } catch {
      clearTimeout(timeoutId)
      // Fallback para dados simulados
      return NextResponse.json(generateMockPrices())
    }
  } catch (error) {
    console.error("Erro ao buscar preços:", error)
    return NextResponse.json(generateMockPrices())
  }
}
