export interface User {
    id: string;
    email: string;
    name: string;
}

export interface Memorial {
    _id: string;
    userId: string;
    name: string;
    birthDate: string;
    deathDate?: string;
    bio?: string;
    profileImage?: string;
    coverImage?: string;
    theme: {
        primaryColor: string;
        secondaryColor: string;
        style: string;
    };
    isPublic: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Memory {
    _id: string;
    memorialId: string;
    userId: string;
    title: string;
    description?: string;
    date: string;
    type: 'photo' | 'video' | 'text' | 'audio';
    mediaUrl?: string;
    thumbnailUrl?: string;
    tags: string[];
    location?: {
        name: string;
        coordinates?: {
            lat: number;
            lng: number;
        };
    };
    createdAt: string;
    updatedAt: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}
