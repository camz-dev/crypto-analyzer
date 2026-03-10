// =============================================
// PAINEL DE ANÁLISE
// =============================================

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Activity,
  Target,
  Shield
} from "lucide-react"

interface AnalysisPanelProps {
  coinId: string
  coinSymbol: string
  coinName: string
}

interface Analysis {
  signal: "BUY" | "SELL" | "HOLD"
  confidence: number
  rsi: number
  trend: "UP" | "DOWN" | "NEUTRAL"
  risk: "LOW" | "MEDIUM" | "HIGH"
  reasons: string[]
}

export function AnalysisPanel({
  coinId,
  coinSymbol,
  coinName
}: AnalysisPanelProps) {
  const [analysis, setAnalysis] = useState<Analysis>({
    signal: "HOLD",
    confidence: 50,
    rsi: 50,
    trend: "NEUTRAL",
    risk: "MEDIUM",
    reasons: ["Carregando análise..."]
  })

  useEffect(() => {
    // Simula análise
    const interval = setInterval(() => {
      const rsi = 30 + Math.random() * 40
      const trendRand = Math.random()
      const trend: "UP" | "DOWN" | "NEUTRAL" = 
        trendRand > 0.6 ? "UP" : trendRand > 0.3 ? "DOWN" : "NEUTRAL"
      
      let signal: "BUY" | "SELL" | "HOLD" = "HOLD"
      let confidence = 50
      const reasons: string[] = []

      if (rsi < 35) {
        signal = "BUY"
        confidence = 60 + Math.random() * 25
        reasons.push("RSI em zona de sobrevenda")
        reasons.push("Possível oportunidade de compra")
      } else if (rsi > 65) {
        signal = "SELL"
        confidence = 60 + Math.random() * 25
        reasons.push("RSI em zona de sobrecompra")
        reasons.push("Considere realizar lucros")
      } else {
        reasons.push("RSI em zona neutra")
        reasons.push("Aguarde confirmação de tendência")
      }

      if (trend === "UP") {
        reasons.push("Tendência de alta detectada")
      } else if (trend === "DOWN") {
        reasons.push("Tendência de baixa detectada")
      }

      setAnalysis({
        signal,
        confidence: Math.min(85, Math.round(confidence)),
        rsi: Math.round(rsi),
        trend,
        risk: confidence > 70 ? "LOW" : confidence > 40 ? "MEDIUM" : "HIGH",
        reasons
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [coinId])

  const signalConfig = {
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
      color: "text-gray-400",
      bg: "bg-gray-500/10",
      border: "border-gray-500/30",
      Icon: Minus,
      label: "AGUARDAR"
    }
  }

  const current = signalConfig[analysis.signal]
  const SignalIcon = current.Icon

  return (
    <div className="space-y-4">
      {/* Sinal Principal */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-white flex items-center gap-2 text-base">
            <Target className="h-4 w-4 text-emerald-500" />
            Sinal - {coinSymbol}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`p-6 rounded-xl text-center ${current.bg} border ${current.border}`}>
            <SignalIcon className={`h-12 w-12 mx-auto mb-3 ${current.color}`} />
            <h3 className={`text-2xl font-bold ${current.color}`}>
              {current.label}
            </h3>
            <p className="text-sm text-gray-400 mt-1">
              Confiança: {analysis.confidence}%
            </p>
            <Progress 
              value={analysis.confidence} 
              className="mt-3 h-2 bg-gray-700"
            />
          </div>
        </CardContent>
      </Card>

      {/* Indicadores */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-white flex items-center gap-2 text-base">
            <Activity className="h-4 w-4 text-emerald-500" />
            Indicadores
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* RSI */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">RSI</span>
            <div className="flex items-center gap-2">
              <Progress value={analysis.rsi} className="w-20 h-2 bg-gray-700" />
              <span className={`text-sm font-medium ${
                analysis.rsi < 30 ? "text-emerald-400" : 
                analysis.rsi > 70 ? "text-red-400" : "text-gray-300"
              }`}>
                {analysis.rsi}
              </span>
            </div>
          </div>

          {/* Tendência */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Tendência</span>
            <Badge className={`
              ${analysis.trend === "UP" ? "bg-emerald-500/10 text-emerald-400" : 
                analysis.trend === "DOWN" ? "bg-red-500/10 text-red-400" : 
                "bg-gray-500/10 text-gray-400"}
            `}>
              {analysis.trend === "UP" ? "↑ Alta" : 
               analysis.trend === "DOWN" ? "↓ Baixa" : "→ Neutra"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Risco */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-white flex items-center gap-2 text-base">
            <Shield className="h-4 w-4 text-emerald-500" />
            Análise de Risco
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Badge className={`
            ${analysis.risk === "LOW" ? "bg-emerald-500/10 text-emerald-400" : 
              analysis.risk === "HIGH" ? "bg-red-500/10 text-red-400" : 
              "bg-yellow-500/10 text-yellow-400"}
          `}>
            {analysis.risk === "LOW" ? "BAIXO" : 
             analysis.risk === "HIGH" ? "ALTO" : "MÉDIO"}
          </Badge>
        </CardContent>
      </Card>

      {/* Razões */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardContent className="pt-4">
          <ul className="space-y-1">
            {analysis.reasons.map((reason, i) => (
              <li key={i} className="text-sm text-gray-400 flex items-start gap-2">
                <span className="text-emerald-500">•</span>
                {reason}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Aviso */}
      <div className="p-3 rounded-lg bg-yellow-500/5 border border-yellow-500/20">
        <p className="text-xs text-yellow-500/80">
          ⚠️ Esta análise é informativa e não constitui recomendação de investimento.
        </p>
      </div>
    </div>
  )
}
