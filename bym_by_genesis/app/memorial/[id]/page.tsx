'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { memorialAPI, memoryAPI } from '@/lib/api';
import { Memorial, Memory } from '@/lib/types';
import Timeline from '@/components/Timeline';
import MemoryCard from '@/components/MemoryCard';
import MediaModal from '@/components/MediaModal';
import PhotoGlobe from '@/components/3d/PhotoGlobe';

export default function MemorialPage() {
    const params = useParams();
    const router = useRouter();
    const [memorial, setMemorial] = useState<Memorial | null>(null);
    const [memories, setMemories] = useState<Memory[]>([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState<'timeline' | 'grid' | 'globe'>('timeline');
    const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isAddingMemory, setIsAddingMemory] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    // Form states
    const [editForm, setEditForm] = useState({ name: '', bio: '', birthDate: '', deathDate: '' });
    const [newMemory, setNewMemory] = useState({ title: '', description: '', date: '', type: 'photo', mediaUrl: '' });

    useEffect(() => {
        const fetchMemorial = async () => {
            try {
                const response = await memorialAPI.getById(params.id as string);
                setMemorial(response.data.memorial);
                setMemories(response.data.memories);
                setEditForm({
                    name: response.data.memorial.name,
                    bio: response.data.memorial.bio || '',
                    birthDate: response.data.memorial.birthDate.split('T')[0],
                    deathDate: response.data.memorial.deathDate ? response.data.memorial.deathDate.split('T')[0] : ''
                });
            } catch (error) {
                console.error('Error fetching memorial:', error);
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchMemorial();
        }
    }, [params.id]);

    const handleUpdateMemorial = async () => {
        if (!memorial) return;
        try {
            const updated = await memorialAPI.update(memorial._id, {
                ...editForm,
                deathDate: editForm.deathDate || undefined
            });
            setMemorial(updated.data);
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating memorial:', error);
        }
    };

    const handleAddMemory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!memorial) return;
        
        try {
            let finalMediaUrl = newMemory.mediaUrl;

            // Handle file upload if selected
            if (selectedFile) {
                const uploadResponse = await memoryAPI.uploadMedia(memorial._id, selectedFile);
                finalMediaUrl = uploadResponse.data.mediaUrl!;
            }

            const response = await memoryAPI.create({
                ...newMemory,
                mediaUrl: finalMediaUrl,
                memorialId: memorial._id,
                type: newMemory.type as 'photo' | 'video' | 'text'
            });
            setMemories([...memories, response.data]);
            setIsAddingMemory(false);
            setNewMemory({ title: '', description: '', date: '', type: 'photo', mediaUrl: '' });
            setSelectedFile(null);
            setPreviewUrl(null);
        } catch (error) {
            console.error('Error adding memory:', error);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
            setNewMemory({ ...newMemory, type: file.type.startsWith('video') ? 'video' : 'photo' });
        }
    };

    const handleUpdateMemory = async (updatedMemory: Memory) => {
        try {
            const response = await memoryAPI.update(updatedMemory._id, updatedMemory);
            setMemories(memories.map(m => m._id === updatedMemory._id ? response.data : m));
            setSelectedMemory(response.data);
        } catch (error) {
            console.error('Error updating memory:', error);
        }
    };

    const handleDeleteMemory = async (id: string) => {
        try {
            await memoryAPI.delete(id);
            setMemories(memories.filter(m => m._id !== id));
            setSelectedMemory(null);
        } catch (error) {
            console.error('Error deleting memory:', error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 flex items-center justify-center">
                <div className="text-white text-xl">Chargement...</div>
            </div>
        );
    }

    if (!memorial) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 flex items-center justify-center">
                <div className="text-white text-xl">Mémorial non trouvé</div>
            </div>
        );
    }

    return (
        <div
            className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900"
            style={{
                '--primary': memorial.theme.primaryColor,
                '--primary-dark': memorial.theme.primaryColor,
                '--secondary': memorial.theme.secondaryColor,
                '--gradient-primary': `linear-gradient(135deg, ${memorial.theme.primaryColor} 0%, ${memorial.theme.secondaryColor} 100%)`,
            } as React.CSSProperties}
        >
            <MediaModal
                memory={selectedMemory} 
                onClose={() => setSelectedMemory(null)} 
                onUpdate={handleUpdateMemory}
                onDelete={handleDeleteMemory}
            />

            {/* Header */}
            <div
                className="relative h-[500px] flex items-center justify-center overflow-hidden"
                style={{
                    background: `linear-gradient(135deg, ${memorial.theme.primaryColor} 0%, ${memorial.theme.secondaryColor} 100%)`
                }}
            >
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
                
                {/* Edit Button */}
                <div className="absolute top-6 right-6 z-20 flex gap-3">
                    <button 
                        onClick={() => router.push('/dashboard')}
                        className="bg-black/20 hover:bg-black/40 backdrop-blur-md text-white px-4 py-2 rounded-full transition-all border border-white/10 flex items-center gap-2"
                    >
                        <span>←</span>
                        <span className="text-sm font-medium">Tableau de bord</span>
                    </button>
                    <button 
                        onClick={() => setIsEditing(!isEditing)}
                        className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full transition-all border border-white/20 flex items-center gap-2"
                    >
                        <span>✏️</span>
                        <span className="text-sm font-medium">{isEditing ? 'Annuler' : 'Modifier'}</span>
                    </button>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative z-10 text-center text-white px-6 max-w-4xl mx-auto"
                >
                    {isEditing ? (
                        <div className="bg-black/50 p-8 rounded-3xl backdrop-blur-xl border border-white/10 w-full max-w-2xl mx-auto">
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    value={editForm.name}
                                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 text-2xl font-bold text-center"
                                    placeholder="Nom du défunt"
                                />
                                <div className="flex gap-4">
                                    <input
                                        type="date"
                                        value={editForm.birthDate}
                                        onChange={(e) => setEditForm({...editForm, birthDate: e.target.value})}
                                        className="w-1/2 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/30"
                                    />
                                    <input
                                        type="date"
                                        value={editForm.deathDate}
                                        onChange={(e) => setEditForm({...editForm, deathDate: e.target.value})}
                                        className="w-1/2 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/30"
                                    />
                                </div>
                                <textarea
                                    value={editForm.bio}
                                    onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 min-h-[100px]"
                                    placeholder="Biographie..."
                                />
                                <button
                                    onClick={handleUpdateMemorial}
                                    className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-100 transition-colors"
                                >
                                    Enregistrer les modifications
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <h1 className="text-6xl md:text-8xl font-bold mb-6 tracking-tight drop-shadow-lg font-serif">
                                {memorial.name}
                            </h1>
                            <div className="inline-block px-6 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8">
                                <p className="text-xl md:text-2xl font-light tracking-widest">
                                    {new Date(memorial.birthDate).getFullYear()} — {memorial.deathDate ? new Date(memorial.deathDate).getFullYear() : 'Présent'}
                                </p>
                            </div>
                            {memorial.bio && (
                                <p className="text-lg md:text-xl leading-relaxed max-w-2xl mx-auto text-gray-100 font-light italic">
                                    "{memorial.bio}"
                                </p>
                            )}
                        </>
                    )}
                </motion.div>
            </div>

            {/* View Toggle & Actions */}
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
                    <h2 className="text-4xl font-bold text-white font-serif">
                        Souvenirs <span className="text-2xl text-white/50 font-sans font-normal">({memories.length})</span>
                    </h2>
                    
                    <div className="flex items-center gap-4">
                        <div className="flex gap-1 bg-white/5 backdrop-blur-md rounded-full p-1 border border-white/10">
                            <button
                                onClick={() => setView('timeline')}
                                className={`px-6 py-2.5 rounded-full transition-all font-medium ${view === 'timeline'
                                        ? 'bg-white text-black shadow-lg'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                Timeline
                            </button>
                            <button
                                onClick={() => setView('grid')}
                                className={`px-6 py-2.5 rounded-full transition-all font-medium ${view === 'grid'
                                        ? 'bg-white text-black shadow-lg'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                Grille
                            </button>
                            <button
                                onClick={() => setView('globe')}
                                className={`px-6 py-2.5 rounded-full transition-all font-medium ${view === 'globe'
                                        ? 'bg-white text-black shadow-lg'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                Globe 3D
                            </button>
                        </div>

                        <button
                            onClick={() => setIsAddingMemory(true)}
                            className="text-white px-6 py-3 rounded-full font-medium transition-all flex items-center gap-2"
                            style={{
                                backgroundColor: memorial.theme.primaryColor,
                                boxShadow: `0 10px 25px ${memorial.theme.primaryColor}44`
                            }}
                        >
                            <span>+</span> Ajouter
                        </button>
                    </div>
                </div>

                {/* Add Memory Modal */}
                <AnimatePresence>
                    {isAddingMemory && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="bg-slate-900 border border-white/10 rounded-3xl p-8 max-w-lg w-full shadow-2xl"
                            >
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-2xl font-bold text-white">Ajouter un souvenir</h3>
                                    <button onClick={() => setIsAddingMemory(false)} className="text-gray-400 hover:text-white">✕</button>
                                </div>
                                <form onSubmit={handleAddMemory} className="space-y-4">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Titre</label>
                                        <input
                                            type="text"
                                            required
                                            value={newMemory.title}
                                            onChange={(e) => setNewMemory({...newMemory, title: e.target.value})}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            placeholder="Titre du souvenir"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Date</label>
                                        <input
                                            type="date"
                                            required
                                            value={newMemory.date}
                                            onChange={(e) => setNewMemory({...newMemory, date: e.target.value})}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Type</label>
                                        <select
                                            value={newMemory.type}
                                            onChange={(e) => setNewMemory({...newMemory, type: e.target.value})}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        >
                                            <option value="photo">Photo</option>
                                            <option value="video">Vidéo</option>
                                            <option value="text">Texte</option>
                                        </select>
                                    </div>
                                    
                                    {newMemory.type !== 'text' && (
                                        <div className="space-y-4">
                                            {/* File Upload Area */}
                                            <div 
                                                onClick={() => fileInputRef.current?.click()}
                                                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                                                    previewUrl ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/10 hover:border-white/30 hover:bg-white/5'
                                                }`}
                                            >
                                                <input 
                                                    type="file" 
                                                    ref={fileInputRef}
                                                    onChange={handleFileSelect}
                                                    className="hidden" 
                                                    accept="image/*,video/*"
                                                />
                                                {previewUrl ? (
                                                    <div className="relative h-40 w-full">
                                                        {newMemory.type === 'video' ? (
                                                            <video src={previewUrl} className="h-full w-full object-contain rounded-lg" controls />
                                                        ) : (
                                                            <img src={previewUrl} alt="Preview" className="h-full w-full object-contain rounded-lg" />
                                                        )}
                                                        <button 
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setSelectedFile(null);
                                                                setPreviewUrl(null);
                                                            }}
                                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                                                        >
                                                            ✕
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-2">
                                                        <div className="text-4xl">📂</div>
                                                        <p className="text-sm text-gray-400">Cliquez pour importer un fichier</p>
                                                        <p className="text-xs text-gray-500">ou glissez-déposez ici</p>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="relative">
                                                <div className="absolute inset-0 flex items-center">
                                                    <div className="w-full border-t border-white/10"></div>
                                                </div>
                                                <div className="relative flex justify-center text-sm">
                                                    <span className="px-2 bg-slate-900 text-gray-500">OU via URL</span>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm text-gray-400 mb-1">URL du média</label>
                                                <input
                                                    type="url"
                                                    value={newMemory.mediaUrl}
                                                    onChange={(e) => setNewMemory({...newMemory, mediaUrl: e.target.value})}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                    placeholder="https://..."
                                                />
                                            </div>
                                        </div>
                                    )}
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Description</label>
                                        <textarea
                                            value={newMemory.description}
                                            onChange={(e) => setNewMemory({...newMemory, description: e.target.value})}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[100px]"
                                            placeholder="Racontez ce souvenir..."
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full text-white font-bold py-3 rounded-xl transition-colors mt-4"
                                        style={{ backgroundColor: memorial.theme.primaryColor }}
                                    >
                                        Ajouter le souvenir
                                    </button>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {memories.length === 0 ? (
                    <div className="glass rounded-3xl p-12 text-center">
                        <div className="text-6xl mb-4">📸</div>
                        <p className="text-gray-300 text-xl mb-2">Aucun souvenir pour le moment</p>
                        <p className="text-gray-400">Soyez le premier à partager un souvenir</p>
                    </div>
                ) : (
                    <>
                        {view === 'timeline' && (
                            <Timeline
                                memories={memories}
                                onSelectMemory={setSelectedMemory}
                                theme={memorial.theme}
                            />
                        )}
                        {view === 'grid' && (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {memories.map((memory) => (
                                    <MemoryCard
                                        key={memory._id}
                                        memory={memory}
                                        onClick={() => setSelectedMemory(memory)}
                                        theme={memorial.theme}
                                    />
                                ))}
                            </div>
                        )}
                        {view === 'globe' && (
                            <PhotoGlobe 
                                memories={memories} 
                                onSelectMemory={setSelectedMemory}
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
