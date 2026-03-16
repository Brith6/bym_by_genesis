'use client';

import { motion } from 'framer-motion';
import { Memory } from '@/lib/types';

interface MemoryCardProps {
    memory: Memory;
    onClick?: () => void;
    theme?: { primaryColor: string; secondaryColor: string };
}

export default function MemoryCard({ memory, onClick, theme }: MemoryCardProps) {
    const primary = theme?.primaryColor || '#6366f1';
    const secondary = theme?.secondaryColor || '#8b5cf6';

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            onClick={onClick}
            // overflow-visible so the floating image can breathe outside the card bounds
            className="glass rounded-2xl group cursor-pointer flex flex-col h-full overflow-visible"
        >
            {memory.mediaUrl && (memory.type === 'photo' || memory.type === 'video') && (
                <div className="relative flex items-center justify-center pt-8 pb-6 px-6">
                    <div style={{ perspective: '800px' }} className="w-full">
                        <motion.div
                            animate={{
                                y: [0, -10, 0],
                                rotateY: [-4, 4, -4],
                                rotateX: [2, -2, 2],
                            }}
                            transition={{
                                y: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
                                rotateY: { duration: 7, repeat: Infinity, ease: 'easeInOut' },
                                rotateX: { duration: 5.5, repeat: Infinity, ease: 'easeInOut' },
                            }}
                            style={{ transformStyle: 'preserve-3d' }}
                            className="relative w-full"
                        >
                            {/* White photo frame */}
                            <div
                                className="absolute bg-white rounded-sm"
                                style={{
                                    inset: '-10px',
                                    transform: 'translateZ(-3px)',
                                    boxShadow: `0 20px 50px rgba(0,0,0,0.45), 0 0 30px ${primary}33`,
                                }}
                            />
                            {/* Media */}
                            {memory.type === 'video' ? (
                                <video
                                    src={memory.mediaUrl}
                                    className="w-full h-48 object-cover rounded-sm block"
                                    style={{ transform: 'translateZ(2px)' }}
                                    muted
                                    loop
                                    autoPlay
                                />
                            ) : (
                                <img
                                    src={memory.mediaUrl}
                                    alt={memory.title}
                                    className="w-full h-48 object-cover rounded-sm block"
                                    style={{ transform: 'translateZ(2px)' }}
                                />
                            )}
                            {/* Glow beneath */}
                            <div
                                className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-3/4 h-4 blur-xl rounded-full opacity-35"
                                style={{ backgroundColor: primary }}
                            />
                        </motion.div>
                    </div>
                </div>
            )}

            <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center justify-between mb-3">
                    <span
                        className="px-3 py-1 rounded-full text-xs font-medium border"
                        style={{
                            backgroundColor: `${secondary}33`,
                            color: secondary,
                            borderColor: `${secondary}4d`,
                        }}
                    >
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
