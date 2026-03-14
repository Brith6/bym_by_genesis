'use client';

import { motion } from 'framer-motion';
import { Memory } from '@/lib/types';

interface TimelineProps {
    memories: Memory[];
    onSelectMemory?: (memory: Memory) => void;
}

export default function Timeline({ memories, onSelectMemory }: TimelineProps) {
    // Sort memories by date
    const sortedMemories = [...memories].sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    return (
        <div className="relative py-10">
            {/* Central Timeline line (Desktop) */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-500 via-purple-500 to-indigo-500 transform -translate-x-1/2" />
            
            {/* Left Timeline line (Mobile) */}
            <div className="md:hidden absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-500 via-purple-500 to-indigo-500" />

            <div className="space-y-12 md:space-y-24">
                {sortedMemories.map((memory, index) => (
                    <motion.div
                        key={memory._id}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className={`relative flex flex-col md:flex-row items-center ${
                            index % 2 === 0 ? 'md:flex-row-reverse' : ''
                        }`}
                    >
                        {/* Content Side */}
                        <div className="w-full md:w-1/2 pl-20 md:pl-0 md:px-12">
                            <div 
                                onClick={() => onSelectMemory?.(memory)}
                                className="glass rounded-2xl p-6 hover:bg-white/10 transition-all group hover:shadow-2xl hover:shadow-purple-500/20 border border-white/5 cursor-pointer transform hover:-translate-y-1 duration-300"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="text-2xl font-bold text-white mb-2">
                                            {memory.title}
                                        </h3>
                                        <p className="text-indigo-400 font-medium">
                                            {new Date(memory.date).toLocaleDateString('fr-FR', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                    <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-sm border border-purple-500/30">
                                        {memory.type === 'photo' && '📸'}
                                        {memory.type === 'video' && '🎥'}
                                        {memory.type === 'text' && '📝'}
                                        {memory.type === 'audio' && '🎵'}
                                    </span>
                                </div>

                                {memory.description && (
                                    <p className="text-gray-300 mb-4 leading-relaxed line-clamp-3">
                                        {memory.description}
                                    </p>
                                )}

                                {memory.mediaUrl && (memory.type === 'photo' || memory.type === 'video') && (
                                    <div className="rounded-xl overflow-hidden shadow-lg relative">
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10 pointer-events-none" />
                                        {memory.type === 'video' ? (
                                            <div className="w-full h-64 bg-black flex items-center justify-center relative">
                                                <video 
                                                    src={memory.mediaUrl} 
                                                    className="w-full h-full object-cover opacity-80"
                                                    muted
                                                    loop
                                                    onMouseOver={e => e.currentTarget.play()}
                                                    onMouseOut={e => e.currentTarget.pause()}
                                                />
                                            </div>
                                        ) : (
                                            <img
                                                src={memory.mediaUrl}
                                                alt={memory.title}
                                                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        )}
                                    </div>
                                )}

                                {memory.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-4">
                                        {memory.tags.map((tag, i) => (
                                            <span
                                                key={i}
                                                className="px-3 py-1 rounded-full bg-white/5 text-gray-400 text-xs uppercase tracking-wider hover:bg-white/10 transition-colors"
                                            >
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Center Dot */}
                        <div className="absolute left-8 md:left-1/2 top-0 md:top-1/2 transform md:-translate-x-1/2 md:-translate-y-1/2 flex items-center justify-center">
                            <div className="w-4 h-4 bg-indigo-500 rounded-full ring-4 ring-slate-900 z-10 relative">
                                <div className="absolute inset-0 bg-purple-500 rounded-full animate-ping opacity-75"></div>
                            </div>
                        </div>

                        {/* Empty Side for Desktop Balance */}
                        <div className="hidden md:block w-1/2" />
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
