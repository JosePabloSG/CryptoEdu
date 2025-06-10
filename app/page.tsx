'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BookOpen,
  Layers,
  Lightbulb,
  Wallet,
  BarChart3,
  ArrowUpDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import CryptoLogos from '@/components/crypto-logos';
import FeatureCard from '@/components/feature-card';
import ConceptCard from '@/components/concept-card';
import Script from 'next/script';
import CountUp from 'react-countup';
import PriceTicker from '@/components/price-ticker';
import CryptoConverter from '@/components/crypto-converter';
import FavoriteCryptos from '@/components/favorite-cryptos';
import { CryptoNewsComponent } from '@/components/CryptoNews';
import UserProfile from '@/components/user-profile';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: {
    duration: 0.3,
    ease: [0.645, 0.045, 0.355, 1], // Curva asimétrica optimizada para interfaces
  },
};

const springTransition = {
  type: 'spring',
  stiffness: 200,
  damping: 20,
  mass: 1,
};

const containerAnimation = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
      duration: 0.2,
    },
  },
};

const itemAnimation = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.2,
      ease: [0.645, 0.045, 0.355, 1],
    },
  },
};

const stats = [
  { number: 100, text: 'Conceptos explicados' },
  { number: 50, text: 'Criptomonedas' },
  { number: 20, text: 'Blockchains' },
  { number: 10000, text: 'Usuarios' },
];

const features = [
  {
    icon: <BookOpen className="h-10 w-10 text-emerald-500" />,
    title: 'Conceptos básicos',
    description:
      'Aprende los fundamentos de las criptomonedas, blockchain y los términos más importantes del ecosistema.',
  },
  {
    icon: <Wallet className="h-10 w-10 text-cyan-500" />,
    title: 'Wallets y seguridad',
    description:
      'Descubre los diferentes tipos de wallets, cómo funcionan y las mejores prácticas de seguridad.',
  },
  {
    icon: <ArrowUpDown className="h-10 w-10 text-emerald-500" />,
    title: 'Exchanges y trading',
    description:
      'Entiende cómo funcionan los exchanges, tipos de órdenes y conceptos básicos de trading.',
  },
  {
    icon: <Layers className="h-10 w-10 text-cyan-500" />,
    title: 'Redes blockchain',
    description:
      'Explora las diferentes redes blockchain, sus características y casos de uso específicos.',
  },
  {
    icon: (
      <Image
        src="/logos/btc.svg"
        alt="Bitcoin"
        width={40}
        height={40}
        className="text-emerald-500"
      />
    ),
    title: 'Principales criptomonedas',
    description:
      'Conoce en detalle Bitcoin, Ethereum, Solana y otras criptomonedas importantes del mercado.',
  },
  {
    icon: <Lightbulb className="h-10 w-10 text-cyan-500" />,
    title: 'Tecnologías emergentes',
    description:
      'Mantente al día con DeFi, NFTs, Web3 y otras tecnologías emergentes en el espacio cripto.',
  },
];

