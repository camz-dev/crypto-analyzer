// =============================================
// PÁGINA DE TRADING
// =============================================
// Dashboard de trading com gráfico em tempo real

"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  TrendingUp,
  TrendingDown,
  Clock,
  BarChart3,
  LineChart,
  Activity
} from "lucide-react"

import { RealtimeCandlestickChart } from "@/components/charts/realtime-candlestick-chart"

import { TradingBotPanel } from "@/components/dashboard/trading-bot-panel"

// Preços base
const BASE_PRICES: Record<string, number> = {
  bitcoin: 97000,
  ethereum: 3400,
  solana: 195,
  ripple: 2.40,
  dogecoin: 0.38
}

export default function TradingPage() {
  const [selectedCoin, setSelectedCoin] = useState<string>("bitcoin")
  const [interval, setInterval] = useState<TimeInterval>("5s")
  const [currentPrice, setCurrentPrice] = useState(BASE_PRICES["bitcoin"])
  const [priceChange, setPriceChange] = useState(0)
  
  const handlePriceUpdate = (price: number, change: number) => {
    setCurrentPrice(price)
    setPriceChange(change)
  }
  
  const handleIntervalChange = (newInterval: TimeInterval) => {
    setInterval(newInterval)
  }

  
  const coins = [
    { id: "bitcoin", symbol: "BTC", name: "Bitcoin" },
    { id: "ethereum", symbol: "ETH", name: "Ethereum" },
    { id: "solana", symbol: "SOL", name: "Solana" },
    { id: "ripple", symbol: "XRP", name: "XRP" },
    { id: "dogecoin", symbol: "DOGE", name: "Dogecoin" }
  ]

  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">CryptoAnalyzer</span>
          </div>
          
          <nav className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => window.location.href = "/dashboard"} className="text-gray-400">
              Dashboard
            </Button>
            <Button variant="ghost" size="sm" className="text-emerald-400 bg-emerald-500/10">
              Trading
            </Button>
          </nav>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-4">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-white">Trading em Tempo Real</h2>
          <p className="text-gray-400">Gráfico de velas com análise automatizada</p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Coin Selector */}
          <Select value={selectedCoin} onValueChange={(v) => {
            const coin = coins.find(c => c.id === v)
            if (coin) {
              setSelectedCoin(coin.id)
              setCurrentPrice(BASE_PRICES[coin.id])
            }
          }}>
            <SelectTrigger className="w-[180px] bg-gray-800 border-gray-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {coins.map(coin => (
                <SelectItem key={coin.id} value={coin.id}>
                  {coin.symbol} - {coin.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
            <Activity className="h-3 w-3 mr-1 animate-pulse" />
            Tempo Real
          </Badge>
        </div>

        {/* Chart and Bot */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <RealtimeCandlestickChart
              coinId={selectedCoin}
              coinSymbol={coins.find(c => c.id === selectedCoin)?.symbol || "BTC"}
              coinName={coins.find(c => c.id === selectedCoin)?.name || "Bitcoin"}
              onIntervalChange={handleIntervalChange}
              onPriceUpdate={handlePriceUpdate}
            />
          </div>
          
          <div className="lg:col-span-1">
            <TradingBotPanel
              coinSymbol={coins.find(c => c.id === selectedCoin)?.symbol || "BTC"}
              coinName={coins.find(c => c.id === selectedCoin)?.name || "Bitcoin"}
              currentPrice={currentPrice}
              priceChange={priceChange}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
