'use client';

import { motion } from 'framer-motion';
import { Memory } from '@/lib/types';

interface MemoryCardProps {
    memory: Memory;
    onClick?: () => void;
}

export default function MemoryCard({ memory, onClick }: MemoryCardProps) {
    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            onClick={onClick}
            className="glass rounded-2xl overflow-hidden group cursor-pointer flex flex-col h-full"
        >
            {memory.mediaUrl && (memory.type === 'photo' || memory.type === 'video') && (
                <div className="relative h-56 overflow-hidden shrink-0">
                    {memory.type === 'video' ? (
                        <div className="w-full h-full bg-black flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
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
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                </div>
            )}

            <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center justify-between mb-3">
                    <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-medium border border-purple-500/30">
                        {memory.type === 'photo' && '📸 Photo'}
                        {memory.type === 'video' && '🎥 Vidéo'}
                        {memory.type === 'text' && '📝 Récit'}
                        {memory.type === 'audio' && '🎵 Audio'}
                    </span>
                    <span className="text-gray-400 text-xs">
                        {new Date(memory.date).toLocaleDateString('fr-FR')}
                    </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
                    {memory.title}
                </h3>

                {memory.description && (
                    <p className="text-gray-400 text-sm line-clamp-3 mb-4 flex-grow">
                        {memory.description}
                    </p>
                )}

                {memory.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-auto">
                        {memory.tags.slice(0, 3).map((tag, i) => (
                            <span
                                key={i}
                                className="px-2 py-1 rounded-full bg-white/5 text-gray-400 text-xs border border-white/5"
                            >
                                #{tag}
                            </span>
                        ))}
                        {memory.tags.length > 3 && (
                            <span className="text-gray-500 text-xs py-1">
                                +{memory.tags.length - 3}
                            </span>
                        )}
                    </div>
                )}
            </div>
        </motion.div>
    );
}
