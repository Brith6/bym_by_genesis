'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { memorialAPI } from '@/lib/api';
import { Memorial } from '@/lib/types';

export default function Dashboard() {
    const [memorials, setMemorials] = useState<Memorial[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMemorials = async () => {
            try {
                const response = await memorialAPI.getAll();
                setMemorials(response.data);
            } catch (error) {
                console.error('Error fetching memorials:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMemorials();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 p-6 md:p-12">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Mes Mémoriaux</h1>
                        <p className="text-gray-400">Gérez et préservez les souvenirs de vos proches</p>
                    </div>
                    <Link 
                        href="/create"
                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-full font-medium transition-all shadow-lg shadow-indigo-500/20 flex items-center gap-2"
                    >
                        <span>+</span> Créer un mémorial
                    </Link>
                </div>

                {loading ? (
                    <div className="text-white text-center py-20">Chargement...</div>
                ) : memorials.length === 0 ? (
                    <div className="text-center py-20 glass rounded-3xl">
                        <div className="text-6xl mb-6">🕊️</div>
                        <h2 className="text-2xl font-bold text-white mb-4">Aucun mémorial créé</h2>
                        <p className="text-gray-400 mb-8">Commencez par créer un espace pour honorer un être cher.</p>
                        <Link 
                            href="/create"
                            className="inline-block bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors"
                        >
                            Commencer
                        </Link>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {memorials.map((memorial, index) => (
                            <motion.div
                                key={memorial._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Link href={`/memorial/${memorial._id}`}>
                                    <div className="group relative h-80 rounded-3xl overflow-hidden cursor-pointer border border-white/10 hover:border-white/30 transition-all">
                                        <div 
                                            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                            style={{ 
                                                background: `linear-gradient(135deg, ${memorial.theme.primaryColor} 0%, ${memorial.theme.secondaryColor} 100%)` 
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                                        
                                        <div className="absolute inset-0 p-8 flex flex-col justify-end">
                                            <h3 className="text-3xl font-bold text-white mb-2">{memorial.name}</h3>
                                            <p className="text-white/80 text-lg">
                                                {new Date(memorial.birthDate).getFullYear()} - {memorial.deathDate ? new Date(memorial.deathDate).getFullYear() : 'Présent'}
                                            </p>
                                            <div className="mt-6 flex items-center gap-2 text-sm font-medium text-white/60 group-hover:text-white transition-colors">
                                                <span>Voir le mémorial</span>
                                                <span>→</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