const concepts = [
  {
    title: '¿Qué es un Exchange?',
    description:
      'Un exchange de criptomonedas es una plataforma que permite a los usuarios comprar, vender e intercambiar criptomonedas por otras monedas digitales o dinero fiat. Existen exchanges centralizados (CEX) como Binance o Coinbase, y descentralizados (DEX) como Uniswap.',
    icon: <ArrowUpDown className="h-6 w-6 text-emerald-500" />,
  },
  {
    title: '¿Qué es un Wallet?',
    description:
      'Un wallet o monedero de criptomonedas es una herramienta que te permite almacenar, enviar y recibir criptomonedas. Contiene tus claves privadas, que son necesarias para acceder y gestionar tus activos digitales en la blockchain.',
    icon: <Wallet className="h-6 w-6 text-cyan-500" />,
  },
  {
    title: 'Tipos de Wallets',
    description:
      'Existen varios tipos de wallets: Hot wallets (conectados a internet) como wallets de software y exchanges; Cold wallets (sin conexión a internet) como hardware wallets y paper wallets; y custodial wallets (gestionados por terceros) vs non-custodial (control total del usuario).',
    icon: <Wallet className="h-6 w-6 text-emerald-500" />,
  },
  {
    title: 'Redes Blockchain',
    description:
      'Las redes blockchain son sistemas distribuidos que mantienen un registro inmutable de transacciones. Cada blockchain tiene características únicas: Bitcoin se centra en ser dinero digital, Ethereum permite contratos inteligentes, Solana ofrece alta velocidad, y existen muchas otras con diferentes enfoques y tecnologías.',
    icon: <Layers className="h-6 w-6 text-cyan-500" />,
  },
  {
    title: 'DeFi (Finanzas Descentralizadas)',
    description:
      'DeFi se refiere a aplicaciones financieras construidas sobre redes blockchain que eliminan intermediarios tradicionales. Incluye préstamos, intercambios descentralizados, staking, yield farming y otros servicios financieros que operan de manera transparente y sin permisos.',
    icon: <BarChart3 className="h-6 w-6 text-emerald-500" />,
  },
  {
    title: 'NFTs (Tokens No Fungibles)',
    description:
      'Los NFTs son activos digitales únicos que representan la propiedad de un item específico. A diferencia de las criptomonedas como Bitcoin, cada NFT tiene un valor único y no puede ser intercambiado de manera equivalente. Se utilizan para arte digital, coleccionables, gaming y más.',
    icon: (
      <Image
        src="/logos/eth.svg"
        alt="Ethereum"
        width={24}
        height={24}
        className="text-cyan-500"
      />
    ),
  },
];

