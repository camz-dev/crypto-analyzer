// =============================================
// PÁGINA INICIAL - LANDING PAGE
// =============================================

"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  TrendingUp,
  TrendingDown,
  Activity,
  BarChart3,
  Zap,
  Shield,
  Brain,
  ArrowRight,
  Bitcoin,
  Coins
} from "lucide-react"

export default function LandingPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      {/* Header */}
      <header className="w-full border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg shadow-lg shadow-emerald-500/20">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">CryptoAnalyzer</h1>
              <p className="text-xs text-gray-400">Análise em tempo real</p>
            </div>
          </div>
          
          <Button
            onClick={() => router.push("/dashboard")}
            className="bg-emerald-500 hover:bg-emerald-600 text-white gap-2"
          >
            Acessar Dashboard
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-16">
          {/* Hero */}
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
              <Activity className="h-3 w-3 mr-1" />
              Tempo Real
            </Badge>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Analise Criptomoedas
              <span className="text-emerald-400"> em Tempo Real</span>
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-8">
              Dashboard profissional com indicadores técnicos, gráficos interativos e bot de análise automatizado.
            </p>
            
            <Button
              onClick={() => router.push("/dashboard")}
              size="lg"
              className="bg-emerald-500 hover:bg-emerald-600 text-white text-lg px-8 py-6 gap-2"
            >
              <Zap className="h-5 w-5" />
              Começar Agora
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <Card className="bg-gray-800/50 border-gray-700 hover:border-emerald-500/50 transition-colors">
              <CardContent className="p-6">
                <div className="p-3 bg-emerald-500/10 rounded-lg w-fit mb-4">
                  <BarChart3 className="h-6 w-6 text-emerald-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Gráficos Interativos</h3>
                <p className="text-gray-400 text-sm">
                  Candlesticks em tempo real com múltiplos intervalos (5s, 15s, 30s, 1m, 5m, 15m).
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700 hover:border-emerald-500/50 transition-colors">
              <CardContent className="p-6">
                <div className="p-3 bg-emerald-500/10 rounded-lg w-fit mb-4">
                  <Brain className="h-6 w-6 text-emerald-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Bot de Análise</h3>
                <p className="text-gray-400 text-sm">
                  Sinais de compra e venda com análise de RSI, MACD e médias móveis.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700 hover:border-emerald-500/50 transition-colors">
              <CardContent className="p-6">
                <div className="p-3 bg-emerald-500/10 rounded-lg w-fit mb-4">
                  <Shield className="h-6 w-6 text-emerald-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Análise de Risco</h3>
                <p className="text-gray-400 text-sm">
                  Indicadores de volatilidade e confiança para tomada de decisão.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Supported Coins */}
          <div className="text-center mb-16">
            <h3 className="text-lg font-semibold text-gray-400 mb-6">Criptomoedas Suportadas</h3>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                { symbol: "BTC", name: "Bitcoin", icon: Bitcoin },
                { symbol: "ETH", name: "Ethereum", icon: Coins },
                { symbol: "SOL", name: "Solana", icon: TrendingUp },
                { symbol: "XRP", name: "Ripple", icon: Activity },
                { symbol: "DOGE", name: "Dogecoin", icon: TrendingDown },
              ].map((coin) => (
                <Badge
                  key={coin.symbol}
                  variant="outline"
                  className="px-4 py-2 text-sm border-gray-700 text-gray-300"
                >
                  <coin.icon className="h-4 w-4 mr-2" />
                  {coin.symbol}
                </Badge>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-gray-800/30 border-gray-700">
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold text-white">5+</p>
                <p className="text-sm text-gray-400">Criptomoedas</p>
              </CardContent>
            </Card>
            <Card className="bg-gray-800/30 border-gray-700">
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold text-white">6</p>
                <p className="text-sm text-gray-400">Intervalos</p>
              </CardContent>
            </Card>
            <Card className="bg-gray-800/30 border-gray-700">
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold text-emerald-400">200ms</p>
                <p className="text-sm text-gray-400">Atualização</p>
              </CardContent>
            </Card>
            <Card className="bg-gray-800/30 border-gray-700">
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold text-white">4</p>
                <p className="text-sm text-gray-400">Indicadores</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-gray-800 bg-gray-900/80 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-500">
            © 2024 CryptoAnalyzer. Dados em tempo real via CoinGecko API.
          </p>
          <p className="text-xs text-gray-600 mt-2">
            ⚠️ As análises são informativas e não constituem recomendação de investimento.
          </p>
        </div>
      </footer>
    </div>
  )
}
