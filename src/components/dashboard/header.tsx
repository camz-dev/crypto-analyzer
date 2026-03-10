// =============================================
// HEADER DO DASHBOARD
// =============================================

"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  TrendingUp,
  LayoutDashboard,
  Zap,
  Wifi
} from "lucide-react"

interface HeaderProps {
  isConnected?: boolean
}

export function DashboardHeader({ isConnected = true }: HeaderProps) {
  const pathname = usePathname()

  return (
    <header className="w-full border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg shadow-lg shadow-emerald-500/20">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">
              CryptoAnalyzer
            </h1>
            <p className="text-xs text-gray-400">
              Análise em tempo real
            </p>
          </div>
        </Link>

        {/* Navegação */}
        <nav className="hidden md:flex items-center gap-1">
          <Link href="/dashboard">
            <Button
              variant="ghost"
              size="sm"
              className={`gap-2 ${
                pathname === "/dashboard" 
                  ? "text-emerald-400 bg-emerald-500/10" 
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Button>
          </Link>
          
          <Link href="/trading">
            <Button
              variant="ghost"
              size="sm"
              className={`gap-2 ${
                pathname === "/trading" 
                  ? "text-emerald-400 bg-emerald-500/10" 
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
            >
              <Zap className="h-4 w-4" />
              Trading
            </Button>
          </Link>
        </nav>

        {/* Status de conexão */}
        <Badge
          variant="outline"
          className={`
            gap-1
            ${isConnected 
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
              : "bg-gray-500/10 text-gray-400 border-gray-500/20"
            }
          `}
        >
          <Wifi className="h-3 w-3" />
          {isConnected ? "Online" : "Offline"}
        </Badge>
      </div>
    </header>
  )
}
