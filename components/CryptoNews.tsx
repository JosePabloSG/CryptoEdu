"use client"

import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { RefreshCw, ExternalLink, Bot, Clock, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"

export interface CryptoNews {
  title: string
  link: string
  pubDate: string
  summary: string
  source: string
}

const containerAnimation = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
      duration: 0.3,
    },
  },
}

const itemAnimation = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.645, 0.045, 0.355, 1],
    },
  },
}

export function CryptoNewsComponent() {
  const {
    data: news = [],
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery<CryptoNews[]>({
    queryKey: ["cryptoNews"],
    queryFn: async () => {
      const response = await fetch("/api/news")
      if (!response.ok) {
        throw new Error("Error fetching news")
      }
      return response.json()
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false,
  })

  if (isLoading) {
    return (
      <div className="w-full bg-gradient-to-b from-gray-900/50 to-gray-800/30 backdrop-blur-sm rounded-2xl border border-white/10">
        <div className="p-8">
          <div className="text-center max-w-md mx-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 mb-6">
              <RefreshCw className="w-8 h-8 animate-spin text-emerald-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Cargando noticias</h3>
            <p className="text-gray-400">Obteniendo las últimas novedades del mundo cripto...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full bg-gradient-to-b from-gray-900/50 to-gray-800/30 backdrop-blur-sm rounded-2xl border border-white/10">
        <div className="p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/20 mb-6">
            <TrendingUp className="w-8 h-8 text-red-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Error al cargar noticias</h3>
          <p className="text-gray-400 mb-6">No pudimos obtener las últimas noticias. Por favor, intenta de nuevo.</p>
          <Button
            onClick={() => refetch()}
            className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-medium px-6 py-2 rounded-full transition-all duration-300 hover:scale-105"
          >
            Reintentar
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full bg-gradient-to-b from-gray-900/50 to-gray-800/30 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
      {/* Header */}
      <div className="p-6 sm:p-8 border-b border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-emerald-500/20 to-cyan-500/20">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">Noticias Cripto</h2>
            </div>
            <div className="flex items-center gap-3">
              <p className="text-gray-300">Últimas novedades del ecosistema</p>
              <div className="inline-flex items-center gap-1.5 text-xs bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-emerald-300 px-3 py-1.5 rounded-full border border-emerald-500/20">
                <Bot size={12} />
                Resúmenes por IA
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isRefetching}
            className="bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/30 transition-all duration-200 hover:scale-105"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefetching ? "animate-spin" : ""}`} />
            Actualizar
          </Button>
        </div>
      </div>

      {/* News Content */}
      <div className="p-6 sm:p-8">
        <motion.div
          initial="hidden"
          animate="show"
          variants={containerAnimation}
          className="space-y-6 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent"
        >
          {news.map((item, index) => (
            <motion.article
              key={item.link}
              variants={itemAnimation}
              className="group relative bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] cursor-pointer"
              onClick={() => window.open(item.link, "_blank", "noopener,noreferrer")}
            >
              {/* Source and Date */}
              <div className="flex items-center justify-between mb-4">
                <div className="inline-flex items-center gap-2 text-sm font-medium text-emerald-400 bg-emerald-500/20 px-3 py-1.5 rounded-full border border-emerald-500/20">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  {item.source}
                </div>
                <div className="flex items-center gap-1.5 text-sm text-gray-400">
                  <Clock size={14} />
                  <time dateTime={item.pubDate}>
                    {new Date(item.pubDate).toLocaleDateString("es-ES", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </time>
                </div>
              </div>

              {/* Title */}
              <h3 className="text-lg font-semibold text-white mb-3 leading-tight group-hover:text-emerald-300 transition-colors duration-200">
                {item.title}
              </h3>

              {/* Summary */}
              <p className="text-gray-300 leading-relaxed mb-4 line-clamp-3">{item.summary}</p>

              {/* Read More Link */}
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-2 text-sm text-cyan-400 font-medium group-hover:text-cyan-300 transition-colors duration-200">
                  <ExternalLink size={14} />
                  Leer artículo completo
                </div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 group-hover:scale-110">
                  <ExternalLink size={14} className="text-emerald-400" />
                </div>
              </div>

              {/* Hover gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-cyan-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </motion.article>
          ))}
        </motion.div>

        {news.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-500/20 mb-4">
              <TrendingUp className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">No hay noticias disponibles</h3>
            <p className="text-gray-400">Intenta actualizar para obtener las últimas noticias.</p>
          </div>
        )}
      </div>
    </div>
  )
}
