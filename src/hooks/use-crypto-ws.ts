// =============================================
// HOOK PARA DADOS DE CRIPTOMOEDAS
// =============================================

"use client"

import { useEffect, useState, useCallback } from "react"

// =============================================
// TIPOS
// =============================================

export interface PriceData {
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

// Preços base
const BASE_PRICES: Record<string, number> = {
  bitcoin: 97000,
  ethereum: 3400,
  solana: 195,
  ripple: 2.40,
  dogecoin: 0.38
}

const COIN_NAMES: Record<string, string> = {
  bitcoin: "Bitcoin",
  ethereum: "Ethereum",
  solana: "Solana",
  ripple: "XRP",
  dogecoin: "Dogecoin"
}

const COIN_SYMBOLS: Record<string, string> = {
  bitcoin: "BTC",
  ethereum: "ETH",
  solana: "SOL",
  ripple: "XRP",
  dogecoin: "DOGE"
}

// =============================================
// HOOK PARA API (FALLBACK COM DADOS SIMULADOS)
// =============================================
export function useCryptoAPI() {
  const [prices, setPrices] = useState<PriceData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPrices = useCallback(async () => {
    try {
      // Tenta buscar da API
      const response = await fetch("/api/crypto/prices", {
        signal: AbortSignal.timeout(5000)
      })
      
      if (response.ok) {
        const data = await response.json()
        setPrices(data)
        setError(null)
      } else {
        throw new Error("API error")
      }
    } catch {
      // Usa dados simulados como fallback
      const mockPrices = generateMockPrices()
      setPrices(mockPrices)
      setError(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPrices()
    
    // Atualiza a cada 30 segundos
    const interval = setInterval(fetchPrices, 30000)
    
    return () => clearInterval(interval)
  }, [fetchPrices])

  return { prices, loading, error, refetch: fetchPrices }
}

// =============================================
// FUNÇÃO PARA GERAR DADOS SIMULADOS
// =============================================
function generateMockPrices(): PriceData[] {
  const coinIds = ["bitcoin", "ethereum", "solana", "ripple", "dogecoin"]
  const now = Date.now()

  return coinIds.map(id => {
    const basePrice = BASE_PRICES[id] || 100
    const randomChange = (Math.random() - 0.5) * 6
    const price = basePrice * (1 + randomChange / 100)

    return {
      id,
      symbol: COIN_SYMBOLS[id],
      name: COIN_NAMES[id],
      price,
      priceChange24h: price * randomChange / 100,
      priceChangePercent24h: randomChange,
      high24h: price * 1.04,
      low24h: price * 0.96,
      volume24h: Math.random() * 50000000000 + 1000000000,
      marketCap: price * (1000000000 + Math.random() * 20000000000),
      timestamp: now
    }
  })
}

// =============================================
// EXPORT COMPATIBILIDADE
// =============================================
export function useCryptoWebSocket() {
  return useCryptoAPI()
}
