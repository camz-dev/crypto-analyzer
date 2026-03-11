// =============================================
// GRÁFICO DE CANDLESTICK EM TEMPO REAL
// =============================================

"use client"

import { useState, useEffect, useRef, useCallback, useMemo, useReducer } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Maximize2,
  Minimize2
} from "lucide-react"

type TimeInterval = "5s" | "15s" | "30s" | "1m" | "5m" | "15m"

interface Candle {
  timestamp: number
  open: number
  high: number
  low: number
  close: number
  volume: number
}

interface RealtimeCandlestickChartProps {
  coinId: string
  coinSymbol: string
  coinName: string
  onIntervalChange?: (interval: TimeInterval) => void
  onPriceUpdate?: (price: number, change: number) => void
}

// Preços base
const BASE_PRICES: Record<string, number> = {
  bitcoin: 97000,
  ethereum: 3400,
  solana: 195,
  ripple: 2.40,
  dogecoin: 0.38
}

// Intervalo em milissegundos
const INTERVAL_MS: Record<TimeInterval, number> = {
  "5s": 5000,
  "15s": 15000,
  "30s": 30000,
  "1m": 60000,
  "5m": 300000,
  "15m": 900000
}

// Função para gerar candles iniciais
function generateInitialCandles(coinId: string, interval: TimeInterval): { candles: Candle[], lastPrice: number } {
  const basePrice = BASE_PRICES[coinId] || 100
  const intervalTime = INTERVAL_MS[interval]
  const now = Date.now()
  const initialCandles: Candle[] = []
  
  let price = basePrice
  for (let i = 50; i >= 0; i--) {
    const timestamp = now - i * intervalTime
    const volatility = basePrice * 0.003
    const open = price
    const change = (Math.random() - 0.5) * volatility * 2
    const close = open + change
    const high = Math.max(open, close) + Math.random() * volatility * 0.5
    const low = Math.min(open, close) - Math.random() * volatility * 0.5
    
    initialCandles.push({
      timestamp,
      open,
      high,
      low,
      close,
      volume: Math.random() * 1000000
    })
    
    price = close
  }
  
  return { candles: initialCandles, lastPrice: price }
}

// Reducer para gerenciar candles
type CandleAction = 
  | { type: "INIT"; candles: Candle[]; price: number }
  | { type: "UPDATE"; basePrice: number; intervalTime: TimeInterval; onPriceUpdate?: (price: number, change: number) => void }

function candleReducer(state: { candles: Candle[]; currentPrice: number }, action: CandleAction): { candles: Candle[]; currentPrice: number } {
  switch (action.type) {
    case "INIT":
      return { candles: action.candles, currentPrice: action.price }
    
    case "UPDATE": {
      const { candles } = state
      if (candles.length === 0) return state
      
      const lastCandle = candles[candles.length - 1]
      const now = Date.now()
      const intervalTime = INTERVAL_MS[action.intervalTime]
      
      // Se passou do tempo do intervalo, criar nova vela
      if (now - lastCandle.timestamp >= intervalTime) {
        const volatility = action.basePrice * 0.003
        const open = lastCandle.close
        const change = (Math.random() - 0.5) * volatility * 2
        const close = open + change
        const high = Math.max(open, close) + Math.random() * volatility * 0.5
        const low = Math.min(open, close) - Math.random() * volatility * 0.5
        
        const newCandle: Candle = {
          timestamp: now,
          open,
          high,
          low,
          close,
          volume: Math.random() * 1000000
        }
        
        // Callback de preço
        if (action.onPriceUpdate && candles.length > 0) {
          const changePercent = ((close - candles[0].open) / candles[0].open) * 100
          action.onPriceUpdate(close, changePercent)
        }
        
        return {
          candles: [...candles.slice(-99), newCandle],
          currentPrice: close
        }
      } else {
        // Atualizar vela atual
        const volatility = action.basePrice * 0.001
        const newPrice = lastCandle.close + (Math.random() - 0.5) * volatility
        
        const updatedCandle: Candle = {
          ...lastCandle,
          close: newPrice,
          high: Math.max(lastCandle.high, newPrice),
          low: Math.min(lastCandle.low, newPrice)
        }
        
        return {
          candles: [...candles.slice(0, -1), updatedCandle],
          currentPrice: newPrice
        }
      }
    }
    
    default:
      return state
  }
}

