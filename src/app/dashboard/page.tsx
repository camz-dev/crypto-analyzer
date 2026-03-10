// =============================================
// PÁGINA PRINCIPAL DO DASHBOARD
// =============================================
// Dashboard completo com gráficos e análises

"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/header"
import { PriceCard, PriceCardSkeleton } from "@/components/dashboard/price-card"
import { CandlestickChart } from "@/components/charts/candlestick-chart"
import { AnalysisPanel } from "@/components/dashboard/analysis-panel"
import { useCryptoAPI, PriceData } from "@/hooks/use-crypto-ws"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  TrendingUp,
  TrendingDown,
  RefreshCw
} from "lucide-react"

// =============================================
// COMPONENTE DE ESTATÍSTICAS
// =============================================
interface StatsBarProps {
  prices: PriceData[]
}

function StatsBar({ prices }: StatsBarProps) {
  const stats = useMemo(() => {
    const totalMarketCap = prices.reduce((sum, p) => sum + p.marketCap, 0)
    const avgChange = prices.length > 0
      ? prices.reduce((sum, p) => sum + p.priceChangePercent24h, 0) / prices.length
      : 0
    const gainers = prices.filter(p => p.priceChangePercent24h > 0).length
    const losers = prices.filter(p => p.priceChangePercent24h < 0).length

    return { totalMarketCap, avgChange, gainers, losers }
  }, [prices])

  const formatLargeNumber = (num: number) => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`
    return `$${num.toFixed(0)}`
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <Card className="bg-gray-800/50 border-gray-700">
        <CardContent className="p-4">
          <p className="text-xs text-gray-500">Market Cap Total</p>
          <p className="text-xl font-bold text-white">
            {formatLargeNumber(stats.totalMarketCap)}
          </p>
        </CardContent>
      </Card>
      
      <Card className="bg-gray-800/50 border-gray-700">
        <CardContent className="p-4">
          <p className="text-xs text-gray-500">Variação Média 24h</p>
          <p className={`text-xl font-bold ${stats.avgChange >= 0 ? "text-emerald-400" : "text-red-400"}`}>
            {stats.avgChange >= 0 ? "+" : ""}{stats.avgChange.toFixed(2)}%
          </p>
        </CardContent>
      </Card>
      
      <Card className="bg-gray-800/50 border-gray-700">
        <CardContent className="p-4">
          <p className="text-xs text-gray-500">Em Alta</p>
          <p className="text-xl font-bold text-emerald-400 flex items-center gap-1">
            <TrendingUp className="h-4 w-4" />
            {stats.gainers} moedas
          </p>
        </CardContent>
      </Card>
      
      <Card className="bg-gray-800/50 border-gray-700">
        <CardContent className="p-4">
          <p className="text-xs text-gray-500">Em Queda</p>
          <p className="text-xl font-bold text-red-400 flex items-center gap-1">
            <TrendingDown className="h-4 w-4" />
            {stats.losers} moedas
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

// =============================================
// COMPONENTE PRINCIPAL
// =============================================
export default function DashboardPage() {
  const router = useRouter()
  
  // Buscar dados da API
  const { prices, loading, error } = useCryptoAPI()

  // Moeda selecionada
  const [selectedCoin, setSelectedCoin] = useState<string>("")

  // Seleciona primeira moeda quando os dados chegam
  useEffect(() => {
    if (prices.length > 0 && !selectedCoin) {
      const timer = setTimeout(() => {
        setSelectedCoin(prices[0].id)
      }, 0)
      return () => clearTimeout(timer)
    }
  }, [prices.length, selectedCoin, prices])

  // Dados da moeda selecionada
  const selectedCoinData = prices.find(p => p.id === selectedCoin)

  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      {/* Header */}
      <DashboardHeader isConnected={true} />

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
        {/* Mensagem de boas-vindas */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white">
            Bem-vindo ao CryptoAnalyzer! 👋
          </h2>
          <p className="text-gray-400">
            Acompanhe suas criptomoedas em tempo real
          </p>
        </div>

        {/* Aviso de erro */}
        {error && (
          <Card className="mb-6 bg-red-500/10 border-red-500/20">
            <CardContent className="p-4 flex items-center gap-3">
              <RefreshCw className="h-5 w-5 text-red-400" />
              <p className="text-red-400">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Estatísticas gerais */}
        {prices.length > 0 && <StatsBar prices={prices} />}

        {/* Abas de navegação */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-gray-800 border border-gray-700">
            <TabsTrigger 
              value="overview"
              className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white"
            >
              Visão Geral
            </TabsTrigger>
            <TabsTrigger 
              value="analysis"
              className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white"
            >
              Análise
            </TabsTrigger>
            <TabsTrigger 
              value="trading"
              className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white"
            >
              Trading
            </TabsTrigger>
          </TabsList>

          {/* Aba: Visão Geral */}
          <TabsContent value="overview" className="space-y-6">
            {/* Cards de preço */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <PriceCardSkeleton key={i} />
                ))
              ) : (
                prices.map((coin) => (
                  <PriceCard
                    key={coin.id}
                    data={coin}
                    isSelected={selectedCoin === coin.id}
                    onClick={() => setSelectedCoin(coin.id)}
                  />
                ))
              )}
            </div>

            {/* Gráfico da moeda selecionada */}
            {selectedCoinData && (
              <CandlestickChart
                coinId={selectedCoinData.id}
                coinSymbol={selectedCoinData.symbol}
                coinName={selectedCoinData.name}
              />
            )}
          </TabsContent>

          {/* Aba: Análise */}
          <TabsContent value="analysis" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Gráfico */}
              {selectedCoinData && (
                <CandlestickChart
                  coinId={selectedCoinData.id}
                  coinSymbol={selectedCoinData.symbol}
                  coinName={selectedCoinData.name}
                />
              )}

              {/* Painel de análise */}
              {selectedCoinData && (
                <AnalysisPanel
                  coinId={selectedCoinData.id}
                  coinSymbol={selectedCoinData.symbol}
                  coinName={selectedCoinData.name}
                />
              )}
            </div>
          </TabsContent>

          {/* Aba: Trading */}
          <TabsContent value="trading" className="space-y-6">
            <div className="flex items-center justify-center p-8">
              <Card className="bg-gray-800/50 border-gray-700 max-w-md">
                <CardContent className="p-6 text-center">
                  <Badge className="mb-4 bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                    Em Breve
                  </Badge>
                  <h3 className="text-xl font-bold text-white mb-2">
                    Página de Trading
                  </h3>
                  <p className="text-gray-400 mb-4">
                    Acesse a página de trading completa com gráfico em tempo real e bot de análise.
                  </p>
                  <button
                    onClick={() => router.push("/trading")}
                    className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors"
                  >
                    Ir para Trading →
                  </button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-gray-800 bg-gray-900/80 py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-500">
            © 2024 CryptoAnalyzer. Dados em tempo real via CoinGecko API.
          </p>
          <p className="text-xs text-gray-600 mt-1">
            As análises são informativas e não constituem recomendação de investimento.
          </p>
        </div>
      </footer>
    </div>
  )
}
