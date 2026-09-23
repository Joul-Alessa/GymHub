import { Router } from 'express';
import { getHeatmap, getGlobalActivity } from './controller.js';

const router = Router();

router.get('/heatmap', getHeatmap);
router.get('/activity', getGlobalActivity);

export default router;
