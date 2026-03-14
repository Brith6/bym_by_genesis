import express, { Router, Response } from 'express';
import { body, validationResult } from 'express-validator';
import Memorial from '../models/Memorial';
import Memory from '../models/Memory';
import { authenticate, AuthRequest } from '../middleware/auth';

const router: Router = express.Router();

// Create memorial
router.post('/', authenticate,
    [
        body('name').trim().notEmpty(),
        body('birthDate').isISO8601()
    ],
    async (req: AuthRequest, res: Response) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const memorial = new Memorial({
                userId: req.userId,
                ...req.body
            });

            await memorial.save();
            res.status(201).json(memorial);
        } catch (error) {
            console.error('Create memorial error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    }
);

// Get all memorials for user
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const memorials = await Memorial.find({ userId: req.userId }).sort({ createdAt: -1 });
        res.json(memorials);
    } catch (error) {
        console.error('Get memorials error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get single memorial with memories
router.get('/:id', async (req, res: Response) => {
    try {
        const memorial = await Memorial.findById(req.params.id);

        if (!memorial) {
            return res.status(404).json({ error: 'Memorial not found' });
        }

        // Get all memories for this memorial
        const memories = await Memory.find({ memorialId: req.params.id }).sort({ date: -1 });

        res.json({
            memorial,
            memories
        });
    } catch (error) {
        console.error('Get memorial error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update memorial
router.put('/:id', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const memorial = await Memorial.findOne({ _id: req.params.id, userId: req.userId });

        if (!memorial) {
            return res.status(404).json({ error: 'Memorial not found' });
        }

        Object.assign(memorial, req.body);
        await memorial.save();

        res.json(memorial);
    } catch (error) {
        console.error('Update memorial error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete memorial
router.delete('/:id', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const memorial = await Memorial.findOneAndDelete({ _id: req.params.id, userId: req.userId });

        if (!memorial) {
            return res.status(404).json({ error: 'Memorial not found' });
        }

        // Delete all associated memories
        await Memory.deleteMany({ memorialId: req.params.id });

        res.json({ message: 'Memorial deleted successfully' });
    } catch (error) {
        console.error('Delete memorial error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
