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
import { useHomepageData } from '@/hooks/use-homepage-data';
import type { HomepageData } from '@/lib/types/homepage';
import MarketAnalysisSection from '@/components/market-analysis-section';

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

export default function Home() {
  const { data: homepageData, isLoading, error } = useHomepageData();

  // Icon mapping functions
  const getFeatureIcon = (title: string) => {
    switch (title) {
      case 'Conceptos básicos':
        return <BookOpen className="h-10 w-10 text-emerald-500" />;
      case 'Wallets y seguridad':
        return <Wallet className="h-10 w-10 text-cyan-500" />;
      case 'Exchanges y trading':
        return <ArrowUpDown className="h-10 w-10 text-emerald-500" />;
      case 'Redes blockchain':
        return <Layers className="h-10 w-10 text-cyan-500" />;
      case 'Principales criptomonedas':
        return (
          <Image
            src="/logos/btc.svg"
            alt="Bitcoin"
            width={40}
            height={40}
            className="text-emerald-500"
          />
        );
      case 'Tecnologías emergentes':
        return <Lightbulb className="h-10 w-10 text-cyan-500" />;
      default:
        return <Lightbulb className="h-10 w-10 text-emerald-500" />;
    }
  };

  const getConceptIcon = (title: string) => {
    switch (title) {
      case '¿Qué es un Exchange?':
        return <ArrowUpDown className="h-6 w-6 text-emerald-500" />;
      case '¿Qué es un Wallet?':
      case 'Tipos de Wallets':
        return <Wallet className="h-6 w-6 text-emerald-500" />;
      case 'Redes Blockchain':
        return <Layers className="h-6 w-6 text-cyan-500" />;
      case 'DeFi (Finanzas Descentralizadas)':
        return <BarChart3 className="h-6 w-6 text-emerald-500" />;
      case 'NFTs (Tokens No Fungibles)':
        return (
          <Image
            src="/logos/eth.svg"
            alt="Ethereum"
            width={24}
            height={24}
            className="text-cyan-500"
          />
        );
      default:
        return <Lightbulb className="h-6 w-6 text-emerald-500" />;
    }
  };

  if (isLoading) {
    return (
      <main className="flex min-h-screen flex-col bg-gradient-to-b from-gray-900 to-black text-white selection:bg-emerald-500/20">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-emerald-500"></div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen flex-col bg-gradient-to-b from-gray-900 to-black text-white selection:bg-emerald-500/20">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-red-500 mb-4">Error</h1>
            <p className="text-gray-400">
              No se pudo cargar la información. Por favor, intenta de nuevo más
              tarde.
            </p>
          </div>
        </div>
      </main>
    );
  }

  const {
    heroSection,
    stats,
    features,
    concepts,
    testimonials,
    tools,
    newsSection,
    footer,
  } = homepageData || ({} as HomepageData);

  // Add icons to features and concepts
  const featuresWithIcons =
    features?.map((feature) => ({
      ...feature,
      icon: getFeatureIcon(feature.title),
    })) || [];

  const conceptsWithIcons =
    concepts?.map((concept) => ({
      ...concept,
      icon: getConceptIcon(concept.title),
    })) || [];

  return (
    <>
      <Script id="json-ld" type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'EducationalOrganization',
          name: footer?.brand || 'CryptoEdu',
          description: heroSection?.subtitle ||
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
                {heroSection?.badge}
              </motion.div>

              <motion.h1
                variants={itemAnimation}
                className="text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.15] tracking-tight mb-8"
              >
                {heroSection?.title}
              </motion.h1>

              <motion.p
                variants={itemAnimation}
                className="text-xl text-gray-300/90 mb-12 leading-relaxed max-w-2xl mx-auto"
              >
                {heroSection?.subtitle}
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

        {/* Crypto Tools Section - Moved to top */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-900/30 backdrop-blur-sm">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="hover:scale-[1.02] transition-transform duration-300"
              >
                <CryptoConverter />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="hover:scale-[1.02] transition-transform duration-300"
              >
                <FavoriteCryptos />
              </motion.div>
            </div>
          </div>
        </section>

        <article className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/50 backdrop-blur-sm">
          <div className="container mx-auto">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-100px' }}
              variants={containerAnimation}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center"
            >
              {stats?.map((stat, index) => (
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
              {featuresWithIcons.map((feature, index) => (
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
              {conceptsWithIcons.map((concept, index) => (
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
              {testimonials?.map((testimonial, index) => (
                <motion.div
                  key={testimonial.name}
                  variants={itemAnimation}
                  className="bg-white/5 backdrop-blur-sm rounded-xl p-6"
                >
                  <p className="text-sm leading-relaxed text-gray-300">
                    "{testimonial.comment}"
                  </p>
                  <p className="mt-2 text-sm text-emerald-400 font-medium">
                    - {testimonial.name}
                  </p>
                </motion.div>
              ))}
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
                {newsSection?.title}
              </motion.h2>
              <motion.p
                variants={itemAnimation}
                className="text-lg text-gray-400"
              >
                {newsSection?.description}
              </motion.p>
            </div>
            <motion.div variants={itemAnimation}>
              <CryptoNewsComponent />
            </motion.div>
          </motion.div>
        </section>
        <MarketAnalysisSection />
        <footer role="contentinfo" className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-950">
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
                  {footer?.brand}
                </span>
              </div>
              <div className="flex space-x-8">
                {footer?.links?.map((link) => (
                  <Link
                    key={link}
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-base font-medium"
                  >
                    {link}
                  </Link>
                ))}
              </div>
            </motion.div>
            <div className="border-t border-gray-800/50 mt-12 pt-8 text-center text-gray-500">
              <p className="text-sm">{footer?.copyright}</p>
            </div>
          </nav>
        </footer>
      </main>
    </>
  );
}