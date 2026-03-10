// =============================================
// GRÁFICO DE CANDLESTICK
// =============================================

"use client"

import { useState, useEffect, useMemo } from "react"
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  TrendingUp,
  TrendingDown,
  RefreshCw,
  ZoomIn,
  ZoomOut,
  Maximize2
} from "lucide-react"

interface CandlestickChartProps {
  coinId: string
  coinSymbol: string
  coinName: string
}

export function CandlestickChart({
  coinId,
  coinSymbol,
  coinName
}: CandlestickChartProps) {
  const [period, setPeriod] = useState<1 | 7 | 30 | 90>(7)
  const [loading, setLoading] = useState(true)
  const [visibleCandles, setVisibleCandles] = useState(50)
  const [candles, setCandles] = useState<any[]>([])

  // Gerar dados simulados
  useEffect(() => {
    setLoading(true)
    
    const basePrice = coinId === "bitcoin" ? 97000 :
                      coinId === "ethereum" ? 3400 :
                      coinId === "solana" ? 195 :
                      coinId === "ripple" ? 2.4 : 0.38

    const interval = period <= 1 ? 30 * 60 * 1000 : 
                     period <= 7 ? 4 * 60 * 60 * 1000 : 
                     24 * 60 * 60 * 1000

    const totalCandles = Math.min(Math.ceil((period * 24 * 60 * 60 * 1000) / interval), 100)
    const now = Date.now()
    let currentPrice = basePrice

    const generatedCandles = []

    for (let i = 0; i < totalCandles; i++) {
      const timestamp = now - (totalCandles - i) * interval
      const volatility = basePrice * 0.025
      const open = currentPrice
      const change = (Math.random() - 0.5) * volatility
      const close = open + change
      const high = Math.max(open, close) + Math.random() * volatility * 0.3
      const low = Math.min(open, close) - Math.random() * volatility * 0.3

      generatedCandles.push({
        timestamp,
        time: Math.floor(timestamp / 1000),
        open,
        high,
        low,
        close,
        volume: Math.random() * 1000000000
      })

      currentPrice = close
    }

    setCandles(generatedCandles)
    setLoading(false)
  }, [coinId, period])

  // Preparar dados para o gráfico
  const chartData = useMemo(() => {
    const visible = candles.slice(-visibleCandles)
    return visible.map((candle, index) => ({
      ...candle,
      index,
      date: new Date(candle.timestamp).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit"
      }),
      isBullish: candle.close >= candle.open,
      color: candle.close >= candle.open ? "#22c55e" : "#ef4444",
      volumeColor: candle.close >= candle.open ? "rgba(34, 197, 94, 0.3)" : "rgba(239, 68, 68, 0.3)"
    }))
  }, [candles, visibleCandles])

  // Estatísticas
  const stats = useMemo(() => {
    if (chartData.length === 0) return null
    const prices = chartData.map(d => d.close)
    const currentPrice = prices[prices.length - 1]
    const startPrice = prices[0]
    const change = currentPrice - startPrice
    const changePercent = (change / startPrice) * 100

    return {
      currentPrice,
      change,
      changePercent,
      high: Math.max(...chartData.map(d => d.high)),
      low: Math.min(...chartData.map(d => d.low)),
    }
  }, [chartData])

  const formatPrice = (price: number) => {
    if (price >= 1000) {
      return `$${price.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
    }
    return `$${price.toFixed(price < 1 ? 4 : 2)}`
  }

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader className="pb-2">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <CardTitle className="text-white">
              {coinName}
              <Badge variant="outline" className="ml-2 text-gray-400">
                {coinSymbol}
              </Badge>
            </CardTitle>
            
            {stats && (
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-white">
                  {formatPrice(stats.currentPrice)}
                </span>
                <Badge
                  className={`
                    ${stats.changePercent >= 0 
                      ? "bg-emerald-500/10 text-emerald-400" 
                      : "bg-red-500/10 text-red-400"
                    }
                  `}
                >
                  {stats.changePercent >= 0 ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  )}
                  {stats.changePercent >= 0 ? "+" : ""}
                  {stats.changePercent.toFixed(2)}%
                </Badge>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Tabs value={period.toString()} onValueChange={(v) => setPeriod(Number(v) as any)}>
              <TabsList className="bg-gray-900 border-gray-700">
                <TabsTrigger value="1" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white">1D</TabsTrigger>
                <TabsTrigger value="7" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white">7D</TabsTrigger>
                <TabsTrigger value="30" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white">30D</TabsTrigger>
                <TabsTrigger value="90" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white">90D</TabsTrigger>
              </TabsList>
            </Tabs>

            <Button variant="ghost" size="icon" onClick={() => setVisibleCandles(Math.min(visibleCandles + 10, candles.length))} className="text-gray-400 hover:text-white">
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setVisibleCandles(Math.max(visibleCandles - 10, 10))} className="text-gray-400 hover:text-white">
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setVisibleCandles(50)} className="text-gray-400 hover:text-white">
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="h-[400px] flex items-center justify-center">
            <RefreshCw className="h-8 w-8 text-emerald-500 animate-spin" />
          </div>
        ) : (
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                <XAxis dataKey="date" stroke="#6b7280" tick={{ fill: "#6b7280", fontSize: 11 }} tickLine={false} />
                <YAxis yAxisId="price" domain={["auto", "auto"]} stroke="#6b7280" tick={{ fill: "#6b7280", fontSize: 11 }} tickLine={false} tickFormatter={(v) => formatPrice(v)} />
                <YAxis yAxisId="volume" orientation="right" domain={[0, "auto"]} hide />
                
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#fff"
                  }}
                  formatter={(value: number) => [formatPrice(value), "Preço"]}
                  labelFormatter={(label) => `Data: ${label}`}
                />
                
                <Bar yAxisId="volume" dataKey="volume" fill="rgba(16, 185, 129, 0.2)" barSize={3} />
                
                <Area
                  yAxisId="price"
                  type="monotone"
                  dataKey="close"
                  stroke="none"
                  fill="url(#priceGradient)"
                  fillOpacity={0.1}
                />
                
                <Line
                  yAxisId="price"
                  type="monotone"
                  dataKey="close"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: "#22c55e" }}
                />
                
                <defs>
                  <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        )}

        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-700">
            <div>
              <p className="text-xs text-gray-500">Máxima</p>
              <p className="text-sm font-medium text-emerald-400">{formatPrice(stats.high)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Mínima</p>
              <p className="text-sm font-medium text-red-400">{formatPrice(stats.low)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Variação</p>
              <p className={`text-sm font-medium ${stats.change >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                {formatPrice(Math.abs(stats.change))}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Período</p>
              <p className="text-sm font-medium text-gray-300">{period} dias</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
