'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { memorialAPI } from '@/lib/api';

interface StepData {
    name: string;
    birthDate: string;
    deathDate: string;
    bio: string;
    profileImage?: File;
    memories: File[];
    theme: {
        primaryColor: string;
        secondaryColor: string;
        style: string;
    };
}

export default function CreateMemorialPage() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<StepData>({
        name: '',
        birthDate: '',
        deathDate: '',
        bio: '',
        memories: [],
        theme: {
            primaryColor: '#6366f1',
            secondaryColor: '#8b5cf6',
            style: 'modern'
        }
    });

    const handleNext = () => {
        if (currentStep < 3) setCurrentStep(currentStep + 1);
    };

    const handleBack = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            setFormData(prev => ({
                ...prev,
                memories: [...prev.memories, ...newFiles]
            }));
        }
    };

    const removeFile = (index: number) => {
        setFormData(prev => ({
            ...prev,
            memories: prev.memories.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            
            // Convert files to base64 for the mock DB
            const processedMemories = await Promise.all(formData.memories.map(async (file) => {
                return new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        resolve({
                            title: file.name.split('.')[0],
                            description: 'Souvenir ajouté lors de la création',
                            date: new Date().toISOString(),
                            type: file.type.startsWith('image/') ? 'photo' : 'video',
                            mediaUrl: reader.result as string,
                            tags: ['souvenir']
                        });
                    };
                    reader.readAsDataURL(file);
                });
            }));

            const response = await memorialAPI.create({
                name: formData.name,
                birthDate: formData.birthDate,
                deathDate: formData.deathDate,
                bio: formData.bio,
                theme: formData.theme,
                isPublic: true,
                // @ts-ignore - Passing extra data for the mock
                memories: processedMemories
            });

            router.push(`/memorial/${response.data._id}`);
        } catch (error) {
            console.error('Error creating memorial:', error);
            alert('Erreur lors de la création du mémorial');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 py-12 px-6">
            <div className="max-w-4xl mx-auto">
                {/* Progress Bar */}
                <div className="mb-12">
                    <div className="flex justify-between items-center mb-4">
                        {[1, 2, 3].map((step) => (
                            <div key={step} className="flex items-center flex-1">
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${step <= currentStep
                                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                                            : 'glass text-gray-400'
                                        }`}
                                >
                                    {step}
                                </div>
                                {step < 3 && (
                                    <div
                                        className={`flex-1 h-1 mx-2 transition-all ${step < currentStep ? 'bg-gradient-to-r from-indigo-600 to-purple-600' : 'bg-gray-700'
                                            }`}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="text-center text-gray-300 text-sm">
                        Étape {currentStep} sur 3
                    </div>
                </div>

                {/* Form Content */}
                <div className="glass rounded-3xl p-8 md:p-12">
                    <AnimatePresence mode="wait">
                        {currentStep === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <h2 className="text-3xl font-bold text-white mb-6">
                                    Informations de base
                                </h2>

                                <div>
                                    <label className="block text-gray-300 mb-2 font-medium">
                                        Nom complet *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="Jean Dupont"
                                        required
                                    />
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-gray-300 mb-2 font-medium">
                                            Date de naissance *
                                        </label>
                                        <input
                                            type="date"
                                            value={formData.birthDate}
                                            onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                                            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-gray-300 mb-2 font-medium">
                                            Date de décès
                                        </label>
                                        <input
                                            type="date"
                                            value={formData.deathDate}
                                            onChange={(e) => setFormData({ ...formData, deathDate: e.target.value })}
                                            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-gray-300 mb-2 font-medium">
                                        Biographie
                                    </label>
                                    <textarea
                                        value={formData.bio}
                                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                        rows={4}
                                        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="Partagez quelques mots sur cette personne..."
                                    />
                                </div>
                            </motion.div>
                        )}

                        {currentStep === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <h2 className="text-3xl font-bold text-white mb-6">
                                    Ajoutez des souvenirs
                                </h2>
                                <p className="text-gray-300 mb-6">
                                    Commencez à construire la bibliothèque de souvenirs. Vous pourrez en ajouter d'autres plus tard.
                                </p>

                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileSelect}
                                    multiple
                                    accept="image/*,video/*"
                                    className="hidden"
                                />

                                <div 
                                    onClick={() => fileInputRef.current?.click()}
                                    className="border-2 border-dashed border-white/20 rounded-2xl p-12 text-center hover:bg-white/5 transition-colors cursor-pointer group"
                                >
                                    <div className="w-20 h-20 mx-auto bg-white/5 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <span className="text-4xl">☁️</span>
                                    </div>
                                    <h3 className="text-xl font-semibold text-white mb-2">
                                        Glissez-déposez vos photos et vidéos ici
                                    </h3>
                                    <p className="text-gray-400 mb-6">
                                        ou cliquez pour parcourir vos fichiers
                                    </p>
                                    <button className="px-6 py-2 rounded-full bg-white/10 text-white font-medium hover:bg-white/20 transition-colors">
                                        Sélectionner des fichiers
                                    </button>
                                </div>

                                {formData.memories.length > 0 && (
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                                        {formData.memories.map((file, index) => (
                                            <div key={index} className="relative aspect-square rounded-xl overflow-hidden group">
                                                {file.type.startsWith('image/') ? (
                                                    <img
                                                        src={URL.createObjectURL(file)}
                                                        alt="Preview"
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gray-800 flex items-center justify-center text-white">
                                                        🎥 Vidéo
                                                    </div>
                                                )}
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        removeFile(index);
                                                    }}
                                                    className="absolute top-2 right-2 w-8 h-8 bg-red-500 rounded-full text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {currentStep === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <h2 className="text-3xl font-bold text-white mb-6">
                                    Personnalisez le thème
                                </h2>

                                <div>
                                    <label className="block text-gray-300 mb-4 font-medium">
                                        Couleurs du thème
                                    </label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-gray-400 text-sm mb-2">
                                                Couleur principale
                                            </label>
                                            <input
                                                type="color"
                                                value={formData.theme.primaryColor}
                                                onChange={(e) => setFormData({
                                                    ...formData,
                                                    theme: { ...formData.theme, primaryColor: e.target.value }
                                                })}
                                                className="w-full h-12 rounded-lg cursor-pointer"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-400 text-sm mb-2">
                                                Couleur secondaire
                                            </label>
                                            <input
                                                type="color"
                                                value={formData.theme.secondaryColor}
                                                onChange={(e) => setFormData({
                                                    ...formData,
                                                    theme: { ...formData.theme, secondaryColor: e.target.value }
                                                })}
                                                className="w-full h-12 rounded-lg cursor-pointer"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="glass rounded-2xl p-6">
                                    <h3 className="text-white font-semibold mb-2">Aperçu</h3>
                                    <div
                                        className="h-32 rounded-lg"
                                        style={{
                                            background: `linear-gradient(135deg, ${formData.theme.primaryColor} 0%, ${formData.theme.secondaryColor} 100%)`
                                        }}
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-8">
                        <button
                            onClick={handleBack}
                            disabled={currentStep === 1}
                            className="px-6 py-3 rounded-full glass text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-all"
                        >
                            Retour
                        </button>

                        {currentStep < 3 ? (
                            <button
                                onClick={handleNext}
                                disabled={!formData.name || !formData.birthDate}
                                className="px-8 py-3 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-purple-500/50 transition-all"
                            >
                                Suivant
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="px-8 py-3 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all disabled:opacity-50"
                            >
                                {loading ? 'Création...' : 'Créer le mémorial'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
