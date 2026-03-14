import mongoose, { Document, Schema } from 'mongoose';

export interface IMemorial extends Document {
    userId: mongoose.Types.ObjectId;
    name: string;
    birthDate: Date;
    deathDate?: Date;
    bio?: string;
    profileImage?: string;
    coverImage?: string;
    theme: {
        primaryColor: string;
        secondaryColor: string;
        style: string;
    };
    isPublic: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const MemorialSchema: Schema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    birthDate: {
        type: Date,
        required: true
    },
    deathDate: {
        type: Date
    },
    bio: {
        type: String
    },
    profileImage: {
        type: String
    },
    coverImage: {
        type: String
    },
    theme: {
        primaryColor: {
            type: String,
            default: '#6366f1'
        },
        secondaryColor: {
            type: String,
            default: '#8b5cf6'
        },
        style: {
            type: String,
            default: 'modern'
        }
    },
    isPublic: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

export default mongoose.model<IMemorial>('Memorial', MemorialSchema);
