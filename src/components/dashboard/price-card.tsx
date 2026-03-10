// =============================================
// CARD DE PREÇO
// =============================================

"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  TrendingUp,
  TrendingDown,
  Star
} from "lucide-react"
import { PriceData } from "@/hooks/use-crypto-ws"

interface PriceCardProps {
  data: PriceData
  isSelected?: boolean
  onClick?: () => void
}

export function PriceCard({ data, isSelected, onClick }: PriceCardProps) {
  const isPositive = data.priceChangePercent24h >= 0

  return (
    <Card
      className={`
        cursor-pointer transition-all hover:scale-[1.02]
        ${isSelected 
          ? "bg-emerald-500/10 border-emerald-500/50 ring-1 ring-emerald-500/30" 
          : "bg-gray-800/50 border-gray-700 hover:border-gray-600"
        }
      `}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-gray-300">
              {data.symbol}
            </Badge>
            <span className="text-sm text-gray-400">{data.name}</span>
          </div>
          
          <button className="text-gray-500 hover:text-yellow-400 transition-colors">
            <Star className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-2">
          <p className="text-2xl font-bold text-white">
            ${data.price.toLocaleString(undefined, { 
              minimumFractionDigits: 2, 
              maximumFractionDigits: data.price < 1 ? 4 : 2 
            })}
          </p>

          <div className="flex items-center gap-2">
            <Badge
              className={`
                ${isPositive 
                  ? "bg-emerald-500/10 text-emerald-400" 
                  : "bg-red-500/10 text-red-400"
                }
              `}
            >
              {isPositive ? (
                <TrendingUp className="h-3 w-3 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1" />
              )}
              {isPositive ? "+" : ""}{data.priceChangePercent24h.toFixed(2)}%
            </Badge>
            
            <span className="text-xs text-gray-500">24h</span>
          </div>
        </div>

        {/* Mini sparkline placeholder */}
        <div className="mt-3 h-8 flex items-end gap-0.5">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className={`flex-1 rounded-sm ${
                Math.random() > 0.5 ? "bg-emerald-500/30" : "bg-red-500/30"
              }`}
              style={{ height: `${Math.random() * 100}%` }}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Skeleton de loading
export function PriceCardSkeleton() {
  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardContent className="p-4">
        <div className="animate-pulse space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-5 w-12 bg-gray-700 rounded" />
            <div className="h-4 w-20 bg-gray-700 rounded" />
          </div>
          <div className="h-8 w-32 bg-gray-700 rounded" />
          <div className="h-5 w-16 bg-gray-700 rounded" />
          <div className="h-8 bg-gray-700 rounded" />
        </div>
      </CardContent>
    </Card>
  )
}
