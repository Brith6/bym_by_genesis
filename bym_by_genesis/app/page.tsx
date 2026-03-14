'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-6">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl md:text-8xl font-bold mb-6 gradient-text">
              BeyondMemories
            </h1>
            <p className="text-2xl md:text-3xl text-gray-300 mb-4">
              Construisons le mémorial numérique du futur
            </p>
            <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
              Préservez et partagez les souvenirs de vos proches dans un espace virtuel éternel, accessible à tous, pour toujours.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <Link
              href="/create"
              className="group relative px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full text-white font-semibold text-lg hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105"
            >
              <span className="relative z-10">Créer un mémorial</span>
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity blur" />
            </Link>
            <Link
              href="/explore"
              className="px-8 py-4 glass rounded-full text-white font-semibold text-lg hover:bg-white/10 transition-all duration-300"
            >
              Explorer
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-center mb-16 text-white"
          >
            Créez en 3 étapes simples
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Informations de base',
                description: 'Entrez le nom, les dates et une photo de votre proche',
                icon: '👤'
              },
              {
                step: '02',
                title: 'Ajoutez des souvenirs',
                description: 'Partagez des photos, vidéos et histoires mémorables',
                icon: '📸'
              },
              {
                step: '03',
                title: 'Personnalisez & Publiez',
                description: 'Choisissez un thème et rendez le mémorial accessible',
                icon: '✨'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="glass rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 group"
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <div className="text-indigo-400 font-mono text-sm mb-2">
                  {feature.step}
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-6">
        <div className="max-w-4xl mx-auto text-center glass rounded-3xl p-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Commencez dès aujourd&apos;hui
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Créez un espace éternel pour honorer la mémoire de vos proches
            </p>
            <Link
              href="/create"
              className="inline-block px-10 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full text-white font-bold text-xl hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105"
            >
              Créer gratuitement
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