export function RealtimeCandlestickChart({
  coinId,
  coinSymbol,
  coinName,
  onIntervalChange,
  onPriceUpdate
}: RealtimeCandlestickChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const onPriceUpdateRef = useRef(onPriceUpdate)
  
  // Atualizar ref quando callback muda
  useEffect(() => {
    onPriceUpdateRef.current = onPriceUpdate
  }, [onPriceUpdate])
  
  const [interval, setInterval] = useState<TimeInterval>("5s")
  const [isFullscreen, setIsFullscreen] = useState(false)
  
  // Usar reducer para gerenciar candles
  const [state, dispatch] = useReducer(candleReducer, { 
    candles: [], 
    currentPrice: BASE_PRICES[coinId] || 100 
  })
  
  // Inicializa candles quando coinId ou interval muda
  const initializedRef = useRef(false)
  
  useEffect(() => {
    initializedRef.current = false
  }, [coinId, interval])
  
  useEffect(() => {
    if (initializedRef.current) return
    initializedRef.current = true
    
    const { candles, lastPrice } = generateInitialCandles(coinId, interval)
    dispatch({ type: "INIT", candles, price: lastPrice })
  }, [coinId, interval])
  
  // Atualização em tempo real
  useEffect(() => {
    if (state.candles.length === 0) return
    
    const basePrice = BASE_PRICES[coinId] || 100
    
    const updateInterval = setInterval(() => {
      dispatch({ 
        type: "UPDATE", 
        basePrice, 
        intervalTime: interval,
        onPriceUpdate: onPriceUpdateRef.current
      })
    }, 200)
    
    return () => clearInterval(updateInterval)
  }, [coinId, interval, state.candles.length])
  
  // Desenhar no canvas
  const drawChart = useCallback(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container || state.candles.length === 0) return
    
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    
    // Configurar dimensões
    const dpr = window.devicePixelRatio || 1
    const rect = container.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    canvas.style.width = `${rect.width}px`
    canvas.style.height = `${rect.height}px`
    ctx.scale(dpr, dpr)
    
    const width = rect.width
    const height = rect.height
    const padding = { top: 20, right: 60, bottom: 30, left: 10 }
    const chartWidth = width - padding.left - padding.right
    const chartHeight = height - padding.top - padding.bottom
    
    // Limpar
    ctx.fillStyle = "#1a1a2e"
    ctx.fillRect(0, 0, width, height)
    
    // Calcular range de preços
    const visibleCandles = state.candles.slice(-60)
    const prices = visibleCandles.flatMap(c => [c.high, c.low])
    let minPrice = Math.min(...prices)
    let maxPrice = Math.max(...prices)
    const priceRange = maxPrice - minPrice
    minPrice -= priceRange * 0.1
    maxPrice += priceRange * 0.1
    
    // Função para converter preço para Y
    const priceToY = (price: number) => {
      return padding.top + chartHeight - ((price - minPrice) / (maxPrice - minPrice)) * chartHeight
    }
    
    // Desenhar grid
    ctx.strokeStyle = "#2a2a4a"
    ctx.lineWidth = 1
    
    const gridLines = 5
    for (let i = 0; i <= gridLines; i++) {
      const y = padding.top + (chartHeight / gridLines) * i
      ctx.beginPath()
      ctx.moveTo(padding.left, y)
      ctx.lineTo(width - padding.right, y)
      ctx.stroke()
      
      // Preço no eixo Y
      const price = maxPrice - ((maxPrice - minPrice) / gridLines) * i
      ctx.fillStyle = "#6b7280"
      ctx.font = "11px sans-serif"
      ctx.textAlign = "left"
      const priceText = price >= 1000 
        ? `$${price.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
        : `$${price.toFixed(price < 1 ? 4 : 2)}`
      ctx.fillText(priceText, width - padding.right + 5, y + 4)
    }
    
    // Calcular largura das velas
    const candleWidth = Math.max(2, (chartWidth / visibleCandles.length) - 2)
    const candleSpacing = chartWidth / visibleCandles.length
    
    // Desenhar velas
    visibleCandles.forEach((candle, i) => {
      const x = padding.left + (i + 0.5) * candleSpacing
      const isBullish = candle.close >= candle.open
      
      // Cores
      const color = isBullish ? "#22c55e" : "#ef4444"
      const wickColor = isBullish ? "#22c55e" : "#ef4444"
      
      // Desenhar pavio
      ctx.strokeStyle = wickColor
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(x, priceToY(candle.high))
      ctx.lineTo(x, priceToY(candle.low))
      ctx.stroke()
      
      // Desenhar corpo
      const bodyTop = priceToY(Math.max(candle.open, candle.close))
      const bodyBottom = priceToY(Math.min(candle.open, candle.close))
      const bodyHeight = Math.max(1, bodyBottom - bodyTop)
      
      ctx.fillStyle = color
      ctx.fillRect(x - candleWidth / 2, bodyTop, candleWidth, bodyHeight)
    })
    
    // Linha de preço atual
    const currentPriceY = priceToY(state.currentPrice)
    ctx.strokeStyle = "#22c55e"
    ctx.lineWidth = 1
    ctx.setLineDash([5, 5])
    ctx.beginPath()
    ctx.moveTo(padding.left, currentPriceY)
    ctx.lineTo(width - padding.right, currentPriceY)
    ctx.stroke()
    ctx.setLineDash([])
    
    // Badge de preço atual
    ctx.fillStyle = "#22c55e"
    ctx.fillRect(width - padding.right, currentPriceY - 10, 55, 20)
    ctx.fillStyle = "#fff"
    ctx.font = "bold 10px sans-serif"
    ctx.textAlign = "left"
    const priceText = state.currentPrice >= 1000 
      ? `$${state.currentPrice.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
      : `$${state.currentPrice.toFixed(state.currentPrice < 1 ? 4 : 2)}`
    ctx.fillText(priceText, width - padding.right + 3, currentPriceY + 4)
    
  }, [state.candles, state.currentPrice])
  
  // Redesenhar quando os dados mudam
  useEffect(() => {
    drawChart()
    
    const handleResize = () => drawChart()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [drawChart])
  
  // Estatísticas
  const stats = useMemo(() => {
    if (state.candles.length < 2) return null
    const lastCandle = state.candles[state.candles.length - 1]
    const firstCandle = state.candles[0]
    const change = lastCandle.close - firstCandle.open
    const changePercent = (change / firstCandle.open) * 100
    const high = Math.max(...state.candles.map(c => c.high))
    const low = Math.min(...state.candles.map(c => c.low))
    
    return {
      change,
      changePercent,
      high,
      low
    }
  }, [state.candles])
  
  const handleIntervalChange = (newInterval: TimeInterval) => {
    setInterval(newInterval)
    onIntervalChange?.(newInterval)
  }
  
  const formatPrice = (price: number) => {
    if (price >= 1000) return `$${price.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
    return `$${price.toFixed(price < 1 ? 4 : 2)}`
  }
  
  return (
    <Card className={`bg-gray-800/50 border-gray-700 ${isFullscreen ? "fixed inset-4 z-50" : ""}`}>
      <CardHeader className="pb-2">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <CardTitle className="text-white">
              {coinName}
              <Badge variant="outline" className="ml-2 text-gray-400">
                {coinSymbol}
              </Badge>
            </CardTitle>
            
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-white">
                {formatPrice(state.currentPrice)}
              </span>
              {stats && (
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
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
              <Activity className="h-3 w-3 mr-1 animate-pulse" />
              Tempo Real
            </Badge>
            
            <Tabs value={interval} onValueChange={(v) => handleIntervalChange(v as TimeInterval)}>
              <TabsList className="bg-gray-900 border-gray-700 h-8">
                <TabsTrigger value="5s" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white text-xs px-2">5s</TabsTrigger>
                <TabsTrigger value="15s" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white text-xs px-2">15s</TabsTrigger>
                <TabsTrigger value="30s" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white text-xs px-2">30s</TabsTrigger>
                <TabsTrigger value="1m" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white text-xs px-2">1m</TabsTrigger>
                <TabsTrigger value="5m" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white text-xs px-2">5m</TabsTrigger>
                <TabsTrigger value="15m" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white text-xs px-2">15m</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="text-gray-400 hover:text-white"
            >
              {isFullscreen ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className={isFullscreen ? "p-0 h-[calc(100%-80px)]" : ""}>
        <div 
          ref={containerRef} 
          className={isFullscreen ? "h-full" : "h-[400px]"}
        >
          <canvas 
            ref={canvasRef}
            className="w-full h-full"
          />
        </div>
        
        {stats && !isFullscreen && (
          <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-700">
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
                {stats.change >= 0 ? "+" : ""}{formatPrice(Math.abs(stats.change))}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
