// =============================================
// PAINEL DO BOT DE TRADING
// =============================================

"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Activity,
  Target,
  Shield,
  Zap,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Bot,
  RefreshCw
} from "lucide-react"

interface TradingBotPanelProps {
  coinSymbol: string
  coinName: string
  currentPrice: number
  priceChange: number
}

interface BotSignal {
  action: "BUY" | "SELL" | "HOLD"
  confidence: number
  entryPrice?: number
  targetPrice?: number
  stopLoss?: number
  riskReward: number
}

interface TechnicalIndicator {
  name: string
  value: number
  signal: "bullish" | "bearish" | "neutral"
  weight: number
}

interface BotAnalysis {
  signal: BotSignal
  indicators: TechnicalIndicator[]
  reasons: string[]
  lastUpdate: Date
  signalHistory: { time: Date; action: "BUY" | "SELL" | "HOLD"; price: number }[]
}

export function TradingBotPanel({
  coinSymbol,
  coinName,
  currentPrice,
  priceChange
}: TradingBotPanelProps) {
  const [analysis, setAnalysis] = useState<BotAnalysis>({
    signal: {
      action: "HOLD",
      confidence: 50,
      riskReward: 1
    },
    indicators: [],
    reasons: ["Analisando mercado..."],
    lastUpdate: new Date(),
    signalHistory: []
  })
  
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  
  // Gerar análise técnica
  useEffect(() => {
    const generateAnalysis = () => {
      setIsAnalyzing(true)
      
      setTimeout(() => {
        // Gerar indicadores técnicos simulados
        const rsi = 20 + Math.random() * 60
        const macd = (Math.random() - 0.5) * 2
        const ema20 = currentPrice * (0.98 + Math.random() * 0.04)
        const ema50 = currentPrice * (0.95 + Math.random() * 0.10)
        const volume24h = Math.random() * 1000000000
        
        const indicators: TechnicalIndicator[] = [
          {
            name: "RSI (14)",
            value: rsi,
            signal: rsi < 30 ? "bullish" : rsi > 70 ? "bearish" : "neutral",
            weight: 0.25
          },
          {
            name: "MACD",
            value: macd,
            signal: macd > 0 ? "bullish" : macd < 0 ? "bearish" : "neutral",
            weight: 0.20
          },
          {
            name: "EMA Cross",
            value: ema20 > ema50 ? 1 : -1,
            signal: ema20 > ema50 ? "bullish" : "bearish",
            weight: 0.25
          },
          {
            name: "Volume",
            value: volume24h,
            signal: volume24h > 500000000 ? "bullish" : "neutral",
            weight: 0.15
          },
          {
            name: "Trend",
            value: priceChange,
            signal: priceChange > 2 ? "bullish" : priceChange < -2 ? "bearish" : "neutral",
            weight: 0.15
          }
        ]
        
        // Calcular sinal
        let bullishScore = 0
        let bearishScore = 0
        
        indicators.forEach(ind => {
          if (ind.signal === "bullish") bullishScore += ind.weight
          else if (ind.signal === "bearish") bearishScore += ind.weight
        })
        
        let action: "BUY" | "SELL" | "HOLD" = "HOLD"
        let confidence = 50
        const reasons: string[] = []
        
        if (bullishScore > 0.6) {
          action = "BUY"
          confidence = 50 + bullishScore * 30
          reasons.push("📈 Múltiplos indicadores de alta")
          reasons.push("🎯 Possível oportunidade de entrada")
        } else if (bearishScore > 0.6) {
          action = "SELL"
          confidence = 50 + bearishScore * 30
          reasons.push("📉 Indicadores apontam correção")
          reasons.push("⚠️ Considere reduzir posição")
        } else {
          reasons.push("📊 Mercado em consolidação")
          reasons.push("⏳ Aguarde confirmação de tendência")
        }
        
        // Adicionar razões específicas dos indicadores
        if (rsi < 30) reasons.push("RSI em sobrevenda")
        if (rsi > 70) reasons.push("RSI em sobrecompra")
        if (ema20 > ema50) reasons.push("EMA 20 acima da EMA 50")
        if (macd > 0) reasons.push("MACD positivo")
        
        // Calcular níveis
        const entryPrice = currentPrice
        const targetPrice = action === "BUY" 
          ? currentPrice * (1 + 0.03 + Math.random() * 0.02)
          : action === "SELL"
          ? currentPrice * (1 - 0.03 - Math.random() * 0.02)
          : undefined
        const stopLoss = action === "BUY"
          ? currentPrice * (1 - 0.015 - Math.random() * 0.01)
          : action === "SELL"
          ? currentPrice * (1 + 0.015 + Math.random() * 0.01)
          : undefined
        
        const riskReward = targetPrice && stopLoss
          ? Math.abs(targetPrice - currentPrice) / Math.abs(currentPrice - stopLoss)
          : 1
        
        setAnalysis(prev => ({
          signal: {
            action,
            confidence: Math.min(95, Math.round(confidence)),
            entryPrice,
            targetPrice,
            stopLoss,
            riskReward
          },
          indicators,
          reasons,
          lastUpdate: new Date(),
          signalHistory: [
            ...prev.signalHistory.slice(-9),
            { time: new Date(), action, price: currentPrice }
          ]
        }))
        
        setIsAnalyzing(false)
      }, 500)
    }
    
    generateAnalysis()
    const interval = setInterval(generateAnalysis, 5000)
    return () => clearInterval(interval)
  }, [currentPrice, priceChange])
  
  const signalConfig = useMemo(() => ({
    BUY: {
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/30",
      Icon: TrendingUp,
      label: "COMPRAR"
    },
    SELL: {
      color: "text-red-400",
      bg: "bg-red-500/10",
      border: "border-red-500/30",
      Icon: TrendingDown,
      label: "VENDER"
    },
    HOLD: {
      color: "text-yellow-400",
      bg: "bg-yellow-500/10",
      border: "border-yellow-500/30",
      Icon: Minus,
      label: "AGUARDAR"
    }
  }), [])
  
  const currentSignal = signalConfig[analysis.signal.action]
  const SignalIcon = currentSignal.Icon
  
  const formatPrice = (price: number) => {
    if (price >= 1000) return `$${price.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
    return `$${price.toFixed(price < 1 ? 4 : 2)}`
  }
  
  return (
    <div className="space-y-4">
      {/* Header do Bot */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2 text-base">
              <Bot className="h-5 w-5 text-emerald-500" />
              Bot de Análise
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                <Activity className="h-3 w-3 mr-1 animate-pulse" />
                Ativo
              </Badge>
              {isAnalyzing && (
                <RefreshCw className="h-4 w-4 text-emerald-400 animate-spin" />
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-400">
            Analisando <span className="text-white font-medium">{coinSymbol}</span> em tempo real
          </p>
        </CardContent>
      </Card>
      
      {/* Sinal Principal */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardContent className="pt-4">
          <div className={`p-4 rounded-xl text-center ${currentSignal.bg} border ${currentSignal.border}`}>
            <SignalIcon className={`h-10 w-10 mx-auto mb-2 ${currentSignal.color}`} />
            <h3 className={`text-2xl font-bold ${currentSignal.color}`}>
              {currentSignal.label}
            </h3>
            <p className="text-sm text-gray-400 mt-1">
              Confiança: {analysis.signal.confidence}%
            </p>
            <Progress 
              value={analysis.signal.confidence} 
              className="mt-3 h-2 bg-gray-700"
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Níveis de Entrada/Saída */}
      {analysis.signal.action !== "HOLD" && (
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-white flex items-center gap-2 text-base">
              <Target className="h-4 w-4 text-emerald-500" />
              Níveis Sugeridos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {analysis.signal.entryPrice && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Entrada</span>
                <span className="text-sm font-medium text-white">
                  {formatPrice(analysis.signal.entryPrice)}
                </span>
              </div>
            )}
            {analysis.signal.targetPrice && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Alvo</span>
                <span className="text-sm font-medium text-emerald-400">
                  {formatPrice(analysis.signal.targetPrice)}
                </span>
              </div>
            )}
            {analysis.signal.stopLoss && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Stop Loss</span>
                <span className="text-sm font-medium text-red-400">
                  {formatPrice(analysis.signal.stopLoss)}
                </span>
              </div>
            )}
            <div className="flex justify-between items-center pt-2 border-t border-gray-700">
              <span className="text-sm text-gray-400">Risco/Retorno</span>
              <Badge className={`
                ${analysis.signal.riskReward >= 2 ? "bg-emerald-500/10 text-emerald-400" : 
                  analysis.signal.riskReward >= 1.5 ? "bg-yellow-500/10 text-yellow-400" :
                  "bg-red-500/10 text-red-400"}
              `}>
                1:{analysis.signal.riskReward.toFixed(1)}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Indicadores Técnicos */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-white flex items-center gap-2 text-base">
            <Activity className="h-4 w-4 text-emerald-500" />
            Indicadores
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {analysis.indicators.map((ind, i) => (
            <div key={i} className="flex items-center justify-between">
              <span className="text-sm text-gray-400">{ind.name}</span>
              <div className="flex items-center gap-2">
                {ind.signal === "bullish" && (
                  <CheckCircle className="h-4 w-4 text-emerald-400" />
                )}
                {ind.signal === "bearish" && (
                  <XCircle className="h-4 w-4 text-red-400" />
                )}
                {ind.signal === "neutral" && (
                  <Minus className="h-4 w-4 text-gray-400" />
                )}
                <Badge className={`
                  ${ind.signal === "bullish" ? "bg-emerald-500/10 text-emerald-400" : 
                    ind.signal === "bearish" ? "bg-red-500/10 text-red-400" :
                    "bg-gray-500/10 text-gray-400"}
                `}>
                  {ind.signal === "bullish" ? "Alta" : 
                   ind.signal === "bearish" ? "Baixa" : "Neutro"}
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
      
      {/* Razões */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardContent className="pt-4">
          <h4 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
            <Zap className="h-4 w-4 text-yellow-400" />
            Análise do Bot
          </h4>
          <ul className="space-y-2">
            {analysis.reasons.map((reason, i) => (
              <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                <span className="text-emerald-500 mt-0.5">•</span>
                {reason}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      
      {/* Histórico de Sinais */}
      {analysis.signalHistory.length > 0 && (
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-white flex items-center gap-2 text-base">
              <Shield className="h-4 w-4 text-emerald-500" />
              Últimos Sinais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-1 flex-wrap">
              {analysis.signalHistory.slice(-10).map((sig, i) => (
                <Badge
                  key={i}
                  className={`
                    ${sig.action === "BUY" ? "bg-emerald-500/10 text-emerald-400" :
                      sig.action === "SELL" ? "bg-red-500/10 text-red-400" :
                      "bg-gray-500/10 text-gray-400"}
                    text-xs
                  `}
                >
                  {sig.action === "BUY" ? "↑" : sig.action === "SELL" ? "↓" : "→"}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Aviso */}
      <div className="p-3 rounded-lg bg-yellow-500/5 border border-yellow-500/20">
        <p className="text-xs text-yellow-500/80 flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span>
            ⚠️ Esta análise é gerada por IA e não constitui recomendação de investimento. 
            Sempre faça sua própria pesquisa.
          </span>
        </p>
      </div>
    </div>
  )
}
