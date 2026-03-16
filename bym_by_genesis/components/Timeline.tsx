'use client';

import { motion } from 'framer-motion';
import { Memory } from '@/lib/types';

interface TimelineProps {
    memories: Memory[];
    onSelectMemory?: (memory: Memory) => void;
    theme?: { primaryColor: string; secondaryColor: string };
}

export default function Timeline({ memories, onSelectMemory, theme }: TimelineProps) {
    const primary = theme?.primaryColor || '#6366f1';
    const secondary = theme?.secondaryColor || '#8b5cf6';
    const lineGradient = `linear-gradient(to bottom, ${primary}, ${secondary}, ${primary})`;

    const sortedMemories = [...memories].sort((a, b) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    return (
        <div className="relative py-10">
            {/* Central Timeline line (Desktop) */}
            <div
                className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 transform -translate-x-1/2"
                style={{ background: lineGradient }}
            />
            {/* Left Timeline line (Mobile) */}
            <div
                className="md:hidden absolute left-8 top-0 bottom-0 w-0.5"
                style={{ background: lineGradient }}
            />

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
                                className="glass rounded-2xl p-6 hover:bg-white/10 transition-all group hover:shadow-2xl border border-white/5 cursor-pointer transform hover:-translate-y-1 duration-300"
                                style={{ ['--tw-shadow-color' as string]: `${secondary}33` }}
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="text-2xl font-bold text-white mb-2">
                                            {memory.title}
                                        </h3>
                                        <p className="font-medium" style={{ color: primary }}>
                                            {new Date(memory.date).toLocaleDateString('fr-FR', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                    <span
                                        className="px-3 py-1 rounded-full text-sm border"
                                        style={{
                                            backgroundColor: `${secondary}33`,
                                            color: secondary,
                                            borderColor: `${secondary}4d`
                                        }}
                                    >
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

                                {/* Image/video shown only on mobile (on desktop it's in the 3D floating card) */}
                                {memory.mediaUrl && (memory.type === 'photo' || memory.type === 'video') && (
                                    <div className="rounded-xl overflow-hidden shadow-lg relative md:hidden">
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10 pointer-events-none" />
                                        {memory.type === 'video' ? (
                                            <div className="w-full h-48 bg-black flex items-center justify-center">
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
                                                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
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
                            <div
                                className="w-4 h-4 rounded-full ring-4 ring-slate-900 z-10 relative"
                                style={{ backgroundColor: primary }}
                            >
                                <div
                                    className="absolute inset-0 rounded-full animate-ping opacity-75"
                                    style={{ backgroundColor: secondary }}
                                />
                            </div>
                        </div>

                        {/* 3D Floating Image Card (desktop, opposite side to content) */}
                        {memory.mediaUrl && (memory.type === 'photo' || memory.type === 'video') ? (
                            <div className="hidden md:flex w-1/2 items-center justify-center px-12">
                                <div style={{ perspective: '900px' }}>
                                    <motion.div
                                        animate={{
                                            y: [0, -14, 0],
                                            rotateY: [-6, 6, -6],
                                            rotateX: [3, -3, 3],
                                        }}
                                        transition={{
                                            y: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
                                            rotateY: { duration: 7, repeat: Infinity, ease: 'easeInOut' },
                                            rotateX: { duration: 5.5, repeat: Infinity, ease: 'easeInOut' },
                                        }}
                                        style={{ transformStyle: 'preserve-3d' }}
                                        className="relative cursor-pointer"
                                        onClick={() => onSelectMemory?.(memory)}
                                    >
                                        {/* White photo frame */}
                                        <div
                                            className="absolute bg-white rounded-sm"
                                            style={{
                                                inset: '-14px',
                                                transform: 'translateZ(-4px)',
                                                boxShadow: `0 30px 60px rgba(0,0,0,0.5), 0 0 40px ${primary}44`
                                            }}
                                        />
                                        {/* Media */}
                                        {memory.type === 'video' ? (
                                            <video
                                                src={memory.mediaUrl}
                                                className="w-80 h-56 object-cover rounded-sm block"
                                                style={{ transform: 'translateZ(2px)' }}
                                                muted
                                                loop
                                                autoPlay
                                            />
                                        ) : (
                                            <img
                                                src={memory.mediaUrl}
                                                alt={memory.title}
                                                className="w-80 h-56 object-cover rounded-sm block"
                                                style={{ transform: 'translateZ(2px)' }}
                                            />
                                        )}
                                        {/* Subtle glow under the card */}
                                        <div
                                            className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-48 h-6 blur-xl rounded-full opacity-40"
                                            style={{ backgroundColor: primary }}
                                        />
                                    </motion.div>
                                </div>
                            </div>
                        ) : (
                            <div className="hidden md:block w-1/2" />
                        )}
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
