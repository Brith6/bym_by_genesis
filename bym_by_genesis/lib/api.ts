import axios from 'axios';
import { AuthResponse, Memorial, Memory } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// MOCK DATA FOR DEMO
const MOCK_MEMORIAL: Memorial = {
    _id: 'mock-id-123',
    userId: 'user-123',
    name: 'Jean Dupont',
    birthDate: '1950-05-15',
    deathDate: '2023-11-20',
    bio: 'Un père aimant, un grand-père adoré et un passionné de jardinage. Il a touché la vie de tous ceux qui l\'ont connu par sa gentillesse et sa générosité.',
    theme: {
        primaryColor: '#6366f1',
        secondaryColor: '#8b5cf6',
        style: 'modern'
    },
    isPublic: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
};

const MOCK_MEMORIES: Memory[] = [
    {
        _id: 'mem-1',
        memorialId: 'mock-id-123',
        userId: 'user-123',
        title: 'Vacances en Bretagne',
        description: 'Un été inoubliable à Saint-Malo. Nous avons passé des heures à pêcher des crabes et à manger des glaces.',
        date: '2015-07-15',
        type: 'photo',
        mediaUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        tags: ['vacances', 'famille', 'été'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        _id: 'mem-2',
        memorialId: 'mock-id-123',
        userId: 'user-123',
        title: 'Son 70ème anniversaire',
        description: 'Toute la famille était réunie pour célébrer ce moment important. Il était si heureux de voir tout le monde.',
        date: '2020-05-15',
        type: 'video',
        tags: ['anniversaire', 'fête'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        _id: 'mem-3',
        memorialId: 'mock-id-123',
        userId: 'user-123',
        title: 'La passion du jardinage',
        description: 'Il passait des heures dans son jardin, à cultiver ses roses primées. C\'était son havre de paix.',
        date: '2018-06-20',
        type: 'text',
        tags: ['passion', 'jardin'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        _id: 'mem-4',
        memorialId: 'mock-id-123',
        userId: 'user-123',
        title: 'Noël 2010',
        description: 'Le premier Noël avec les petits-enfants. Une soirée magique remplie de rires et de cadeaux.',
        date: '2010-12-25',
        type: 'photo',
        mediaUrl: 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        tags: ['noël', 'famille'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }
];

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests
api.interceptors.request.use((config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Helper to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// --- INDEXED DB HELPER ---
const DB_NAME = 'BeyondMemoriesDB';
const STORE_MEMORIALS = 'memorials';
const STORE_MEMORIES = 'memories';

const initDB = () => {
    if (typeof window === 'undefined') return Promise.resolve(null);
    return new Promise<IDBDatabase>((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1);
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains(STORE_MEMORIALS)) {
                db.createObjectStore(STORE_MEMORIALS, { keyPath: '_id' });
            }
            if (!db.objectStoreNames.contains(STORE_MEMORIES)) {
                db.createObjectStore(STORE_MEMORIES, { keyPath: '_id' });
            }
        };
    });
};

const getAllFromStore = async (storeName: string): Promise<any[]> => {
    const db = await initDB();
    if (!db) return storeName === STORE_MEMORIALS ? [MOCK_MEMORIAL] : MOCK_MEMORIES;
    
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.getAll();
        request.onsuccess = () => {
            const result = request.result;
            if (result.length === 0) {
                const seedData = storeName === STORE_MEMORIALS ? [MOCK_MEMORIAL] : MOCK_MEMORIES;
                resolve(seedData); 
            } else {
                resolve(result);
            }
        };
        request.onerror = () => reject(request.error);
    });
};

const saveToStore = async (storeName: string, item: any) => {
    const db = await initDB();
    if (!db) return;
    return new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.put(item);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
};

const deleteFromStore = async (storeName: string, id: string) => {
    const db = await initDB();
    if (!db) return;
    return new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.delete(id);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
};

// Seed DB if empty
const seedDB = async () => {
    if (typeof window === 'undefined') return;
    const db = await initDB();
    if (!db) return;
    
    const memTx = db.transaction(STORE_MEMORIALS, 'readonly');
    const memReq = memTx.objectStore(STORE_MEMORIALS).count();
    memReq.onsuccess = () => {
        if (memReq.result === 0) {
            const tx = db.transaction(STORE_MEMORIALS, 'readwrite');
            tx.objectStore(STORE_MEMORIALS).put(MOCK_MEMORIAL);
        }
    };

    const memoryTx = db.transaction(STORE_MEMORIES, 'readonly');
    const memoryReq = memoryTx.objectStore(STORE_MEMORIES).count();
    memoryReq.onsuccess = () => {
        if (memoryReq.result === 0) {
            const tx = db.transaction(STORE_MEMORIES, 'readwrite');
            MOCK_MEMORIES.forEach(m => tx.objectStore(STORE_MEMORIES).put(m));
        }
    };
};

if (typeof window !== 'undefined') {
    seedDB();
}

// Auth API
export const authAPI = {
    register: (email: string, password: string, name: string) =>
        api.post<AuthResponse>('/auth/register', { email, password, name }),

    login: (email: string, password: string) =>
        api.post<AuthResponse>('/auth/login', { email, password }),

    getMe: () => api.get('/auth/me'),
};

// Memorial API (MOCKED FOR DEMO)
export const memorialAPI = {
    create: async (data: Partial<Memorial> & { memories?: any[] }) => {
        await delay(1000);
        
        const newMemorialId = `mem-${Date.now()}`;
        const newMemorial: Memorial = {
            ...MOCK_MEMORIAL, // Default values
            ...data,
            _id: newMemorialId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        await saveToStore(STORE_MEMORIALS, newMemorial);

        // Handle new memories
        if (data.memories) {
            const newMemories: Memory[] = data.memories.map((mem: any, index: number) => ({
                _id: `memory-${Date.now()}-${index}`,
                memorialId: newMemorialId,
                userId: 'user-123',
                title: mem.title || 'Souvenir',
                description: mem.description || '',
                date: mem.date || new Date().toISOString(),
                type: mem.type || 'photo',
                mediaUrl: mem.mediaUrl,
                tags: mem.tags || [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }));
            
            for (const mem of newMemories) {
                await saveToStore(STORE_MEMORIES, mem);
            }
        }

        return { data: newMemorial } as any;
    },

    getAll: async () => {
        await delay(500);
        const memorials = await getAllFromStore(STORE_MEMORIALS);
        return { data: memorials } as any;
    },

    getById: async (id: string) => {
        await delay(800);
        const memorials = await getAllFromStore(STORE_MEMORIALS);
        const memories = await getAllFromStore(STORE_MEMORIES);
        
        const memorial = memorials.find((m: Memorial) => m._id === id);
        const memorialMemories = memories.filter((m: Memory) => m.memorialId === id);

        if (!memorial) {
            throw new Error('Memorial not found');
        }

        return { 
            data: { 
                memorial, 
                memories: memorialMemories 
            } 
        } as any;
    },

    update: async (id: string, data: Partial<Memorial>) => {
        await delay(500);
        const memorials = await getAllFromStore(STORE_MEMORIALS);
        const memorial = memorials.find((m: Memorial) => m._id === id);
        
        if (!memorial) throw new Error('Memorial not found');
        
        const updated = { ...memorial, ...data, updatedAt: new Date().toISOString() };
        await saveToStore(STORE_MEMORIALS, updated);
        
        return { data: updated } as any;
    },

    delete: async (id: string) => {
        await delay(500);
        await deleteFromStore(STORE_MEMORIALS, id);
        
        const memories = await getAllFromStore(STORE_MEMORIES);
        const toDelete = memories.filter((m: Memory) => m.memorialId === id);
        for (const m of toDelete) {
            await deleteFromStore(STORE_MEMORIES, m._id);
        }
        
        return { data: { success: true } } as any;
    },
};

// Memory API (MOCKED FOR DEMO)
export const memoryAPI = {
    create: async (data: Partial<Memory>) => {
        await delay(500);
        
        const newMemory: Memory = {
            _id: `mem-${Date.now()}`,
            memorialId: data.memorialId!,
            userId: 'user-123',
            title: data.title || 'Nouveau souvenir',
            description: data.description || '',
            date: data.date || new Date().toISOString(),
            type: data.type || 'photo',
            mediaUrl: data.mediaUrl,
            tags: data.tags || [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        await saveToStore(STORE_MEMORIES, newMemory);
        
        return { data: newMemory } as any;
    },

    getAll: async (params?: { memorialId?: string }) => {
        await delay(500);
        let memories = await getAllFromStore(STORE_MEMORIES);
        if (params?.memorialId) {
            memories = memories.filter((m: Memory) => m.memorialId === params.memorialId);
        }
        return { data: memories } as any;
    },

    getById: async (id: string) => {
        await delay(300);
        const memories = await getAllFromStore(STORE_MEMORIES);
        const memory = memories.find((m: Memory) => m._id === id);
        if (!memory) throw new Error('Memory not found');
        return { data: memory } as any;
    },

    update: async (id: string, data: Partial<Memory>) => {
        await delay(500);
        const memories = await getAllFromStore(STORE_MEMORIES);
        const memory = memories.find((m: Memory) => m._id === id);
        
        if (!memory) throw new Error('Memory not found');
        
        const updated = { ...memory, ...data, updatedAt: new Date().toISOString() };
        await saveToStore(STORE_MEMORIES, updated);
        
        return { data: updated } as any;
    },

    delete: async (id: string) => {
        await delay(500);
        await deleteFromStore(STORE_MEMORIES, id);
        return { data: { success: true } } as any;
    },

    uploadMedia: async (id: string, file: File) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                resolve({ 
                    data: { 
                        mediaUrl: reader.result as string 
                    } 
                } as any);
            };
            reader.onerror = (error) => reject(error);
        });
    },
};

export default api;
