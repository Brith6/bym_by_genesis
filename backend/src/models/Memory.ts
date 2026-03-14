import mongoose, { Document, Schema } from 'mongoose';

export interface IMemory extends Document {
    memorialId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    title: string;
    description?: string;
    date: Date;
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
    createdAt: Date;
    updatedAt: Date;
}

const MemorySchema: Schema = new Schema({
    memorialId: {
        type: Schema.Types.ObjectId,
        ref: 'Memorial',
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    date: {
        type: Date,
        required: true
    },
    type: {
        type: String,
        enum: ['photo', 'video', 'text', 'audio'],
        required: true
    },
    mediaUrl: {
        type: String
    },
    thumbnailUrl: {
        type: String
    },
    tags: [{
        type: String
    }],
    location: {
        name: String,
        coordinates: {
            lat: Number,
            lng: Number
        }
    }
}, {
    timestamps: true
});

// Index for efficient timeline queries
MemorySchema.index({ memorialId: 1, date: -1 });

export default mongoose.model<IMemory>('Memory', MemorySchema);
