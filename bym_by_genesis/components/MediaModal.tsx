'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Memory } from '@/lib/types';
import { useEffect, useState } from 'react';
import Image3DViewer from './3d/Image3DViewer';

interface MediaModalProps {
    memory: Memory | null;
    onClose: () => void;
    onUpdate?: (memory: Memory) => void;
    onDelete?: (id: string) => void;
}

export default function MediaModal({ memory, onClose, onUpdate, onDelete }: MediaModalProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState<Partial<Memory>>({});
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        if (memory) {
            setEditForm({
                title: memory.title,
                description: memory.description,
                date: memory.date.split('T')[0],
                tags: memory.tags
            });
            setIsEditing(false);
            setShowDeleteConfirm(false);
        }
    }, [memory]);

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    const handleSave = () => {
        if (memory && onUpdate) {
            onUpdate({
                ...memory,
                ...editForm,
                date: new Date(editForm.date || memory.date).toISOString()
            } as Memory);
            setIsEditing(false);
        }
    };

    const handleDelete = () => {
        if (memory && onDelete) {
            onDelete(memory._id);
            onClose();
        }
    };

    if (!memory) return null;

    return (
        <AnimatePresence>
            {memory && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/90 backdrop-blur-md"
                    />

                    {/* Modal Container */}
                    <div className="w-full max-w-6xl z-10 h-[80vh]">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-white/10 w-full h-full flex flex-col md:flex-row"
                        >
                            {/* Close Button */}
                            <button 
                                onClick={onClose}
                                className="absolute top-4 right-4 z-50 bg-black/50 hover:bg-black/70 text-white w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/10 transition-all"
                            >
                                ✕
                            </button>

                            {/* Media Side (3D Viewer) */}
                            <div className="w-full md:w-2/3 bg-black/50 relative flex items-center justify-center">
                                {(memory.type === 'photo' || memory.type === 'video') && memory.mediaUrl ? (
                                    <div className="absolute inset-0">
                                        <Image3DViewer imageUrl={memory.mediaUrl} type={memory.type} />
                                        <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none">
                                            <p className="text-white/50 text-sm bg-black/20 inline-block px-4 py-1 rounded-full backdrop-blur-sm">
                                                🖱️ Cliquez et glissez pour tourner {memory.type === 'video' ? 'la vidéo' : "l'image"}
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        {memory.type === 'text' && (
                                            <div className="p-12 text-center">
                                                <span className="text-8xl block mb-6 opacity-50">📝</span>
                                                <p className="text-2xl text-gray-300 italic font-serif leading-relaxed">"{memory.description}"</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Info Side */}
                            <div className="w-full md:w-1/3 p-8 md:p-10 flex flex-col bg-gradient-to-br from-slate-900 to-slate-950 border-l border-white/5 overflow-y-auto relative">
                                {onUpdate && !isEditing && !showDeleteConfirm && (
                                    <div className="absolute top-4 right-16 flex gap-2">
                                        <button 
                                            onClick={() => setIsEditing(true)}
                                            className="text-white/50 hover:text-white transition-colors p-2"
                                            title="Modifier"
                                        >
                                            ✏️
                                        </button>
                                        <button 
                                            onClick={() => setShowDeleteConfirm(true)}
                                            className="text-white/50 hover:text-red-400 transition-colors p-2"
                                            title="Supprimer"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                )}

                                {showDeleteConfirm ? (
                                    <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                                        <p className="text-white text-lg">Êtes-vous sûr de vouloir supprimer ce souvenir ?</p>
                                        <div className="flex gap-4">
                                            <button 
                                                onClick={() => setShowDeleteConfirm(false)}
                                                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white"
                                            >
                                                Annuler
                                            </button>
                                            <button 
                                                onClick={handleDelete}
                                                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white"
                                            >
                                                Supprimer
                                            </button>
                                        </div>
                                    </div>
                                ) : isEditing ? (
                                    <div className="space-y-4 mt-8">
                                        <div>
                                            <label className="text-xs text-gray-500 uppercase tracking-wider">Date</label>
                                            <input
                                                type="date"
                                                value={editForm.date}
                                                onChange={(e) => setEditForm({...editForm, date: e.target.value})}
                                                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-500 uppercase tracking-wider">Titre</label>
                                            <input
                                                type="text"
                                                value={editForm.title}
                                                onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                                                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-500 uppercase tracking-wider">Description</label>
                                            <textarea
                                                value={editForm.description}
                                                onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                                                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[150px]"
                                            />
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setIsEditing(false)}
                                                className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-xl transition-colors"
                                            >
                                                Annuler
                                            </button>
                                            <button
                                                onClick={handleSave}
                                                className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-colors"
                                            >
                                                Enregistrer
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="mb-6">
                                            <span className="px-4 py-1.5 rounded-full bg-indigo-500/20 text-indigo-300 text-sm font-medium border border-indigo-500/30">
                                                {new Date(memory.date).toLocaleDateString('fr-FR', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </span>
                                        </div>

                                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight font-serif">
                                            {memory.title}
                                        </h2>

                                        {memory.description && memory.type !== 'text' && (
                                            <p className="text-gray-300 text-lg leading-relaxed mb-8 font-light">
                                                {memory.description}
                                            </p>
                                        )}

                                        {memory.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mt-auto pt-8">
                                                {memory.tags.map((tag, i) => (
                                                    <span
                                                        key={i}
                                                        className="text-xs text-gray-400 bg-white/5 px-3 py-1 rounded-full border border-white/5"
                                                    >
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </div>
            )}
        </AnimatePresence>
    );
}
