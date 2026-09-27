import express from 'express';
import { adaptWebPage } from '../controllers/adapterController.js';

const router = express.Router();

router.post('/process', adaptWebPage);

export default router;