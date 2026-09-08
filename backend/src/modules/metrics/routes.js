import { Router } from 'express';
import { getMetrics, postMetric, putMetric, getUnits, postUnit, putUnit } from './controller.js';

const router = Router();

router.get('/', getMetrics);
router.post('/', postMetric);
router.put('/:id', putMetric);
router.get('/:metricId/units', getUnits);
router.post('/:metricId/units', postUnit);
router.put('/units/:id', putUnit);

export default router;
