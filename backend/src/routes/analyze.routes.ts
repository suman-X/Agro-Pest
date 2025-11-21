import { Router } from 'express';
import multer from 'multer';
import { analyzeController } from '../controllers/analyze.controller';
import path from 'path';
import crypto from 'crypto';

const router = Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        // Sanitize and randomize filename to prevent collisions / path issues
        const ext = path.extname(file.originalname || '').toLowerCase();
        const safeExt = ['.jpg', '.jpeg', '.png'].includes(ext) ? ext : '.jpg';
        const randomName = crypto.randomBytes(8).toString('hex');
        cb(null, `${Date.now()}-${randomName}${safeExt}`);
    }
});

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB max
    },
    fileFilter: (req, file, cb) => {
        const allowed = ['image/jpeg', 'image/png', 'image/jpg'];
        if (!allowed.includes(file.mimetype)) {
            return cb(new Error('Only JPEG and PNG images are allowed'));
        }
        cb(null, true);
    }
});

// Ensure uploads directory exists
import fs from 'fs';
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

router.post('/', (req, res, next) => {
    upload.single('image')(req, res, (err: any) => {
        if (err) {
            return res.status(400).json({ error: err.message || 'Invalid file upload' });
        }
        next();
    });
}, analyzeController);

export default router;
