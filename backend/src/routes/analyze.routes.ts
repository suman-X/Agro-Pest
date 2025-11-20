import { Router } from 'express';
import multer from 'multer';
import { analyzeController } from '../controllers/analyze.controller';
import path from 'path';

const router = Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// Ensure uploads directory exists
import fs from 'fs';
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

router.post('/', upload.single('image'), analyzeController);

export default router;
