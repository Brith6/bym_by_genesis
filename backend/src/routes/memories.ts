import express, { Router, Response } from 'express';
import multer from 'multer';
import path from 'path';
import { body, validationResult } from 'express-validator';
import Memory from '../models/Memory';
import { authenticate, AuthRequest } from '../middleware/auth';

const router: Router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|mp4|mov|avi|mp3|wav/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (extname && mimetype) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type'));
        }
    }
});

// Create memory
router.post('/', authenticate,
    [
        body('memorialId').notEmpty(),
        body('title').trim().notEmpty(),
        body('date').isISO8601(),
        body('type').isIn(['photo', 'video', 'text', 'audio'])
    ],
    async (req: AuthRequest, res: Response) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const memory = new Memory({
                userId: req.userId,
                ...req.body
            });

            await memory.save();
            res.status(201).json(memory);
        } catch (error) {
            console.error('Create memory error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    }
);

// Upload media for memory
router.post('/:id/upload', authenticate, upload.single('file'), async (req: AuthRequest, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const memory = await Memory.findOne({ _id: req.params.id, userId: req.userId });

        if (!memory) {
            return res.status(404).json({ error: 'Memory not found' });
        }

        memory.mediaUrl = `/uploads/${req.file.filename}`;
        await memory.save();

        res.json(memory);
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get memories (with filters)
router.get('/', async (req, res: Response) => {
    try {
        const { memorialId, startDate, endDate, type, tags } = req.query;

        const filter: any = {};

        if (memorialId) filter.memorialId = memorialId;
        if (type) filter.type = type;
        if (tags) filter.tags = { $in: (tags as string).split(',') };

        if (startDate || endDate) {
            filter.date = {};
            if (startDate) filter.date.$gte = new Date(startDate as string);
            if (endDate) filter.date.$lte = new Date(endDate as string);
        }

        const memories = await Memory.find(filter).sort({ date: -1 });
        res.json(memories);
    } catch (error) {
        console.error('Get memories error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get single memory
router.get('/:id', async (req, res: Response) => {
    try {
        const memory = await Memory.findById(req.params.id);

        if (!memory) {
            return res.status(404).json({ error: 'Memory not found' });
        }

        res.json(memory);
    } catch (error) {
        console.error('Get memory error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update memory
router.put('/:id', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const memory = await Memory.findOne({ _id: req.params.id, userId: req.userId });

        if (!memory) {
            return res.status(404).json({ error: 'Memory not found' });
        }

        Object.assign(memory, req.body);
        await memory.save();

        res.json(memory);
    } catch (error) {
        console.error('Update memory error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete memory
router.delete('/:id', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const memory = await Memory.findOneAndDelete({ _id: req.params.id, userId: req.userId });

        if (!memory) {
            return res.status(404).json({ error: 'Memory not found' });
        }

        res.json({ message: 'Memory deleted successfully' });
    } catch (error) {
        console.error('Delete memory error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
