import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { inter } from "@/lib/fonts"
import Chatbot from "@/components/chat-assistant/chat-assistant"
import { ReactQueryClientProvider } from "@/providers/query-provider"

export const metadata: Metadata = {
  title: "CryptoEdu | Aprende sobre Criptomonedas y Blockchain",
  description: "Descubre el mundo de las criptomonedas con nuestro asistente virtual educativo. Aprende sobre Bitcoin, Ethereum, DeFi, NFTs y más de manera sencilla.",
  keywords: "criptomonedas, blockchain, bitcoin, ethereum, defi, nft, educación crypto, wallet, exchange",
  authors: [{ name: "CryptoEdu" }],
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "https://chatbot-template-8pdj.vercel.app/",
    siteName: "CryptoEdu",
    title: "CryptoEdu | Tu Guía en el Mundo Cripto",
    description: "Aprende sobre criptomonedas y blockchain con nuestro asistente virtual educativo. Conceptos básicos, wallets, exchanges y más.",
    images: [
      {
        url: "/picture.png",
        width: 1200,
        height: 630,
        alt: "CryptoEdu Preview"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "CryptoEdu | Aprende sobre Criptomonedas",
    description: "Tu guía educativa en el mundo de las criptomonedas y blockchain",
    images: ["/picture.png"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: "google-site-verification-code", // Reemplazar con tu código real
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ReactQueryClientProvider>
      <html lang="es" className="scroll-smooth">
        <head>
          <link rel="canonical" href="https://chatbot-template-8pdj.vercel.app/" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </head>
        <body className={inter.className}>
          {children}
          <Chatbot />
        </body>
      </html>
    </ReactQueryClientProvider>
  )
}