export default function Home() {
  return (
    <>
      <Script id="json-ld" type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'EducationalOrganization',
          name: 'CryptoEdu',
          description:
            'Plataforma educativa sobre criptomonedas y blockchain con asistente virtual',
          url: 'https://chatbot-template-8pdj.vercel.app',
          logo: 'https://chatbot-template-8pdj.vercel.app/logos/btc.svg',
          sameAs: [
            'https://twitter.com/cryptoedu',
            'https://facebook.com/cryptoedu',
          ],
          offers: {
            '@type': 'Offer',
            name: 'Educación en Criptomonedas',
            description: 'Aprende sobre Bitcoin, Ethereum, DeFi, NFTs y más',
          },
        })}
      </Script>

      <main className="flex min-h-screen flex-col bg-gradient-to-b from-gray-900 to-black text-white selection:bg-emerald-500/20">
        <header className="relative overflow-hidden py-24 sm:py-32 px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="absolute inset-0 z-0"
          >
            <CryptoLogos />
          </motion.div>{' '}
          <div className="container mx-auto relative z-10">
            {/* User Profile Section */}
            <div className="absolute top-0 right-0">
              <UserProfile />
            </div>

            <motion.div
              initial="hidden"
              animate="show"
              variants={containerAnimation}
              className="max-w-3xl mx-auto text-center"
            >
              <motion.div
                variants={itemAnimation}
                className="inline-block rounded-full bg-gradient-to-r from-emerald-500/90 to-cyan-500/90 px-6 py-2 text-sm font-semibold tracking-wide mb-8 shadow-lg hover:scale-105 transition-transform duration-200"
              >
                Tu guía en el mundo cripto
              </motion.div>

              <motion.h1
                variants={itemAnimation}
                className="text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.15] tracking-tight mb-8"
              >
                Aprende sobre{' '}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
                  criptomonedas
                </span>{' '}
                de manera sencilla
              </motion.h1>

              <motion.p
                variants={itemAnimation}
                className="text-xl text-gray-300/90 mb-12 leading-relaxed max-w-2xl mx-auto"
              >
                Descubre conceptos, tecnologías y términos del mundo cripto con
                nuestro asistente virtual educativo.
              </motion.p>

              {/* Agregamos el ticker de precios */}
              <motion.div
                variants={itemAnimation}
                className="max-w-4xl mx-auto mb-12"
              >
                <PriceTicker />
              </motion.div>
            </motion.div>
          </div>
        </header>
        <article className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/50 backdrop-blur-sm">
          <div className="container mx-auto">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-100px' }}
              variants={containerAnimation}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.text}
                  variants={itemAnimation}
                  className="p-4 rounded-xl hover:bg-white/5 transition-all duration-200 hover:scale-105"
                >
                  <motion.p
                    initial={{ scale: 0.5, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={springTransition}
                    className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400"
                  >
                    <CountUp
                      end={stat.number}
                      duration={2}
                      suffix={stat.number === 10000 ? '+' : '+'}
                      enableScrollSpy={true}
                      scrollSpyOnce={true}
                    />
                  </motion.p>
                  <p className="text-gray-400 mt-3 text-base sm:text-lg font-medium">
                    {stat.text}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </article>
        <section
          aria-labelledby="features-heading"
          className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8"
        >
          <h2 id="features-heading" className="sr-only">
            Características principales
          </h2>
          <div className="container mx-auto">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-100px' }}
              variants={containerAnimation}
              className="text-center max-w-3xl mx-auto mb-20"
            >
              <motion.h2
                variants={itemAnimation}
                className="text-3xl md:text-4xl font-bold mb-6 tracking-tight"
              >
                Aprende todo sobre el mundo cripto
              </motion.h2>
              <motion.p
                variants={itemAnimation}
                className="text-xl text-gray-400/90 leading-relaxed"
              >
                Nuestro asistente virtual educativo te ayuda a entender los
                conceptos fundamentales de las criptomonedas y la tecnología
                blockchain.
              </motion.p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-50px' }}
              variants={containerAnimation}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 relative"
            >
              {features.map((feature, index) => (
                <FeatureCard key={feature.title} {...feature} index={index} />
              ))}
            </motion.div>
          </div>
        </section>
        <section
          aria-labelledby="concepts-heading"
          className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-gray-900/30 backdrop-blur-sm"
        >
          <h2 id="concepts-heading" className="sr-only">
            Conceptos clave
          </h2>
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-3xl mx-auto mb-20"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">
                Conceptos clave que aprenderás
              </h2>
              <p className="text-xl text-gray-400/90 leading-relaxed">
                Nuestro asistente virtual te explica de manera clara y sencilla
                los conceptos más importantes del ecosistema cripto.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
              {concepts.map((concept, index) => (
                <ConceptCard key={concept.title} {...concept} index={index} />
              ))}
            </div>
          </div>
        </section>
        <section
          aria-labelledby="cta-heading"
          className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-gray-900 to-gray-800"
        >
          <h2 id="cta-heading" className="sr-only">
            Llamada a la acción
          </h2>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={containerAnimation}
            className="container mx-auto text-center"
          >
            <motion.div
              variants={itemAnimation}
              className="inline-block rounded-full bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 px-4 py-1.5 mb-8"
            >
              <span className="text-sm font-medium">
                Más de 10,000 usuarios ya confían en nosotros
              </span>
            </motion.div>
            <motion.h2
              variants={itemAnimation}
              className="text-3xl md:text-4xl font-bold mb-8 tracking-tight"
            >
              Comienza tu viaje en el mundo cripto
            </motion.h2>
            <motion.p
              variants={itemAnimation}
              className="text-xl text-gray-300/90 mb-12 max-w-2xl mx-auto leading-relaxed"
            >
              Únete a miles de usuarios que ya están aprendiendo sobre
              criptomonedas con nuestro asistente virtual educativo.
            </motion.p>

            {/* Social proof grid */}
            <motion.div
              variants={containerAnimation}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-12"
            >
              <motion.div
                variants={itemAnimation}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-6"
              >
                <p className="text-sm leading-relaxed text-gray-300">
                  "La mejor plataforma para aprender sobre crypto que he
                  encontrado."
                </p>
                <p className="mt-2 text-sm text-emerald-400 font-medium">
                  - María G.
                </p>
              </motion.div>
              <motion.div
                variants={itemAnimation}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-6"
              >
                <p className="text-sm leading-relaxed text-gray-300">
                  "Conceptos complejos explicados de forma simple y clara."
                </p>
                <p className="mt-2 text-sm text-emerald-400 font-medium">
                  - Juan R.
                </p>
              </motion.div>
              <motion.div
                variants={itemAnimation}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-6"
              >
                <p className="text-sm leading-relaxed text-gray-300">
                  "El asistente virtual resuelve todas mis dudas al instante."
                </p>
                <p className="mt-2 text-sm text-emerald-400 font-medium">
                  - Carlos M.
                </p>
              </motion.div>
            </motion.div>

            <motion.div
              variants={itemAnimation}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              className="inline-block"
            >
              <Button
                size="lg"
                className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-semibold px-8 py-6 text-lg rounded-full shadow-lg transition-all duration-300 hover:shadow-xl"
              >
                Comenzar ahora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </motion.div>
        </section>{' '}
        <section
          aria-labelledby="crypto-tools-heading"
          className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-gray-900/30 backdrop-blur-sm"
        >
          <h2 id="crypto-tools-heading" className="sr-only">
            Herramientas de criptomonedas
          </h2>
          <div className="container mx-auto">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-100px' }}
              variants={containerAnimation}
              className="text-center max-w-3xl mx-auto mb-20"
            >
              <motion.div
                variants={itemAnimation}
                className="inline-block rounded-full bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 px-6 py-2 mb-6"
              >
                <span className="text-sm font-semibold tracking-wide">
                  Precios en tiempo real
                </span>
              </motion.div>
              <motion.h2
                variants={itemAnimation}
                className="text-3xl md:text-4xl font-bold mb-6 tracking-tight text-white"
              >
                Herramientas de criptomonedas
              </motion.h2>
              <motion.p
                variants={itemAnimation}
                className="text-xl text-gray-300 leading-relaxed"
              >
                Utiliza nuestras herramientas para convertir entre criptomonedas
                y seguir tus favoritas en tiempo real.
              </motion.p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {' '}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="hover:scale-[1.02] transition-transform duration-300"
              >
                <CryptoConverter />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="hover:scale-[1.02] transition-transform duration-300"
              >
                <FavoriteCryptos />
              </motion.div>
            </div>
          </div>
        </section>
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="show"
            variants={containerAnimation}
            className="mx-auto max-w-7xl"
          >
            <div className="text-center mb-12">
              <motion.h2
                variants={itemAnimation}
                className="text-3xl font-bold tracking-tight sm:text-4xl mb-4"
              >
                Últimas Noticias
              </motion.h2>
              <motion.p
                variants={itemAnimation}
                className="text-lg text-gray-400"
              >
                Mantente informado sobre las últimas novedades del mundo cripto
              </motion.p>
            </div>
            <motion.div variants={itemAnimation}>
              <CryptoNewsComponent />
            </motion.div>
          </motion.div>
        </section>
        <footer
          role="contentinfo"
          className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-950"
        >
          <nav aria-label="Footer navigation" className="container mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex flex-col md:flex-row justify-between items-center space-y-8 md:space-y-0"
            >
              <div className="flex items-center">
                <div className="flex space-x-3">
                  <Image
                    src="/logos/btc.svg"
                    alt="Bitcoin"
                    width={28}
                    height={28}
                    className="hover:scale-110 transition-transform duration-300"
                  />
                  <Image
                    src="/logos/eth.svg"
                    alt="Ethereum"
                    width={28}
                    height={28}
                    className="hover:scale-110 transition-transform duration-300"
                  />
                  <Image
                    src="/logos/sol.svg"
                    alt="Solana"
                    width={28}
                    height={28}
                    className="hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <span className="ml-4 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
                  CryptoEdu
                </span>
              </div>
              <div className="flex space-x-8">
                <Link
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors duration-200 text-base font-medium"
                >
                  Inicio
                </Link>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors duration-200 text-base font-medium"
                >
                  Conceptos
                </Link>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors duration-200 text-base font-medium"
                >
                  Recursos
                </Link>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors duration-200 text-base font-medium"
                >
                  Contacto
                </Link>
              </div>
            </motion.div>
            <div className="border-t border-gray-800/50 mt-12 pt-8 text-center text-gray-500">
              <p className="text-sm">
                © {new Date().getFullYear()} CryptoEdu. Todos los derechos
                reservados.
              </p>
            </div>
          </nav>
        </footer>
      </main>
    </>
  );
}
